import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/m/restaurant/categories")({
  component: () => (
    <RequireAuth>
      <RestaurantCategoriesPage />
    </RequireAuth>
  ),
});

type RestaurantCategory = {
  id: string;
  name: string;
  type: "Cuisine" | "Establishment" | "Feature";
  restaurantsCount: number;
  status: "active" | "inactive";
};

const sampleCategories: RestaurantCategory[] = [
  { id: "RC-01", name: "North Indian", type: "Cuisine", restaurantsCount: 45, status: "active" },
  { id: "RC-02", name: "South Indian", type: "Cuisine", restaurantsCount: 32, status: "active" },
  { id: "RC-03", name: "Fast Food", type: "Cuisine", restaurantsCount: 54, status: "active" },
  { id: "RC-04", name: "Fine Dining", type: "Establishment", restaurantsCount: 12, status: "active" },
  { id: "RC-05", name: "Cafe", type: "Establishment", restaurantsCount: 28, status: "active" },
  { id: "RC-06", name: "Pet Friendly", type: "Feature", restaurantsCount: 8, status: "active" },
];

function RestaurantCategoriesPage() {
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<RestaurantCategory[]>(sampleCategories);
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState<Partial<RestaurantCategory>>({ status: "active", type: "Cuisine" });

  const filtered = useMemo(
    () =>
      categories.filter((cat) => {
        const search = query.trim().toLowerCase();
        if (!search) return true;
        return cat.name.toLowerCase().includes(search) || cat.type.toLowerCase().includes(search);
      }),
    [categories, query],
  );

  const handleSave = () => {
    const newCat: RestaurantCategory = {
      id: `RC-${Math.floor(10 + Math.random() * 90)}`,
      name: form.name || "New Category",
      type: form.type || "Cuisine",
      restaurantsCount: 0,
      status: form.status || "active",
    };
    setCategories((prev) => [newCat, ...prev]);
    setAddOpen(false);
    setForm({ status: "active", type: "Cuisine" });
  };

  const deleteCategory = (id: string) => {
    if (!confirm("Delete this category?")) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen space-y-4 bg-transparent p-1">
      <PageHeader
        title="Restaurant Categories"
        description="Define cuisines, establishment types, and features for restaurant classification."
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
              <TableHead>Type</TableHead>
              <TableHead>Restaurants</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell className="font-medium">{cat.id}</TableCell>
                <TableCell>{cat.name}</TableCell>
                <TableCell>{cat.type}</TableCell>
                <TableCell>{cat.restaurantsCount} units</TableCell>
                <TableCell>
                  <Badge variant={cat.status === "active" ? "success" : "secondary" as any}>
                    {cat.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteCategory(cat.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
            <DialogTitle>Add New Category</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Category Name</Label>
              <Input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Italian" />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v as any })}>
                <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cuisine">Cuisine</SelectItem>
                  <SelectItem value="Establishment">Establishment</SelectItem>
                  <SelectItem value="Feature">Feature</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default RestaurantCategoriesPage;
