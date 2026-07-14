import React, { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

type Rider = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  status: "active" | "suspended" | "pending";
  joinedAt: string;
};

const sampleRiders: Rider[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `R-${1000 + i}`,
  fullName: `Rider ${i + 1}`,
  email: `rider${i + 1}@example.com`,
  phone: `+1-555-0${i}${i}${i}`,
  status: i % 4 === 0 ? "pending" : (i % 6 === 0 ? "suspended" : "active"),
  joinedAt: new Date(Date.now() - i * 86400000 * 3).toISOString().split('T')[0],
}));

export const Route = createFileRoute("/m/iam/riders")({
  component: () => (
    <RequireAuth>
      <RidersPage />
    </RequireAuth>
  ),
});

function RidersPage() {
  const [rows] = useState<Rider[]>(sampleRiders);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
    );
  }, [rows, query]);

  const toggleSelect = (id: string) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  };

  return (
    <div className="min-h-screen p-2">
      <PageHeader title="Riders" description="Manage rider profiles" />

      <div className="surface-card rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search riders..." value={query} onChange={(e: any) => setQuery(e.target.value)} className="w-72" />
        </div>
      </div>

      <div className="surface-card rounded-2xl p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><Checkbox /></TableHead>
              <TableHead>Rider</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell><Checkbox checked={Boolean(selected[r.id])} onCheckedChange={() => toggleSelect(r.id)} /></TableCell>
                <TableCell>
                  <div className="font-medium">{r.fullName}</div>
                  <div className="text-muted-foreground text-xs">{r.id}</div>
                </TableCell>
                <TableCell>{r.email}</TableCell>
                <TableCell>{r.phone}</TableCell>
                <TableCell>
                  <Badge variant={r.status === 'active' ? 'default' : (r.status === 'suspended' ? 'destructive' : 'secondary') as any}>{r.status.toUpperCase()}</Badge>
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" variant="ghost">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default undefined;
