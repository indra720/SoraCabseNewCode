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

type Role = {
  id: string;
  name: string;
  description: string;
  userCount: number;
};

const sampleRoles: Role[] = [
  { id: "ROLE-1", name: "Admin", description: "Full system access", userCount: 5 },
  { id: "ROLE-2", name: "Staff", description: "General operational access", userCount: 45 },
  { id: "ROLE-3", name: "Fleet Owner", description: "Fleet management access", userCount: 12 },
  { id: "ROLE-4", name: "Maintenance", description: "Vehicle maintenance access", userCount: 8 },
  { id: "ROLE-5", name: "Support", description: "Customer support access", userCount: 20 },
  { id: "ROLE-6", name: "Manager", description: "Branch management access", userCount: 10 },
];

export const Route = createFileRoute("/m/iam/roles")({
  component: () => (
    <RequireAuth>
      <RolesPage />
    </RequireAuth>
  ),
});

function RolesPage() {
  const [rows] = useState<Role[]>(sampleRoles);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});

  const filtered = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q)
    );
  }, [rows, query]);

  const toggleSelect = (id: string) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  };

  return (
    <div className="min-h-screen p-2">
      <PageHeader title="Roles" description="Manage user roles" />

      <div className="surface-card rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search roles..." value={query} onChange={(e: any) => setQuery(e.target.value)} className="w-72" />
        </div>
      </div>

      <div className="surface-card rounded-2xl p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><Checkbox /></TableHead>
              <TableHead>Role Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Users</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell><Checkbox checked={Boolean(selected[r.id])} onCheckedChange={() => toggleSelect(r.id)} /></TableCell>
                <TableCell className="font-medium">{r.name}</TableCell>
                <TableCell>{r.description}</TableCell>
                <TableCell>{r.userCount}</TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" variant="ghost">View</Button>
                  <Button size="sm" variant="ghost">Edit</Button>
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
