import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, Edit, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/m/menu/items")({
  component: () => (
    <RequireAuth>
      <MenuItemsPage />
    </RequireAuth>
  ),
});

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  isAvailable: boolean;
  isVeg: boolean;
  rating: number;
  orders: number;
};

const categories = ["All Categories", "North Indian", "South Indian", "Chinese", "Fast Food", "Desserts", "Beverages"];

const sampleItems: MenuItem[] = Array.from({ length: 24 }).map((_, index) => ({
  id: `ITM-${1000 + index}`,
  name: ["Paneer Butter Masala", "Chicken Tikka", "Veg Manchurian", "Hakka Noodles", "Gulab Jamun", "Masala Dosa"][index % 6],
  description: "A delicious and authentic dish prepared with fresh ingredients and traditional spices.",
  price: Math.round(150 + Math.random() * 500),
  category: categories[1 + (index % (categories.length - 1))],
  isAvailable: index % 8 !== 0,
  isVeg: index % 3 !== 1,
  rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
  orders: Math.floor(Math.random() * 1000),
  image: `https://api.dicebear.com/6.x/shapes/svg?seed=item${index}`,
}));

function formatCurrency(value: number) {
  return `₹${value.toLocaleString()}`;
}

function MenuItemsPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<MenuItem[]>(sampleItems);
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<Partial<MenuItem>>({ isAvailable: true, isVeg: true, price: 0 });

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        if (category !== "All Categories" && item.category !== category) return false;
        const search = query.trim().toLowerCase();
        if (!search) return true;
        return (
          item.name.toLowerCase().includes(search) ||
          item.category.toLowerCase().includes(search)
        );
      }),
    [items, query, category],
  );

  const pageSize = 8;
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggleAvailability = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, isAvailable: !item.isAvailable } : item)));
  };

  const deleteItem = (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = () => {
    if (editItem) {
      setItems((prev) => prev.map((it) => (it.id === editItem.id ? ({ ...it, ...form } as MenuItem) : it)));
      setEditItem(null);
    } else {
      const newItem: MenuItem = {
        id: `ITM-${Math.floor(5000 + Math.random() * 5000)}`,
        name: form.name || "New Item",
        description: form.description || "",
        price: form.price || 0,
        category: form.category || categories[1],
        isAvailable: form.isAvailable ?? true,
        isVeg: form.isVeg ?? true,
        rating: 0,
        orders: 0,
        image: form.image || `https://api.dicebear.com/6.x/shapes/svg?seed=${Date.now()}`,
      };
      setItems((prev) => [newItem, ...prev]);
      setAddOpen(false);
    }
    setForm({ isAvailable: true, isVeg: true, price: 0 });
  };

  return (
    <div className="min-h-screen space-y-4 bg-transparent p-1">
      <PageHeader
        title="Menu Items"
        description="Manage your restaurant's menu items, pricing, and availability."
        actions={
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
            <Input
              className="w-64 min-w-[16rem]"
              placeholder="Search items..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
            <Select value={category} onValueChange={(v) => { setCategory(v); setPage(1); }}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Item</Button>
          </div>
        }
      />

      <div className="surface-card rounded-2xl p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead>Rating/Orders</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center"><ImageIcon className="h-6 w-6 text-muted-foreground/40" /></div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">{item.description}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell className="font-medium">{formatCurrency(item.price)}</TableCell>
                <TableCell>
                  <Badge variant={item.isVeg ? "success" : "destructive" as any} className="text-[10px]">
                    {item.isVeg ? "VEG" : "NON-VEG"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Switch checked={item.isAvailable} onCheckedChange={() => toggleAvailability(item.id)} />
                    <span className="text-xs">{item.isAvailable ? "Available" : "Sold Out"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-xs">
                    <div className="font-medium">⭐ {item.rating}</div>
                    <div className="text-muted-foreground">{item.orders} orders</div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditItem(item); setForm(item); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteItem(item.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}
          </p>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage((v) => Math.max(1, v - 1))}>
              Prev
            </Button>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm">{page} / {pages}</div>
            <Button variant="ghost" size="sm" disabled={page === pages} onClick={() => setPage((v) => Math.min(pages, v + 1))}>
              Next
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={addOpen || !!editItem} onOpenChange={(v) => { if(!v) { setAddOpen(false); setEditItem(null); setForm({ isAvailable: true, isVeg: true, price: 0 }); } }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editItem ? "Edit Item" : "Add New Menu Item"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Item Name</Label>
                <Input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Butter Chicken" />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c !== "All Categories").map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe the dish..." />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Price (₹)</Label>
                <Input type="number" value={form.price || ""} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
              </div>
              <div className="space-y-2 flex flex-col justify-end pb-2">
                <div className="flex items-center gap-2">
                  <Switch checked={form.isVeg} onCheckedChange={(v) => setForm({ ...form, isVeg: v })} />
                  <Label>Is Vegetarian</Label>
                </div>
              </div>
              <div className="space-y-2 flex flex-col justify-end pb-2">
                <div className="flex items-center gap-2">
                  <Switch checked={form.isAvailable} onCheckedChange={(v) => setForm({ ...form, isAvailable: v })} />
                  <Label>Available</Label>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={form.image || ""} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>{editItem ? "Update Item" : "Create Item"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default MenuItemsPage;
