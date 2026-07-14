import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency, posSampleBills } from "./pos-utils";

export const Route = createFileRoute("/m/pos/hold-bills")({
  component: () => (
    <RequireAuth>
      <HoldBillsPage />
    </RequireAuth>
  ),
});

function HoldBillsPage() {
  const [search, setSearch] = useState("");
  const heldBills = posSampleBills.filter(b => b.status === "hold" && b.id.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen space-y-6 bg-transparent p-6">
      <PageHeader
        title="Held Bills"
        description="View and manage bills that have been put on hold."
      />
      
      <Card className="rounded-2xl border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Held Bills List</CardTitle>
            <Input placeholder="Search ID..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill ID</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Held At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {heldBills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.id}</TableCell>
                  <TableCell>{bill.table}</TableCell>
                  <TableCell>{formatCurrency(bill.total)}</TableCell>
                  <TableCell>{bill.openedAt}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="outline" size="sm">Resume</Button>
                    <Button variant="destructive" size="sm">Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
