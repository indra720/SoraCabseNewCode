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

type Chef = {
  id: string;
  name: string;
  specialization: string;
  activeOrders: number;
  status: "available" | "busy" | "off-duty";
  station: string;
};

// Generate 6 chefs
const sampleChefs: Chef[] = Array.from({ length: 6 }).map((_, i) => ({
  id: `CHF-${100 + i}`,
  name: ["Rajesh Kumar", "Sunita Sharma", "Anil Deshmukh", "Priya Singh", "Vikram Malhotra", "Meera Nair"][i % 6],
  specialization: ["Main Course", "South Indian", "Chinese", "Desserts", "Tandoor", "Fast Food"][i % 6],
  activeOrders: Math.floor(Math.random() * 5),
  status: (["available", "busy", "off-duty"] as const)[i % 3],
  station: ["Station A", "Station B", "Station C", "Station D"][i % 4],
}));

function ChefAssignmentPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [chefs, setChefs] = useState<Chef[]>(sampleChefs);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<Partial<Chef>>({ status: "available", activeOrders: 0, station: "Station A" });

  const filtered = useMemo(
    () =>
      chefs.filter((chef) => {
        if (status !== "all" && chef.status !== status) return false;
        const search = query.trim().toLowerCase();
        if (!search) return true;
        return (
          chef.name.toLowerCase().includes(search) ||
          chef.specialization.toLowerCase().includes(search) ||
          chef.station.toLowerCase().includes(search)
        );
      }),
    [chefs, query, status],
  );

  const handleSave = () => {
    const newChef: Chef = {
      id: `CHF-${Math.floor(1000 + Math.random() * 9000)}`,
      name: form.name || "New Chef",
      specialization: form.specialization || "General",
      activeOrders: form.activeOrders || 0,
      status: form.status || "available",
      station: form.station || "Station A",
    };
    setChefs((prev) => [newChef, ...prev]);
    setAddOpen(false);
    setForm({ status: "available", activeOrders: 0, station: "Station A" });
  };

  const deleteChef = (id: string) => {
    if (!confirm("Remove this chef?")) return;
    setChefs((prev) => prev.filter((c) => c.id !== id));
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
              <TableHead>Chef</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Station</TableHead>
              <TableHead>Active Orders</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((chef) => (
              <TableRow key={chef.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{chef.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{chef.name}</div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{chef.id}</TableCell>
                <TableCell>{chef.specialization}</TableCell>
                <TableCell>{chef.station}</TableCell>
                <TableCell>{chef.activeOrders}</TableCell>
                <TableCell>
                  <Badge variant={chef.status === "available" ? "success" : chef.status === "busy" ? "warning" : "secondary" as any}>
                    {chef.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteChef(chef.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
