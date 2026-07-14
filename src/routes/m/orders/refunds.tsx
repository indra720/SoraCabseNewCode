import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye } from "lucide-react";

export const Route = createFileRoute("/m/orders/refunds")({
  component: () => (
    <RequireAuth>
      <RefundsPage />
    </RequireAuth>
  ),
});

type RefundStatus = "pending" | "processed" | "rejected";
type RefundOrder = {
  id: string;
  orderId: string;
  amount: number;
  status: RefundStatus;
  reason: string;
};

const sampleRefunds: RefundOrder[] = Array.from({ length: 10 }).map((_, i) => ({
  id: `R-${600 + i}`,
  orderId: `ORD-${5000 + i}`,
  amount: 100 + i * 50,
  status: (["pending", "processed", "rejected"] as const)[i % 3],
  reason: "Item missing",
}));

function RefundsPage() {
  const [query, setQuery] = useState("");
  const [viewItem, setViewItem] = useState<RefundOrder | null>(null);

  const filtered = useMemo(() =>
    sampleRefunds.filter((r) => {
      const search = query.trim().toLowerCase();
      if (!search) return true;
      return r.id.toLowerCase().includes(search) || r.orderId.toLowerCase().includes(search);
    }),
    [query]
  );

  const renderStatusBadge = (status: RefundStatus) => {
    const variants: Record<RefundStatus, string> = { pending: "secondary", processed: "success", rejected: "destructive" };
    return <Badge variant={variants[status] as any}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="min-h-screen space-y-4 p-4">
      <PageHeader
        title="Refunds"
        description="Refund requests and statuses."
        actions={
          <Input className="w-64" placeholder="Search Refund, Order ID" value={query} onChange={(e) => setQuery(e.target.value)} />
        }
      />
      <div className="surface-card rounded-2xl p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Refund ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">{r.id}</TableCell>
                <TableCell>{r.orderId}</TableCell>
                <TableCell>₹{r.amount}</TableCell>
                <TableCell>{renderStatusBadge(r.status)}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setViewItem(r)}><Eye className="h-4 w-4" /></Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Refund Details: {r.id}</DialogTitle></DialogHeader>
                      {viewItem && (
                        <div className="space-y-2">
                          <p>Order: {viewItem.orderId}</p>
                          <p>Amount: ₹{viewItem.amount}</p>
                          <p>Status: {viewItem.status.toUpperCase()}</p>
                          <p>Reason: {viewItem.reason}</p>
                        </div>
                      )}
                      <DialogFooter><DialogClose asChild><Button>Close</Button></DialogClose></DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default RefundsPage;
