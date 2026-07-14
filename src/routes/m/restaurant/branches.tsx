import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Plus, MapPin, Navigation } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/m/restaurant/branches")({
  component: () => (
    <RequireAuth>
      <RestaurantBranchesPage />
    </RequireAuth>
  ),
});

type RestaurantBranch = {
  id: string;
  restaurantName: string;
  address: string;
  city: string;
  manager: string;
  phone: string;
  status: "active" | "closed" | "renovating";
};

const sampleBranches: RestaurantBranch[] = Array.from({ length: 12 }).map((_, index) => ({
  id: `BR-${100 + index}`,
  restaurantName: ["Sora Bistro", "Pizza Palace", "Tandoor Express"][index % 3],
  address: `${index + 10}, MG Road, ${["Bengaluru", "Delhi", "Mumbai"][index % 3]}`,
  city: ["Bengaluru", "Delhi", "Mumbai"][index % 3],
  manager: ["John Doe", "Jane Smith", "Anil K"][index % 3],
  phone: `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`,
  status: index % 10 === 0 ? "closed" : index % 7 === 0 ? "renovating" : "active",
}));

function RestaurantBranchesPage() {
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("All Cities");
  const [branches, setBranches] = useState<RestaurantBranch[]>(sampleBranches);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<Partial<RestaurantBranch>>({ status: "active" });

  const filtered = useMemo(
    () =>
      branches.filter((branch) => {
        if (city !== "All Cities" && branch.city !== city) return false;
        const search = query.trim().toLowerCase();
        if (!search) return true;
        return (
          branch.restaurantName.toLowerCase().includes(search) ||
          branch.address.toLowerCase().includes(search) ||
          branch.manager.toLowerCase().includes(search)
        );
      }),
    [branches, query, city],
  );

  const handleSave = () => {
    const newBranch: RestaurantBranch = {
      id: `BR-${Math.floor(500 + Math.random() * 500)}`,
      restaurantName: form.restaurantName || "New Branch",
      address: form.address || "",
      city: form.city || "Bengaluru",
      manager: form.manager || "",
      phone: form.phone || "",
      status: form.status || "active",
    };
    setBranches((prev) => [newBranch, ...prev]);
    setAddOpen(false);
    setForm({ status: "active" });
  };

  const deleteBranch = (id: string) => {
    if (!confirm("Delete this branch?")) return;
    setBranches((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen space-y-4 bg-transparent p-1">
      <PageHeader
        title="Restaurant Branches"
        description="Manage individual branch locations, managers, and contact details."
        actions={
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
            <Input
              className="w-64 min-w-[16rem]"
              placeholder="Search by Restaurant, Address, or Manager"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Cities">All Cities</SelectItem>
                <SelectItem value="Bengaluru">Bengaluru</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Branch</Button>
          </div>
        }
      />

      <div className="surface-card rounded-2xl p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Branch ID</TableHead>
              <TableHead>Restaurant</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((branch) => (
              <TableRow key={branch.id}>
                <TableCell className="font-medium">{branch.id}</TableCell>
                <TableCell>{branch.restaurantName}</TableCell>
                <TableCell>
                  <div className="flex items-start gap-2 max-w-xs">
                    <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <span className="truncate">{branch.address}</span>
                  </div>
                </TableCell>
                <TableCell>{branch.city}</TableCell>
                <TableCell>{branch.manager}</TableCell>
                <TableCell>{branch.phone}</TableCell>
                <TableCell>
                  <Badge variant={branch.status === "active" ? "success" : branch.status === "closed" ? "destructive" : "secondary" as any}>
                    {branch.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon"><Navigation className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteBranch(branch.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
            <DialogTitle>Add New Branch</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Restaurant Name</Label>
              <Input value={form.restaurantName || ""} onChange={(e) => setForm({ ...form, restaurantName: e.target.value })} placeholder="e.g. Sora Bistro" />
            </div>
            <div className="space-y-2">
              <Label>Address</Label>
              <Input value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="Street address" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={form.city || ""} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="City" />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Manager Name</Label>
              <Input value={form.manager || ""} onChange={(e) => setForm({ ...form, manager: e.target.value })} placeholder="John Doe" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>Add Branch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RestaurantBranchesPage;
