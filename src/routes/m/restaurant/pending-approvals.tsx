import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle, XCircle, Eye, FileText } from "lucide-react";

export const Route = createFileRoute("/m/restaurant/pending-approvals")({
  component: () => (
    <RequireAuth>
      <PendingApprovalsPage />
    </RequireAuth>
  ),
});

type ApprovalRequest = {
  id: string;
  restaurantName: string;
  ownerName: string;
  submissionDate: string;
  type: "new_registration" | "document_update" | "location_change";
  status: "pending" | "reviewing" | "rejected";
};

const sampleRequests: ApprovalRequest[] = Array.from({ length: 8 }).map((_, index) => ({
  id: `APR-${200 + index}`,
  restaurantName: ["Green Chilli", "Spice Hut", "Royal Darbar", "The Hungry Hub"][index % 4],
  ownerName: ["Vikram Rao", "Sneha Patel", "Rahul Jain", "Ayesha Khan"][index % 4],
  submissionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * (index + 1)).toISOString(),
  type: (["new_registration", "document_update", "location_change"] as const)[index % 3],
  status: index % 4 === 0 ? "reviewing" : "pending",
}));

function PendingApprovalsPage() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<ApprovalRequest[]>(sampleRequests);

  const filtered = useMemo(
    () =>
      items.filter((req) => {
        const search = query.trim().toLowerCase();
        if (!search) return true;
        return (
          req.restaurantName.toLowerCase().includes(search) ||
          req.ownerName.toLowerCase().includes(search)
        );
      }),
    [items, query],
  );

  const handleAction = (id: string, action: "approve" | "reject") => {
    if (!confirm(`Are you sure you want to ${action} this request?`)) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen space-y-4 bg-transparent p-1">
      <PageHeader
        title="Pending Approvals"
        description="Review and process new restaurant registrations and critical updates."
        actions={
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
            <Input
              className="w-64 min-w-[16rem]"
              placeholder="Search by Restaurant or Owner"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        }
      />

      <div className="surface-card rounded-2xl p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Request ID</TableHead>
              <TableHead>Restaurant</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Submission Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="font-medium">{req.id}</TableCell>
                <TableCell>{req.restaurantName}</TableCell>
                <TableCell>{req.ownerName}</TableCell>
                <TableCell>{new Date(req.submissionDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {req.type.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={req.status === "reviewing" ? "warning" : "secondary" as any}>
                    {req.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" title="View Documents"><FileText className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-success" onClick={() => handleAction(req.id, "approve")} title="Approve">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleAction(req.id, "reject")} title="Reject">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            No pending approval requests found.
          </div>
        )}
      </div>
    </div>
  );
}

export default PendingApprovalsPage;
