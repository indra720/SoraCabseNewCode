import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Eye } from "lucide-react";

export const Route = createFileRoute("/m/menu/approval")({
  component: () => (
    <RequireAuth>
      <MenuApprovalPage />
    </RequireAuth>
  ),
});

type MenuApprovalRequest = {
  id: string;
  itemName: string;
  restaurant: string;
  submittedBy: string;
  submittedAt: string;
  status: "pending" | "approved" | "rejected";
  type: "new_item" | "price_change" | "description_update";
};

const sampleRequests: MenuApprovalRequest[] = Array.from({ length: 12 }).map((_, index) => ({
  id: `REQ-${500 + index}`,
  itemName: ["Butter Chicken", "Masala Dosa", "Veg Hakka Noodles", "Chocolate Brownie"][index % 4],
  restaurant: ["Sora Bistro", "Tandoor Express", "Noodle House", "Sweet Treats"][index % 4],
  submittedBy: "Manager " + (index + 1),
  submittedAt: new Date(Date.now() - 1000 * 60 * 60 * (index + 2)).toISOString(),
  status: index % 5 === 0 ? "approved" : index % 7 === 0 ? "rejected" : "pending",
  type: index % 3 === 0 ? "new_item" : index % 3 === 1 ? "price_change" : "description_update",
}));

function MenuApprovalPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [items, setItems] = useState<MenuApprovalRequest[]>(sampleRequests);

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        if (status !== "all" && item.status !== status) return false;
        const search = query.trim().toLowerCase();
        if (!search) return true;
        return (
          item.itemName.toLowerCase().includes(search) ||
          item.restaurant.toLowerCase().includes(search)
        );
      }),
    [items, query, status],
  );

  const handleAction = (id: string, newStatus: "approved" | "rejected") => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item)));
  };

  return (
    <div className="min-h-screen space-y-4 bg-transparent p-1">
      <PageHeader
        title="Menu Approvals"
        description="Review and approve menu changes submitted by restaurants."
        actions={
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
            <Input
              className="w-64 min-w-[16rem]"
              placeholder="Search requests..."
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
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <div className="surface-card rounded-2xl p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Item Name</TableHead>
              <TableHead>Restaurant</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Submitted At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.itemName}</TableCell>
                <TableCell>{item.restaurant}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {item.type.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(item.submittedAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={item.status === "approved" ? "success" : item.status === "rejected" ? "destructive" : "secondary" as any}>
                    {item.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {item.status === "pending" && (
                      <>
                        <Button variant="ghost" size="icon" className="text-success" onClick={() => handleAction(item.id, "approved")}>
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleAction(item.id, "rejected")}>
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default MenuApprovalPage;
