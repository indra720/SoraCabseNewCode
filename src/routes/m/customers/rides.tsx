import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MapPin, Clock, Eye, Navigation } from "lucide-react";

export const Route = createFileRoute("/m/customers/rides")({
  component: () => (
    <RequireAuth>
      <CustomerRidesPage />
    </RequireAuth>
  ),
});

type CustomerRide = {
  id: string;
  customerName: string;
  driverName: string;
  pickup: string;
  destination: string;
  fare: number;
  status: "completed" | "cancelled" | "ongoing";
  date: string;
};

const sampleRides: CustomerRide[] = Array.from({ length: 25 }).map((_, index) => ({
  id: `RID-${1000 + index}`,
  customerName: ["Ayesha Khan", "Rahul Jain", "Sneha Patel", "Vikram Rao"][index % 4],
  driverName: ["Suresh Kumar", "Amit Singh", "Rajesh L"][index % 3],
  pickup: ["Indiranagar", "Koramangala", "HSR Layout"][index % 3],
  destination: ["Whitefield", "Electronic City", "Airport"][index % 3],
  fare: Math.round(150 + Math.random() * 800),
  status: index === 0 ? "ongoing" : index % 7 === 0 ? "cancelled" : "completed",
  date: new Date(Date.now() - 1000 * 60 * 60 * (index * 2 + 1)).toISOString(),
}));

function formatCurrency(value: number) {
  return `₹${value.toLocaleString()}`;
}

function CustomerRidesPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [items, setItems] = useState<CustomerRide[]>(sampleRides);

  const filtered = useMemo(
    () =>
      items.filter((ride) => {
        if (status !== "all" && ride.status !== status) return false;
        const search = query.trim().toLowerCase();
        if (!search) return true;
        return (
          ride.id.toLowerCase().includes(search) ||
          ride.customerName.toLowerCase().includes(search) ||
          ride.driverName.toLowerCase().includes(search)
        );
      }),
    [items, query, status],
  );

  return (
    <div className="min-h-screen space-y-4 bg-transparent p-1">
      <PageHeader
        title="Customer Rides"
        description="Detailed history and real-time tracking of all customer ride bookings."
        actions={
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
            <Input
              className="w-64 min-w-[16rem]"
              placeholder="Search by Ride ID, Customer, Driver"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <div className="surface-card rounded-2xl p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ride ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Fare</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((ride) => (
              <TableRow key={ride.id}>
                <TableCell className="font-medium">{ride.id}</TableCell>
                <TableCell>{ride.customerName}</TableCell>
                <TableCell>{ride.driverName}</TableCell>
                <TableCell>
                  <div className="flex flex-col text-xs">
                    <div className="flex items-center gap-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-success" />
                      <span className="truncate max-w-[150px]">{ride.pickup}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-destructive" />
                      <span className="truncate max-w-[150px]">{ride.destination}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{formatCurrency(ride.fare)}</TableCell>
                <TableCell className="text-xs">{new Date(ride.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={ride.status === "completed" ? "success" : ride.status === "ongoing" ? "info" : "secondary" as any}>
                    {ride.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon"><Navigation className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default CustomerRidesPage;
