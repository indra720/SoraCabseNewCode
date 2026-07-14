import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { formatCurrency, posTransactions } from "./pos-utils";

export const Route = createFileRoute("/m/pos/payments")({
  component: () => (
    <RequireAuth>
      <PaymentsPage />
    </RequireAuth>
  ),
});

function PaymentsPage() {
  const [search, setSearch] = useState("");
  const txns = posTransactions.filter(t => t.id.toLowerCase().includes(search.toLowerCase()) || t.customer.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen space-y-6 bg-transparent p-6">
      <PageHeader
        title="Payments"
        description="View transaction history and manage refunds."
      />
      
      <Card className="rounded-2xl border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Transaction History</CardTitle>
            <Input placeholder="Search ID/Customer..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {txns.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">{tx.id}</TableCell>
                  <TableCell>{tx.customer}</TableCell>
                  <TableCell>{formatCurrency(tx.amount)}</TableCell>
                  <TableCell>{tx.method}</TableCell>
                  <TableCell>
                    <Badge variant={tx.status === "Completed" ? "success" : tx.status === "Refunded" ? "destructive" : "secondary"}>{tx.status}</Badge>
                  </TableCell>
                  <TableCell>{tx.paymentDate}</TableCell>
                  <TableCell>
                    {tx.status === "Completed" && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">Refund</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Refund</DialogTitle>
                            <DialogDescription>Are you sure you want to refund this transaction?</DialogDescription>
                          </DialogHeader>
                          <DialogFooter>
                            <Button variant="outline">Cancel</Button>
                            <Button variant="destructive">Confirm Refund</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
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
