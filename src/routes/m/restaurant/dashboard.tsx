import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/common/StatCard";
import { Utensils, Users, ShoppingBag, IndianRupee, TrendingUp, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/m/restaurant/dashboard")({
  component: () => (
    <RequireAuth>
      <RestaurantDashboardPage />
    </RequireAuth>
  ),
});

function RestaurantDashboardPage() {
  const stats = [
    { label: "Total Restaurants", value: "124", delta: 5, icon: Utensils, accent: "primary" as const },
    { label: "Active Owners", value: "86", delta: 2, icon: Users, accent: "info" as const },
    { label: "Total Orders", value: "12,450", delta: 12, icon: ShoppingBag, accent: "success" as const },
    { label: "Gross Revenue", value: "₹45.2L", delta: 8, icon: IndianRupee, accent: "warning" as const },
  ];

  const recentRegistrations = [
    { id: "R-101", name: "Green Chilli", owner: "Vikram Rao", city: "Bengaluru", status: "active" },
    { id: "R-102", name: "Spice Hut", owner: "Sneha Patel", city: "Delhi", status: "pending" },
    { id: "R-103", name: "Royal Darbar", owner: "Rahul Jain", city: "Mumbai", status: "active" },
    { id: "R-104", name: "The Hungry Hub", owner: "Ayesha Khan", city: "Hyderabad", status: "active" },
  ];

  return (
    <div className="min-h-screen space-y-6 bg-transparent p-1">
      <PageHeader
        title="Restaurant Analytics"
        description="Comprehensive overview of restaurant performance, growth, and registrations."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="surface-card rounded-2xl border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recent Registrations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentRegistrations.map((reg) => (
                <div key={reg.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                  <div className="flex flex-col">
                    <span className="font-medium">{reg.name}</span>
                    <span className="text-xs text-muted-foreground">{reg.owner} • {reg.city}</span>
                  </div>
                  <Badge variant={reg.status === "active" ? "success" : "secondary" as any}>
                    {reg.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card rounded-2xl border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Regional Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { city: "Bengaluru", count: 45, revenue: "₹18.5L" },
                { city: "Delhi", count: 32, revenue: "₹12.2L" },
                { city: "Mumbai", count: 28, revenue: "₹10.8L" },
                { city: "Hyderabad", count: 19, revenue: "₹3.7L" },
              ].map((region, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{region.city}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">{region.count} units</span>
                    <span className="font-semibold">{region.revenue}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RestaurantDashboardPage;
