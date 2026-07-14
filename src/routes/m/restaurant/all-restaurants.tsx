import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";

export const Route = createFileRoute("/m/restaurant/all-restaurants")({
  component: () => (
    <RequireAuth>
      <AllRestaurantsPage />
    </RequireAuth>
  ),
});

type RestaurantStatus = "active" | "pending" | "suspended";

type Restaurant = {
  id: string;
  logo?: string;
  coverImage?: string;
  name: string;
  owner: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  latitude?: string;
  longitude?: string;
  gst?: string;
  fssai?: string;
  pan?: string;
  openingTime?: string;
  closingTime?: string;
  workingDays?: string[];
  deliveryRadius?: number;
  minOrder?: number;
  deliveryCharge?: number;
  tax?: number;
  subscriptionPlan?: string;
  rating?: number;
  totalOrders?: number;
  revenue: number;
  branches: number;
  status: RestaurantStatus;
  createdAt?: string;
  updatedAt?: string;
  cuisine?: string;
  hours?: string;
};

const statusOptions: { label: string; value: RestaurantStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Suspended", value: "suspended" },
];

const sample: Restaurant[] = Array.from({ length: 28 }).map((_, i) => ({
  id: `R-${1000 + i}`,
  name: `Sora Bistro ${i + 1}`,
  owner: ["Meera Rao", "Amit Singh", "Ravi Kumar"][i % 3],
  email: `owner${i + 1}@sora.example`,
  phone: `+91 9${Math.floor(100000000 + Math.random() * 899999999)}`,
  whatsapp: `+91 9${Math.floor(100000000 + Math.random() * 899999999)}`,
  address: `${i + 1}, MG Road, ${["Bengaluru", "Delhi", "Mumbai"][i % 3]}`,
  city: ["Bengaluru", "Delhi", "Mumbai"][i % 3],
  state: ["Karnataka", "Delhi", "Maharashtra"][i % 3],
  country: "India",
  pincode: `5600${i}`,
  gst: `GSTIN${1000 + i}`,
  fssai: `FSSAI${2000 + i}`,
  pan: `PAN${3000 + i}`,
  cuisine: ["North Indian", "South Indian", "Italian"][i % 3],
  hours: "10:00 - 22:00",
  openingTime: "10:00",
  closingTime: "22:00",
  workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  deliveryRadius: 8,
  minOrder: 150,
  deliveryCharge: 30,
  tax: 5,
  subscriptionPlan: i % 4 === 0 ? "Pro" : "Basic",
  rating: Math.round(30 + Math.random() * 20) / 10,
  totalOrders: Math.floor(100 + Math.random() * 900),
  revenue: Math.round(10000 + Math.random() * 90000),
  branches: 1 + (i % 5),
  status: i % 7 === 0 ? "suspended" : i % 5 === 0 ? "pending" : "active",
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  updatedAt: new Date().toISOString(),
  logo: undefined,
  coverImage: undefined,
  latitude: `12.${Math.floor(100000 + Math.random() * 900000)}`,
  longitude: `77.${Math.floor(100000 + Math.random() * 900000)}`,
}));

function formatCurrency(n: number) {
  return `₹${n.toLocaleString()}`;
}

function AllRestaurantsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<RestaurantStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Restaurant[]>(sample);
  const [viewItem, setViewItem] = useState<Restaurant | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<Restaurant | null>(null);
  const [form, setForm] = useState<Partial<Restaurant>>({
    status: "pending",
    subscriptionPlan: "Basic",
    rating: 4.5,
    totalOrders: 0,
    branches: 1,
    revenue: 0,
  });

  const filtered = useMemo(() => {
    return items.filter((restaurant) => {
      if (status !== "all" && restaurant.status !== status) return false;
      if (
        query &&
        !restaurant.name.toLowerCase().includes(query.toLowerCase()) &&
        !restaurant.owner.toLowerCase().includes(query.toLowerCase())
      )
        return false;
      return true;
    });
  }, [items, query, status]);

  const total = filtered.length;
  const pageSize = 8;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const updateForm = (field: keyof Restaurant, value: string | number | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openAddDialog = () => {
    setForm({
      status: "pending",
      subscriptionPlan: "Basic",
      rating: 4.5,
      totalOrders: 0,
      branches: 1,
      revenue: 0,
    });
    setAddOpen(true);
  };

  const addRestaurant = () => {
    const newRestaurant: Restaurant = {
      id: `R-${Math.floor(100000 + Math.random() * 900000)}`,
      name: form.name || "New Restaurant",
      owner: form.owner || "Owner Name",
      email: form.email || "owner@example.com",
      phone: form.phone || "+91 9000000000",
      city: form.city || "City",
      state: form.state || "State",
      country: form.country || "India",
      status: (form.status as RestaurantStatus) || "pending",
      branches: form.branches ?? 1,
      revenue: form.revenue ?? 0,
      gst: form.gst || "GSTIN0000",
      fssai: form.fssai || "FSSAI0000",
      address: form.address || "Address",
      cuisine: form.cuisine || "Cuisine",
      hours: form.hours || "10:00 - 22:00",
      rating: form.rating ?? 0,
      totalOrders: form.totalOrders ?? 0,
      subscriptionPlan: form.subscriptionPlan || "Basic",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      whatsapp: form.whatsapp,
      pan: form.pan,
      pincode: form.pincode,
      latitude: form.latitude,
      longitude: form.longitude,
      openingTime: form.openingTime,
      closingTime: form.closingTime,
      workingDays: form.workingDays,
      deliveryRadius: form.deliveryRadius,
      minOrder: form.minOrder,
      deliveryCharge: form.deliveryCharge,
      tax: form.tax,
      logo: form.logo,
      coverImage: form.coverImage,
    };
    setItems((prev) => [newRestaurant, ...prev]);
    setAddOpen(false);
    setPage(1);
  };

  const openEditDialog = (restaurant: Restaurant) => {
    setEditItem(restaurant);
    setForm(restaurant);
    setEditOpen(true);
  };

  const saveEdit = () => {
    if (!editItem) return;
    setItems((prev) => prev.map((restaurant) => (restaurant.id === editItem.id ? ({ ...restaurant, ...form } as Restaurant) : restaurant)));
    setEditOpen(false);
    setEditItem(null);
  };

  const deleteRestaurant = (restaurant: Restaurant) => {
    if (!confirm(`Delete ${restaurant.name}?`)) return;
    setItems((prev) => prev.filter((item) => item.id !== restaurant.id));
  };

  const renderBadge = (status: RestaurantStatus) => {
    return status === "active" ? (
      <Badge>Active</Badge>
    ) : status === "pending" ? (
      <Badge variant="secondary">Pending</Badge>
    ) : (
      <Badge variant="destructive">Suspended</Badge>
    );
  };

  return (
    <div className="min-h-screen space-y-4 bg-transparent p-1">
      <PageHeader
        title="All Restaurants"
        description="Advanced restaurant management with add, edit, delete, and details."
        actions={
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
            <Input
              className="w-72 min-w-[18rem]"
              placeholder="Search restaurants or owner"
              value={query}
              onChange={(e) => {
                setQuery((e.target as HTMLInputElement).value);
                setPage(1);
              }}
            />
            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value as RestaurantStatus | "all");
                setPage(1);
              }}
            >
              <SelectTrigger className="w-40">
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
            <Button onClick={openAddDialog}>Add Restaurant</Button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <Button
            key={option.value}
            variant={status === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setStatus(option.value);
              setPage(1);
            }}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <div className="surface-card rounded-2xl p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <tr>
              <TableHead>Logo</TableHead>
              <TableHead>Restaurant ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>Branches</TableHead>
              <TableHead>Cuisine</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>GST</TableHead>
              <TableHead>FSSAI</TableHead>
              <TableHead>Plan</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead>Actions</TableHead>
            </tr>
          </TableHeader>
          <TableBody>
            {pageData.map((restaurant) => (
              <TableRow key={restaurant.id}>
                <TableCell>
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{restaurant.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell>{restaurant.id}</TableCell>
                <TableCell>{restaurant.name}</TableCell>
                <TableCell>
                  {restaurant.owner}
                  <div className="text-xs text-muted-foreground">{restaurant.email}</div>
                </TableCell>
                <TableCell>{restaurant.branches}</TableCell>
                <TableCell>{restaurant.cuisine}</TableCell>
                <TableCell>{restaurant.email}</TableCell>
                <TableCell>{restaurant.phone}</TableCell>
                <TableCell>{restaurant.city}</TableCell>
                <TableCell>{restaurant.state}</TableCell>
                <TableCell>{restaurant.country}</TableCell>
                <TableCell>{restaurant.gst}</TableCell>
                <TableCell>{restaurant.fssai}</TableCell>
                <TableCell>{restaurant.subscriptionPlan}</TableCell>
                <TableCell>{restaurant.rating?.toFixed(1)}</TableCell>
                <TableCell>{restaurant.totalOrders}</TableCell>
                <TableCell>{formatCurrency(restaurant.revenue)}</TableCell>
                <TableCell>{renderBadge(restaurant.status)}</TableCell>
                <TableCell>{restaurant.createdAt ? new Date(restaurant.createdAt).toLocaleDateString() : "-"}</TableCell>
                <TableCell>{restaurant.updatedAt ? new Date(restaurant.updatedAt).toLocaleDateString() : "-"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="View"><Eye className="h-4 w-4" /></Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl">
                        <DialogHeader>
                          <DialogTitle>{restaurant.name}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 p-4">
                          <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
                            <div className="rounded-3xl bg-zinc-100 p-4">
                              <div
                                className="h-36 rounded-3xl bg-cover bg-center"
                                style={{ backgroundImage: `url(${restaurant.coverImage || "https://via.placeholder.com/500x220?text=Cover"})` }}
                              />
                              <div className="mt-4 flex items-center gap-3">
                                <div className="h-20 w-20 rounded-3xl bg-zinc-200 flex items-center justify-center text-xl">Logo</div>
                                <div>
                                  <p className="text-sm text-muted-foreground">{restaurant.cuisine}</p>
                                  <h3 className="text-lg font-semibold">{restaurant.name}</h3>
                                  <p className="text-xs text-muted-foreground">{restaurant.address}</p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="rounded-3xl bg-zinc-100 p-4">
                                <p className="text-xs text-muted-foreground">Restaurant Profile</p>
                                <div className="mt-2 grid gap-2 text-sm">
                                  <div><strong>Owner:</strong> {restaurant.owner}</div>
                                  <div><strong>Contact:</strong> {restaurant.phone} / {restaurant.email}</div>
                                  <div><strong>Location:</strong> {restaurant.city}, {restaurant.state}, {restaurant.country}</div>
                                  <div><strong>GST:</strong> {restaurant.gst}</div>
                                  <div><strong>FSSAI:</strong> {restaurant.fssai}</div>
                                  <div><strong>Status:</strong> {restaurant.status}</div>
                                </div>
                              </div>
                              <div className="rounded-3xl bg-zinc-100 p-4">
                                <p className="text-xs text-muted-foreground">Subscription</p>
                                <div className="mt-2 text-sm">
                                  <div><strong>Plan:</strong> {restaurant.subscriptionPlan}</div>
                                  <div><strong>Revenue:</strong> {formatCurrency(restaurant.revenue)}</div>
                                  <div><strong>Orders:</strong> {restaurant.totalOrders}</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-4 lg:grid-cols-2">
                            <div className="rounded-3xl bg-zinc-100 p-4">
                              <p className="text-xs text-muted-foreground">Documents</p>
                              <div className="mt-3 grid gap-2 text-sm">
                                <div><strong>PAN:</strong> {restaurant.pan || "N/A"}</div>
                                <div><strong>WhatsApp:</strong> {restaurant.whatsapp}</div>
                                <div><strong>Opening Time:</strong> {restaurant.openingTime || restaurant.hours}</div>
                                <div><strong>Working Days:</strong> {restaurant.workingDays?.join(", ")}</div>
                              </div>
                            </div>
                            <div className="rounded-3xl bg-zinc-100 p-4">
                              <p className="text-xs text-muted-foreground">Analytics</p>
                              <div className="mt-3 grid gap-2 text-sm">
                                <div><strong>Rating:</strong> {restaurant.rating?.toFixed(1)}</div>
                                <div><strong>Min Order:</strong> {restaurant.minOrder ? formatCurrency(restaurant.minOrder) : "-"}</div>
                                <div><strong>Delivery Charge:</strong> {restaurant.deliveryCharge ? formatCurrency(restaurant.deliveryCharge) : "-"}</div>
                                <div><strong>Tax:</strong> {restaurant.tax ? `${restaurant.tax}%` : "-"}</div>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-3xl bg-zinc-100 p-4">
                            <p className="text-xs text-muted-foreground">Activity Logs</p>
                            <ul className="mt-3 space-y-2 text-sm">
                              <li>Order volume increased by 12% this week.</li>
                              <li>Menu updated 2 days ago.</li>
                              <li>Documents verified on {restaurant.updatedAt ? new Date(restaurant.updatedAt).toLocaleDateString() : "-"}.</li>
                            </ul>
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button>Close</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => openEditDialog(restaurant)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => deleteRestaurant(restaurant)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </Button>
            <div className="px-3 py-1 rounded-md bg-muted/50">{page} / {pages}</div>
            <Button variant="ghost" disabled={page === pages} onClick={() => setPage((p) => Math.min(pages, p + 1))}>
              Next
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Restaurant</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              <Input value={form.name || ""} onChange={(e) => updateForm("name", e.target.value)} placeholder="Restaurant Name" />
              <Input value={form.owner || ""} onChange={(e) => updateForm("owner", e.target.value)} placeholder="Owner Name" />
              <Input value={form.email || ""} onChange={(e) => updateForm("email", e.target.value)} placeholder="Email" />
              <Input value={form.phone || ""} onChange={(e) => updateForm("phone", e.target.value)} placeholder="Phone" />
              <Input value={form.city || ""} onChange={(e) => updateForm("city", e.target.value)} placeholder="City" />
              <Input value={form.state || ""} onChange={(e) => updateForm("state", e.target.value)} placeholder="State" />
              <Input value={form.country || ""} onChange={(e) => updateForm("country", e.target.value)} placeholder="Country" />
              <Input value={form.pincode || ""} onChange={(e) => updateForm("pincode", e.target.value)} placeholder="Pincode" />
              <Input value={form.gst || ""} onChange={(e) => updateForm("gst", e.target.value)} placeholder="GST Number" />
              <Input value={form.fssai || ""} onChange={(e) => updateForm("fssai", e.target.value)} placeholder="FSSAI Number" />
              <Input value={form.pan || ""} onChange={(e) => updateForm("pan", e.target.value)} placeholder="PAN" />
              <Input value={form.subscriptionPlan || ""} onChange={(e) => updateForm("subscriptionPlan", e.target.value)} placeholder="Subscription Plan" />
            </div>
            <Textarea value={form.address || ""} onChange={(e) => updateForm("address", e.target.value)} placeholder="Address" />
            <div className="grid gap-3 md:grid-cols-3">
              <Input value={form.cuisine || ""} onChange={(e) => updateForm("cuisine", e.target.value)} placeholder="Cuisine" />
              <Input value={form.hours || ""} onChange={(e) => updateForm("hours", e.target.value)} placeholder="Operating Hours" />
              <Input value={form.whatsapp || ""} onChange={(e) => updateForm("whatsapp", e.target.value)} placeholder="WhatsApp" />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <Input value={form.revenue ?? ""} onChange={(e) => updateForm("revenue", Number(e.target.value))} placeholder="Revenue" type="number" />
              <Input value={form.totalOrders ?? ""} onChange={(e) => updateForm("totalOrders", Number(e.target.value))} placeholder="Total Orders" type="number" />
              <Input value={form.rating ?? ""} onChange={(e) => updateForm("rating", Number(e.target.value))} placeholder="Rating" type="number" />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <Input value={form.deliveryCharge ?? ""} onChange={(e) => updateForm("deliveryCharge", Number(e.target.value))} placeholder="Delivery Charge" type="number" />
              <Input value={form.tax ?? ""} onChange={(e) => updateForm("tax", Number(e.target.value))} placeholder="Tax %" type="number" />
              <Input value={form.minOrder ?? ""} onChange={(e) => updateForm("minOrder", Number(e.target.value))} placeholder="Minimum Order" type="number" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={addRestaurant}>Save</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Restaurant</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              <Input value={form.name || ""} onChange={(e) => updateForm("name", e.target.value)} placeholder="Restaurant Name" />
              <Input value={form.owner || ""} onChange={(e) => updateForm("owner", e.target.value)} placeholder="Owner Name" />
              <Input value={form.email || ""} onChange={(e) => updateForm("email", e.target.value)} placeholder="Email" />
              <Input value={form.phone || ""} onChange={(e) => updateForm("phone", e.target.value)} placeholder="Phone" />
              <Input value={form.city || ""} onChange={(e) => updateForm("city", e.target.value)} placeholder="City" />
              <Input value={form.state || ""} onChange={(e) => updateForm("state", e.target.value)} placeholder="State" />
              <Input value={form.country || ""} onChange={(e) => updateForm("country", e.target.value)} placeholder="Country" />
              <Input value={form.pincode || ""} onChange={(e) => updateForm("pincode", e.target.value)} placeholder="Pincode" />
              <Input value={form.gst || ""} onChange={(e) => updateForm("gst", e.target.value)} placeholder="GST Number" />
              <Input value={form.fssai || ""} onChange={(e) => updateForm("fssai", e.target.value)} placeholder="FSSAI Number" />
              <Input value={form.pan || ""} onChange={(e) => updateForm("pan", e.target.value)} placeholder="PAN" />
              <Input value={form.subscriptionPlan || ""} onChange={(e) => updateForm("subscriptionPlan", e.target.value)} placeholder="Subscription Plan" />
            </div>
            <Textarea value={form.address || ""} onChange={(e) => updateForm("address", e.target.value)} placeholder="Address" />
            <div className="grid gap-3 md:grid-cols-3">
              <Input value={form.cuisine || ""} onChange={(e) => updateForm("cuisine", e.target.value)} placeholder="Cuisine" />
              <Input value={form.hours || ""} onChange={(e) => updateForm("hours", e.target.value)} placeholder="Operating Hours" />
              <Input value={form.whatsapp || ""} onChange={(e) => updateForm("whatsapp", e.target.value)} placeholder="WhatsApp" />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <Input value={form.revenue ?? ""} onChange={(e) => updateForm("revenue", Number(e.target.value))} placeholder="Revenue" type="number" />
              <Input value={form.totalOrders ?? ""} onChange={(e) => updateForm("totalOrders", Number(e.target.value))} placeholder="Total Orders" type="number" />
              <Input value={form.rating ?? ""} onChange={(e) => updateForm("rating", Number(e.target.value))} placeholder="Rating" type="number" />
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <Input value={form.deliveryCharge ?? ""} onChange={(e) => updateForm("deliveryCharge", Number(e.target.value))} placeholder="Delivery Charge" type="number" />
              <Input value={form.tax ?? ""} onChange={(e) => updateForm("tax", Number(e.target.value))} placeholder="Tax %" type="number" />
              <Input value={form.minOrder ?? ""} onChange={(e) => updateForm("minOrder", Number(e.target.value))} placeholder="Minimum Order" type="number" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={saveEdit}>Update</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AllRestaurantsPage;
