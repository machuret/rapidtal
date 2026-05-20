import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireApiAuth, assertClientAccess } from "@/lib/api-auth";
import { z } from "zod";

const schema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(100000),
  clientId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  const auth = await requireApiAuth();
  if ("error" in auth) return auth.error;
  const { user } = auth;

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 });
  }

  const { title, content, clientId } = parsed.data;
  const userId = user.id;

  const accessError = assertClientAccess(user, clientId);
  if (accessError) return accessError;

  const supabase = createAdminClient();

  const { error } = await supabase.from("vault_items").insert({
    client_id: clientId,
    source_type: "text",
    title,
    raw_content: content,
    status: "ready",
    created_by: userId,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
