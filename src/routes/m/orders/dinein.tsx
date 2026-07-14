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

export const Route = createFileRoute("/m/orders/dinein")({
  component: () => (
    <RequireAuth>
      <DineInPage />
    </RequireAuth>
  ),
});

type DineInOrder = {
  id: string;
  table: string;
  guests: number;
  status: "active" | "seated" | "paid";
  orderTime: string;
};

// Generate 6 orders
const sampleOrders: DineInOrder[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `DIN-${200 + i}`,
  table: `T-${(i % 10) + 1}`,
  guests: 2 + (i % 4),
  status: (["active", "seated", "paid"] as const)[i % 3],
  orderTime: new Date(Date.now() - 1000 * 60 * (i * 10 + 5)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
}));

function DineInPage() {
  const [query, setQuery] = useState("");
  const [viewItem, setViewItem] = useState<DineInOrder | null>(null);

  const filtered = useMemo(() =>
    sampleOrders.filter((order) => {
      const search = query.trim().toLowerCase();
      if (!search) return true;
      return order.id.toLowerCase().includes(search) || order.table.toLowerCase().includes(search);
    }),
    [query]
  );

  return (
    <div className="min-h-screen space-y-4 bg-transparent p-1">
      <PageHeader
        title="Dine-In Orders"
        description="Active dine-in orders and table status."
        actions={
            <Input className="w-64" placeholder="Search Order, Table" value={query} onChange={(e) => setQuery(e.target.value)} />
        }
      />
      <div className="surface-card rounded-2xl p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Order ID</TableHead>
              <TableHead className="w-[100px]">Table</TableHead>
              <TableHead className="w-[100px]">Guests</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[150px]">Order Time</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium text-muted-foreground">{order.id}</TableCell>
                <TableCell className="font-medium">{order.table}</TableCell>
                <TableCell>{order.guests}</TableCell>
                <TableCell><Badge variant={order.status === 'paid' ? 'success' : order.status === 'seated' ? 'secondary' : 'default' as any}>{order.status.toUpperCase()}</Badge></TableCell>
                <TableCell className="text-muted-foreground text-sm">{order.orderTime}</TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setViewItem(order)}><Eye className="h-4 w-4" /></Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm">
                      <DialogHeader><DialogTitle>Order Details: {order.id}</DialogTitle></DialogHeader>
                      <div className="grid gap-3 py-4">
                        <div className="flex justify-between"><strong>Table:</strong> {order.table}</div>
                        <div className="flex justify-between"><strong>Guests:</strong> {order.guests}</div>
                        <div className="flex justify-between"><strong>Order Time:</strong> {order.orderTime}</div>
                        <div className="flex justify-between"><strong>Status:</strong> {order.status.toUpperCase()}</div>
                      </div>
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

export default DineInPage;
