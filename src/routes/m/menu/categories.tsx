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
import { Edit, Trash2, Plus, Image as ImageIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/m/menu/categories")({
  component: () => (
    <RequireAuth>
      <MenuCategoriesPage />
    </RequireAuth>
  ),
});

type MenuCategory = {
  id: string;
  name: string;
  itemCount: number;
  status: "active" | "inactive";
  image?: string;
  parent?: string;
};

const sampleCategories: MenuCategory[] = [
  { id: "CAT-1", name: "North Indian", itemCount: 45, status: "active" },
  { id: "CAT-2", name: "South Indian", itemCount: 32, status: "active" },
  { id: "CAT-3", name: "Chinese", itemCount: 28, status: "active" },
  { id: "CAT-4", name: "Fast Food", itemCount: 54, status: "active" },
  { id: "CAT-5", name: "Desserts", itemCount: 18, status: "active" },
  { id: "CAT-6", name: "Beverages", itemCount: 22, status: "active" },
  { id: "CAT-7", name: "Continental", itemCount: 15, status: "inactive" },
];

function MenuCategoriesPage() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<MenuCategory[]>(sampleCategories);
  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<MenuCategory | null>(null);
  const [form, setForm] = useState<Partial<MenuCategory>>({ status: "active" });

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        const search = query.trim().toLowerCase();
        if (!search) return true;
        return item.name.toLowerCase().includes(search);
      }),
    [items, query],
  );

  const handleSave = () => {
    if (editItem) {
      setItems((prev) => prev.map((it) => (it.id === editItem.id ? ({ ...it, ...form } as MenuCategory) : it)));
      setEditItem(null);
    } else {
      const newItem: MenuCategory = {
        id: `CAT-${Math.floor(100 + Math.random() * 900)}`,
        name: form.name || "New Category",
        itemCount: 0,
        status: form.status || "active",
        image: form.image,
        parent: form.parent,
      };
      setItems((prev) => [newItem, ...prev]);
      setAddOpen(false);
    }
    setForm({ status: "active" });
  };

  const deleteCategory = (id: string) => {
    if (!confirm("Delete this category?")) return;
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen space-y-4 bg-transparent p-1">
      <PageHeader
        title="Menu Categories"
        description="Organize your menu with categories and subcategories."
        actions={
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
            <Input
              className="w-64 min-w-[16rem]"
              placeholder="Search categories..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Button onClick={() => setAddOpen(true)}><Plus className="mr-2 h-4 w-4" /> Add Category</Button>
          </div>
        }
      />

      <div className="surface-card rounded-2xl p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Items Count</TableHead>
              <TableHead>Parent Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="font-medium">{cat.id}</TableCell>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.itemCount} items</TableCell>
                <TableCell>{cat.parent || "None"}</TableCell>
                <TableCell>
                  <Badge variant={cat.status === "active" ? "success" : "secondary" as any}>
                    {cat.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => { setEditItem(cat); setForm(cat); }}><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteCategory(cat.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
            <DialogTitle>{editItem ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Category Name</Label>
              <Input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Desserts" />
            </div>
            <div className="space-y-2">
              <Label>Parent Category (Optional)</Label>
              <Select value={form.parent} onValueChange={(v) => setForm({ ...form, parent: v })}>
                <SelectTrigger><SelectValue placeholder="Select Parent" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {items.filter(i => i.id !== editItem?.id).map(i => <SelectItem key={i.id} value={i.name}>{i.name}</SelectItem>)}
                </SelectContent>
              </Select>
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

export default MenuCategoriesPage;
