import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Edit, Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/m/kitchen/chef-assignment")({
  component: () => (
    <RequireAuth>
      <ChefAssignmentPage />
    </RequireAuth>
  ),
});

type AssignmentStatus = "assigned" | "in-progress" | "completed" | "cancelled";

type Assignment = {
  id: string; // ASSIGNMENT_ID
  chef: string; // CHEF
  orderId: string; // ORDER_ID
  status: AssignmentStatus; // STATUS
  startedAt?: string; // STARTED_AT (ISO)
};

// Fixed sample assignments (5 rows) matching requested columns
const sampleAssignments: Assignment[] = [
  { id: `ASG-1001`, chef: "Rajesh Kumar", orderId: `ORD-9001`, status: "assigned", startedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
  { id: `ASG-1002`, chef: "Sunita Sharma", orderId: `ORD-9002`, status: "in-progress", startedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString() },
  { id: `ASG-1003`, chef: "Anil Deshmukh", orderId: `ORD-9003`, status: "completed", startedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString() },
  { id: `ASG-1004`, chef: "Priya Singh", orderId: `ORD-9004`, status: "in-progress", startedAt: new Date(Date.now() - 1000 * 60 * 10).toISOString() },
  { id: `ASG-1005`, chef: "Vikram Malhotra", orderId: `ORD-9005`, status: "cancelled", startedAt: new Date(Date.now() - 1000 * 60 * 120).toISOString() },
];

function ChefAssignmentPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<AssignmentStatus | "all">("all");
  const [assignments, setAssignments] = useState<Assignment[]>(sampleAssignments);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<Partial<Assignment>>({ status: "assigned", chef: "", orderId: "", startedAt: new Date().toISOString() });

  const filtered = useMemo(
    () =>
      assignments.filter((a) => {
        if (status !== "all" && a.status !== status) return false;
        const search = query.trim().toLowerCase();
        if (!search) return true;
        return a.id.toLowerCase().includes(search) || a.chef.toLowerCase().includes(search) || a.orderId.toLowerCase().includes(search);
      }),
    [assignments, query, status],
  );

  const handleSave = () => {
    const newAssignment: Assignment = {
      id: `ASG-${Math.floor(1000 + Math.random() * 9000)}`,
      chef: form.chef || "Unassigned",
      orderId: form.orderId || `ORD-${Math.floor(9000 + Math.random() * 9000)}`,
      status: (form.status as AssignmentStatus) || "assigned",
      startedAt: form.startedAt || new Date().toISOString(),
    };
    setAssignments((prev) => [newAssignment, ...prev]);
    setAddOpen(false);
    setForm({ status: "assigned", chef: "", orderId: "", startedAt: new Date().toISOString() });
  };

  const deleteAssignment = (id: string) => {
    if (!confirm("Remove this assignment?")) return;
    setAssignments((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen space-y-4 bg-transparent p-1">
      <PageHeader
        title="Chef Assignment"
        description="Manage kitchen staff and assign chefs to specific orders or stations."
        actions={
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
            <Input
              className="w-64 min-w-[16rem]"
              placeholder="Search by Name, Spec, or Station"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="busy">Busy</SelectItem>
                <SelectItem value="off-duty">Off-duty</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Chef</Button>
          </div>
        }
      />

      <div className="surface-card rounded-2xl p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ASSIGNMENT_ID</TableHead>
              <TableHead>CHEF</TableHead>
              <TableHead>ORDER_ID</TableHead>
              <TableHead>STATUS</TableHead>
              <TableHead>STARTED_AT</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium">{a.id}</TableCell>
                <TableCell>{a.chef}</TableCell>
                <TableCell className="text-muted-foreground">{a.orderId}</TableCell>
                <TableCell>
                  <Badge variant={a.status === "completed" ? "success" : a.status === "in-progress" ? "warning" : a.status === "cancelled" ? "destructive" : "secondary" as any}>
                    {a.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell>{a.startedAt ? new Date(a.startedAt).toLocaleString() : "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteAssignment(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Chef</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rajesh Kumar" />
            </div>
            <div className="space-y-2">
              <Label>Specialization</Label>
              <Input value={form.specialization || ""} onChange={(e) => setForm({ ...form, specialization: e.target.value })} placeholder="e.g. Main Course" />
            </div>
            <div className="space-y-2">
              <Label>Station</Label>
              <Input value={form.station || ""} onChange={(e) => setForm({ ...form, station: e.target.value })} placeholder="e.g. Station A" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as any })}>
                <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="busy">Busy</SelectItem>
                  <SelectItem value="off-duty">Off-duty</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>Add Chef</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ChefAssignmentPage;
