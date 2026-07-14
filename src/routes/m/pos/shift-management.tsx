import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, posShifts } from "./pos-utils";

export const Route = createFileRoute("/m/pos/shift-management")({
  component: () => (
    <RequireAuth>
      <ShiftManagementPage />
    </RequireAuth>
  ),
});

function ShiftManagementPage() {
  return (
    <div className="min-h-screen space-y-6 bg-transparent p-6">
      <PageHeader
        title="Shift Management"
        description="Manage POS shifts, cash in/out, and summaries."
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl border-none shadow-sm">
          <CardHeader>
            <CardTitle>Shift Control</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-2">
            <Button>Open Shift</Button>
            <Button variant="outline">Close Shift</Button>
            <Button variant="secondary">Cash In</Button>
            <Button variant="secondary">Cash Out</Button>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-none shadow-sm">
          <CardHeader>
            <CardTitle>Active Shift Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">Shift ID: {posShifts[0].id}</p>
            <p className="text-sm">Opened by: {posShifts[0].openedBy}</p>
            <p className="text-sm">Cash In: {formatCurrency(posShifts[0].cashIn)}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-none shadow-sm">
        <CardHeader>
          <CardTitle>Recent Shifts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Shift ID</TableHead>
                <TableHead>Opened By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expected Cash</TableHead>
                <TableHead>Actual Cash</TableHead>
                <TableHead>Opened At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posShifts.map((shift) => (
                <TableRow key={shift.id}>
                  <TableCell className="font-medium">{shift.id}</TableCell>
                  <TableCell>{shift.openedBy}</TableCell>
                  <TableCell>
                    <Badge variant={shift.status === "open" ? "success" : "secondary"}>{shift.status}</Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(shift.expectedCash)}</TableCell>
                  <TableCell>{formatCurrency(shift.actualCash)}</TableCell>
                  <TableCell>{shift.openedAt}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
