import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Edit, Trash2, Printer, Download } from "lucide-react";

export const Route = createFileRoute("/m/orders/all-orders")({
  component: () => (
    <RequireAuth>
      <AllOrdersPage />
    </RequireAuth>
  ),
});

type OrderStatus = "pending" | "preparing" | "ready" | "out-for-delivery" | "delivered" | "cancelled" | "refunded";
type OrderType = "delivery" | "dine-in" | "takeaway";

type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  customerName: string;
  customerPhone: string;
  restaurantName: string;
  total: number;
  type: OrderType;
  status: OrderStatus;
  items: OrderItem[];
  placedAt: string;
  deliveryAddress?: string;
  paymentMethod: "upi" | "cash" | "card" | "wallet";
};

const statusOptions: { label: string; value: OrderStatus | "all" }[] = [
  { label: "All Status", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Preparing", value: "preparing" },
  { label: "Ready", value: "ready" },
  { label: "Out for Delivery", value: "out-for-delivery" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Refunded", value: "refunded" },
];

const typeOptions: { label: string; value: OrderType | "all" }[] = [
  { label: "All Types", value: "all" },
  { label: "Delivery", value: "delivery" },
  { label: "Dine-in", value: "dine-in" },
  { label: "Takeaway", value: "takeaway" },
];

// Generate 6 orders
const sampleOrders: Order[] = Array.from({ length: 6 }).map((_, index) => ({
  id: `ORD-${5000 + index}`,
  customerName: ["Ayesha Khan", "Rahul Jain", "Sneha Patel", "Vikram Rao", "Meera Nair", "Amit Singh"][index % 6],
  customerPhone: `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`,
  restaurantName: ["Sora Bistro", "Pizza Palace", "Tandoor Express", "Burger King"][index % 4],
  total: Math.round(200 + Math.random() * 1500),
  type: (["delivery", "dine-in", "takeaway"] as OrderType[])[index % 3],
  status: (["pending", "preparing", "ready", "delivered", "cancelled", "refunded"] as OrderStatus[])[index % 6],
  placedAt: new Date(Date.now() - 1000 * 60 * (index * 15 + 10)).toISOString(),
  paymentMethod: (["upi", "cash", "card", "wallet"] as const)[index % 4],
  items: [
    { id: "it-1", name: "Paneer Tikka", quantity: 1, price: 250 },
    { id: "it-2", name: "Butter Naan", quantity: 2, price: 40 },
  ],
  deliveryAddress: index % 3 === 0 ? "123, MG Road, Bengaluru" : undefined,
}));

function formatCurrency(value: number) {
  return `₹${value.toLocaleString()}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function AllOrdersPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<OrderStatus | "all">("all");
  const [type, setType] = useState<OrderType | "all">("all");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Order[]>(sampleOrders);
  const [viewItem, setViewItem] = useState<Order | null>(null);

  const filtered = useMemo(
    () =>
      items.filter((order) => {
        if (status !== "all" && order.status !== status) return false;
        if (type !== "all" && order.type !== type) return false;
        const search = query.trim().toLowerCase();
        if (!search) return true;
        return (
          order.id.toLowerCase().includes(search) ||
          order.customerName.toLowerCase().includes(search) ||
          order.restaurantName.toLowerCase().includes(search)
        );
      }),
    [items, query, status, type],
  );

  const pageSize = 10;
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const renderStatusBadge = (status: OrderStatus) => {
    const variants: Record<OrderStatus, string> = {
      pending: "secondary",
      preparing: "info",
      ready: "warning",
      "out-for-delivery": "primary",
      delivered: "success",
      cancelled: "destructive",
      refunded: "outline",
    };
    
    // Custom Badge logic for variants not in UI Badge component
    const variant = variants[status];
    return <Badge variant={variant as any}>{status.toUpperCase()}</Badge>;
  };

  const deleteOrder = (order: Order) => {
    if (!confirm(`Cancel Order ${order.id}?`)) return;
    setItems((prev) => prev.map(o => o.id === order.id ? { ...o, status: "cancelled" } : o));
  };

  return (
    <div className="min-h-screen space-y-4 bg-transparent p-1">
      <PageHeader
        title="All Orders"
        description="Comprehensive list of all orders across the platform."
        actions={
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
            <Input
              className="w-64 min-w-[16rem]"
              placeholder="Search by Order ID, Customer, Restaurant"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
            <Select value={status} onValueChange={(v) => { setStatus(v as any); setPage(1); }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={type} onValueChange={(v) => { setType(v as any); setPage(1); }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon"><Download className="h-4 w-4" /></Button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <Button
            key={option.value}
            size="sm"
            variant={status === option.value ? "default" : "outline"}
            onClick={() => {
              setStatus(option.value as any);
              setPage(1);
            }}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <div className="surface-card rounded-2xl p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Order ID</TableHead>
              <TableHead className="w-[200px]">Customer</TableHead>
              <TableHead className="w-[150px]">Restaurant</TableHead>
              <TableHead className="w-[100px]">Total</TableHead>
              <TableHead className="w-[100px]">Type</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[150px]">Placed At</TableHead>
              <TableHead className="text-right w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageData.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-muted-foreground">{order.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{order.customerName}</span>
                    <span className="text-xs text-muted-foreground">{order.customerPhone}</span>
                  </div>
                </TableCell>
                <TableCell>{order.restaurantName}</TableCell>
                <TableCell>{formatCurrency(order.total)}</TableCell>
                <TableCell className="capitalize">{order.type}</TableCell>
                <TableCell>{renderStatusBadge(order.status)}</TableCell>
                <TableCell className="text-muted-foreground">{formatDate(order.placedAt)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => setViewItem(order)}><Eye className="h-4 w-4" /></Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Order Details: {order.id}</DialogTitle>
                        </DialogHeader>
                        {viewItem && (
                          <div className="grid gap-6 py-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-muted-foreground">Status</p>
                                <div className="mt-1">{renderStatusBadge(viewItem.status)}</div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm text-muted-foreground">Placed At</p>
                                <p className="font-medium">{formatDate(viewItem.placedAt)}</p>
                              </div>
                            </div>
                            
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="rounded-xl border p-3">
                                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Customer</p>
                                <p className="font-medium">{viewItem.customerName}</p>
                                <p className="text-sm text-muted-foreground">{viewItem.customerPhone}</p>
                              </div>
                              <div className="rounded-xl border p-3">
                                <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Restaurant</p>
                                <p className="font-medium">{viewItem.restaurantName}</p>
                                <p className="text-sm text-muted-foreground">{viewItem.type.toUpperCase()}</p>
                              </div>
                            </div>

                            <div>
                              <p className="mb-3 text-sm font-semibold">Order Items</p>
                              <div className="rounded-xl border overflow-hidden">
                                <table className="w-full text-sm">
                                  <thead className="bg-muted/50">
                                    <tr>
                                      <th className="px-3 py-2 text-left">Item</th>
                                      <th className="px-3 py-2 text-center">Qty</th>
                                      <th className="px-3 py-2 text-right">Price</th>
                                      <th className="px-3 py-2 text-right">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y">
                                    {viewItem.items.map((item, idx) => (
                                      <tr key={idx}>
                                        <td className="px-3 py-2">{item.name}</td>
                                        <td className="px-3 py-2 text-center">{item.quantity}</td>
                                        <td className="px-3 py-2 text-right">{formatCurrency(item.price)}</td>
                                        <td className="px-3 py-2 text-right">{formatCurrency(item.price * item.quantity)}</td>
                                      </tr>
                                    ))}
                                    <tr className="bg-muted/20 font-semibold">
                                      <td colSpan={3} className="px-3 py-2 text-right">Grand Total</td>
                                      <td className="px-3 py-2 text-right">{formatCurrency(viewItem.total)}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>

                            {viewItem.deliveryAddress && (
                              <div>
                                <p className="mb-1 text-sm font-semibold">Delivery Address</p>
                                <p className="text-sm text-muted-foreground">{viewItem.deliveryAddress}</p>
                              </div>
                            )}

                            <div className="flex gap-2 justify-end">
                              <Button variant="outline" size="sm" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" /> Print Receipt</Button>
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button>Close</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteOrder(order)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage((v) => Math.max(1, v - 1))}>
              Prev
            </Button>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm">{page} / {pages}</div>
            <Button variant="ghost" size="sm" disabled={page === pages} onClick={() => setPage((v) => Math.min(pages, v + 1))}>
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllOrdersPage;
