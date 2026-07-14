import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye, CheckCircle2, Trash2 } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export const Route = createFileRoute("/m/customers/support")({
  component: () => (
    <RequireAuth>
      <SupportRequestsPage />
    </RequireAuth>
  ),
});

type RequestStatus = "open" | "pending" | "resolved" | "closed";
type SupportType = "Payment" | "Ride" | "Account" | "Feedback";

type SupportRequest = {
  id: string;
  customer: string;
  subject: string;
  type: SupportType;
  priority: "Low" | "Medium" | "High";
  status: RequestStatus;
  createdAt: string;
  updatedAt: string;
};

const statusOptions: { label: string; value: RequestStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Pending", value: "pending" },
  { label: "Resolved", value: "resolved" },
  { label: "Closed", value: "closed" },
];

const sampleRequests: SupportRequest[] = Array.from({ length: 14 }).map((_, index) => ({
  id: `TKT-${4000 + index}`,
  customer: ["Ayesha Khan", "Rahul Jain", "Sneha Patel", "Vikram Rao"][index % 4],
  subject: ["Refund request", "Payment issue", "Ride cancellation", "Account verification"][index % 4],
  type: ["Payment", "Ride", "Account", "Feedback"][index % 4] as SupportType,
  priority: index % 3 === 0 ? "High" : index % 3 === 1 ? "Medium" : "Low",
  status: index % 5 === 0 ? "closed" : index % 4 === 0 ? "resolved" : index % 3 === 0 ? "pending" : "open",
  createdAt: new Date(Date.now() - index * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - index * 3600000).toISOString(),
}));

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function SupportRequestsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<RequestStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<SupportRequest[]>(sampleRequests);

  const filtered = useMemo(
    () =>
      items.filter((request) => {
        if (status !== "all" && request.status !== status) return false;
        const search = query.trim().toLowerCase();
        if (!search) return true;
        return (
          request.customer.toLowerCase().includes(search) ||
          request.subject.toLowerCase().includes(search) ||
          request.id.toLowerCase().includes(search)
        );
      }),
    [items, query, status],
  );

  const pageSize = 8;
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const resolveRequest = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: "resolved", updatedAt: new Date().toISOString() } : item)));
  };

  const renderPriority = (priority: string) => {
    if (priority === "High") return <Badge variant="destructive">High</Badge>;
    if (priority === "Medium") return <Badge variant="secondary">Medium</Badge>;
    return <Badge>Low</Badge>;
  };

  const renderStatus = (status: RequestStatus) => {
    if (status === "open") return <Badge>Open</Badge>;
    if (status === "pending") return <Badge variant="secondary">Pending</Badge>;
    if (status === "resolved") return <Badge variant="success">Resolved</Badge>;
    return <Badge variant="outline">Closed</Badge>;
  };

  return (
    <div className="min-h-screen space-y-4 bg-transparent p-1">
      <PageHeader
        title="Support Tickets"
        description="Manage customer support tickets, priorities, and resolution status."
        actions={
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
            <Input
              className="w-72 min-w-[18rem]"
              placeholder="Search tickets"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
            <Select value={status} onValueChange={(value) => {
              setStatus(value as RequestStatus | "all");
              setPage(1);
            }}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      <div className="surface-card rounded-2xl p-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead>
            <tr>
              <th className="px-3 py-3 text-left font-semibold">Ticket ID</th>
              <th className="px-3 py-3 text-left font-semibold">Customer</th>
              <th className="px-3 py-3 text-left font-semibold">Issue Type</th>
              <th className="px-3 py-3 text-left font-semibold">Priority</th>
              <th className="px-3 py-3 text-left font-semibold">Status</th>
              <th className="px-3 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {pageData.map((request) => (
              <tr key={request.id}>
                <td className="px-3 py-3 font-medium">{request.id}</td>
                <td className="px-3 py-3">{request.customer}</td>
                <td className="px-3 py-3">{request.type}</td>
                <td className="px-3 py-3">{renderPriority(request.priority)}</td>
                <td className="px-3 py-3">{renderStatus(request.status)}</td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="View"><Eye className="h-4 w-4" /></Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Ticket Details: {request.id}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-3">
                            <p><strong>Customer:</strong> {request.customer}</p>
                            <p><strong>Subject:</strong> {request.subject}</p>
                            <p><strong>Type:</strong> {request.type}</p>
                            <p><strong>Status:</strong> {request.status}</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                    {request.status !== "resolved" && (
                        <Button variant="ghost" size="icon" aria-label="Resolve" onClick={() => resolveRequest(request.id)}>
                            <CheckCircle2 className="h-4 w-4" />
                        </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {pageData.length} of {total} tickets</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
            <Button variant="outline" size="sm" disabled={page === pages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SupportRequestsPage;
