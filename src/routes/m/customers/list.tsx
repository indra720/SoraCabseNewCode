import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";

export const Route = createFileRoute("/m/customers/list")({
  component: () => (
    <RequireAuth>
      <CustomersPage />
    </RequireAuth>
  ),
});

type CustomerStatus = "active" | "inactive" | "banned";

type Customer = {
  id: string;
  avatar?: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  joinedAt: string;
  lastActive: string;
  walletBalance: number;
  totalRides: number;
  rating: number;
  status: CustomerStatus;
  documents: string[];
  notes?: string;
};

const statusOptions: { label: string; value: CustomerStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
  { label: "Banned", value: "banned" },
];

const sampleCustomers: Customer[] = Array.from({ length: 16 }).map((_, index) => ({
  id: `C-${1200 + index}`,
  avatar: index % 4 === 0 ? undefined : `https://api.dicebear.com/6.x/fun-emoji/svg?seed=customer${index}`,
  name: ["Ayesha Khan", "Rahul Jain", "Sneha Patel", "Vikram Rao"][index % 4],
  email: `customer${index + 1}@soraapp.com`,
  phone: `+91 9${Math.floor(100000000 + Math.random() * 900000000)}`,
  city: ["Mumbai", "Bengaluru", "Delhi", "Hyderabad"][index % 4],
  joinedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * (index * 3 + 12)).toISOString(),
  lastActive: new Date(Date.now() - 1000 * 60 * 60 * (index * 5 + 2)).toISOString(),
  walletBalance: Math.round(Math.random() * 2000),
  totalRides: 10 + index * 3,
  rating: Math.round((3 + Math.random() * 2) * 10) / 10,
  status: index % 7 === 0 ? "banned" : index % 3 === 0 ? "inactive" : "active",
  documents:
    index % 3 === 0
      ? [
          "https://via.placeholder.com/320x220?text=Passport",
          "https://via.placeholder.com/320x220?text=ID+Proof",
        ]
      : ["https://via.placeholder.com/320x220?text=Profile+Photo"],
  notes: "Premium customer with fast booking preference.",
}));

function formatCurrency(value: number) {
  return `₹${value.toLocaleString()}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function CustomersPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<CustomerStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<Customer[]>(sampleCustomers);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<Customer | null>(null);
  const [form, setForm] = useState<Partial<Customer>>({ status: "active", walletBalance: 0, totalRides: 0, rating: 4.5 });

  const filtered = useMemo(
    () =>
      items.filter((customer) => {
        if (status !== "all" && customer.status !== status) return false;
        const search = query.trim().toLowerCase();
        if (!search) return true;
        return (
          customer.name.toLowerCase().includes(search) ||
          customer.email.toLowerCase().includes(search) ||
          customer.phone.toLowerCase().includes(search)
        );
      }),
    [items, query, status],
  );

  const pageSize = 8;
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const updateForm = (field: keyof Customer, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openAddDialog = () => {
    setForm({ status: "active", walletBalance: 0, totalRides: 0, rating: 4.5 });
    setAddOpen(true);
  };

  const addCustomer = () => {
    const newCustomer: Customer = {
      id: `C-${Math.floor(5000 + Math.random() * 5000)}`,
      name: form.name || "New Customer",
      email: form.email || "new.customer@soraapp.com",
      phone: form.phone || "+91 9000000000",
      city: form.city || "City",
      joinedAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      walletBalance: form.walletBalance ?? 0,
      totalRides: form.totalRides ?? 0,
      rating: form.rating ?? 0,
      status: (form.status as CustomerStatus) || "active",
      avatar: form.avatar,
      documents: form.documents || ["https://via.placeholder.com/320x220?text=Document"],
      notes: form.notes || "New customer added manually.",
    };
    setItems((prev) => [newCustomer, ...prev]);
    setAddOpen(false);
    setPage(1);
  };

  const openEditDialog = (customer: Customer) => {
    setEditItem(customer);
    setForm(customer);
    setEditOpen(true);
  };

  const saveEdit = () => {
    if (!editItem) return;
    setItems((prev) => prev.map((item) => (item.id === editItem.id ? ({ ...item, ...form } as Customer) : item)));
    setEditOpen(false);
    setEditItem(null);
  };

  const deleteCustomer = (customer: Customer) => {
    if (!confirm(`Delete ${customer.name}?`)) return;
    setItems((prev) => prev.filter((item) => item.id !== customer.id));
  };

  const renderStatusBadge = (status: CustomerStatus) => {
    if (status === "active") return <Badge>Active</Badge>;
    if (status === "inactive") return <Badge variant="secondary">Inactive</Badge>;
    return <Badge variant="destructive">Banned</Badge>;
  };

  return (
    <div className="min-h-screen space-y-4 bg-transparent p-1">
      <PageHeader
        title="Customers"
        description="Manage customers, their wallet balances, rides, and profile details."
        actions={
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
            <Input
              className="w-72 min-w-[18rem]"
              placeholder="Search customers"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
            <Select value={status} onValueChange={(value) => {
              setStatus(value as CustomerStatus | "all");
              setPage(1);
            }}>
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
            <Button onClick={openAddDialog}>Add Customer</Button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <Button
            key={option.value}
            size="sm"
            variant={status === option.value ? "default" : "outline"}
            onClick={() => {
              setStatus(option.value as CustomerStatus | "all");
              setPage(1);
            }}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <div className="surface-card rounded-2xl p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Wallet</TableHead>
              <TableHead>Rides</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageData.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      {customer.avatar ? (
                        <img src={customer.avatar} alt={customer.name} className="h-full w-full rounded-full object-cover" />
                      ) : (
                        <AvatarFallback>{customer.name.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-xs text-muted-foreground">{customer.id}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>{customer.city}</TableCell>
                <TableCell>{formatCurrency(customer.walletBalance)}</TableCell>
                <TableCell>{customer.totalRides}</TableCell>
                <TableCell>{customer.rating.toFixed(1)}</TableCell>
                <TableCell>{renderStatusBadge(customer.status)}</TableCell>
                <TableCell>{formatDate(customer.joinedAt)}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="View"><Eye className="h-4 w-4" /></Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>{customer.name}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 p-4">
                          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                            <div className="rounded-3xl bg-zinc-100 p-4">
                              <div className="flex items-center gap-4">
                                <div className="h-24 w-24 rounded-3xl bg-zinc-200 overflow-hidden">
                                  {customer.avatar ? (
                                    <img src={customer.avatar} alt={customer.name} className="h-full w-full object-cover" />
                                  ) : (
                                    <div className="flex h-full items-center justify-center text-2xl text-zinc-500">{customer.name.charAt(0)}</div>
                                  )}
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">Customer ID</p>
                                  <p className="text-lg font-semibold">{customer.id}</p>
                                  <p className="mt-2 text-sm">{customer.email}</p>
                                  <p className="text-sm">{customer.phone}</p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <div className="rounded-3xl bg-zinc-100 p-4">
                                <p className="text-xs text-muted-foreground">Activity</p>
                                <div className="mt-3 grid gap-2 text-sm">
                                  <div><strong>City:</strong> {customer.city}</div>
                                  <div><strong>Joined:</strong> {formatDate(customer.joinedAt)}</div>
                                  <div><strong>Last Active:</strong> {formatDate(customer.lastActive)}</div>
                                  <div><strong>Status:</strong> {customer.status}</div>
                                </div>
                              </div>
                              <div className="rounded-3xl bg-zinc-100 p-4">
                                <p className="text-xs text-muted-foreground">Wallet Summary</p>
                                <div className="mt-3 text-sm">
                                  <div><strong>Balance:</strong> {formatCurrency(customer.walletBalance)}</div>
                                  <div><strong>Completed rides:</strong> {customer.totalRides}</div>
                                  <div><strong>Rating:</strong> {customer.rating.toFixed(1)}</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-3xl bg-zinc-100 p-4">
                            <p className="text-xs text-muted-foreground">Documents</p>
                            <div className="mt-3 grid gap-3 sm:grid-cols-2">
                              {customer.documents.map((src, idx) => (
                                <div key={idx} className="overflow-hidden rounded-3xl bg-white shadow-sm">
                                  <img src={src} alt={`Document ${idx + 1}`} className="h-36 w-full object-cover" />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="rounded-3xl bg-zinc-100 p-4">
                            <p className="text-xs text-muted-foreground">Notes</p>
                            <p className="mt-2 text-sm leading-relaxed">{customer.notes}</p>
                          </div>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button>Close</Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Button variant="ghost" size="icon" aria-label="Edit" onClick={() => openEditDialog(customer)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Delete" onClick={() => deleteCustomer(customer)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
            <Button variant="ghost" size="sm" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
              Prev
            </Button>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-sm">{page} / {pages}</div>
            <Button variant="ghost" size="sm" disabled={page === pages} onClick={() => setPage((value) => Math.min(pages, value + 1))}>
              Next
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add Customer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="form-name">Name</Label>
                <Input id="form-name" value={form.name || ""} placeholder="Name" onChange={(e) => updateForm("name", e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="form-email">Email</Label>
                <Input id="form-email" value={form.email || ""} placeholder="Email" onChange={(e) => updateForm("email", e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="form-phone">Phone</Label>
                <Input id="form-phone" value={form.phone || ""} placeholder="Phone" onChange={(e) => updateForm("phone", e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="form-city">City</Label>
                <Input id="form-city" value={form.city || ""} placeholder="City" onChange={(e) => updateForm("city", e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="form-wallet">Wallet Balance</Label>
                <Input id="form-wallet" value={form.walletBalance ?? ""} placeholder="Wallet Balance" type="number" onChange={(e) => updateForm("walletBalance", Number(e.target.value))} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="form-rides">Total Rides</Label>
                <Input id="form-rides" value={form.totalRides ?? ""} placeholder="Total Rides" type="number" onChange={(e) => updateForm("totalRides", Number(e.target.value))} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="form-rating">Rating</Label>
                <Input id="form-rating" value={form.rating ?? ""} placeholder="Rating" type="number" onChange={(e) => updateForm("rating", Number(e.target.value))} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="form-status">Status</Label>
                <Select value={form.status || "active"} onValueChange={(value) => updateForm("status", value as CustomerStatus)}>
                  <SelectTrigger id="form-status" className="w-full"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    {statusOptions.filter((item) => item.value !== "all").map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Input value={form.avatar || ""} placeholder="Avatar URL" onChange={(e) => updateForm("avatar", e.target.value)} />
            <Input value={form.notes || ""} placeholder="Notes" onChange={(e) => updateForm("notes", e.target.value)} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={addCustomer}>Save</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="grid gap-1.5">
                <Label htmlFor="form-name">Name</Label>
                <Input id="form-name" value={form.name || ""} placeholder="Name" onChange={(e) => updateForm("name", e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="form-email">Email</Label>
                <Input id="form-email" value={form.email || ""} placeholder="Email" onChange={(e) => updateForm("email", e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="form-phone">Phone</Label>
                <Input id="form-phone" value={form.phone || ""} placeholder="Phone" onChange={(e) => updateForm("phone", e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="form-city">City</Label>
                <Input id="form-city" value={form.city || ""} placeholder="City" onChange={(e) => updateForm("city", e.target.value)} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="form-wallet">Wallet Balance</Label>
                <Input id="form-wallet" value={form.walletBalance ?? ""} placeholder="Wallet Balance" type="number" onChange={(e) => updateForm("walletBalance", Number(e.target.value))} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="form-rides">Total Rides</Label>
                <Input id="form-rides" value={form.totalRides ?? ""} placeholder="Total Rides" type="number" onChange={(e) => updateForm("totalRides", Number(e.target.value))} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="form-rating">Rating</Label>
                <Input id="form-rating" value={form.rating ?? ""} placeholder="Rating" type="number" onChange={(e) => updateForm("rating", Number(e.target.value))} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="form-status">Status</Label>
                <Select value={form.status || "active"} onValueChange={(value) => updateForm("status", value as CustomerStatus)}>
                  <SelectTrigger id="form-status" className="w-full"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    {statusOptions.filter((item) => item.value !== "all").map((option) => (
                      <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Input value={form.avatar || ""} placeholder="Avatar URL" onChange={(e) => updateForm("avatar", e.target.value)} />
            <Input value={form.notes || ""} placeholder="Notes" onChange={(e) => updateForm("notes", e.target.value)} />
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

export default CustomersPage;
