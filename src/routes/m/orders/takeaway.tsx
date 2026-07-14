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

export const Route = createFileRoute("/m/orders/takeaway")({
  component: () => (
    <RequireAuth>
      <TakeawayPage />
    </RequireAuth>
  ),
});

type TakeawayOrder = {
  id: string;
  customer: string;
  status: "preparing" | "ready" | "picked-up";
};

const sampleOrders: TakeawayOrder[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `TA-${300 + i}`,
  customer: ["Ayesha Khan", "Rahul Jain", "Sneha Patel", "Vikram Rao"][i % 4],
  status: (["preparing", "ready", "picked-up"] as const)[i % 3],
}));

function TakeawayPage() {
  const [query, setQuery] = useState("");
  const [viewItem, setViewItem] = useState<TakeawayOrder | null>(null);

  const filtered = useMemo(() =>
    sampleOrders.filter((o) => {
      const search = query.trim().toLowerCase();
      if (!search) return true;
      return o.id.toLowerCase().includes(search) || o.customer.toLowerCase().includes(search);
    }),
    [query]
  );

  return (
    <div className="min-h-screen space-y-4 p-4">
      <PageHeader
        title="Takeaway Orders"
        description="Active takeaway orders."
        actions={
          <Input className="w-64" placeholder="Search Order, Customer" value={query} onChange={(e) => setQuery(e.target.value)} />
        }
      />
      <div className="surface-card rounded-2xl p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-medium">{o.id}</TableCell>
                <TableCell>{o.customer}</TableCell>
                <TableCell><Badge variant={o.status === "ready" ? "success" : "secondary"}>{o.status.toUpperCase()}</Badge></TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => setViewItem(o)}><Eye className="h-4 w-4" /></Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Order Details: {o.id}</DialogTitle></DialogHeader>
                      {viewItem && (
                        <div className="space-y-2">
                          <p>Customer: {viewItem.customer}</p>
                          <p>Status: {viewItem.status.toUpperCase()}</p>
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

export default TakeawayPage;
