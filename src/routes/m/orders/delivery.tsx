import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Download } from "lucide-react";

export const Route = createFileRoute("/m/orders/delivery")({
  component: () => (
    <RequireAuth>
      <DeliveryPage />
    </RequireAuth>
  ),
});

type OrderStatus = "pending" | "preparing" | "ready" | "out-for-delivery" | "delivered" | "cancelled";
type Order = {
  id: string;
  customerName: string;
  total: number;
  status: OrderStatus;
  placedAt: string;
  deliveryAddress: string;
};

const statusOptions: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Preparing", value: "preparing" },
  { label: "Ready", value: "ready" },
  { label: "Out for Delivery", value: "out-for-delivery" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

const sampleOrders: Order[] = Array.from({ length: 20 }).map((_, index) => ({
  id: `DEL-${1000 + index}`,
  customerName: ["Ayesha Khan", "Rahul Jain", "Sneha Patel", "Vikram Rao"][index % 4],
  total: Math.round(200 + Math.random() * 1000),
  status: (["pending", "preparing", "ready", "out-for-delivery", "delivered", "cancelled"] as OrderStatus[])[index % 6],
  placedAt: new Date(Date.now() - 1000 * 60 * (index * 15 + 10)).toISOString(),
  deliveryAddress: `${10 + index}, MG Road, Bengaluru`,
}));

function formatCurrency(value: number) { return `₹${value.toLocaleString()}`; }
function formatDate(date: string) { return new Date(date).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); }

function DeliveryPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [viewItem, setViewItem] = useState<Order | null>(null);

  const filtered = useMemo(() =>
      sampleOrders.filter((order) => {
        if (status !== "all" && order.status !== status) return false;
        const search = query.trim().toLowerCase();
        if (!search) return true;
        return order.id.toLowerCase().includes(search) || order.customerName.toLowerCase().includes(search);
      }),
    [query, status],
  );

  const renderStatusBadge = (status: OrderStatus) => {
    const variants: Record<OrderStatus, string> = { pending: "secondary", preparing: "info", ready: "warning", "out-for-delivery": "primary", delivered: "success", cancelled: "destructive" };
    return <Badge variant={variants[status] as any}>{status.toUpperCase()}</Badge>;
  };

  return (
    <div className="min-h-screen space-y-4 p-4">
      <PageHeader
        title="Delivery Orders"
        description="Manage and track active delivery orders."
        actions={
          <div className="flex items-center gap-2">
            <Input className="w-64" placeholder="Search ID, Customer" value={query} onChange={(e) => setQuery(e.target.value)} />
            <Select value={status} onValueChange={(v) => setStatus(v as any)}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>{statusOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
            </Select>
            <Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button>
          </div>
        }
      />
      <div className="surface-card rounded-2xl p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customerName}</TableCell>
                <TableCell>{formatCurrency(order.total)}</TableCell>
                <TableCell>{renderStatusBadge(order.status)}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{order.deliveryAddress}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setViewItem(order)}><Eye className="h-4 w-4" /></Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Order Details: {order.id}</DialogTitle></DialogHeader>
                      {viewItem && (
                        <div className="space-y-4">
                          <p>Customer: {viewItem.customerName}</p>
                          <p>Address: {viewItem.deliveryAddress}</p>
                          <p>Total: {formatCurrency(viewItem.total)}</p>
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

export default DeliveryPage;
