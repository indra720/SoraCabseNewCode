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

export const Route = createFileRoute("/m/menu/combos")({
  component: () => (
    <RequireAuth>
      <MenuCombosPage />
    </RequireAuth>
  ),
});

type MenuCombo = {
  id: string;
  name: string;
  description: string;
  price: number;
  items: string[];
  status: "active" | "inactive";
};

const sampleCombos: MenuCombo[] = [
  {
    id: "CMB-1",
    name: "Family Pack",
    description: "2 Large Pizzas + 1 Coke 1.25L + Garlic Bread",
    price: 899,
    items: ["Pizza", "Coke", "Garlic Bread"],
    status: "active",
  },
  {
    id: "CMB-2",
    name: "Solo Meal",
    description: "1 Burger + 1 Small Fries + 1 Pepsi 250ml",
    price: 249,
    items: ["Burger", "Fries", "Pepsi"],
    status: "active",
  },
  {
    id: "CMB-3",
    name: "Duo Feast",
    description: "2 Pastas + 2 Desserts",
    price: 599,
    items: ["Pasta", "Dessert"],
    status: "active",
  },
];

function formatCurrency(value: number) {
  return `₹${value.toLocaleString()}`;
}

function MenuCombosPage() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<MenuCombo[]>(sampleCombos);
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuCombo | null>(null);
  const [form, setForm] = useState<Partial<MenuCombo>>({ status: "active", items: [] });

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const search = query.trim().toLowerCase();
        if (!search) return true;
        return item.name.toLowerCase().includes(search) || item.description.toLowerCase().includes(search);
      }),
    [items, query],
  );

  const handleSave = () => {
    if (editItem) {
      setItems((prev) => prev.map((it) => (it.id === editItem.id ? ({ ...it, ...form } as MenuCombo) : it)));
      setEditItem(null);
    } else {
      const newItem: MenuCombo = {
        id: `CMB-${Math.floor(100 + Math.random() * 900)}`,
        name: form.name || "New Combo",
        description: form.description || "",
        price: form.price || 0,
        items: form.items || [],
        status: form.status || "active",
      };
      setItems((prev) => [newItem, ...prev]);
      setAddOpen(false);
    }
    setForm({ status: "active", items: [] });
  };

  const deleteCombo = (id: string) => {
    if (!confirm("Delete this combo?")) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen space-y-4 bg-transparent p-1">
      <PageHeader
        title="Value Combos"
        description="Create and manage value-for-money meal combos and packs."
        actions={
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
            <Input
              className="w-64 min-w-[16rem]"
              placeholder="Search combos..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Combo</Button>
          </div>
        }
      />

      <div className="surface-card rounded-2xl p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Combo ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
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
                <TableCell className="max-w-md truncate">{item.description}</TableCell>
                <TableCell>{formatCurrency(item.price)}</TableCell>
                <TableCell>
                  <Badge variant={item.status === "active" ? "success" : "secondary" as any}>
                    {item.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditItem(item); setForm(item); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteCombo(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={addOpen || !!editItem} onOpenChange={(v) => { if(!v) { setAddOpen(false); setEditItem(null); setForm({ status: "active", items: [] }); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Combo" : "Add Combo"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Combo Name</Label>
              <Input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Happy Meal" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What's included?" />
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

export default MenuCombosPage;
