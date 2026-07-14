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

type User = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  phone?: string;
  role: string;
  department?: string;
  branch?: string;
  status: "active" | "suspended" | "inactive";
  createdAt: string;
};

const sampleUsers: User[] = Array.from({ length: 23 }).map((_, i) => ({
  id: `U-${1000 + i}`,
  fullName: `User ${i + 1}`,
  username: `user${i + 1}`,
  email: `user${i + 1}@example.com`,
  phone: `+1-555-0${i}${i}${i}`,
  role: i % 3 === 0 ? "Admin" : "Staff",
  department: i % 2 === 0 ? "Ops" : "Sales",
  branch: `Branch ${((i % 4) + 1)}`,
  status: i % 7 === 0 ? "suspended" : "active",
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
}));

export const Route = createFileRoute("/m/iam/users")({
  component: () => (
    <RequireAuth>
      <UsersPage />
    </RequireAuth>
  ),
});

function UsersPage() {
  const [rows, setRows] = useState<User[]>(sampleUsers);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    if (!query) return rows;
    const q = query.toLowerCase();
    return rows.filter(
      (r) =>
        r.fullName.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.username.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
    );
  }, [rows, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleSelect = (id: string) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  };

  const selectAllOnPage = (v: boolean) => {
    const pageIds = pageRows.map((r) => r.id);
    setSelected((s) => {
      const next = { ...s };
      pageIds.forEach((id) => (next[id] = v));
      return next;
    });
  };

  const bulkDelete = () => {
    const ids = Object.entries(selected).filter(([, v]) => v).map(([k]) => k);
    if (!ids.length) return alert("No rows selected");
    if (!confirm(`Delete ${ids.length} users?`)) return;
    setRows((r) => r.filter((x) => !ids.includes(x.id)));
    setSelected({});
  };

  const exportCSV = () => {
    const csv = ["id,fullName,username,email,role,branch,status,createdAt", ...rows.map(r => `${r.id},"${r.fullName}",${r.username},${r.email},${r.role},${r.branch},${r.status},${r.createdAt}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const onImport = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const lines = text.split(/\r?\n/).slice(1).filter(Boolean);
      const parsed = lines.map((l) => {
        const [id, fullName, username, email, role, branch, status, createdAt] = l.split(",");
        return {
          id: id?.trim() || `U-${Date.now()}`,
          fullName: fullName?.replace(/^"|"$/g, "") || "",
          username: username?.trim() || "",
          email: email?.trim() || "",
          role: role?.trim() || "Staff",
          branch: branch?.trim() || "",
          status: (status?.trim() as any) || "active",
          createdAt: createdAt?.trim() || new Date().toISOString(),
        } as User;
      });
      setRows((r) => [...parsed, ...r]);
    };
    reader.readAsText(file);
  };

  const addUser = () => {
    const name = prompt("Full name") || "New User";
    const id = `U-${Date.now() % 100000}`;
    const u: User = { id, fullName: name, username: name.replace(/\s+/g, "").toLowerCase(), email: `${name.replace(/\s+/g, "").toLowerCase()}@example.com`, role: "Staff", branch: "Branch 1", status: "active", createdAt: new Date().toISOString() };
    setRows((r) => [u, ...r]);
  };

  return (
    <div className="min-h-screen p-2">
      <PageHeader title="Users" description="Manage system users" />

      <div className="surface-card rounded-2xl p-4 mb-4">
        <div className="flex flex-nowrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." value={query} onChange={(e: any) => { setQuery(e.target.value); setPage(1); }} className="w-72 min-w-[18rem]" />
          </div>
          <div className="ml-auto flex gap-2">
            <Button onClick={addUser}>Add User</Button>
            <Button variant="outline" onClick={exportCSV}>Export CSV</Button>
            <label className="btn">
              <input type="file" accept=".csv" onChange={(e) => onImport(e.target.files?.[0])} style={{ display: 'none' }} />
              Import CSV
            </label>
            <Button variant="destructive" onClick={bulkDelete}>Delete Selected</Button>
          </div>
        </div>
      </div>

      <div className="surface-card rounded-2xl p-4 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox onCheckedChange={(v) => selectAllOnPage(Boolean(v))} />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Branch</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <Checkbox checked={Boolean(selected[r.id])} onCheckedChange={() => toggleSelect(r.id)} />
                </TableCell>
                <TableCell>
                  <div className="font-medium">{r.fullName}</div>
                  <div className="text-muted-foreground text-xs">{r.id}</div>
                </TableCell>
                <TableCell>{r.username}</TableCell>
                <TableCell>{r.email}</TableCell>
                <TableCell>{r.role}</TableCell>
                <TableCell>{r.branch}</TableCell>
                <TableCell>
                  <Badge variant={r.status === 'active' ? 'default' : 'secondary' as any}>{r.status.toUpperCase()}</Badge>
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => alert(JSON.stringify(r, null, 2))}>View</Button>
                  <Button size="sm" variant="ghost" onClick={() => { const name = prompt('Full name', r.fullName); if (name) setRows(s => s.map(x => x.id === r.id ? { ...x, fullName: name } : x)); }}>Edit</Button>
                  <Button size="sm" variant="ghost" onClick={() => { setRows(s => s.map(x => x.id === r.id ? { ...x, status: 'active' } : x)); }}>Activate</Button>
                  <Button size="sm" variant="ghost" onClick={() => { setRows(s => s.map(x => x.id === r.id ? { ...x, status: 'suspended' } : x)); }}>Suspend</Button>
                  <Button size="sm" variant="destructive" onClick={() => { if (confirm('Delete user?')) setRows(s => s.filter(x => x.id !== r.id)); }}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between mt-4">
          <div>Showing {filtered.length} users</div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Prev</Button>
            <div>Page {page} / {pageCount}</div>
            <Button onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default undefined;
