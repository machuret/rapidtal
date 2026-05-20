import { redirect } from "next/navigation";
import { getCurrentUserAndClient } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { format, subDays } from "date-fns";
import { AdminDailyLogsReview } from "@/components/daily-log/AdminDailyLogsReview";

export default async function AdminDailyLogsPage() {
  const ctx = await getCurrentUserAndClient();
  if (!ctx) redirect("/login");
  const { user } = ctx;

  if (!["client_admin", "super_admin"].includes(user.role)) redirect("/dashboard");
  if (!user.client_id) redirect("/dashboard");

  const since = format(subDays(new Date(), 29), "yyyy-MM-dd");
  const admin = createAdminClient();

  const { data: logs } = await admin
    .from("daily_logs")
    .select("*, users!inner(full_name, email, role)")
    .eq("client_id", user.client_id)
    .eq("users.role", "va")
    .gte("log_date", since)
    .order("log_date", { ascending: false })
    .limit(300);

  return <AdminDailyLogsReview logs={logs ?? []} />;
}
