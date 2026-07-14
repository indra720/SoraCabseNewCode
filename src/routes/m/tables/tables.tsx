import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { useMemo, useState } from "react";
import { Search, QrCode, Copy } from "lucide-react";

export const Route = createFileRoute("/m/tables/tables")({
  component: () => (
    <RequireAuth>
      <TablesPage />
    </RequireAuth>
  ),
});

type TableItem = {
    id: string;
    seats: number;
    status: 'reserved' | 'available' | 'occupied';
    qr: string;
    zone: 'Indoor' | 'Outdoor' | 'VIP';
};

// Generate 6 tables
function TablesPage() {
  const [search, setSearch] = useState("");
  const tables = useMemo(() => Array.from({ length: 6 }).map((_, i) => ({
    id: `T-${i + 1}`,
    seats: (i % 6) + 2,
    status: i % 4 === 0 ? 'reserved' : i % 4 === 1 ? 'occupied' : 'available' as 'reserved' | 'available' | 'occupied',
    qr: `QR-${1000 + i}`,
    zone: (['Indoor', 'Outdoor', 'VIP'] as const)[i % 3],
  })), []);

  const [preview, setPreview] = useState<TableItem | null>(null);

  const filteredTables = useMemo(() => {
    return tables.filter(t => t.id.toLowerCase().includes(search.toLowerCase()) || t.zone.toLowerCase().includes(search.toLowerCase()));
  }, [tables, search]);

  const copyLink = async (tId: string) => {
    try {
      await navigator.clipboard.writeText(`${location.origin}/qr/${tId}`);
    } catch (e) {
      console.warn('copy failed', e);
    }
  };

  return (
    <div className="min-h-screen p-1">
      <PageHeader title="Tables" description="Manage table status and QR ordering links." />
      
      <div className="surface-card rounded-2xl p-4 mt-4">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tables or zones..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Table ID</TableHead>
              <TableHead className="w-[80px]">Seats</TableHead>
              <TableHead className="w-[120px]">Zone</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[150px]">QR Reference</TableHead>
              <TableHead className="text-right w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTables.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium text-muted-foreground">{t.id}</TableCell>
                <TableCell>{t.seats}</TableCell>
                <TableCell>{t.zone}</TableCell>
                <TableCell>
                  <Badge variant={t.status === 'reserved' ? 'secondary' : t.status === 'occupied' ? 'destructive' : 'success' as any}>{t.status.toUpperCase()}</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm font-medium text-muted-foreground">{t.qr}</div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => setPreview(t)}><QrCode className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => copyLink(t.id)}><Copy className="h-4 w-4" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!preview} onOpenChange={(open) => { if (!open) setPreview(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>QR Preview for {preview?.id}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 p-4">
            <div className="h-56 w-56 rounded-md bg-zinc-100 flex items-center justify-center text-2xl font-bold border-2 border-dashed">{preview?.id}</div>
            <div className="text-center text-sm text-muted-foreground">Scan to order from {preview?.id} ({preview?.zone} Zone)</div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TablesPage;
