import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local manually
const envPath = resolve(__dirname, "../.env.local");
const envFile = readFileSync(envPath, "utf8");
for (const line of envFile.split("\n")) {
  const [key, ...rest] = line.split("=");
  if (key && rest.length) process.env[key.trim()] = rest.join("=").trim();
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const DEMO_CLIENT_NAME = "Demo Client Inc.";
const DEMO_CLIENT_SLUG = "demo-client-inc";

const USERS = [
  { email: "admin@rapidtile.local", password: "Admin1234!", role: "super_admin",   full_name: "Super Admin",  clientSlug: null },
  { email: "client@rapidtile.local", password: "Client1234!", role: "client_admin", full_name: "Client Admin", clientSlug: DEMO_CLIENT_SLUG },
  { email: "va@rapidtile.local",     password: "Va1234!",     role: "va",           full_name: "Demo VA",      clientSlug: DEMO_CLIENT_SLUG },
];

async function main() {
  console.log("Seeding Rapid Tile Portal…\n");

  // 1. Create demo client
  let clientId;
  const { data: existingClient } = await supabase.from("clients").select("id").eq("slug", DEMO_CLIENT_SLUG).single();
  if (existingClient) {
    clientId = existingClient.id;
    console.log(`Client already exists: ${clientId}`);
  } else {
    const { data: newClient, error } = await supabase.from("clients").insert({ name: DEMO_CLIENT_NAME, slug: DEMO_CLIENT_SLUG }).select().single();
    if (error) throw new Error("Failed to create client: " + error.message);
    clientId = newClient.id;
    console.log(`Created client: ${clientId}`);
  }

  // 2. Create auth users + users table rows
  const { data: { users: existingUsers } } = await supabase.auth.admin.listUsers();

  for (const u of USERS) {
    const clientIdForUser = u.clientSlug ? clientId : null;
    const existing = existingUsers.find(au => au.email === u.email);

    let userId;
    if (existing) {
      userId = existing.id;
      console.log(`Auth user already exists: ${u.email}`);
    } else {
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: u.email, password: u.password, email_confirm: true,
      });
      if (authError) throw new Error(`Failed to create ${u.email}: ` + authError.message);
      userId = authData.user.id;
      console.log(`Created auth user: ${u.email}`);
    }

    const { error: userError } = await supabase.from("users").upsert(
      { id: userId, email: u.email, full_name: u.full_name, role: u.role, client_id: clientIdForUser },
      { onConflict: "id" }
    );
    if (userError) throw new Error(`Failed to upsert users row for ${u.email}: ` + userError.message);
    console.log(`  users row OK: ${u.email} (${u.role})`);
  }

  // 3. Seed Company DNA
  const { error: dnaError } = await supabase.from("company_dna").upsert({
    client_id: clientId,
    company_name: "Demo Client Inc.",
    founders: "Jane Smith, Bob Lee",
    location: "Sydney, NSW, Australia",
    phone: "+61 2 9000 0000",
    email: "hello@democlient.com.au",
    website: "https://democlient.com.au",
    values: "Integrity, Innovation, Customer Focus",
    services: "IT Consulting, Software Development, Cloud Migration, Managed Services",
    target_demographic: "SMBs and mid-market businesses in Australia",
    client_type: "Technology Services",
    updated_at: new Date().toISOString(),
  }, { onConflict: "client_id" });
  if (dnaError) throw new Error("Failed to seed DNA: " + dnaError.message);
  console.log("Company DNA seeded.");

  // 4. Seed a Vault item
  const { error: vaultError } = await supabase.from("vault_items").insert({
    client_id: clientId,
    source_type: "text",
    title: "Company Overview",
    raw_content: `Demo Client Inc. is a Sydney-based technology services company founded by Jane Smith and Bob Lee.
We specialise in IT consulting, custom software development, cloud migration, and managed services.
Our clients are primarily SMBs and mid-market businesses across Australia.
We believe in integrity, innovation, and putting the customer first in everything we do.
Contact us at hello@democlient.com.au or +61 2 9000 0000.`,
    status: "ready",
  });
  if (vaultError && !vaultError.message.includes("duplicate")) {
    throw new Error("Failed to seed vault: " + vaultError.message);
  }
  console.log("Vault item seeded.");

  console.log("\n✅ Seed complete!\n");
  console.log("Login credentials:");
  for (const u of USERS) {
    console.log(`  ${u.email}  /  ${u.password}  (${u.role})`);
  }
}

main().catch(err => { console.error("\n❌ Seed failed:", err.message); process.exit(1); });
