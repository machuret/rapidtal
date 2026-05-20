import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(
  req: NextRequest,
  { params }: { params: { date: string } }
) {
  const auth = await requireApiAuth();
  if ("error" in auth) return auth.error;
  const { user } = auth;
  if (!user.client_id) return NextResponse.json({ error: "No client." }, { status: 403 });

  const { date } = params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date format" }, { status: 400 });
  }

  const admin = createAdminClient();

  // For admins, allow viewing any VA's log by passing ?user_id=
  const targetUserId = req.nextUrl.searchParams.get("user_id") ?? user.id;

  // Enforce: non-admins can only view own logs
  if (user.role === "va" && targetUserId !== user.id) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  // Single query — notes embedded via FK relationship (one round-trip instead of two)
  const { data: log, error } = await admin
    .from("daily_logs")
    .select("*, daily_log_notes(id, body, created_at, user_id)")
    .eq("user_id", targetUserId)
    .eq("log_date", date)
    .eq("client_id", user.client_id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!log)  return NextResponse.json({ log: null, notes: [] });

  const { daily_log_notes: notes, ...logData } = log as typeof log & {
    daily_log_notes: { id: string; body: string; created_at: string; user_id: string }[];
  };

  const sortedNotes = [...(notes ?? [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return NextResponse.json({ log: logData, notes: sortedNotes });
}
