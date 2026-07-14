import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Activity, Clock3, DollarSign, ShoppingBag, ListChecks, AlertTriangle, Flame } from "lucide-react";
import { formatCurrency, posSampleBills, posTransactions } from "./pos-utils";

export const Route = createFileRoute("/m/pos/dashboard")({
  component: () => (
    <RequireAuth>
      <PosDashboardPage />
    </RequireAuth>
  ),
});

function PosDashboardPage() {
  const [range, setRange] = useState("Today");
  const [search, setSearch] = useState("");

  const filteredBills = posSampleBills.filter(bill => bill.id.toLowerCase().includes(search.toLowerCase()));
  const filteredTxns = posTransactions.filter(txn => txn.customer.toLowerCase().includes(search.toLowerCase()));

  const revenue = useMemo(() => posTransactions.reduce((acc, curr) => acc + curr.amount, 0), []);
  const orders = posTransactions.length;
  const activeTables = posSampleBills.filter((bill) => bill.status === "open").length;
  const pendingBills = posSampleBills.filter((bill) => bill.status === "hold").length;
  
  return (
    <div className="min-h-screen space-y-6 bg-transparent p-6">
      <PageHeader
        title="POS Dashboard"
        description="Live restaurant POS metrics, orders, and billing insights."
        actions={
          <div className="flex items-center gap-2">
            <Input placeholder="Search bills/customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64" />
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="This Week">This Week</SelectItem>
              </SelectContent>
            </Select>
            <Button>Refresh</Button>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Revenue" value={formatCurrency(revenue)} delta={12} icon={DollarSign} accent="success" />
        <StatCard label="Total Orders" value={`${orders}`} delta={8} icon={ShoppingBag} accent="primary" />
        <StatCard label="Active Tables" value={`${activeTables}`} delta={-4} icon={ListChecks} accent="warning" />
        <StatCard label="Pending Bills" value={`${pendingBills}`} delta={3} icon={Clock3} accent="destructive" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-2xl border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-primary" /> Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTxns.slice(0, 8).map((txn) => (
                <div key={txn.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{txn.customer}</p>
                    <p className="text-sm text-muted-foreground">{txn.billId} • {txn.method}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(txn.amount)}</p>
                    <Badge variant={txn.status === "Completed" ? "success" : "secondary"}>{txn.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-none shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock3 className="h-5 w-5 text-warning" /> Open Bills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredBills.filter(b => b.status === "open").slice(0, 8).map((bill) => (
                <div key={bill.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">Table {bill.table}</p>
                    <p className="text-sm text-muted-foreground">{bill.id} • {bill.guests} Guests</p>
                  </div>
                  <p className="font-semibold">{formatCurrency(bill.total)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PosDashboardPage;
