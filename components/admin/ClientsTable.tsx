"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Plus, Users } from "lucide-react";

interface Client {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

interface ClientsTableProps {
  clients: Client[];
  userCounts: Record<string, number>;
}

export function ClientsTable({ clients: initial, userCounts }: ClientsTableProps) {
  const supabase = createClient();
  const [clients, setClients] = useState(initial);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [saving, setSaving] = useState(false);

  function toSlug(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { data, error } = await supabase
      .from("clients")
      .insert({ name, slug })
      .select()
      .single();
    if (error) {
      toast.error("Failed to create client: " + error.message);
    } else {
      toast.success(`Client "${name}" created.`);
      setClients((prev) => [data as Client, ...prev]);
      setOpen(false);
      setName(""); setSlug("");
    }
    setSaving(false);
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger>
            <Button><Plus className="w-4 h-4 mr-2" />New Client</Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-700">
            <DialogHeader>
              <DialogTitle>Create Client</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="flex flex-col gap-4 mt-2">
              <div className="flex flex-col gap-1.5">
                <Label>Name</Label>
                <Input
                  value={name}
                  onChange={(e) => { setName(e.target.value); setSlug(toSlug(e.target.value)); }}
                  placeholder="Acme Corp"
                  required
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Slug</Label>
                <Input
                  value={slug}
                  onChange={(e) => setSlug(toSlug(e.target.value))}
                  placeholder="acme-corp"
                  required
                  className="bg-zinc-800 border-zinc-700"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setOpen(false)} className="border-zinc-700">Cancel</Button>
                <Button type="submit" disabled={saving}>{saving ? "Creating…" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-12 text-center">
          <p className="text-zinc-400">No clients yet. Create your first one above.</p>
        </div>
      ) : (
        <div className="rounded-xl border border-zinc-800 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800 hover:bg-transparent">
                <TableHead className="text-zinc-400">Name</TableHead>
                <TableHead className="text-zinc-400">Slug</TableHead>
                <TableHead className="text-zinc-400">Users</TableHead>
                <TableHead className="text-zinc-400">Created</TableHead>
                <TableHead className="text-zinc-400"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((c) => (
                <TableRow key={c.id} className="border-zinc-800 hover:bg-zinc-900/50">
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-zinc-400 font-mono text-xs">{c.slug}</TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5 text-zinc-400 text-sm">
                      <Users className="w-3.5 h-3.5" />
                      {userCounts[c.id] ?? 0}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-500 text-sm">{new Date(c.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <a href={`/admin/clients/${c.id}`} className="text-xs text-zinc-400 hover:text-white underline">Manage</a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
