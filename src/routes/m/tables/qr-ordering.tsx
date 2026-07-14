import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Table, TableBody, TableHeader, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";

export const Route = createFileRoute("/m/tables/qr-ordering")({
  component: () => (
    <RequireAuth>
      <QROrdering />
    </RequireAuth>
  ),
});

function QROrdering() {
  const [search, setSearch] = useState("");
  // Generate 50 tables
  const tables = useMemo(() => Array.from({ length: 50 }).map((_, i) => ({
      id: `T-${i + 1}`,
      seats: (i % 6) + 2,
      qr: `${location.origin}/qr/T-${i + 1}`,
      status: i % 3 === 0 ? 'reserved' : 'available' as 'reserved' | 'available'
  })), []);

  const filteredTables = useMemo(() => {
    return tables.filter(t => t.id.toLowerCase().includes(search.toLowerCase()));
  }, [tables, search]);

  const copy = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
    } catch (e) {
      console.warn('copy failed', e);
    }
  };

  return (
    <div className="min-h-screen space-y-4 bg-transparent p-1">
      <PageHeader title="QR Table Ordering" description="QR codes and ordering links for your tables." />

      <div className="surface-card rounded-2xl p-4 overflow-x-auto">
        <div className="flex items-center gap-2 mb-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search tables..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Table ID</TableHead>
              <TableHead className="w-[100px]">Seats</TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTables.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium text-muted-foreground">{t.id}</TableCell>
                <TableCell>{t.seats}</TableCell>
                <TableCell>
                  <Badge variant={t.status === 'reserved' ? 'secondary' : 'default' as any}>{t.status.toUpperCase()}</Badge>
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => window.open(t.qr, '_blank')}>Open</Button>
                  <Button variant="ghost" size="icon" onClick={() => copy(t.qr)}>Copy</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default QROrdering;
