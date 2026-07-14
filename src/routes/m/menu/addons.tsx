import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Plus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/m/menu/addons")({
  component: () => (
    <RequireAuth>
      <MenuAddonsPage />
    </RequireAuth>
  ),
});

type MenuAddon = {
  id: string;
  name: string;
  price: number;
  status: "active" | "inactive";
  category: string;
};

const categories = ["Toppings", "Sides", "Dips", "Crust", "Extras"];

const sampleAddons: MenuAddon[] = Array.from({ length: 15 }).map((_, index) => ({
  id: `ADD-${100 + index}`,
  name: ["Extra Cheese", "Mayonnaise", "Potato Fries", "Coke 250ml", "Garlic Bread"][index % 5],
  price: Math.round(20 + Math.random() * 100),
  status: index % 7 === 0 ? "inactive" : "active",
  category: categories[index % categories.length],
}));

function formatCurrency(value: number) {
  return `₹${value.toLocaleString()}`;
}

function MenuAddonsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [items, setItems] = useState<MenuAddon[]>(sampleAddons);
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuAddon | null>(null);
  const [form, setForm] = useState<Partial<MenuAddon>>({ status: "active" });

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        if (category !== "All" && item.category !== category) return false;
        const search = query.trim().toLowerCase();
        if (!search) return true;
        return item.name.toLowerCase().includes(search);
      }),
    [items, query, category],
  );

  const handleSave = () => {
    if (editItem) {
      setItems((prev) => prev.map((it) => (it.id === editItem.id ? ({ ...it, ...form } as MenuAddon) : it)));
      setEditItem(null);
    } else {
      const newItem: MenuAddon = {
        id: `ADD-${Math.floor(500 + Math.random() * 500)}`,
        name: form.name || "New Addon",
        price: form.price || 0,
        status: form.status || "active",
        category: form.category || categories[0],
      };
      setItems((prev) => [newItem, ...prev]);
      setAddOpen(false);
    }
    setForm({ status: "active" });
  };

  const deleteAddon = (id: string) => {
    if (!confirm("Delete this addon?")) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen space-y-4 bg-transparent p-1">
      <PageHeader
        title="Menu Addons"
        description="Manage extra items, sides, and toppings for your menu."
        actions={
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
            <Input
              className="w-64 min-w-[16rem]"
              placeholder="Search addons..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Addon</Button>
          </div>
        }
      />

      <div className="surface-card rounded-2xl p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Addon ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{formatCurrency(item.price)}</TableCell>
                <TableCell>
                  <Badge variant={item.status === "active" ? "success" : "secondary" as any}>
                    {item.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditItem(item); setForm(item); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteAddon(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={addOpen || !!editItem} onOpenChange={(v) => { if(!v) { setAddOpen(false); setEditItem(null); setForm({ status: "active" }); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Addon" : "Add Addon"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Addon Name</Label>
              <Input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Extra Cheese" />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                <SelectContent>
                  {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Price (₹)</Label>
              <Input type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex items-center gap-2">
                <Switch checked={form.status === "active"} onCheckedChange={(v) => setForm({ ...form, status: v ? "active" : "inactive" })} />
                <Label>{form.status === "active" ? "Active" : "Inactive"}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>{editItem ? "Update" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MenuAddonsPage;
