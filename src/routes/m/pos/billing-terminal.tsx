import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Barcode, ShoppingCart, CreditCard, DollarSign, Wallet, Printer, Save } from "lucide-react";
import { posCategories, posProducts, formatCurrency } from "./pos-utils";

export const Route = createFileRoute("/m/pos/billing-terminal")({
  component: () => (
    <RequireAuth>
      <BillingTerminalPage />
    </RequireAuth>
  ),
});

function BillingTerminalPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<{ productId: string; qty: number }[]>([]);
  const [note, setNote] = useState("");
  const [discount, setDiscount] = useState(0);
  const [serviceCharge, setServiceCharge] = useState(5);
  const [activeTab, setActiveTab] = useState("cash");

  const filteredProducts = useMemo(() => {
    return posProducts.filter((product) => {
      if (category !== "All" && product.category !== category) return false;
      const query = search.trim().toLowerCase();
      return query ? product.name.toLowerCase().includes(query) : true;
    });
  }, [category, search]);

  const addToCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) => item.productId === productId ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { productId, qty: 1 }];
    });
  };

  const updateQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((item) => item.productId !== productId));
      return;
    }
    setCart((prev) => prev.map((item) => item.productId === productId ? { ...item, qty } : item));
  };

  const items = cart.map((cartItem) => ({
    ...posProducts.find((product) => product.id === cartItem.productId)!,
    qty: cartItem.qty,
  }));

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountValue = (subtotal * discount) / 100;
  const serviceValue = (subtotal * serviceCharge) / 100;
  const taxValue = (subtotal - discountValue + serviceValue) * 0.05;
  const grandTotal = subtotal - discountValue + serviceValue + taxValue;

  return (
    <div className="min-h-screen space-y-6 bg-transparent p-1">
      <PageHeader
        title="Billing Terminal"
        description="Modern POS experience with quick add, order preview, discounts, taxes and payments."
      />

      <div className="grid gap-4 xl:grid-cols-[1.2fr_1.8fr_1fr]">
        <div className="space-y-4">
          <Card className="surface-card rounded-2xl border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Search className="h-5 w-5 text-primary" /> Menu Search
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input placeholder="Search menu items" value={search} onChange={(e: any) => setSearch(e.target.value)} />
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="min-w-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {posCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="grid gap-2 sm:grid-cols-2">
                {posProducts.slice(0, 4).map((product) => (
                  <Button key={product.id} variant="outline" size="sm" onClick={() => addToCart(product.id)}>
                    {product.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card className="surface-card rounded-2xl border-none shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Barcode className="h-5 w-5 text-info" /> Barcode Scan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Scan an item barcode or search directly from the menu to add products instantly.</p>
              <Button className="mt-4" onClick={() => alert("Barcode scanning not available in dummy mode")}>Scan Barcode</Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredProducts.slice(0, 2).map((product) => (
              <Card key={product.id} className="surface-card rounded-2xl border-none shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <Badge variant={product.isVeg ? "success" : "destructive" as any}>{product.isVeg ? "Veg" : "Non-Veg"}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{product.tags.join(" • ")}</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{formatCurrency(product.price)}</span>
                    <Button size="sm" onClick={() => addToCart(product.id)}>Add</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {filteredProducts.slice(2, 6).map((product) => (
              <Card key={product.id} className="surface-card rounded-2xl border-none shadow-sm">
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                    </div>
                    <Badge variant={product.isVeg ? "success" : "destructive" as any}>{product.isVeg ? "Veg" : "Non-Veg"}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{product.tags.join(" • ")}</p>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold">{formatCurrency(product.price)}</span>
                    <Button size="sm" onClick={() => addToCart(product.id)}>Add</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="sticky top-4 space-y-4">
          <Card className="surface-card rounded-2xl border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Add items to the cart to preview the bill summary.</p>
                ) : (
                  items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty {item.qty}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{formatCurrency(item.price * item.qty)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="grid gap-3 rounded-2xl border border-border p-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Discount</span>
                  <span>{discount}%</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Service Charge</span>
                  <span>{serviceCharge}%</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Tax (5%)</span>
                  <span>{formatCurrency(taxValue)}</span>
                </div>
                <div className="flex items-center justify-between text-base font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground">Bill Note</label>
                  <Input value={note} onChange={(e: any) => setNote(e.target.value)} placeholder="Add custom note" />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Input type="number" value={discount} onChange={(e: any) => setDiscount(Number(e.target.value))} placeholder="Discount %" />
                  <Input type="number" value={serviceCharge} onChange={(e: any) => setServiceCharge(Number(e.target.value))} placeholder="Service %" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Payment method</span>
                  <span className="font-medium text-foreground">{activeTab.toUpperCase()}</span>
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList>
                    {['cash', 'card', 'upi', 'wallet', 'split'].map((tab) => (
                      <TabsTrigger key={tab} value={tab}>{tab.toUpperCase()}</TabsTrigger>
                    ))}
                  </TabsList>
                  <TabsContent value={activeTab}>
                    <p className="text-sm text-muted-foreground">Select a payment method before completing the bill.</p>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="grid gap-2">
                <Button variant="secondary" className="w-full" onClick={() => alert("Hold bill saved in dummy mode")}>Hold Bill</Button>
                <Button variant="outline" className="w-full" onClick={() => alert("Draft saved")}>Save Draft</Button>
                <Button variant="ghost" className="w-full" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" /> Print</Button>
                <Button className="w-full" onClick={() => alert("Order completed in demo mode")}>Complete Order</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default BillingTerminalPage;
