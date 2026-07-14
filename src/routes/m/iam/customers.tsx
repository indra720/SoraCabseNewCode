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

type Customer = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  totalOrders: number;
  status: "active" | "inactive";
  joinedAt: string;
};

const sampleCustomers: Customer[] = Array.from({ length: 12 }).map((_, i) => ({
  id: `C-${1000 + i}`,
  fullName: `Customer ${i + 1}`,
  email: `customer${i + 1}@example.com`,
  phone: `+1-555-0${i}${i}${i}`,
  totalOrders: Math.floor(Math.random() * 50),
  status: i % 5 === 0 ? "inactive" : "active",
  joinedAt: new Date(Date.now() - i * 86400000 * 2).toISOString().split('T')[0],
}));

export const Route = createFileRoute("/m/iam/customers")({
  component: () => (
    <RequireAuth>
      <CustomersPage />
    </RequireAuth>
  ),
});

function CustomersPage() {
  const [rows] = useState<Customer[]>(sampleCustomers);
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
      <PageHeader title="Customers" description="Manage customers" />

      <div className="surface-card rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search customers..." value={query} onChange={(e: any) => setQuery(e.target.value)} className="w-72" />
        </div>
      </div>

      <div className="surface-card rounded-2xl p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><Checkbox /></TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Orders</TableHead>
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
                <TableCell>{r.totalOrders}</TableCell>
                <TableCell>
                  <Badge variant={r.status === 'active' ? 'default' : 'secondary' as any}>{r.status.toUpperCase()}</Badge>
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
