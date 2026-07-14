import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useMemo, useState } from "react";
import { Search, Calendar, Users } from "lucide-react";

export const Route = createFileRoute("/m/tables/reservations")({
  component: () => (
    <RequireAuth>
      <ReservationsPage />
    </RequireAuth>
  ),
});

type Reservation = {
    id: string;
    customerName: string;
    table: string;
    date: string;
    time: string;
    guests: number;
    status: 'confirmed' | 'pending' | 'cancelled';
};

// Generate 6 reservations
function ReservationsPage() {
  const [search, setSearch] = useState("");
  const res = useMemo(() => Array.from({ length: 6 }).map((_, i) => ({
      id: `R-${200 + i}`,
      customerName: ["Ayesha Khan", "Rahul Jain", "Sneha Patel", "Vikram Rao", "Meera Nair", "Amit Singh"][i % 6],
      table: `T-${(i % 10) + 1}`,
      date: `2026-07-${15 + (i % 5)}`,
      time: ['18:00', '19:30', '20:00'][i % 3],
      guests: 2 + (i % 5),
      status: (['confirmed', 'pending', 'cancelled'] as const)[i % 3],
  })), []);

  const filteredRes = useMemo(() => {
    return res.filter(r => r.table.toLowerCase().includes(search.toLowerCase()) || r.customerName.toLowerCase().includes(search.toLowerCase()));
  }, [res, search]);

  return (
    <div className="min-h-screen p-1">
      <PageHeader title="Reservations" description="Manage upcoming restaurant reservations." />
      
      <div className="surface-card rounded-2xl p-4 mt-4">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by table or name..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Resv ID</TableHead>
              <TableHead className="w-[200px]">Customer</TableHead>
              <TableHead className="w-[100px]">Table</TableHead>
              <TableHead className="w-[150px]">Date/Time</TableHead>
              <TableHead className="w-[100px]">Guests</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRes.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium text-muted-foreground">{r.id}</TableCell>
                <TableCell className="font-medium">{r.customerName}</TableCell>
                <TableCell>{r.table}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3 w-3" />
                        {r.date} {r.time}
                    </div>
                </TableCell>
                <TableCell>
                    <div className="flex items-center gap-1.5">
                        <Users className="h-3 w-3" />
                        {r.guests}
                    </div>
                </TableCell>
                <TableCell>
                  <Badge variant={r.status === 'confirmed' ? 'success' : r.status === 'pending' ? 'secondary' : 'destructive' as any}>{r.status.toUpperCase()}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">Details</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm">
                      <DialogHeader>
                        <DialogTitle>Reservation {r.id}</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-3 py-4">
                        <div className="flex justify-between"><strong>Customer:</strong> {r.customerName}</div>
                        <div className="flex justify-between"><strong>Table:</strong> {r.table}</div>
                        <div className="flex justify-between"><strong>Date:</strong> {r.date}</div>
                        <div className="flex justify-between"><strong>Time:</strong> {r.time}</div>
                        <div className="flex justify-between"><strong>Guests:</strong> {r.guests}</div>
                        <div className="flex justify-between"><strong>Status:</strong> {r.status.toUpperCase()}</div>
                      </div>
                      <DialogFooter><DialogClose asChild><Button>Close</Button></DialogClose></DialogFooter>
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ReservationsPage;
