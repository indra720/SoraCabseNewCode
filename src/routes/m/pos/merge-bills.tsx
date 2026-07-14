import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency, posSampleBills } from "./pos-utils";

export const Route = createFileRoute("/m/pos/merge-bills")({
  component: () => (
    <RequireAuth>
      <MergeBillsPage />
    </RequireAuth>
  ),
});

function MergeBillsPage() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const openBills = posSampleBills.filter(b => b.status === "open");

  const toggleBill = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen space-y-6 bg-transparent p-6">
      <PageHeader
        title="Merge Bills"
        description="Select multiple bills to merge them into one."
      />
      
      <Card className="rounded-2xl border-none shadow-sm">
        <CardHeader>
          <CardTitle>Select Bills to Merge</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Bill ID</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {openBills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell>
                    <Checkbox checked={selectedIds.includes(bill.id)} onCheckedChange={() => toggleBill(bill.id)} />
                  </TableCell>
                  <TableCell className="font-medium">{bill.id}</TableCell>
                  <TableCell>{bill.table}</TableCell>
                  <TableCell>{formatCurrency(bill.total)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <Button disabled={selectedIds.length < 2}>Merge {selectedIds.length} Bills</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
