import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { posSampleBills } from "./pos-utils";

export const Route = createFileRoute("/m/pos/split-bills")({
  component: () => (
    <RequireAuth>
      <SplitBillsPage />
    </RequireAuth>
  ),
});

function SplitBillsPage() {
  const [splitType, setSplitType] = useState<"item" | "equal">("item");
  const [billId, setBillId] = useState(posSampleBills[0].id);

  return (
    <div className="min-h-screen space-y-6 bg-transparent p-6">
      <PageHeader
        title="Split Bill"
        description="Split a bill among customers by items or equal portions."
      />
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-2xl border-none shadow-sm">
          <CardHeader>
            <CardTitle>Select Bill to Split</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={billId} onValueChange={setBillId}>
              <SelectTrigger>
                <SelectValue placeholder="Select bill..." />
              </SelectTrigger>
              <SelectContent>
                {posSampleBills.filter(b => b.status === "open").map(b => (
                  <SelectItem key={b.id} value={b.id}>{b.id} - Table {b.table}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
        
        <Card className="rounded-2xl border-none shadow-sm">
          <CardHeader>
            <CardTitle>Select Split Method</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Button variant={splitType === "item" ? "default" : "outline"} onClick={() => setSplitType("item")}>Item-based</Button>
            <Button variant={splitType === "equal" ? "default" : "outline"} onClick={() => setSplitType("equal")}>Equal</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-none shadow-sm">
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Confirm and Split Bill</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Bill Split</DialogTitle>
                <DialogDescription>Are you sure you want to split bill {billId}?</DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
