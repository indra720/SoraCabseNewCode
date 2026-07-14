import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Eye, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/m/customers/wallet")({
  component: () => (
    <RequireAuth>
      <CustomerWalletPage />
    </RequireAuth>
  ),
});

type TransactionStatus = "completed" | "pending" | "refunded";
type TransactionType = "Top-up" | "Ride Payment" | "Refund";

type WalletTransaction = {
  id: string;
  customer: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  date: string;
};

const statusOptions: { label: string; value: TransactionStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Completed", value: "completed" },
  { label: "Pending", value: "pending" },
  { label: "Refunded", value: "refunded" },
];

const sampleTransactions: WalletTransaction[] = Array.from({ length: 14 }).map((_, index) => ({
  id: `TXN-${9000 + index}`,
  customer: ["Ayesha Khan", "Rahul Jain", "Sneha Patel", "Vikram Rao"][index % 4],
  amount: Math.round(Math.random() * 2000),
  type: ["Top-up", "Ride Payment", "Refund"][index % 3] as TransactionType,
  status: index % 5 === 0 ? "refunded" : index % 4 === 0 ? "pending" : "completed",
  date: new Date(Date.now() - index * 86400000).toISOString(),
}));

function formatCurrency(value: number) {
  return `₹${value.toLocaleString()}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function CustomerWalletPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<TransactionStatus | "all">("all");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<WalletTransaction[]>(sampleTransactions);

  const filtered = useMemo(
    () =>
      items.filter((record) => {
        if (status !== "all" && record.status !== status) return false;
        const search = query.trim().toLowerCase();
        if (!search) return true;
        return record.customer.toLowerCase().includes(search) || record.id.toLowerCase().includes(search);
      }),
    [items, query, status],
  );

  const pageSize = 8;
  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const refundTransaction = (id: string) => {
    if (!confirm(`Refund transaction ${id}?`)) return;
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, status: "refunded" } : item)));
  };

  const renderStatus = (status: TransactionStatus) => {
    if (status === "completed") return <Badge variant="success">Completed</Badge>;
    if (status === "pending") return <Badge variant="secondary">Pending</Badge>;
    return <Badge variant="destructive">Refunded</Badge>;
  };

  return (
    <div className="min-h-screen space-y-4 bg-transparent p-1">
      <PageHeader
        title="Wallet Transactions"
        description="Track transaction history, amounts, and refund status."
        actions={
          <div className="flex flex-nowrap items-center gap-2 overflow-x-auto">
            <Input
              className="w-72 min-w-[18rem]"
              placeholder="Search by customer or transaction ID"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
            <Select value={status} onValueChange={(value) => {
              setStatus(value as TransactionStatus | "all");
              setPage(1);
            }}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
      />

      <div className="surface-card rounded-2xl p-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead>
            <tr>
              <th className="px-3 py-3 text-left font-semibold">Transaction ID</th>
              <th className="px-3 py-3 text-left font-semibold">Customer</th>
              <th className="px-3 py-3 text-left font-semibold">Amount</th>
              <th className="px-3 py-3 text-left font-semibold">Type</th>
              <th className="px-3 py-3 text-left font-semibold">Status</th>
              <th className="px-3 py-3 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {pageData.map((record) => (
              <tr key={record.id}>
                <td className="px-3 py-3 font-medium">{record.id}</td>
                <td className="px-3 py-3">{record.customer}</td>
                <td className="px-3 py-3">{formatCurrency(record.amount)}</td>
                <td className="px-3 py-3">{record.type}</td>
                <td className="px-3 py-3">{renderStatus(record.status)}</td>
                <td className="px-3 py-3">
                  <div className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="View"><Eye className="h-4 w-4" /></Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Transaction Details: {record.id}</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-3">
                            <p><strong>Customer:</strong> {record.customer}</p>
                            <p><strong>Amount:</strong> {formatCurrency(record.amount)}</p>
                            <p><strong>Type:</strong> {record.type}</p>
                            <p><strong>Status:</strong> {record.status}</p>
                            <p><strong>Date:</strong> {formatDate(record.date)}</p>
                        </div>
                      </DialogContent>
                    </Dialog>
                    {record.status === "completed" && (
                        <Button variant="ghost" size="icon" aria-label="Refund" onClick={() => refundTransaction(record.id)}>
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Showing {pageData.length} of {total} transactions</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
            <Button variant="outline" size="sm" disabled={page === pages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerWalletPage;
