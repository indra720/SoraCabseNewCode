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
import { Edit, Trash2, Plus, Eye, Mail, Phone } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/m/restaurant/owners")({
  component: () => (
    <RequireAuth>
      <RestaurantOwnersPage />
    </RequireAuth>
  ),
});

type RestaurantOwner = {
  id: string;
  name: string;
  email: string;
  phone: string;
  restaurantsCount: number;
  joinedAt: string;
  status: "active" | "suspended";
};

const sampleOwners: RestaurantOwner[] = Array.from({ length: 10 }).map((_, index) => ({
  id: `OWN-${500 + index}`,
  name: ["Meera Rao", "Amit Singh", "Ravi Kumar", "Sanjay Gupta", "Priya Sharma"][index % 5],
  email: `owner${index + 1}@example.com`,
  phone: `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`,
  restaurantsCount: 1 + (index % 3),
  joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (index * 10 + 30)).toISOString(),
  status: index % 8 === 0 ? "suspended" : "active",
}));

function RestaurantOwnersPage() {
  const [query, setQuery] = useState("");
  const [owners, setOwners] = useState<RestaurantOwner[]>(sampleOwners);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<Partial<RestaurantOwner>>({ status: "active", restaurantsCount: 0 });

  const filtered = useMemo(
    () =>
      owners.filter((owner) => {
        const search = query.trim().toLowerCase();
        if (!search) return true;
        return (
          owner.name.toLowerCase().includes(search) ||
          owner.email.toLowerCase().includes(search) ||
          owner.phone.toLowerCase().includes(search)
        );
      }),
    [owners, query],
  );

  const handleSave = () => {
    const newOwner: RestaurantOwner = {
      id: `OWN-${Math.floor(1000 + Math.random() * 9000)}`,
      name: form.name || "New Owner",
      email: form.email || "",
      phone: form.phone || "",
      restaurantsCount: 0,
      joinedAt: new Date().toISOString(),
      status: form.status || "active",
    };
    setOwners((prev) => [newOwner, ...prev]);
    setAddOpen(false);
    setForm({ status: "active", restaurantsCount: 0 });
  };

  const deleteOwner = (id: string) => {
    if (!confirm("Remove this owner?")) return;
    setOwners((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div className="min-h-screen space-y-4 bg-transparent p-1">
      <PageHeader
        title="Restaurant Owners"
        description="Manage restaurant owners and their contact information."
        actions={
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
            <Input
              className="w-64 min-w-[16rem]"
              placeholder="Search by Name, Email, or Phone"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Owner</Button>
          </div>
        }
      />

      <div className="surface-card rounded-2xl p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Owner</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Restaurants</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((owner) => (
              <TableRow key={owner.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>{owner.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{owner.name}</div>
                  </div>
                </TableCell>
                <TableCell>{owner.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span>{owner.email}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span>{owner.phone}</span>
                  </div>
                </TableCell>
                <TableCell>{owner.restaurantsCount} units</TableCell>
                <TableCell>{new Date(owner.joinedAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={owner.status === "active" ? "success" : "secondary" as any}>
                    {owner.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteOwner(owner.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
            <DialogTitle>Add New Restaurant Owner</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Meera Rao" />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="owner@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 90000 00000" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>Add Owner</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RestaurantOwnersPage;
