import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/m/kitchen/kds")({
  component: () => (
    <RequireAuth>
      <KDSPage />
    </RequireAuth>
  ),
});

type KDSOrder = {
  id: string;
  tableNumber?: string;
  type: "delivery" | "dine-in" | "takeaway";
  items: { name: string; quantity: number; status: "pending" | "preparing" | "ready" }[];
  status: "pending" | "preparing" | "ready";
  placedAt: string;
  timeElapsed: number; // in minutes
};

const sampleOrders: KDSOrder[] = [
  {
    id: "ORD-101",
    tableNumber: "T-05",
    type: "dine-in",
    items: [
      { name: "Margherita Pizza", quantity: 1, status: "preparing" },
      { name: "Coke", quantity: 1, status: "ready" },
    ],
    status: "preparing",
    placedAt: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    timeElapsed: 12,
  },
  {
    id: "ORD-102",
    type: "delivery",
    items: [
      { name: "Paneer Tikka", quantity: 2, status: "pending" },
      { name: "Butter Naan", quantity: 4, status: "pending" },
    ],
    status: "pending",
    placedAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    timeElapsed: 5,
  },
  {
    id: "ORD-103",
    tableNumber: "T-12",
    type: "dine-in",
    items: [
      { name: "Veg Hakka Noodles", quantity: 1, status: "ready" },
      { name: "Manchurian", quantity: 1, status: "ready" },
    ],
    status: "ready",
    placedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    timeElapsed: 25,
  },
];

function KDSPage() {
  const [orders, setOrders] = useState<KDSOrder[]>(sampleOrders);

  const updateStatus = (orderId: string, newStatus: "preparing" | "ready") => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: newStatus,
              items: o.items.map((i) => ({ ...i, status: newStatus })),
            }
          : o
      )
    );
  };

  const completeOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  return (
    <div className="min-h-screen space-y-4 bg-zinc-50/50 p-4">
      <PageHeader
        title="Kitchen Display System"
        description="Real-time order tracking and management for the kitchen staff."
        actions={
          <div className="flex gap-2">
            <Badge variant="outline" className="bg-white">Active Orders: {orders.length}</Badge>
            <Button variant="outline" size="sm">Refresh</Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {orders.map((order) => (
          <Card key={order.id} className={`overflow-hidden border-2 ${order.timeElapsed > 20 ? 'border-destructive/50' : 'border-border'}`}>
            <CardHeader className={`p-3 ${order.status === 'ready' ? 'bg-success/10' : order.status === 'preparing' ? 'bg-info/10' : 'bg-muted/50'}`}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold">{order.id}</CardTitle>
                <Badge variant={order.type === 'delivery' ? 'destructive' : 'secondary' as any}>{order.type.toUpperCase()}</Badge>
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{order.timeElapsed}m elapsed</span>
                </div>
                {order.tableNumber && <span className="font-semibold text-foreground">{order.tableNumber}</span>}
              </div>
            </CardHeader>
            <CardContent className="p-3">
              <ul className="space-y-2">
                {order.items.map((item, idx) => (
                  <li key={idx} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary">{item.quantity}x</span>
                      <span>{item.name}</span>
                    </div>
                    {item.status === 'ready' && <CheckCircle2 className="h-4 w-4 text-success" />}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex gap-2">
                {order.status === "pending" && (
                  <Button className="w-full" size="sm" onClick={() => updateStatus(order.id, "preparing")}>Start Preparing</Button>
                )}
                {order.status === "preparing" && (
                  <Button className="w-full" size="sm" variant="warning" onClick={() => updateStatus(order.id, "ready")}>Mark Ready</Button>
                )}
                {order.status === "ready" && (
                  <Button className="w-full" size="sm" variant="success" onClick={() => completeOrder(order.id)}>Serve / Dispatch</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
        {orders.length === 0 && (
          <div className="col-span-full flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-white">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground/30" />
            <p className="mt-2 text-muted-foreground font-medium">All orders completed!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default KDSPage;
