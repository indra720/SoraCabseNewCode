import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Eye, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/m/customers/ratings")({
  component: () => (
    <RequireAuth>
      <CustomerRatingsPage />
    </RequireAuth>
  ),
});

type CustomerRating = {
  id: string;
  customerName: string;
  restaurantName: string;
  rating: number;
  comment: string;
  date: string;
  status: "published" | "hidden";
};

const sampleRatings: CustomerRating[] = Array.from({ length: 20 }).map((_, index) => ({
  id: `RAT-${800 + index}`,
  customerName: ["Ayesha Khan", "Rahul Jain", "Sneha Patel", "Vikram Rao"][index % 4],
  restaurantName: ["Sora Bistro", "Pizza Palace", "Tandoor Express", "Burger King"][index % 4],
  rating: [5, 4, 3, 2, 5][index % 5],
  comment: [
    "Excellent food and quick delivery!",
    "Good taste but the packaging could be better.",
    "Average experience, food was a bit cold.",
    "Very disappointed with the service.",
    "Highly recommended! Best butter chicken in town.",
  ][index % 5],
  date: new Date(Date.now() - 1000 * 60 * 60 * (index * 5 + 2)).toISOString(),
  status: index % 10 === 0 ? "hidden" : "published",
}));

function CustomerRatingsPage() {
  const [query, setQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [items, setItems] = useState<CustomerRating[]>(sampleRatings);

  const filtered = useMemo(
    () =>
      items.filter((item) => {
        if (ratingFilter !== "all" && item.rating !== Number(ratingFilter)) return false;
        const search = query.trim().toLowerCase();
        if (!search) return true;
        return (
          item.customerName.toLowerCase().includes(search) ||
          item.restaurantName.toLowerCase().includes(search) ||
          item.comment.toLowerCase().includes(search)
        );
      }),
    [items, query, ratingFilter],
  );

  return (
    <div className="min-h-screen space-y-4 bg-transparent p-1">
      <PageHeader
        title="Customer Ratings"
        description="Monitor and manage customer feedback and restaurant ratings."
        actions={
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
            <Input
              className="w-64 min-w-[16rem]"
              placeholder="Search feedback..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <div className="surface-card rounded-2xl p-4 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Restaurant</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="max-w-md">Comment</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{item.customerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{item.customerName}</span>
                  </div>
                </TableCell>
                <TableCell>{item.restaurantName}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < item.rating ? "fill-current" : "text-slate-200"}`} />
                    ))}
                  </div>
                </TableCell>
                <TableCell className="max-w-md">
                  <p className="truncate text-sm text-muted-foreground" title={item.comment}>{item.comment}</p>
                </TableCell>
                <TableCell className="text-xs">{new Date(item.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={item.status === "published" ? "success" : "secondary" as any}>
                    {item.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon"><MessageSquare className="h-4 w-4" /></Button>
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

export default CustomerRatingsPage;
