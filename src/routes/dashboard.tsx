 import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Bike,
  Car,
  DollarSign,
  IdCard,
  ShoppingBag,
  Users,
  Route as RouteIcon,
  ArrowUpRight,
  Plus,
  Download,
  Filter,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <RequireAuth>
      <DashboardPage />
    </RequireAuth>
  ),
});
const revenueData = [
  { m: "Jan", revenue: 82000, expense: 54000 },
  { m: "Feb", revenue: 91000, expense: 58000 },
  { m: "Mar", revenue: 87000, expense: 61000 },
  { m: "Apr", revenue: 99000, expense: 63000 },
  { m: "May", revenue: 105000, expense: 67000 },
  { m: "Jun", revenue: 112000, expense: 70000 },
  { m: "Jul", revenue: 118000, expense: 74000 },
  { m: "Aug", revenue: 121000, expense: 76000 },
  { m: "Sep", revenue: 128000, expense: 79000 },
];

const utilization = [
  { name: "Active", value: 68, fill: "var(--chart-1)" },
  { name: "Idle", value: 22, fill: "var(--chart-3)" },
  { name: "Maintenance", value: 10, fill: "var(--chart-4)" },
];

const rideData = [
  { d: "Mon", rides: 420 },
  { d: "Tue", rides: 510 },
  { d: "Wed", rides: 480 },
  { d: "Thu", rides: 560 },
  { d: "Fri", rides: 610 },
  { d: "Sat", rides: 690 },
  { d: "Sun", rides: 540 },
];

const growthData = [
  { m: "Jan", drivers: 1800, fleet: 620 },
  { m: "Feb", drivers: 1950, fleet: 660 },
  { m: "Mar", drivers: 2100, fleet: 700 },
  { m: "Apr", drivers: 2280, fleet: 740 },
  { m: "May", drivers: 2450, fleet: 790 },
  { m: "Jun", drivers: 2620, fleet: 840 },
  { m: "Jul", drivers: 2780, fleet: 880 },
  { m: "Aug", drivers: 2847, fleet: 912 },
];

const payments = [
  { id: "TXN-8291", user: "Meera Rao", method: "UPI", status: "Success", amount: "₹450" },
  { id: "TXN-8290", user: "Nikhil Das", method: "Card", status: "Pending", amount: "₹1,200" },
  { id: "TXN-8289", user: "Aditi Singh", method: "Wallet", status: "Success", amount: "₹280" },
  { id: "TXN-8288", user: "Vikram Patel", method: "UPI", status: "Failed", amount: "₹90" },
  { id: "TXN-8287", user: "Ritika Nair", method: "Card", status: "Success", amount: "₹640" },
];

const activities = [
  { u: "Ravi Kumar", act: "completed a ride to Koramangala", t: "2 min ago", tone: "primary" },
  { u: "Sana Iqbal", act: "submitted KYC documents", t: "12 min ago", tone: "info" },
  { u: "Amit Singh", act: "collected cash payment ₹2,500", t: "25 min ago", tone: "success" },
  { u: "Priya S", act: "cancelled a booking", t: "40 min ago", tone: "destructive" },
  { u: "Admin", act: "updated fare rules", t: "1 hr ago", tone: "warning" },
];

function statusVariant(status: string) {
  switch (status) {
    case "Success":
      return "bg-emerald-100 text-emerald-700";
    case "Pending":
      return "bg-amber-100 text-amber-700";
    case "Failed":
      return "bg-red-100 text-red-700";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function toneClass(tone: string) {
  switch (tone) {
    case "primary":
      return "bg-primary/10 text-primary";
    case "info":
      return "bg-blue-100 text-blue-700";
    case "success":
      return "bg-emerald-100 text-emerald-700";
    case "destructive":
      return "bg-red-100 text-red-700";
    case "warning":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-muted text-muted-foreground";
  }
}
// ... (keep existing const data and functions)

function DashboardPage() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen space-y-3 bg-transparent p-1">
      <PageHeader
        title={`Welcome Back, ${user?.name?.split(" ")[0] ?? "Admin"}`}
        description="Monitor your business performance in real time."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-slate-300 hover:bg-slate-100"
            >
              <Filter className="mr-1.5 h-4 w-4" /> Filter
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl border-slate-300 hover:bg-slate-100"
            >
              <Download className="mr-1.5 h-4 w-4" /> Export
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm">
                  <Plus className="mr-1.5 h-4 w-4" /> New booking
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[94vw] max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-8">
                <DialogHeader>
                  <DialogTitle>New Booking</DialogTitle>
                  <DialogDescription>Create a new ride booking request.</DialogDescription>
                </DialogHeader>
                <form
                  className="mt-4 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setOpen(false);
                  }}
                >
                  <div className="space-y-1.5">
                    <Label htmlFor="customer">Customer Name</Label>
                    <Input id="customer" placeholder="Enter customer name" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="pickup">Pickup Location</Label>
                      <Input id="pickup" placeholder="Pickup" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="drop">Drop Location</Label>
                      <Input id="drop" placeholder="Drop" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="vehicle">Vehicle Type</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bike">Bike</SelectItem>
                        <SelectItem value="car">Car</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea id="notes" placeholder="Any special instructions..." />
                  </div>
                  <DialogFooter className="mt-6">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Create Booking</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      {/*  KPI grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-7">
        <StatCard
          label="Revenue"
          value="$1.28M"
          delta={12.4}
          hint="vs last month"
          icon={DollarSign}
          accent="primary"
        />
        <StatCard label="Active Drivers" value="2,847" delta={4.2} icon={IdCard} accent="info" />
        <StatCard label="Customers" value="48,210" delta={8.1} icon={Users} accent="success" />
        <StatCard label="Fleet" value="912" delta={2.7} icon={Car} accent="warning" />
        <StatCard
          label="Orders"
          value="12,340"
          delta={-1.2}
          icon={ShoppingBag}
          accent="destructive"
        />
        <StatCard label="Bike Rentals" value="1,584" delta={15.6} icon={Bike} accent="primary" />
        <StatCard label="Trips" value="9,412" delta={6.9} icon={RouteIcon} accent="info" />
      </div>
      {/* Charts row 1 */}
      <div className="grid gap-4 lg:grid-cols-1">
        <div className="surface-card rounded-2xl p-4 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-foreground">Revenue vs Expenses</h3>
              <p className="text-sm text-slate-500">Last 9 months</p>
            </div>
          </div>
          {/* Charts row 2 */}
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="surface-card rounded-2xl p-4">
              <h3 className="text-lg font-bold text-foreground">Rides this week</h3>
              <p className="text-sm text-slate-500">Completed trips per day</p>
              <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={rideData} margin={{ left: -12, right: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="d"
                      stroke="var(--muted-foreground)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="var(--muted-foreground)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--popover)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="rides" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="surface-card rounded-2xl p-4">
              <h3 className="text-lg font-bold text-foreground">Driver & Fleet growth</h3>
              <p className="text-sm text-slate-500">Onboarding trend</p>
              <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={growthData} margin={{ left: -12, right: 12 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                      dataKey="m"
                      stroke="var(--muted-foreground)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="var(--muted-foreground)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--popover)",
                        border: "1px solid var(--border)",
                        borderRadius: 12,
                        fontSize: 12,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="drivers"
                      stroke="var(--chart-1)"
                      strokeWidth={2.5}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="fleet"
                      stroke="var(--chart-3)"
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          {/* Activities + payments */}
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="surface-card rounded-2xl p-4 lg:col-span-2">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-foreground">Latest payments</h3>
                  <p className="text-sm text-slate-500">Real-time transaction feed</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs">
                  View all <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-[15px]">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="pb-2 font-medium">Txn</th>
                      <th className="pb-2 font-medium">Customer</th>
                      <th className="pb-2 font-medium">Method</th>
                      <th className="pb-2 font-medium">Status</th>
                      <th className="pb-2 text-right font-medium">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {payments.map((p) => (
                      <tr key={p.id} className="text-sm">
                        <td className="py-3 font-mono text-sm text-slate-500">{p.id}</td>
                        <td className="py-3 text-foreground">{p.user}</td>
                        <td className="py-3 text-muted-foreground">{p.method}</td>
                        <td className="py-3">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 font-semibold px-3 py-1 font-semibold px-2 py-0.5 text-[11px] font-medium ${statusVariant(p.status)}`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3 text-right font-medium text-foreground">{p.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="surface-card rounded-2xl p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Recent activity</h3>
                <Badge
                  variant="secondary"
                  className="rounded-full px-3 py-1 font-semibold text-[10px]"
                >
                  Live
                </Badge>
              </div>
              <ol className="space-y-4">
                {activities.map((a, i) => (
                  <li key={i} className="flex gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className={`text-[11px] ${toneClass(a.tone)}`}>
                        {a.u
                          .split(" ")
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground">
                        <span className="font-medium">{a.u}</span>{" "}
                        <span className="text-muted-foreground">{a.act}</span>
                      </p>
                      <p className="text-[11px] text-muted-foreground">{a.t}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}