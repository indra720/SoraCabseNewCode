import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, posSampleBills } from "./pos-utils";

export const Route = createFileRoute("/m/pos/open-bills")({
  component: () => (
    <RequireAuth>
      <OpenBillsPage />
    </RequireAuth>
  ),
});

function OpenBillsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBills = posSampleBills.filter(bill => 
    (bill.id.toLowerCase().includes(search.toLowerCase()) || bill.table.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "all" || bill.status === statusFilter)
  );
  
  return (
    <div className="min-h-screen space-y-6 bg-transparent p-6">
      <PageHeader
        title="Open Bills"
        description="Manage currently open and pending bills."
      />
      
      <Card className="rounded-2xl border-none shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Bill List</CardTitle>
            <div className="flex gap-2">
              <Input placeholder="Search ID/Table..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="hold">Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bill ID</TableHead>
                <TableHead>Table</TableHead>
                <TableHead>Guests</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Opened At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBills.map((bill) => (
                <TableRow key={bill.id}>
                  <TableCell className="font-medium">{bill.id}</TableCell>
                  <TableCell>{bill.table}</TableCell>
                  <TableCell>{bill.guests}</TableCell>
                  <TableCell>{formatCurrency(bill.total)}</TableCell>
                  <TableCell>
                    <Badge variant={bill.status === "open" ? "success" : "warning"}>{bill.status}</Badge>
                  </TableCell>
                  <TableCell>{bill.openedAt}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="outline" size="sm">Resume</Button>
                    <Button variant="destructive" size="sm">Cancel</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
