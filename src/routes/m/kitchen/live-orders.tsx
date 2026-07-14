import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Clock, Eye, Timer } from "lucide-react";

export const Route = createFileRoute("/m/kitchen/live-orders")({
  component: () => (
    <RequireAuth>
      <LiveOrdersPage />
    </RequireAuth>
  ),
});

type LiveOrder = {
  id: string;
  table?: string;
  type: "delivery" | "dine-in" | "takeaway";
  status: "preparing" | "ready" | "pending";
  startTime: string;
  itemsCount: number;
  assignedChef: string;
  priority: "high" | "normal" | "low";
};

const sampleLiveOrders: LiveOrder[] = Array.from({ length: 15 }).map((_, index) => ({
  id: `ORD-${2000 + index}`,
  table: index % 3 === 0 ? `T-${10 + (index % 10)}` : undefined,
  type: (["delivery", "dine-in", "takeaway"] as const)[index % 3],
  status: (["preparing", "ready", "pending"] as const)[index % 3],
  startTime: new Date(Date.now() - 1000 * 60 * (index * 4 + 2)).toISOString(),
  itemsCount: 2 + (index % 5),
  assignedChef: ["Chef Rajesh", "Chef Sunita", "Chef Anil", "Unassigned"][index % 4],
  priority: index % 5 === 0 ? "high" : "normal",
}));

function LiveOrdersPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(
    () =>
      sampleLiveOrders.filter((order) => {
        if (status !== "all" && order.status !== status) return false;
        const search = query.trim().toLowerCase();
        if (!search) return true;
        return (
          order.id.toLowerCase().includes(search) ||
          order.assignedChef.toLowerCase().includes(search)
        );
      }),
    [query, status],
  );

  const getElapsedTime = (startTime: string) => {
    const elapsed = Math.floor((Date.now() - new Date(startTime).getTime()) / (1000 * 60));
    return `${elapsed}m`;
  };

  return (
    <div className="min-h-screen space-y-4 bg-transparent p-1">
      <PageHeader
        title="Live Orders"
        description="Monitor current active orders and their preparation status."
        actions={
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
            <Input
              className="w-64 min-w-[16rem]"
              placeholder="Search by Order ID or Chef"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="preparing">Preparing</SelectItem>
                <SelectItem value="ready">Ready</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <div className="surface-card rounded-2xl p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Table/Details</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Assigned Chef</TableHead>
              <TableHead>Elapsed</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell className="capitalize">{order.type}</TableCell>
                <TableCell>{order.table || "N/A"}</TableCell>
                <TableCell>{order.itemsCount} items</TableCell>
                <TableCell>{order.assignedChef}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Timer className="h-3 w-3 text-muted-foreground" />
                    <span>{getElapsedTime(order.startTime)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={order.priority === "high" ? "destructive" : "secondary" as any}>
                    {order.priority.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={order.status === "ready" ? "success" : order.status === "preparing" ? "info" : "secondary" as any}>
                    {order.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default LiveOrdersPage;
