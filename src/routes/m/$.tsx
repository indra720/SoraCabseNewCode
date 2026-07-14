import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { Rocket, Plus, Download, Upload, Filter, Eye, Pencil } from "lucide-react";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { NAV_SECTIONS } from "@/constants/navigation";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/m/$")({
  component: () => (
    <RequireAuth>
      <ModuleStubPage />
    </RequireAuth>
  ),
});

function titleize(slug: string) {
  return slug.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getDisplayFieldsForDriver(childKey: string, fields: FormField[]) {
  const key = (childKey || "registration").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);

  switch (key) {
    case "registration":
      return [
        byName("name"),
        byName("phone"),
        byName("email"),
        byName("city"),
        byName("vehicle_type"),
      ];
    case "kyc":
      return [
        byName("driver_id"),
        byName("aadhar_no"),
        byName("pan_no"),
        byName("status"),
        byName("verified_by"),
      ];
    case "documents":
      return [
        byName("doc_id"),
        byName("driver_id"),
        byName("doc_type"),
        byName("expiry_date"),
        byName("image_url"),
      ];
    case "license":
      return [
        byName("license_no"),
        byName("driver_id"),
        byName("authority"),
        byName("license_class"),
        byName("status"),
      ];
    case "availability":
      return [
        byName("driver_id"),
        byName("name"),
        byName("shift"),
        byName("status"),
        byName("working_days"),
      ];
    case "performance":
      return [
        byName("driver_id"),
        byName("total_trips"),
        byName("avg_rating"),
        byName("completion_rate"),
        byName("status"),
      ];
    case "wallet":
      return [
        byName("driver_id"),
        byName("balance"),
        byName("pending"),
        byName("locked"),
        byName("last_sync"),
      ];
    case "earnings":
      return [
        byName("earnings_id"),
        byName("driver_id"),
        byName("period"),
        byName("net_payout"),
        byName("status"),
      ];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForVehicle(childKey: string, fields: FormField[]) {
  const key = (childKey || "registration").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);

  switch (key) {
    case "registration":
      return [byName("name"), byName("model"), byName("owner"), byName("fuel"), byName("status")];
    case "documents":
      return [
        byName("doc_id"),
        byName("vehicle_id"),
        byName("doc_type"),
        byName("expiry_date"),
        byName("image_url"),
      ];
    case "insurance":
      return [
        byName("policy_id"),
        byName("vehicle_id"),
        byName("provider"),
        byName("premium"),
        byName("expiry_date"),
      ];
    case "maintenance":
      return [
        byName("maint_id"),
        byName("vehicle_id"),
        byName("service"),
        byName("provider"),
        byName("cost"),
      ];
    case "fuel":
      return [
        byName("fuel_id"),
        byName("vehicle_id"),
        byName("type"),
        byName("quantity"),
        byName("cost"),
      ];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForPayments(childKey: string, fields: FormField[]) {
  const key = (childKey || "cash").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);

  switch (key) {
    case "cash":
      return [
        byName("txn_id"),
        byName("driver_id"),
        byName("amount"),
        byName("collected_by"),
        byName("status"),
      ];
    case "upi":
      return [
        byName("upi_txn_id"),
        byName("sender_upi"),
        byName("amount"),
        byName("timestamp"),
        byName("status"),
      ];
    case "online":
      return [
        byName("payment_id"),
        byName("gateway"),
        byName("card_brand"),
        byName("amount"),
        byName("status"),
      ];
    case "wallet":
      return [
        byName("wallet_id"),
        byName("customer_name"),
        byName("balance"),
        byName("last_funded"),
        byName("status"),
      ];
    case "refunds":
      return [
        byName("refund_id"),
        byName("payment_id"),
        byName("amount"),
        byName("reason"),
        byName("status"),
      ];
    case "payout":
      return [
        byName("payout_id"),
        byName("driver_name"),
        byName("amount"),
        byName("bank_name"),
        byName("status"),
      ];
    case "commission":
      return [
        byName("commission_id"),
        byName("ride_id"),
        byName("gross_fare"),
        byName("commission_amount"),
        byName("status"),
      ];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForFinance(childKey: string, fields: FormField[]) {
  const key = (childKey || "revenue").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);
  switch (key) {
    case "revenue":
      return [
        byName("name"),
        byName("amount"),
        byName("category"),
        byName("status"),
        byName("notes"),
      ];
    case "expenses":
      return [
        byName("name"),
        byName("amount"),
        byName("category"),
        byName("status"),
        byName("notes"),
      ];
    case "invoices":
      return [byName("name"), byName("amount"), byName("status"), byName("notes")];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForHR(childKey: string, fields: FormField[]) {
  const key = (childKey || "employees").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);
  switch (key) {
    case "employees":
      return [
        byName("name"),
        byName("department"),
        byName("role"),
        byName("status"),
        byName("notes"),
      ];
    case "attendance":
      return [byName("name"), byName("date"), byName("status"), byName("notes")];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForProcurement(childKey: string, fields: FormField[]) {
  const key = (childKey || "requests").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);
  switch (key) {
    case "requests":
    case "orders":
      return [
        byName("name"),
        byName("supplier"),
        byName("priority"),
        byName("status"),
        byName("notes"),
      ];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForCRM(childKey: string, fields: FormField[]) {
  const key = (childKey || "support").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);
  switch (key) {
    case "support":
    case "complaints":
    case "ticketing":
      return [
        byName("name"),
        byName("issue"),
        byName("priority"),
        byName("status"),
        byName("notes"),
      ];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForMarketing(childKey: string, fields: FormField[]) {
  const key = (childKey || "campaigns").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);
  switch (key) {
    case "campaigns":
      return [
        byName("name"),
        byName("channel"),
        byName("budget"),
        byName("status"),
        byName("notes"),
      ];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForNotifications(childKey: string, fields: FormField[]) {
  const key = (childKey || "sms").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);
  switch (key) {
    case "sms":
    case "email":
    case "push":
    case "whatsapp":
      return [
        byName("name"),
        byName("channel"),
        byName("audience"),
        byName("status"),
        byName("notes"),
      ];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFields(sectionId: string | undefined, childKey: string, fields: FormField[]) {
  const section = (sectionId || "").toLowerCase();
  if (section === "drivers") return getDisplayFieldsForDriver(childKey, fields);
  if (section === "vehicles") return getDisplayFieldsForVehicle(childKey, fields);
  if (section === "fleet") return getDisplayFieldsForFleet(childKey, fields);
  if (section === "rental") return getDisplayFieldsForRental(childKey, fields);
  if (section === "rides") return getDisplayFieldsForRides(childKey, fields);
  if (section === "gps") return getDisplayFieldsForGPS(childKey, fields);
  if (section === "assets") return getDisplayFieldsForAssets(childKey, fields);
  if (section === "legal") return getDisplayFieldsForLegal(childKey, fields);
  if (section === "pricing") return getDisplayFieldsForPricing(childKey, fields);
  if (section === "payments") return getDisplayFieldsForPayments(childKey, fields);
  if (section === "finance") return getDisplayFieldsForFinance(childKey, fields);
  if (section === "hr") return getDisplayFieldsForHR(childKey, fields);
  if (section === "procurement") return getDisplayFieldsForProcurement(childKey, fields);
  if (section === "crm") return getDisplayFieldsForCRM(childKey, fields);
  if (section === "marketing") return getDisplayFieldsForMarketing(childKey, fields);
  if (section === "notifications") return getDisplayFieldsForNotifications(childKey, fields);
  if (section === "payroll") return getDisplayFieldsForPayroll(childKey, fields);
  if (section === "ai") return getDisplayFieldsForAI(childKey, fields);
  if (section === "integrations") return getDisplayFieldsForIntegrations(childKey, fields);
  if (section === "subscription") return getDisplayFieldsForSubscription(childKey, fields);
  if (section === "reports") return getDisplayFieldsForReports(childKey, fields);
  if (section === "restaurant") return getDisplayFieldsForRestaurant(childKey, fields);
  if (section === "menu") return getDisplayFieldsForMenu(childKey, fields);
  if (section === "kitchen") return getDisplayFieldsForKitchen(childKey, fields);
  if (section === "orders") return getDisplayFieldsForOrders(childKey, fields);
  if (section === "tables") return getDisplayFieldsForTables(childKey, fields);
  if (section === "settings") return getDisplayFieldsForSettings(childKey, fields);
  return fields.slice(0, 5);
}

function getDisplayFieldsForRestaurant(childKey: string, fields: FormField[]) {
  const key = (childKey || "all-restaurants").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);

  switch (key) {
    case "all-restaurants":
      return [byName("id"), byName("name"), byName("owner"), byName("status"), byName("city")];
    case "pending-approvals":
      return [byName("id"), byName("name"), byName("submitted_by"), byName("submitted_on"), byName("status")];
    case "owners":
      return [byName("owner_id"), byName("name"), byName("email"), byName("phone"), byName("restaurants")];
    case "branches":
      return [byName("branch_id"), byName("restaurant"), byName("address"), byName("city"), byName("status")];
    case "categories":
      return [byName("category_id"), byName("name"), byName("parent"), byName("status"), byName("items_count")];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForMenu(childKey: string, fields: FormField[]) {
  const key = (childKey || "categories").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);

  switch (key) {
    case "categories":
      return [byName("id"), byName("name"), byName("parent"), byName("status"), byName("items")];
    case "items":
      return [byName("item_id"), byName("name"), byName("price"), byName("category"), byName("available")];
    case "addons":
      return [byName("addon_id"), byName("name"), byName("price"), byName("applies_to"), byName("status")];
    case "combos":
      return [byName("combo_id"), byName("name"), byName("price"), byName("items"), byName("status")];
    case "approval":
      return [byName("request_id"), byName("item_name"), byName("restaurant"), byName("submitted_on"), byName("status")];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForKitchen(childKey: string, fields: FormField[]) {
  const key = (childKey || "kds").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);

  switch (key) {
    case "kds":
      return [byName("kds_id"), byName("restaurant"), byName("stations"), byName("status"), byName("last_sync")];
    case "live-orders":
      return [byName("order_id"), byName("table"), byName("items"), byName("status"), byName("eta")];
    case "assignments":
      return [byName("assignment_id"), byName("chef"), byName("order_id"), byName("status"), byName("started_at")];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForOrders(childKey: string, fields: FormField[]) {
  const key = (childKey || "all").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);

  switch (key) {
    case "all":
      return [byName("order_id"), byName("restaurant"), byName("total"), byName("status"), byName("placed_at")];
    case "dine-in":
      return [byName("order_id"), byName("table"), byName("server"), byName("status"), byName("placed_at")];
    case "delivery":
      return [byName("order_id"), byName("customer"), byName("address"), byName("status"), byName("eta")];
    case "takeaway":
      return [byName("order_id"), byName("customer"), byName("pickup_time"), byName("status"), byName("placed_at")];
    case "scheduled":
      return [byName("order_id"), byName("customer"), byName("scheduled_for"), byName("status"), byName("placed_at")];
    case "refunds":
      return [byName("refund_id"), byName("order_id"), byName("amount"), byName("reason"), byName("status")];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForTables(childKey: string, fields: FormField[]) {
  const key = (childKey || "list").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);

  switch (key) {
    case "list":
      return [byName("table_id"), byName("number"), byName("seats"), byName("location"), byName("status")];
    case "reservations":
      return [byName("reservation_id"), byName("customer"), byName("table"), byName("time"), byName("status")];
    case "qr":
      return [byName("qr_id"), byName("table"), byName("qr_image"), byName("status"), byName("last_scanned")];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForAI(childKey: string, fields: FormField[]) {
  const key = (childKey || "matching").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);
  switch (key) {
    case "matching":
      return [
        byName("model"),
        byName("algorithm"),
        byName("latency"),
        byName("accuracy"),
        byName("status"),
      ];
    case "demand":
      return [
        byName("model"),
        byName("prediction_window"),
        byName("confidence"),
        byName("region"),
        byName("status"),
      ];
    case "fraud":
      return [
        byName("run_id"),
        byName("alerts"),
        byName("suspicious_trips"),
        byName("precision"),
        byName("status"),
      ];
    case "heatmaps":
      return [
        byName("map_id"),
        byName("area"),
        byName("density"),
        byName("period"),
        byName("notes"),
      ];
    case "bi":
      return [
        byName("report"),
        byName("dashboard"),
        byName("last_refresh"),
        byName("owner"),
        byName("status"),
      ];
    case "ml":
      return [
        byName("experiment"),
        byName("model"),
        byName("version"),
        byName("metrics"),
        byName("status"),
      ];
    case "incentives":
      return [
        byName("engine_id"),
        byName("scheme"),
        byName("criteria"),
        byName("budget"),
        byName("status"),
      ];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForIntegrations(childKey: string, fields: FormField[]) {
  const key = (childKey || "payments").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);
  switch (key) {
    case "payments":
      return [
        byName("gateway"),
        byName("merchant_id"),
        byName("status"),
        byName("fee"),
        byName("notes"),
      ];
    case "maps":
      return [
        byName("provider"),
        byName("api_key"),
        byName("rate_limit"),
        byName("region"),
        byName("status"),
      ];
    case "sms":
      return [
        byName("provider"),
        byName("sender_id"),
        byName("status"),
        byName("throughput"),
        byName("notes"),
      ];
    case "email":
      return [
        byName("provider"),
        byName("from_address"),
        byName("status"),
        byName("throughput"),
        byName("notes"),
      ];
    case "analytics":
      return [
        byName("provider"),
        byName("property"),
        byName("data_retention"),
        byName("status"),
        byName("notes"),
      ];
    case "iot-lock":
      return [
        byName("device_provider"),
        byName("device_model"),
        byName("status"),
        byName("last_sync"),
        byName("notes"),
      ];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForSubscription(childKey: string, fields: FormField[]) {
  const key = (childKey || "plans").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);
  switch (key) {
    case "plans":
      return [
        byName("plan_id"),
        byName("name"),
        byName("price"),
        byName("cycle"),
        byName("status"),
      ];
    case "billing":
      return [
        byName("bill_id"),
        byName("customer_id"),
        byName("amount"),
        byName("due_date"),
        byName("status"),
      ];
    case "invoices":
      return [
        byName("invoice_id"),
        byName("customer_id"),
        byName("amount"),
        byName("issued_on"),
        byName("status"),
      ];
    case "renewals":
      return [
        byName("renewal_id"),
        byName("subscription_id"),
        byName("renewal_date"),
        byName("amount"),
        byName("status"),
      ];
    case "payments":
      return [
        byName("payment_id"),
        byName("invoice_id"),
        byName("amount"),
        byName("method"),
        byName("status"),
      ];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForReports(childKey: string, fields: FormField[]) {
  const key = (childKey || "revenue").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);

  switch (key) {
    case "revenue":
      return [
        byName("report_id"),
        byName("period"),
        byName("total_revenue"),
        byName("net_revenue"),
        byName("currency"),
      ];
    case "rides":
      return [
        byName("report_id"),
        byName("ride_id"),
        byName("date"),
        byName("fare"),
        byName("status"),
      ];
    case "drivers":
      return [
        byName("report_id"),
        byName("driver_id"),
        byName("trips"),
        byName("avg_rating"),
        byName("earnings"),
      ];
    case "fleet":
      return [
        byName("report_id"),
        byName("fleet_id"),
        byName("total_vehicles"),
        byName("utilization"),
        byName("revenue"),
      ];
    case "rental":
      return [
        byName("report_id"),
        byName("bike_id"),
        byName("rentals"),
        byName("revenue"),
        byName("status"),
      ];
    case "customers":
      return [
        byName("report_id"),
        byName("customer_id"),
        byName("name"),
        byName("total_spent"),
        byName("last_ride"),
      ];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForFleet(childKey: string, fields: FormField[]) {
  const key = (childKey || "owners").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);

  switch (key) {
    case "owners":
      return [
        byName("name"),
        byName("contact"),
        byName("phone"),
        byName("region"),
        byName("status"),
      ];
    case "allocation":
      return [
        byName("alloc_id"),
        byName("vehicle_id"),
        byName("driver_id"),
        byName("branch"),
        byName("status"),
      ];
    case "performance":
      return [
        byName("fleet_id"),
        byName("total_vehicles"),
        byName("utilization"),
        byName("avg_downtime"),
        byName("region"),
      ];
    case "fuel":
      return [
        byName("fuel_id"),
        byName("fleet_id"),
        byName("vehicle_id"),
        byName("type"),
        byName("cost"),
      ];
    case "maintenance":
      return [
        byName("maint_id"),
        byName("fleet_id"),
        byName("vehicle_id"),
        byName("service"),
        byName("cost"),
      ];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForRides(childKey: string, fields: FormField[]) {
  const key = (childKey || "booking").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);

  switch (key) {
    case "booking":
      return [
        byName("ride_id"),
        byName("passenger"),
        byName("route"),
        byName("fare"),
        byName("status"),
      ];
    case "matching":
      return [
        byName("match_id"),
        byName("ride_id"),
        byName("driver_id"),
        byName("vehicle_id"),
        byName("status"),
      ];
    case "dispatch":
      return [
        byName("dispatch_id"),
        byName("ride_id"),
        byName("driver_id"),
        byName("eta"),
        byName("status"),
      ];
    case "tracking":
      return [
        byName("trip_id"),
        byName("ride_id"),
        byName("driver_id"),
        byName("current_location"),
        byName("status"),
      ];
    case "cancellation":
      return [
        byName("cancel_id"),
        byName("ride_id"),
        byName("passenger"),
        byName("reason"),
        byName("status"),
      ];
    case "history":
      return [
        byName("trip_id"),
        byName("ride_id"),
        byName("date"),
        byName("driver_id"),
        byName("status"),
      ];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForGPS(childKey: string, fields: FormField[]) {
  const key = (childKey || "live").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);

  switch (key) {
    case "live":
      return [
        byName("device_id"),
        byName("ride_id"),
        byName("driver_id"),
        byName("latitude"),
        byName("longitude"),
      ];
    case "eta":
      return [
        byName("eta_id"),
        byName("ride_id"),
        byName("driver_id"),
        byName("pickup_time"),
        byName("expected_arrival"),
      ];
    case "routes":
      return [
        byName("route_id"),
        byName("ride_id"),
        byName("origin"),
        byName("destination"),
        byName("optimized_distance"),
      ];
    case "geofence":
      return [
        byName("geofence_id"),
        byName("ride_id"),
        byName("zone_name"),
        byName("type"),
        byName("status"),
      ];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForPricing(childKey: string, fields: FormField[]) {
  const key = (childKey || "fare-rules").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);

  switch (key) {
    case "fare-rules":
      return [
        byName("rule_id"),
        byName("name"),
        byName("base_fare"),
        byName("per_km"),
        byName("status"),
      ];
    case "dynamic":
      return [
        byName("rule_id"),
        byName("name"),
        byName("surge_multiplier"),
        byName("condition"),
        byName("status"),
      ];
    case "rental":
      return [
        byName("plan_id"),
        byName("name"),
        byName("duration"),
        byName("price"),
        byName("status"),
      ];
    case "coupons":
      return [
        byName("coupon_id"),
        byName("code"),
        byName("discount"),
        byName("valid_until"),
        byName("status"),
      ];
    case "discounts":
      return [
        byName("discount_id"),
        byName("name"),
        byName("type"),
        byName("amount"),
        byName("status"),
      ];
    case "promo":
      return [
        byName("promo_id"),
        byName("code"),
        byName("offer"),
        byName("valid_until"),
        byName("status"),
      ];
    case "toll":
      return [
        byName("toll_id"),
        byName("ride_id"),
        byName("amount"),
        byName("location"),
        byName("status"),
      ];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForAssets(childKey: string, fields: FormField[]) {
  const key = (childKey || "office").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);

  switch (key) {
    case "office":
      return [
        byName("asset_id"),
        byName("name"),
        byName("department"),
        byName("condition"),
        byName("status"),
      ];
    case "vehicles":
      return [
        byName("vehicle_id"),
        byName("plate"),
        byName("model"),
        byName("owner"),
        byName("status"),
      ];
    case "computers":
      return [
        byName("asset_id"),
        byName("serial"),
        byName("model"),
        byName("assigned_to"),
        byName("status"),
      ];
    case "mobile":
      return [
        byName("asset_id"),
        byName("imei"),
        byName("model"),
        byName("assigned_to"),
        byName("status"),
      ];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForSettings(childKey: string, fields: FormField[]) {
  const key = (childKey || "general").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);

  switch (key) {
    case "general":
      return [
        byName("site_name"),
        byName("timezone"),
        byName("currency"),
        byName("language"),
        byName("status"),
      ];
    case "branding":
      return [
        byName("brand_name"),
        byName("logo_url"),
        byName("primary_color"),
        byName("secondary_color"),
        byName("status"),
      ];
    case "theme":
      return [
        byName("theme"),
        byName("dark_mode"),
        byName("accent"),
        byName("status"),
        byName("notes"),
      ];
    case "currency":
      return [
        byName("currency"),
        byName("symbol"),
        byName("exchange_rate"),
        byName("status"),
        byName("notes"),
      ];
    case "language":
      return [
        byName("language"),
        byName("default_locale"),
        byName("status"),
        byName("notes"),
        byName("translator"),
      ];
    case "timezone":
      return [
        byName("timezone"),
        byName("default_offset"),
        byName("status"),
        byName("notes"),
        byName("region"),
      ];
    case "email":
      return [
        byName("smtp_host"),
        byName("smtp_port"),
        byName("from_email"),
        byName("status"),
        byName("notes"),
      ];
    case "sms":
      return [
        byName("provider"),
        byName("api_key"),
        byName("from_number"),
        byName("status"),
        byName("notes"),
      ];
    case "storage":
      return [
        byName("provider"),
        byName("bucket"),
        byName("region"),
        byName("status"),
        byName("notes"),
      ];
    case "api":
      return [
        byName("api_key"),
        byName("rate_limit"),
        byName("status"),
        byName("notes"),
        byName("whitelist"),
      ];
    case "seo":
      return [
        byName("meta_title"),
        byName("meta_description"),
        byName("meta_keywords"),
        byName("robots"),
        byName("status"),
      ];
    case "cache":
      return [
        byName("cache_provider"),
        byName("ttl"),
        byName("status"),
        byName("notes"),
        byName("region"),
      ];
    case "ai":
      return [
        byName("model"),
        byName("provider"),
        byName("api_key"),
        byName("status"),
        byName("notes"),
      ];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForPayroll(childKey: string, fields: FormField[]) {
  const key = (childKey || "driver-earnings").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);

  switch (key) {
    case "driver-earnings":
      return [
        byName("driver_id"),
        byName("period"),
        byName("total_fare"),
        byName("commission"),
        byName("net_payout"),
      ];
    case "salary":
      return [
        byName("employee_id"),
        byName("name"),
        byName("base_salary"),
        byName("allowances"),
        byName("status"),
      ];
    case "bonuses":
      return [
        byName("bonus_id"),
        byName("employee_id"),
        byName("type"),
        byName("amount"),
        byName("status"),
      ];
    case "incentives":
      return [
        byName("incentive_id"),
        byName("employee_id"),
        byName("scheme"),
        byName("amount"),
        byName("status"),
      ];
    case "deductions":
      return [
        byName("deduction_id"),
        byName("employee_id"),
        byName("type"),
        byName("amount"),
        byName("status"),
      ];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForRental(childKey: string, fields: FormField[]) {
  const key = (childKey || "inventory").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);

  switch (key) {
    case "inventory":
      return [
        byName("bike_id"),
        byName("model"),
        byName("location"),
        byName("status"),
        byName("image_url"),
      ];
    case "registration":
      return [
        byName("bike_id"),
        byName("owner"),
        byName("plate"),
        byName("status"),
        byName("notes"),
      ];
    case "qr":
      return [
        byName("qr_id"),
        byName("bike_id"),
        byName("qr_image"),
        byName("status"),
        byName("notes"),
      ];
    case "allocation":
      return [
        byName("alloc_id"),
        byName("bike_id"),
        byName("user_id"),
        byName("start_date"),
        byName("end_date"),
      ];
    case "plans":
      return [
        byName("plan_id"),
        byName("name"),
        byName("duration"),
        byName("price"),
        byName("notes"),
      ];
    case "billing":
      return [
        byName("bill_id"),
        byName("alloc_id"),
        byName("amount"),
        byName("status"),
        byName("receipt_image"),
      ];
    case "exchange":
      return [
        byName("exchange_id"),
        byName("from_bike"),
        byName("to_bike"),
        byName("reason"),
        byName("date"),
      ];
    case "maintenance":
      return [
        byName("maint_id"),
        byName("bike_id"),
        byName("service"),
        byName("provider"),
        byName("cost"),
      ];
    case "eligibility":
      return [
        byName("user_id"),
        byName("age"),
        byName("license_valid"),
        byName("kyc_status"),
        byName("notes"),
      ];
    case "penalty":
      return [
        byName("penalty_id"),
        byName("alloc_id"),
        byName("amount"),
        byName("reason"),
        byName("status"),
      ];
    case "payments":
      return [
        byName("payment_id"),
        byName("bill_id"),
        byName("amount"),
        byName("method"),
        byName("status"),
      ];
    case "reports":
      return [
        byName("report_id"),
        byName("period"),
        byName("total_rentals"),
        byName("revenue"),
        byName("notes"),
      ];
    default:
      return fields.slice(0, 5);
  }
}

function getDisplayFieldsForLegal(childKey: string, fields: FormField[]) {
  const key = (childKey || "kyc").toLowerCase();
  const byName = (name: string) =>
    fields.find((f) => f.name === name) ?? ({ name, label: name, type: "text" } as FormField);

  switch (key) {
    case "kyc":
      return [
        byName("kyc_id"),
        byName("entity"),
        byName("document_type"),
        byName("status"),
        byName("verified_on"),
      ];
    case "driver-verify":
      return [
        byName("verification_id"),
        byName("driver_id"),
        byName("verifier"),
        byName("status"),
        byName("notes"),
      ];
    case "vehicle-verify":
      return [
        byName("verification_id"),
        byName("vehicle_id"),
        byName("inspector"),
        byName("status"),
        byName("expiry"),
      ];
    case "insurance":
      return [
        byName("policy_id"),
        byName("vehicle_id"),
        byName("provider"),
        byName("expiry_date"),
        byName("status"),
      ];
    case "contracts":
      return [
        byName("contract_id"),
        byName("party"),
        byName("start_date"),
        byName("end_date"),
        byName("status"),
      ];
    case "licenses":
      return [
        byName("license_id"),
        byName("license_type"),
        byName("holder"),
        byName("expiry_date"),
        byName("status"),
      ];
    case "incidents":
      return [
        byName("incident_id"),
        byName("date"),
        byName("type"),
        byName("severity"),
        byName("status"),
      ];
    default:
      return fields.slice(0, 5);
  }
}

type FormFieldType =
  "text" | "email" | "tel" | "number" | "textarea" | "select" | "date" | "time" | "datetime-local";

type FormField = {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  options?: string[];
  required?: boolean;
};

type ModuleTemplate = {
  title: string;
  description: string;
  primaryField: string;
  fields: FormField[];
  initialRecords: Record<string, string>[];
};

function getModuleTemplate(sectionId: string, childPath: string): ModuleTemplate {
  const section = sectionId.toLowerCase();
  const child = childPath.toLowerCase();

  switch (section) {
    case "iam":
      return {
        title: "User record",
        description: "Create a sample identity record with role and access details.",
        primaryField: "name",
        fields: [
          { name: "name", label: "Full name", type: "text", placeholder: "Asha Menon" },
          { name: "email", label: "Email", type: "email", placeholder: "asha@soracabs.com" },
          {
            name: "role",
            label: "Role",
            type: "select",
            options: ["Admin", "Manager", "Operator", "Support"],
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: ["Active", "Pending", "Suspended"],
          },
          {
            name: "notes",
            label: "Notes",
            type: "textarea",
            placeholder: "Access needs and onboarding details",
          },
        ],
        initialRecords: [
          {
            name: "Asha Menon",
            email: "asha@soracabs.com",
            role: "Admin",
            status: "Active",
            notes: "Super admin access",
          },
          {
            name: "Karan Shah",
            email: "karan@soracabs.com",
            role: "Manager",
            status: "Active",
            notes: "Fleet oversight",
          },
        ],
      };
    case "customers":
      return {
        title: "Customer profile",
        description: "Capture customer details and support context for development demos.",
        primaryField: "name",
        fields: [
          { name: "name", label: "Customer name", type: "text", placeholder: "Meera Rao" },
          { name: "phone", label: "Phone", type: "tel", placeholder: "+91 99999 99999" },
          {
            name: "plan",
            label: "Plan",
            type: "select",
            options: ["Premium", "Standard", "Corporate"],
          },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: ["Active", "Pending", "Blocked"],
          },
          {
            name: "notes",
            label: "Notes",
            type: "textarea",
            placeholder: "Preferred contact channel and account notes",
          },
        ],
        initialRecords: [
          {
            name: "Meera Rao",
            phone: "+91 99999 11111",
            plan: "Premium",
            status: "Active",
            notes: "Prefers WhatsApp",
          },
          {
            name: "Nikhil Das",
            phone: "+91 88888 22222",
            plan: "Standard",
            status: "Pending",
            notes: "Needs KYC review",
          },
        ],
      };
    case "drivers": {
      const driverTemplates: Record<string, ModuleTemplate> = {
        registration: {
          title: "Driver Registration",
          description: "Onboard new driver partners into the Sora Cabs network.",
          primaryField: "name",
          fields: [
            { name: "name", label: "Full Name", type: "text", placeholder: "Ravi Kumar" },
            { name: "email", label: "Email", type: "email", placeholder: "ravi.k@example.com" },
            { name: "phone", label: "Phone Number", type: "tel", placeholder: "+91 98765 43210" },
            { name: "dob", label: "Date of Birth", type: "date" },
            {
              name: "gender",
              label: "Gender",
              type: "select",
              options: ["Male", "Female", "Other"],
            },
            { name: "city", label: "City", type: "text", placeholder: "Bangalore" },
            {
              name: "vehicle_type",
              label: "Vehicle Type",
              type: "select",
              options: ["Bike", "Car", "EV", "Scooter"],
            },
            {
              name: "status",
              label: "Registration Status",
              type: "select",
              options: ["Pending", "Approved", "Rejected"],
            },
          ],
          initialRecords: [
            {
              name: "Ravi Kumar",
              email: "ravi.k@example.com",
              phone: "+91 98765 43210",
              dob: "1992-05-12",
              gender: "Male",
              city: "Bangalore",
              vehicle_type: "Bike",
              status: "Approved",
            },
            {
              name: "Sana Iqbal",
              email: "sana.i@example.com",
              phone: "+91 99887 76655",
              dob: "1995-11-20",
              gender: "Female",
              city: "Mumbai",
              vehicle_type: "EV",
              status: "Pending",
            },
          ],
        },
        kyc: {
          title: "Driver KYC",
          description: "Verify identity and legal credentials of driver partners.",
          primaryField: "driver_id",
          fields: [
            { name: "driver_id", label: "Driver ID", type: "text", placeholder: "SORA-DRV-101" },
            {
              name: "aadhar_no",
              label: "Aadhar Number",
              type: "text",
              placeholder: "XXXX XXXX 1234",
            },
            { name: "pan_no", label: "PAN Number", type: "text", placeholder: "ABCDE1234F" },
            {
              name: "status",
              label: "KYC Status",
              type: "select",
              options: ["Verified", "Pending", "Rejected", "Expired"],
            },
            { name: "verified_by", label: "Verified By", type: "text", placeholder: "Agent Smith" },
            { name: "verification_date", label: "Verification Date", type: "date" },
            {
              name: "notes",
              label: "Verification Notes",
              type: "textarea",
              placeholder: "All docs verified",
            },
          ],
          initialRecords: [
            {
              driver_id: "SORA-DRV-101",
              aadhar_no: "1234 5678 9012",
              pan_no: "BKDPY1234Z",
              status: "Verified",
              verified_by: "Admin User",
              verification_date: "2026-01-15",
              notes: "Documents clear",
            },
            {
              driver_id: "SORA-DRV-102",
              aadhar_no: "9876 5432 1098",
              pan_no: "CXYZP5678W",
              status: "Pending",
              verified_by: "—",
              verification_date: "—",
              notes: "Awaiting PAN copy",
            },
          ],
        },
        documents: {
          title: "Driver Documents",
          description: "Manage and track validity of mandatory driver documentation.",
          primaryField: "doc_id",
          fields: [
            { name: "doc_id", label: "Document ID", type: "text", placeholder: "DOC-1001" },
            { name: "driver_id", label: "Driver ID", type: "text", placeholder: "SORA-DRV-101" },
            {
              name: "doc_type",
              label: "Document Type",
              type: "select",
              options: [
                "Driving License",
                "Insurance",
                "Address Proof",
                "Police Clearance",
                "Medical Certificate",
              ],
            },
            { name: "upload_date", label: "Upload Date", type: "date" },
            { name: "expiry_date", label: "Expiry Date", type: "date" },
            {
              name: "status",
              label: "Doc Status",
              type: "select",
              options: ["Valid", "Expired", "Under Review", "Invalid"],
            },
            {
              name: "image_url",
              label: "Document Image",
              type: "text",
              placeholder:
                "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='120'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23f3f4f6'/%3E%3Ctext%20x='50%25'%20y='50%25'%20fill='%23666'%20font-size='16'%20text-anchor='middle'%20dominant-baseline='middle'%3EImage%3C/text%3E%3C/svg%3E",
            },
          ],
          initialRecords: [
            {
              doc_id: "DOC-1001",
              driver_id: "SORA-DRV-101",
              doc_type: "Driving License",
              upload_date: "2025-05-10",
              expiry_date: "2030-05-10",
              status: "Valid",
              image_url:
                "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='120'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23f3f4f6'/%3E%3Ctext%20x='50%25'%20y='50%25'%20fill='%23666'%20font-size='16'%20text-anchor='middle'%20dominant-baseline='middle'%3EDL%3C/text%3E%3C/svg%3E",
            },
            {
              doc_id: "DOC-1002",
              driver_id: "SORA-DRV-101",
              doc_type: "Insurance",
              upload_date: "2026-01-01",
              expiry_date: "2026-12-31",
              status: "Valid",
              image_url:
                "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='120'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23f3f4f6'/%3E%3Ctext%20x='50%25'%20y='50%25'%20fill='%23666'%20font-size='14'%20text-anchor='middle'%20dominant-baseline='middle'%3EInsurance%3C/text%3E%3C/svg%3E",
            },
            {
              doc_id: "DOC-1003",
              driver_id: "SORA-DRV-102",
              doc_type: "Driving License",
              upload_date: "2024-02-15",
              expiry_date: "2025-02-15",
              status: "Expired",
              image_url:
                "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='120'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23f3f4f6'/%3E%3Ctext%20x='50%25'%20y='50%25'%20fill='%23666'%20font-size='14'%20text-anchor='middle'%20dominant-baseline='middle'%3EExpired%3C/text%3E%3C/svg%3E",
            },
          ],
        },
        license: {
          title: "License Verification",
          description: "Verify authenticity of driving licenses with government databases.",
          primaryField: "license_no",
          fields: [
            {
              name: "license_no",
              label: "License Number",
              type: "text",
              placeholder: "DL-KA-2023-0001",
            },
            { name: "driver_id", label: "Driver ID", type: "text", placeholder: "SORA-DRV-101" },
            {
              name: "authority",
              label: "Issuing Authority",
              type: "text",
              placeholder: "RTO Bangalore",
            },
            {
              name: "license_class",
              label: "License Class",
              type: "select",
              options: ["LMV", "MCWG", "HMV", "Transport"],
            },
            {
              name: "status",
              label: "Verification Status",
              type: "select",
              options: ["Authentic", "Fraudulent", "Not Found", "Pending"],
            },
            { name: "last_checked", label: "Last Checked", type: "date" },
          ],
          initialRecords: [
            {
              license_no: "DL-KA-2023-0001",
              driver_id: "SORA-DRV-101",
              authority: "RTO Bangalore",
              license_class: "MCWG",
              status: "Authentic",
              last_checked: "2026-06-01",
            },
            {
              license_no: "DL-MH-2022-5543",
              driver_id: "SORA-DRV-102",
              authority: "RTO Mumbai",
              license_class: "LMV",
              status: "Pending",
              last_checked: "—",
            },
          ],
        },
        availability: {
          title: "Driver Availability",
          description: "Manage driver shifts and real-time operational status.",
          primaryField: "driver_id",
          fields: [
            { name: "driver_id", label: "Driver ID", type: "text", placeholder: "SORA-DRV-101" },
            { name: "name", label: "Driver Name", type: "text", placeholder: "Ravi Kumar" },
            {
              name: "shift",
              label: "Assigned Shift",
              type: "select",
              options: ["Morning (6AM-2PM)", "Evening (2PM-10PM)", "Night (10PM-6AM)", "Flexible"],
            },
            {
              name: "working_days",
              label: "Working Days",
              type: "text",
              placeholder: "Mon, Tue, Wed, Thu, Fri",
            },
            { name: "max_hours", label: "Max Hours/Day", type: "number", placeholder: "10" },
            {
              name: "status",
              label: "Current Status",
              type: "select",
              options: ["Online", "Offline", "On Break", "On Trip"],
            },
          ],
          initialRecords: [
            {
              driver_id: "SORA-DRV-101",
              name: "Ravi Kumar",
              shift: "Morning (6AM-2PM)",
              working_days: "Mon-Fri",
              max_hours: "10",
              status: "Online",
            },
            {
              driver_id: "SORA-DRV-102",
              name: "Sana Iqbal",
              shift: "Flexible",
              working_days: "Sat-Sun",
              max_hours: "12",
              status: "Offline",
            },
          ],
        },
        performance: {
          title: "Driver Performance",
          description: "Analyze driver efficiency, ratings, and behavioral metrics.",
          primaryField: "driver_id",
          fields: [
            { name: "driver_id", label: "Driver ID", type: "text", placeholder: "SORA-DRV-101" },
            { name: "total_trips", label: "Total Trips", type: "number", placeholder: "1250" },
            { name: "avg_rating", label: "Avg Rating", type: "number", placeholder: "4.8" },
            { name: "completion_rate", label: "Completion %", type: "number", placeholder: "94" },
            { name: "cancel_rate", label: "Cancel %", type: "number", placeholder: "2" },
            {
              name: "status",
              label: "Performance Tier",
              type: "select",
              options: ["Platinum", "Gold", "Silver", "Bronze"],
            },
          ],
          initialRecords: [
            {
              driver_id: "SORA-DRV-101",
              total_trips: "1250",
              avg_rating: "4.8",
              completion_rate: "94",
              cancel_rate: "2",
              status: "Platinum",
            },
            {
              driver_id: "SORA-DRV-102",
              total_trips: "450",
              avg_rating: "4.2",
              completion_rate: "82",
              cancel_rate: "8",
              status: "Silver",
            },
          ],
        },
        wallet: {
          title: "Driver Wallet",
          description: "Track driver balances, pending payouts, and locked funds.",
          primaryField: "driver_id",
          fields: [
            { name: "driver_id", label: "Driver ID", type: "text", placeholder: "SORA-DRV-101" },
            { name: "balance", label: "Available Balance", type: "number", placeholder: "12500" },
            { name: "pending", label: "Pending Payout", type: "number", placeholder: "3200" },
            { name: "locked", label: "Locked Amount", type: "number", placeholder: "500" },
            { name: "last_sync", label: "Last Sync Date", type: "date" },
            {
              name: "status",
              label: "Wallet Status",
              type: "select",
              options: ["Active", "Frozen", "Under Review"],
            },
          ],
          initialRecords: [
            {
              driver_id: "SORA-DRV-101",
              balance: "12500",
              pending: "3200",
              locked: "500",
              last_sync: "2026-07-11",
              status: "Active",
            },
            {
              driver_id: "SORA-DRV-102",
              balance: "4200",
              pending: "1100",
              locked: "0",
              last_sync: "2026-07-10",
              status: "Active",
            },
          ],
        },
        earnings: {
          title: "Driver Earnings",
          description: "Comprehensive breakdown of fares, commissions, and bonuses.",
          primaryField: "earnings_id",
          fields: [
            { name: "earnings_id", label: "Payout ID", type: "text", placeholder: "PAY-9901" },
            { name: "driver_id", label: "Driver ID", type: "text", placeholder: "SORA-DRV-101" },
            { name: "period", label: "Period", type: "text", placeholder: "July 1-15" },
            { name: "total_fare", label: "Gross Fare", type: "number", placeholder: "45000" },
            { name: "commission", label: "Sora Commission", type: "number", placeholder: "4500" },
            { name: "bonus", label: "Incentive Bonus", type: "number", placeholder: "2000" },
            { name: "net_payout", label: "Net Payout", type: "number", placeholder: "42500" },
            {
              name: "status",
              label: "Payment Status",
              type: "select",
              options: ["Paid", "Processing", "Scheduled", "Hold"],
            },
          ],
          initialRecords: [
            {
              earnings_id: "PAY-9901",
              driver_id: "SORA-DRV-101",
              period: "July 1-15",
              total_fare: "45000",
              commission: "4500",
              bonus: "2000",
              net_payout: "42500",
              status: "Paid",
            },
            {
              earnings_id: "PAY-9902",
              driver_id: "SORA-DRV-102",
              period: "July 1-15",
              total_fare: "12000",
              commission: "1200",
              bonus: "500",
              net_payout: "11300",
              status: "Processing",
            },
          ],
        },
      };
      const key = child || "registration";
      return driverTemplates[key] || driverTemplates.registration;
    }
    case "vehicles": {
      const vehicleTemplates: Record<string, ModuleTemplate> = {
        registration: {
          title: "Vehicle Registration",
          description: "Register vehicles with plate, model and owner details.",
          primaryField: "name",
          fields: [
            { name: "name", label: "Plate / ID", type: "text", placeholder: "KA-01-AB-1234" },
            { name: "model", label: "Model", type: "text", placeholder: "City EV" },
            { name: "owner", label: "Owner Name", type: "text", placeholder: "Fleet Owner" },
            {
              name: "fuel",
              label: "Fuel Type",
              type: "select",
              options: ["Electric", "Petrol", "Diesel", "Hybrid"],
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Maintenance", "Inactive"],
            },
          ],
          initialRecords: [
            {
              name: "KA-01-AB-1234",
              model: "City EV",
              owner: "North Star Fleet",
              fuel: "Electric",
              status: "Active",
            },
            {
              name: "KA-02-CD-5678",
              model: "City Ride",
              owner: "Indi Fleet",
              fuel: "Petrol",
              status: "Maintenance",
            },
          ],
        },
        documents: {
          title: "Vehicle Documents",
          description: "Store vehicle documents like RC, insurance copies and permits.",
          primaryField: "doc_id",
          fields: [
            { name: "doc_id", label: "Document ID", type: "text", placeholder: "V-DOC-1001" },
            { name: "vehicle_id", label: "Vehicle ID", type: "text", placeholder: "KA-01-AB-1234" },
            {
              name: "doc_type",
              label: "Document Type",
              type: "select",
              options: ["RC", "Permit", "Insurance", "Pollution"],
            },
            { name: "upload_date", label: "Upload Date", type: "date" },
            { name: "expiry_date", label: "Expiry Date", type: "date" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Valid", "Expired", "Under Review"],
            },
            {
              name: "image_url",
              label: "Document Image",
              type: "text",
              placeholder: "https://...",
            },
          ],
          initialRecords: [
            {
              doc_id: "V-DOC-1001",
              vehicle_id: "KA-01-AB-1234",
              doc_type: "RC",
              upload_date: "2025-05-10",
              expiry_date: "2035-05-10",
              status: "Valid",
              image_url:
                "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='120'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23f3f4f6'/%3E%3Ctext%20x='50%25'%20y='50%25'%20fill='%23666'%20font-size='14'%20text-anchor='middle'%20dominant-baseline='middle'%3ERC%3C/text%3E%3C/svg%3E",
            },
          ],
        },
        insurance: {
          title: "Vehicle Insurance",
          description: "Track insurance policies, premiums and copies.",
          primaryField: "policy_id",
          fields: [
            { name: "policy_id", label: "Policy ID", type: "text", placeholder: "POL-2026-001" },
            { name: "vehicle_id", label: "Vehicle ID", type: "text", placeholder: "KA-01-AB-1234" },
            { name: "provider", label: "Provider", type: "text", placeholder: "ABC Insurance" },
            { name: "premium", label: "Premium", type: "number", placeholder: "4500" },
            { name: "expiry_date", label: "Expiry Date", type: "date" },
            {
              name: "policy_image",
              label: "Policy Image",
              type: "text",
              placeholder: "https://...",
            },
          ],
          initialRecords: [
            {
              policy_id: "POL-2026-001",
              vehicle_id: "KA-01-AB-1234",
              provider: "ABC Insurance",
              premium: "4500",
              expiry_date: "2027-05-10",
              policy_image:
                "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='120'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23f3f4f6'/%3E%3Ctext%20x='50%25'%20y='50%25'%20fill='%23666'%20font-size='14'%20text-anchor='middle'%20dominant-baseline='middle'%3EPolicy%3C/text%3E%3C/svg%3E",
            },
          ],
        },
        maintenance: {
          title: "Vehicle Maintenance",
          description: "Log maintenance events, service providers and receipts.",
          primaryField: "maint_id",
          fields: [
            { name: "maint_id", label: "Maintenance ID", type: "text", placeholder: "MNT-5001" },
            { name: "vehicle_id", label: "Vehicle ID", type: "text", placeholder: "KA-01-AB-1234" },
            {
              name: "service",
              label: "Service Performed",
              type: "text",
              placeholder: "Oil change",
            },
            { name: "provider", label: "Service Provider", type: "text", placeholder: "AutoCare" },
            { name: "cost", label: "Cost", type: "number", placeholder: "1200" },
            { name: "date", label: "Service Date", type: "date" },
            {
              name: "receipt_image",
              label: "Receipt Image",
              type: "text",
              placeholder: "https://...",
            },
          ],
          initialRecords: [
            {
              maint_id: "MNT-5001",
              vehicle_id: "KA-02-CD-5678",
              service: "Oil change",
              provider: "AutoCare",
              cost: "1200",
              date: "2026-06-01",
              receipt_image:
                "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='120'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23f3f4f6'/%3E%3Ctext%20x='50%25'%20y='50%25'%20fill='%23666'%20font-size='14'%20text-anchor='middle'%20dominant-baseline='middle'%3EReceipt%3C/text%3E%3C/svg%3E",
            },
          ],
        },
        fuel: {
          title: "Fuel / EV",
          description: "Track fuel fills, battery swaps and charging sessions.",
          primaryField: "fuel_id",
          fields: [
            { name: "fuel_id", label: "Record ID", type: "text", placeholder: "FUEL-3001" },
            { name: "vehicle_id", label: "Vehicle ID", type: "text", placeholder: "KA-01-AB-1234" },
            {
              name: "type",
              label: "Type",
              type: "select",
              options: ["Petrol", "Diesel", "CNG", "EV Charge", "Battery Swap"],
            },
            { name: "quantity", label: "Quantity", type: "number", placeholder: "10" },
            { name: "cost", label: "Cost", type: "number", placeholder: "800" },
            { name: "date", label: "Date", type: "date" },
          ],
          initialRecords: [
            {
              fuel_id: "FUEL-3001",
              vehicle_id: "KA-01-AB-1234",
              type: "EV Charge",
              quantity: "1",
              cost: "150",
              date: "2026-07-10",
            },
          ],
        },
      };
      const key = child || "registration";
      return vehicleTemplates[key] || vehicleTemplates.registration;
    }
    case "fleet": {
      const fleetTemplates: Record<string, ModuleTemplate> = {
        owners: {
          title: "Fleet Owners",
          description: "Manage fleet owner profiles and contact details.",
          primaryField: "name",
          fields: [
            { name: "name", label: "Fleet Owner", type: "text", placeholder: "North Star Fleet" },
            { name: "contact", label: "Contact Person", type: "text", placeholder: "Dinesh Rao" },
            { name: "phone", label: "Phone", type: "tel", placeholder: "+91 99999 11111" },
            {
              name: "region",
              label: "Region",
              type: "select",
              options: ["North", "South", "West", "East"],
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Review", "Paused"],
            },
          ],
          initialRecords: [
            {
              name: "North Star Fleet",
              contact: "Dinesh Rao",
              phone: "+91 99999 11111",
              region: "North",
              status: "Active",
            },
          ],
        },
        allocation: {
          title: "Vehicle Allocation",
          description: "Assign vehicles to drivers and branches with allocation history.",
          primaryField: "alloc_id",
          fields: [
            { name: "alloc_id", label: "Allocation ID", type: "text", placeholder: "ALLOC-2001" },
            { name: "vehicle_id", label: "Vehicle ID", type: "text", placeholder: "KA-01-AB-1234" },
            { name: "driver_id", label: "Driver ID", type: "text", placeholder: "SORA-DRV-101" },
            { name: "branch", label: "Branch", type: "text", placeholder: "Koramangala" },
            { name: "start_date", label: "Start Date", type: "date" },
            { name: "end_date", label: "End Date", type: "date" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Released", "Pending"],
            },
          ],
          initialRecords: [
            {
              alloc_id: "ALLOC-2001",
              vehicle_id: "KA-01-AB-1234",
              driver_id: "SORA-DRV-101",
              branch: "Koramangala",
              start_date: "2026-01-01",
              end_date: "—",
              status: "Active",
            },
          ],
        },
        performance: {
          title: "Fleet Performance",
          description: "Aggregate fleet metrics: utilization, uptime, and costs.",
          primaryField: "fleet_id",
          fields: [
            { name: "fleet_id", label: "Fleet ID", type: "text", placeholder: "FLEET-01" },
            { name: "total_vehicles", label: "Total Vehicles", type: "number", placeholder: "120" },
            { name: "utilization", label: "Utilization %", type: "number", placeholder: "78" },
            { name: "avg_downtime", label: "Avg Downtime (hrs)", type: "number", placeholder: "2" },
            { name: "region", label: "Region", type: "text", placeholder: "South" },
          ],
          initialRecords: [
            {
              fleet_id: "FLEET-01",
              total_vehicles: "120",
              utilization: "78",
              avg_downtime: "1.8",
              region: "South",
            },
          ],
        },
        fuel: {
          title: "Fuel Tracking",
          description: "Monitor fleet fuel consumption and charging events.",
          primaryField: "fuel_id",
          fields: [
            { name: "fuel_id", label: "Record ID", type: "text", placeholder: "FLEET-FUEL-1001" },
            { name: "fleet_id", label: "Fleet ID", type: "text", placeholder: "FLEET-01" },
            { name: "vehicle_id", label: "Vehicle ID", type: "text", placeholder: "KA-01-AB-1234" },
            {
              name: "type",
              label: "Type",
              type: "select",
              options: ["Petrol", "Diesel", "CNG", "EV Charge", "Battery Swap"],
            },
            { name: "quantity", label: "Quantity", type: "number", placeholder: "10" },
            { name: "cost", label: "Cost", type: "number", placeholder: "800" },
            { name: "date", label: "Date", type: "date" },
          ],
          initialRecords: [
            {
              fuel_id: "FLEET-FUEL-1001",
              fleet_id: "FLEET-01",
              vehicle_id: "KA-01-AB-1234",
              type: "EV Charge",
              quantity: "1",
              cost: "150",
              date: "2026-07-10",
            },
          ],
        },
        maintenance: {
          title: "Fleet Maintenance",
          description: "Centralized maintenance schedule and cost tracking for the fleet.",
          primaryField: "maint_id",
          fields: [
            { name: "maint_id", label: "Maintenance ID", type: "text", placeholder: "F-MNT-7001" },
            { name: "fleet_id", label: "Fleet ID", type: "text", placeholder: "FLEET-01" },
            { name: "vehicle_id", label: "Vehicle ID", type: "text", placeholder: "KA-02-CD-5678" },
            { name: "service", label: "Service", type: "text", placeholder: "Brake check" },
            { name: "provider", label: "Provider", type: "text", placeholder: "FleetServ" },
            { name: "cost", label: "Cost", type: "number", placeholder: "2500" },
            { name: "date", label: "Date", type: "date" },
            {
              name: "receipt_image",
              label: "Receipt Image",
              type: "text",
              placeholder: "https://...",
            },
          ],
          initialRecords: [
            {
              maint_id: "F-MNT-7001",
              fleet_id: "FLEET-01",
              vehicle_id: "KA-02-CD-5678",
              service: "Brake check",
              provider: "FleetServ",
              cost: "2500",
              date: "2026-06-20",
              receipt_image:
                "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='120'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23f3f4f6'/%3E%3Ctext%20x='50%25'%20y='50%25'%20fill='%23666'%20font-size='14'%20text-anchor='middle'%20dominant-baseline='middle'%3EReceipt%3C/text%3E%3C/svg%3E",
            },
          ],
        },
      };
      const key = child || "owners";
      return fleetTemplates[key] || fleetTemplates.owners;
    }
    case "rental": {
      const rentalTemplates: Record<string, ModuleTemplate> = {
        inventory: {
          title: "Bike Inventory",
          description: "Track bikes available for rent with condition and location.",
          primaryField: "bike_id",
          fields: [
            { name: "bike_id", label: "Bike ID", type: "text", placeholder: "BK-1102" },
            { name: "model", label: "Model", type: "text", placeholder: "Urban Lite" },
            { name: "location", label: "Location", type: "text", placeholder: "Koramangala" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Available", "Rented", "Maintenance"],
            },
            { name: "image_url", label: "Bike Image", type: "text", placeholder: "https://..." },
          ],
          initialRecords: [
            {
              bike_id: "BK-1102",
              model: "Urban Lite",
              location: "Koramangala",
              status: "Available",
              image_url:
                "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='120'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23f3f4f6'/%3E%3Ctext%20x='50%25'%20y='50%25'%20fill='%23666'%20font-size='16'%20text-anchor='middle'%20dominant-baseline='middle'%3EBike%3C/text%3E%3C/svg%3E",
            },
          ],
        },
        registration: {
          title: "Bike Registration",
          description: "Register bikes and attachments used in rental fleet.",
          primaryField: "bike_id",
          fields: [
            { name: "bike_id", label: "Bike ID", type: "text", placeholder: "BK-1102" },
            { name: "owner", label: "Owner", type: "text", placeholder: "North Star Fleet" },
            { name: "plate", label: "Plate", type: "text", placeholder: "KA-01-AB-1234" },
            { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
            { name: "notes", label: "Notes", type: "textarea", placeholder: "Registration notes" },
          ],
          initialRecords: [
            {
              bike_id: "BK-1102",
              owner: "North Star Fleet",
              plate: "KA-01-AB-1234",
              status: "Active",
              notes: "Assigned to downtown",
            },
            {
              bike_id: "BK-1103",
              owner: "Indi Rentals",
              plate: "KA-02-CD-5678",
              status: "Active",
              notes: "Spare bike",
            },
            {
              bike_id: "BK-1104",
              owner: "North Star Fleet",
              plate: "KA-03-EF-9012",
              status: "Inactive",
              notes: "Under inspection",
            },
            {
              bike_id: "BK-1105",
              owner: "City Bikes Co.",
              plate: "KA-04-GH-3456",
              status: "Active",
              notes: "Ready for rental",
            },
          ],
        },
        qr: {
          title: "QR Code",
          description: "Manage QR code assets linked to bikes for rentals and checkins.",
          primaryField: "qr_id",
          fields: [
            { name: "qr_id", label: "QR ID", type: "text", placeholder: "QR-1001" },
            { name: "bike_id", label: "Bike ID", type: "text", placeholder: "BK-1102" },
            { name: "qr_image", label: "QR Image", type: "text", placeholder: "https://..." },
            { name: "status", label: "Status", type: "select", options: ["Active", "Deactivated"] },
          ],
          initialRecords: [
            {
              qr_id: "QR-1001",
              bike_id: "BK-1102",
              qr_image:
                "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='200'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23ffffff'/%3E%3Ctext%20x='50%25'%20y='50%25'%20fill='%23000'%20font-size='18'%20text-anchor='middle'%20dominant-baseline='middle'%3EQR%3C/text%3E%3C/svg%3E",
              status: "Active",
            },
          ],
        },
        allocation: {
          title: "Bike Allocation",
          description: "Assign bikes to users/drivers and branches for rental periods.",
          primaryField: "alloc_id",
          fields: [
            {
              name: "alloc_id",
              label: "Allocation ID",
              type: "text",
              placeholder: "ALLOC-BK-3001",
            },
            { name: "bike_id", label: "Bike ID", type: "text", placeholder: "BK-1102" },
            { name: "user_id", label: "User/Driver ID", type: "text", placeholder: "SORA-DRV-101" },
            { name: "start_date", label: "Start Date", type: "date" },
            { name: "end_date", label: "End Date", type: "date" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Returned", "Overdue"],
            },
          ],
          initialRecords: [
            {
              alloc_id: "ALLOC-BK-3001",
              bike_id: "BK-1102",
              user_id: "USR-2001",
              start_date: "2026-07-01",
              end_date: "2026-07-03",
              status: "Returned",
            },
            {
              alloc_id: "ALLOC-BK-3002",
              bike_id: "BK-1103",
              user_id: "USR-2002",
              start_date: "2026-06-28",
              end_date: "2026-07-02",
              status: "Overdue",
            },
            {
              alloc_id: "ALLOC-BK-3003",
              bike_id: "BK-1104",
              user_id: "USR-2003",
              start_date: "2026-07-05",
              end_date: "2026-07-06",
              status: "Active",
            },
            {
              alloc_id: "ALLOC-BK-3004",
              bike_id: "BK-1105",
              user_id: "USR-2004",
              start_date: "2026-07-08",
              end_date: "2026-07-09",
              status: "Active",
            },
          ],
        },
        plans: {
          title: "Rental Plans",
          description: "Define pricing plans and rules for rentals.",
          primaryField: "plan_id",
          fields: [
            { name: "plan_id", label: "Plan ID", type: "text", placeholder: "PLAN-STD-01" },
            { name: "name", label: "Name", type: "text", placeholder: "Daily Standard" },
            { name: "duration", label: "Duration", type: "text", placeholder: "1 day" },
            { name: "price", label: "Price", type: "number", placeholder: "299" },
            {
              name: "notes",
              label: "Notes",
              type: "textarea",
              placeholder: "Plan rules and limits",
            },
          ],
          initialRecords: [
            {
              plan_id: "PLAN-STD-01",
              name: "Daily Standard",
              duration: "1 day",
              price: "299",
              notes: "Kilometer cap: 50km",
            },
            {
              plan_id: "PLAN-HALF-01",
              name: "Half Day",
              duration: "6 hours",
              price: "199",
              notes: "Peak hours: extra charge",
            },
            {
              plan_id: "PLAN-WEEK-01",
              name: "Weekly",
              duration: "7 days",
              price: "1499",
              notes: "Includes maintenance",
            },
            {
              plan_id: "PLAN-MON-01",
              name: "Monthly",
              duration: "30 days",
              price: "4999",
              notes: "Best for long-term rentals",
            },
          ],
        },
        billing: {
          title: "Rental Billing",
          description: "Track rental invoices, settlements and refunds.",
          primaryField: "bill_id",
          fields: [
            { name: "bill_id", label: "Bill ID", type: "text", placeholder: "BILL-5001" },
            {
              name: "alloc_id",
              label: "Allocation ID",
              type: "text",
              placeholder: "ALLOC-BK-3001",
            },
            { name: "amount", label: "Amount", type: "number", placeholder: "299" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Paid", "Pending", "Refunded"],
            },
            {
              name: "receipt_image",
              label: "Receipt Image",
              type: "text",
              placeholder: "https://...",
            },
          ],
          initialRecords: [
            {
              bill_id: "BILL-5001",
              alloc_id: "ALLOC-BK-3001",
              amount: "299",
              status: "Paid",
              receipt_image:
                "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='120'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23f3f4f6'/%3E%3Ctext%20x='50%25'%20y='50%25'%20fill='%23666'%20font-size='16'%20text-anchor='middle'%20dominant-baseline='middle'%3EReceipt%3C/text%3E%3C/svg%3E",
            },
            {
              bill_id: "BILL-5002",
              alloc_id: "ALLOC-BK-3002",
              amount: "598",
              status: "Pending",
              receipt_image:
                "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='120'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23f3f4f6'/%3E%3Ctext%20x='50%25'%20y='50%25'%20fill='%23666'%20font-size='16'%20text-anchor='middle'%20dominant-baseline='middle'%3EReceipt%3C/text%3E%3C/svg%3E",
            },
            {
              bill_id: "BILL-5003",
              alloc_id: "ALLOC-BK-3003",
              amount: "299",
              status: "Paid",
              receipt_image:
                "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='120'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23f3f4f6'/%3E%3Ctext%20x='50%25'%20y='50%25'%20fill='%23666'%20font-size='16'%20text-anchor='middle'%20dominant-baseline='middle'%3EReceipt%3C/text%3E%3C/svg%3E",
            },
            {
              bill_id: "BILL-5004",
              alloc_id: "ALLOC-BK-3004",
              amount: "399",
              status: "Refunded",
              receipt_image:
                "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='120'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23f3f4f6'/%3E%3Ctext%20x='50%25'%20y='50%25'%20fill='%23666'%20font-size='16'%20text-anchor='middle'%20dominant-baseline='middle'%3EReceipt%3C/text%3E%3C/svg%3E",
            },
          ],
        },
        exchange: {
          title: "Bike Exchange",
          description: "Manage exchanges/swaps for rentals and returns.",
          primaryField: "exchange_id",
          fields: [
            { name: "exchange_id", label: "Exchange ID", type: "text", placeholder: "EX-1001" },
            { name: "from_bike", label: "From Bike", type: "text", placeholder: "BK-1102" },
            { name: "to_bike", label: "To Bike", type: "text", placeholder: "BK-1103" },
            { name: "reason", label: "Reason", type: "textarea", placeholder: "Damaged battery" },
            { name: "date", label: "Date", type: "date" },
          ],
          initialRecords: [
            {
              exchange_id: "EX-1001",
              from_bike: "BK-1102",
              to_bike: "BK-1103",
              reason: "Battery issue",
              date: "2026-06-20",
            },
            {
              exchange_id: "EX-1002",
              from_bike: "BK-1104",
              to_bike: "BK-1105",
              reason: "Customer request",
              date: "2026-07-02",
            },
            {
              exchange_id: "EX-1003",
              from_bike: "BK-1103",
              to_bike: "BK-1102",
              reason: "Swap for maintenance",
              date: "2026-07-05",
            },
            {
              exchange_id: "EX-1004",
              from_bike: "BK-1105",
              to_bike: "BK-1104",
              reason: "Battery swap",
              date: "2026-07-08",
            },
          ],
        },
        maintenance: {
          title: "Maintenance",
          description: "Bike maintenance records, service receipts and schedules.",
          primaryField: "maint_id",
          fields: [
            { name: "maint_id", label: "Maintenance ID", type: "text", placeholder: "MNT-BK-4001" },
            { name: "bike_id", label: "Bike ID", type: "text", placeholder: "BK-1102" },
            { name: "service", label: "Service", type: "text", placeholder: "Battery replacement" },
            { name: "provider", label: "Provider", type: "text", placeholder: "BikeCare" },
            { name: "cost", label: "Cost", type: "number", placeholder: "1200" },
            {
              name: "receipt_image",
              label: "Receipt Image",
              type: "text",
              placeholder: "https://...",
            },
          ],
          initialRecords: [
            {
              maint_id: "MNT-BK-4001",
              bike_id: "BK-1102",
              service: "Battery replacement",
              provider: "BikeCare",
              cost: "1200",
              receipt_image:
                "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='120'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23f3f4f6'/%3E%3Ctext%20x='50%25'%20y='50%25'%20fill='%23666'%20font-size='16'%20text-anchor='middle'%20dominant-baseline='middle'%3EReceipt%3C/text%3E%3C/svg%3E",
              date: "2026-06-15",
            },
            {
              maint_id: "MNT-BK-4002",
              bike_id: "BK-1103",
              service: "Tire change",
              provider: "BikeCare",
              cost: "400",
              receipt_image:
                "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='120'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23f3f4f6'/%3E%3Ctext%20x='50%25'%20y='50%25'%20fill='%23666'%20font-size='16'%20text-anchor='middle'%20dominant-baseline='middle'%3EReceipt%3C/text%3E%3C/svg%3E",
              date: "2026-06-20",
            },
            {
              maint_id: "MNT-BK-4003",
              bike_id: "BK-1104",
              service: "Brake check",
              provider: "BikeCare",
              cost: "300",
              receipt_image:
                "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='120'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23f3f4f6'/%3E%3Ctext%20x='50%25'%20y='50%25'%20fill='%23666'%20font-size='16'%20text-anchor='middle'%20dominant-baseline='middle'%3EReceipt%3C/text%3E%3C/svg%3E",
              date: "2026-07-01",
            },
            {
              maint_id: "MNT-BK-4004",
              bike_id: "BK-1105",
              service: "Software update",
              provider: "BikeCare",
              cost: "0",
              receipt_image:
                "data:image/svg+xml;utf8,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='200'%20height='120'%3E%3Crect%20width='100%25'%20height='100%25'%20fill='%23f3f4f6'/%3E%3Ctext%20x='50%25'%20y='50%25'%20fill='%23666'%20font-size='16'%20text-anchor='middle'%20dominant-baseline='middle'%3EReceipt%3C/text%3E%3C/svg%3E",
              date: "2026-07-05",
            },
          ],
        },
        eligibility: {
          title: "Driver Eligibility",
          description: "Track eligibility criteria for riders/drivers to rent bikes.",
          primaryField: "user_id",
          fields: [
            { name: "user_id", label: "User ID", type: "text", placeholder: "USR-1001" },
            { name: "age", label: "Age", type: "number", placeholder: "21" },
            {
              name: "license_valid",
              label: "License Valid",
              type: "select",
              options: ["Yes", "No"],
            },
            {
              name: "kyc_status",
              label: "KYC Status",
              type: "select",
              options: ["Verified", "Pending", "Rejected"],
            },
          ],
          initialRecords: [
            { user_id: "USR-2001", age: "25", license_valid: "Yes", kyc_status: "Verified" },
            { user_id: "USR-2002", age: "22", license_valid: "Yes", kyc_status: "Verified" },
            { user_id: "USR-2003", age: "20", license_valid: "No", kyc_status: "Pending" },
            { user_id: "USR-2004", age: "28", license_valid: "Yes", kyc_status: "Verified" },
          ],
        },
        penalty: {
          title: "Fine & Penalty",
          description: "Record fines, penalties and damage charges against rentals.",
          primaryField: "penalty_id",
          fields: [
            { name: "penalty_id", label: "Penalty ID", type: "text", placeholder: "PN-1001" },
            {
              name: "alloc_id",
              label: "Allocation ID",
              type: "text",
              placeholder: "ALLOC-BK-3001",
            },
            { name: "amount", label: "Amount", type: "number", placeholder: "500" },
            { name: "reason", label: "Reason", type: "textarea", placeholder: "Late return" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Charged", "Waived", "Disputed"],
            },
          ],
          initialRecords: [
            {
              penalty_id: "PN-1001",
              alloc_id: "ALLOC-BK-3002",
              amount: "500",
              reason: "Late return",
              status: "Charged",
            },
            {
              penalty_id: "PN-1002",
              alloc_id: "ALLOC-BK-3003",
              amount: "1200",
              reason: "Damage",
              status: "Charged",
            },
            {
              penalty_id: "PN-1003",
              alloc_id: "ALLOC-BK-3001",
              amount: "0",
              reason: "Waived - promo",
              status: "Waived",
            },
            {
              penalty_id: "PN-1004",
              alloc_id: "ALLOC-BK-3004",
              amount: "300",
              reason: "Cleaning fee",
              status: "Charged",
            },
          ],
        },
        payments: {
          title: "Payments",
          description: "Record payments for rentals and reconciliations.",
          primaryField: "payment_id",
          fields: [
            { name: "payment_id", label: "Payment ID", type: "text", placeholder: "PAY-3001" },
            { name: "bill_id", label: "Bill ID", type: "text", placeholder: "BILL-5001" },
            { name: "amount", label: "Amount", type: "number", placeholder: "299" },
            { name: "method", label: "Method", type: "select", options: ["UPI", "Card", "Wallet"] },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Succeeded", "Pending", "Failed"],
            },
          ],
          initialRecords: [
            {
              payment_id: "PAY-3001",
              bill_id: "BILL-5001",
              amount: "299",
              method: "UPI",
              status: "Succeeded",
            },
            {
              payment_id: "PAY-3002",
              bill_id: "BILL-5002",
              amount: "598",
              method: "Card",
              status: "Pending",
            },
            {
              payment_id: "PAY-3003",
              bill_id: "BILL-5003",
              amount: "299",
              method: "Wallet",
              status: "Succeeded",
            },
            {
              payment_id: "PAY-3004",
              bill_id: "BILL-5004",
              amount: "399",
              method: "Card",
              status: "Refunded",
            },
          ],
        },
        reports: {
          title: "Reports",
          description: "Rental reports and usage summaries for analysis.",
          primaryField: "report_id",
          fields: [
            { name: "report_id", label: "Report ID", type: "text", placeholder: "RPT-9001" },
            { name: "period", label: "Period", type: "text", placeholder: "July 2026" },
            { name: "total_rentals", label: "Total Rentals", type: "number", placeholder: "1200" },
            { name: "revenue", label: "Revenue", type: "number", placeholder: "360000" },
          ],
          initialRecords: [
            {
              report_id: "RPT-9001",
              period: "July 1-7",
              total_rentals: "120",
              revenue: "35800",
              notes: "Weekly summary",
            },
            {
              report_id: "RPT-9002",
              period: "July 8-14",
              total_rentals: "140",
              revenue: "42000",
              notes: "Weekly summary",
            },
            {
              report_id: "RPT-9003",
              period: "July 15-21",
              total_rentals: "130",
              revenue: "39000",
              notes: "Weekly summary",
            },
            {
              report_id: "RPT-9004",
              period: "July 22-31",
              total_rentals: "260",
              revenue: "78000",
              notes: "Bi-weekly summary",
            },
          ],
        },
      };
      const key = child || "inventory";
      return rentalTemplates[key] || rentalTemplates.inventory;
    }
    case "reports": {
      const reportsTemplates: Record<string, ModuleTemplate> = {
        revenue: {
          title: "Revenue Report",
          description: "Aggregate revenue figures for selected periods.",
          primaryField: "report_id",
          fields: [
            { name: "report_id", label: "Report ID", type: "text" },
            { name: "period", label: "Period", type: "text", placeholder: "July 2026" },
            { name: "total_revenue", label: "Total Revenue", type: "text" },
            { name: "net_revenue", label: "Net Revenue", type: "text" },
            { name: "currency", label: "Currency", type: "text" },
          ],
          initialRecords: [
            {
              report_id: "REV-202607",
              period: "July 2026",
              total_revenue: "₹12,40,000",
              net_revenue: "₹9,60,000",
              currency: "INR",
            },
            {
              report_id: "REV-202606",
              period: "June 2026",
              total_revenue: "₹11,80,000",
              net_revenue: "₹9,10,000",
              currency: "INR",
            },
            {
              report_id: "REV-202605",
              period: "May 2026",
              total_revenue: "₹10,50,000",
              net_revenue: "₹8,20,000",
              currency: "INR",
            },
            {
              report_id: "REV-202604",
              period: "April 2026",
              total_revenue: "₹9,20,000",
              net_revenue: "₹7,10,000",
              currency: "INR",
            },
          ],
        },
        rides: {
          title: "Ride Report",
          description: "Trip-level report including fares and status.",
          primaryField: "report_id",
          fields: [
            { name: "report_id", label: "Report ID", type: "text" },
            { name: "ride_id", label: "Ride ID", type: "text" },
            { name: "date", label: "Date", type: "date" },
            { name: "fare", label: "Fare", type: "text" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Completed", "Cancelled", "No-show"],
            },
          ],
          initialRecords: [
            {
              report_id: "RR-1001",
              ride_id: "RIDE-1001",
              date: "2026-07-10",
              fare: "₹120",
              status: "Completed",
            },
            {
              report_id: "RR-1002",
              ride_id: "RIDE-1002",
              date: "2026-07-09",
              fare: "₹240",
              status: "Completed",
            },
            {
              report_id: "RR-1003",
              ride_id: "RIDE-1003",
              date: "2026-07-08",
              fare: "₹80",
              status: "Cancelled",
            },
            {
              report_id: "RR-1004",
              ride_id: "RIDE-1004",
              date: "2026-07-07",
              fare: "₹160",
              status: "Completed",
            },
          ],
        },
        drivers: {
          title: "Driver Report",
          description: "Performance and earnings summary per driver.",
          primaryField: "report_id",
          fields: [
            { name: "report_id", label: "Report ID", type: "text" },
            { name: "driver_id", label: "Driver ID", type: "text" },
            { name: "trips", label: "Trips", type: "number" },
            { name: "avg_rating", label: "Avg Rating", type: "text" },
            { name: "earnings", label: "Earnings", type: "text" },
          ],
          initialRecords: [
            {
              report_id: "DR-1001",
              driver_id: "SORA-DRV-101",
              trips: "120",
              avg_rating: "4.8",
              earnings: "₹45,000",
            },
            {
              report_id: "DR-1002",
              driver_id: "SORA-DRV-102",
              trips: "98",
              avg_rating: "4.6",
              earnings: "₹38,000",
            },
            {
              report_id: "DR-1003",
              driver_id: "SORA-DRV-103",
              trips: "75",
              avg_rating: "4.5",
              earnings: "₹29,000",
            },
            {
              report_id: "DR-1004",
              driver_id: "SORA-DRV-104",
              trips: "140",
              avg_rating: "4.9",
              earnings: "₹52,000",
            },
          ],
        },
        fleet: {
          title: "Fleet Report",
          description: "Aggregated fleet utilization and revenue metrics.",
          primaryField: "report_id",
          fields: [
            { name: "report_id", label: "Report ID", type: "text" },
            { name: "fleet_id", label: "Fleet ID", type: "text" },
            { name: "total_vehicles", label: "Total Vehicles", type: "number" },
            { name: "utilization", label: "Utilization", type: "text" },
            { name: "revenue", label: "Revenue", type: "text" },
          ],
          initialRecords: [
            {
              report_id: "FL-1001",
              fleet_id: "FLEET-1",
              total_vehicles: "120",
              utilization: "78%",
              revenue: "₹6,20,000",
            },
            {
              report_id: "FL-1002",
              fleet_id: "FLEET-2",
              total_vehicles: "80",
              utilization: "69%",
              revenue: "₹3,40,000",
            },
            {
              report_id: "FL-1003",
              fleet_id: "FLEET-3",
              total_vehicles: "50",
              utilization: "55%",
              revenue: "₹1,10,000",
            },
            {
              report_id: "FL-1004",
              fleet_id: "FLEET-4",
              total_vehicles: "200",
              utilization: "82%",
              revenue: "₹9,00,000",
            },
          ],
        },
        rental: {
          title: "Bike Rental Report",
          description: "Rental-specific metrics for bikes and scooters.",
          primaryField: "report_id",
          fields: [
            { name: "report_id", label: "Report ID", type: "text" },
            { name: "bike_id", label: "Bike ID", type: "text" },
            { name: "rentals", label: "Rentals", type: "number" },
            { name: "revenue", label: "Revenue", type: "text" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Maintenance", "Retired"],
            },
          ],
          initialRecords: [
            {
              report_id: "BR-1001",
              bike_id: "BIKE-101",
              rentals: "320",
              revenue: "₹1,20,000",
              status: "Active",
            },
            {
              report_id: "BR-1002",
              bike_id: "BIKE-102",
              rentals: "210",
              revenue: "₹80,000",
              status: "Active",
            },
            {
              report_id: "BR-1003",
              bike_id: "BIKE-103",
              rentals: "50",
              revenue: "₹18,000",
              status: "Maintenance",
            },
            {
              report_id: "BR-1004",
              bike_id: "BIKE-104",
              rentals: "410",
              revenue: "₹1,60,000",
              status: "Active",
            },
          ],
        },
        customers: {
          title: "Customer Report",
          description: "Customer spend and activity metrics.",
          primaryField: "report_id",
          fields: [
            { name: "report_id", label: "Report ID", type: "text" },
            { name: "customer_id", label: "Customer ID", type: "text" },
            { name: "name", label: "Name", type: "text" },
            { name: "total_spent", label: "Total Spent", type: "text" },
            { name: "last_ride", label: "Last Ride", type: "date" },
          ],
          initialRecords: [
            {
              report_id: "CR-1001",
              customer_id: "CUST-101",
              name: "Meera Rao",
              total_spent: "₹6,200",
              last_ride: "2026-07-09",
            },
            {
              report_id: "CR-1002",
              customer_id: "CUST-102",
              name: "Nikhil Das",
              total_spent: "₹3,800",
              last_ride: "2026-07-08",
            },
            {
              report_id: "CR-1003",
              customer_id: "CUST-103",
              name: "Aditi Singh",
              total_spent: "₹12,400",
              last_ride: "2026-07-05",
            },
            {
              report_id: "CR-1004",
              customer_id: "CUST-104",
              name: "Vikram Patel",
              total_spent: "₹1,200",
              last_ride: "2026-06-30",
            },
          ],
        },
      };
      const key = child || "revenue";
      return reportsTemplates[key] || reportsTemplates.revenue;
    }
    case "ai": {
      const aiTemplates: Record<string, ModuleTemplate> = {
        matching: {
          title: "AI Ride Matching",
          description:
            "Configuration and runs for the matching models used to pair riders and drivers.",
          primaryField: "model",
          fields: [
            { name: "model", label: "Model", type: "text" },
            { name: "algorithm", label: "Algorithm", type: "text" },
            { name: "latency", label: "Latency (ms)", type: "text" },
            { name: "accuracy", label: "Accuracy", type: "text" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Testing", "Disabled"],
            },
          ],
          initialRecords: [
            {
              model: "match-v1",
              algorithm: "NearestDriver",
              latency: "45",
              accuracy: "92%",
              status: "Active",
            },
            {
              model: "match-v2",
              algorithm: "MLRank",
              latency: "60",
              accuracy: "95%",
              status: "Testing",
            },
            {
              model: "match-legacy",
              algorithm: "Heuristic",
              latency: "30",
              accuracy: "85%",
              status: "Disabled",
            },
            {
              model: "match-experimental",
              algorithm: "Hybrid",
              latency: "70",
              accuracy: "97%",
              status: "Testing",
            },
          ],
        },
        demand: {
          title: "Demand Prediction",
          description: "Forecast models and outputs for demand prediction.",
          primaryField: "model",
          fields: [
            { name: "model", label: "Model", type: "text" },
            { name: "prediction_window", label: "Window", type: "text" },
            { name: "confidence", label: "Confidence", type: "text" },
            { name: "region", label: "Region", type: "text" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Planned", "Offline"],
            },
          ],
          initialRecords: [
            {
              model: "demand-v1",
              prediction_window: "30min",
              confidence: "0.85",
              region: "Bangalore",
              status: "Active",
            },
            {
              model: "demand-v2",
              prediction_window: "1hr",
              confidence: "0.78",
              region: "Mumbai",
              status: "Planned",
            },
            {
              model: "demand-eu",
              prediction_window: "1hr",
              confidence: "0.81",
              region: "Berlin",
              status: "Active",
            },
            {
              model: "demand-test",
              prediction_window: "15min",
              confidence: "0.60",
              region: "Test",
              status: "Offline",
            },
          ],
        },
        fraud: {
          title: "Fraud Detection",
          description: "Alert runs, detection thresholds and flagged items.",
          primaryField: "run_id",
          fields: [
            { name: "run_id", label: "Run ID", type: "text" },
            { name: "alerts", label: "Alerts", type: "number" },
            { name: "suspicious_trips", label: "Suspicious Trips", type: "number" },
            { name: "precision", label: "Precision", type: "text" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Finished", "Running", "Failed"],
            },
          ],
          initialRecords: [
            {
              run_id: "FR-20260710-1",
              alerts: "12",
              suspicious_trips: "5",
              precision: "0.92",
              status: "Finished",
            },
            {
              run_id: "FR-20260709-2",
              alerts: "8",
              suspicious_trips: "3",
              precision: "0.89",
              status: "Finished",
            },
            {
              run_id: "FR-20260708-1",
              alerts: "0",
              suspicious_trips: "0",
              precision: "-",
              status: "Failed",
            },
            {
              run_id: "FR-20260707-5",
              alerts: "4",
              suspicious_trips: "2",
              precision: "0.95",
              status: "Running",
            },
          ],
        },
        heatmaps: {
          title: "Heat Maps",
          description: "Geospatial density maps for demand and supply.",
          primaryField: "map_id",
          fields: [
            { name: "map_id", label: "Map ID", type: "text" },
            { name: "area", label: "Area", type: "text" },
            { name: "density", label: "Density", type: "text" },
            { name: "period", label: "Period", type: "text" },
            { name: "notes", label: "Notes", type: "textarea" },
          ],
          initialRecords: [
            {
              map_id: "HM-001",
              area: "Central Bangalore",
              density: "High",
              period: "Morning",
              notes: "Peak pickup zones",
            },
            {
              map_id: "HM-002",
              area: "Airport",
              density: "Medium",
              period: "Evening",
              notes: "Higher demand late nights",
            },
            {
              map_id: "HM-003",
              area: "University district",
              density: "Low",
              period: "Afternoon",
              notes: "Weekday patterns",
            },
            {
              map_id: "HM-004",
              area: "Mall area",
              density: "High",
              period: "Weekend",
              notes: "Event-driven spikes",
            },
          ],
        },
        bi: {
          title: "Business Intelligence",
          description: "Dashboards, refresh cadence and ownership for BI assets.",
          primaryField: "report",
          fields: [
            { name: "report", label: "Report", type: "text" },
            { name: "dashboard", label: "Dashboard", type: "text" },
            { name: "last_refresh", label: "Last Refresh", type: "text" },
            { name: "owner", label: "Owner", type: "text" },
            { name: "status", label: "Status", type: "select", options: ["Active", "Deprecated"] },
          ],
          initialRecords: [
            {
              report: "Weekly Ops",
              dashboard: "Ops Overview",
              last_refresh: "2026-07-10T02:00Z",
              owner: "Analytics Team",
              status: "Active",
            },
            {
              report: "Revenue Snapshot",
              dashboard: "Revenue",
              last_refresh: "2026-07-10T01:00Z",
              owner: "Finance",
              status: "Active",
            },
            {
              report: "Driver Performance",
              dashboard: "Drivers",
              last_refresh: "2026-07-09T23:00Z",
              owner: "HR",
              status: "Active",
            },
            {
              report: "Fraud Summary",
              dashboard: "Security",
              last_refresh: "2026-07-10T03:00Z",
              owner: "Security Ops",
              status: "Active",
            },
          ],
        },
        ml: {
          title: "Machine Learning",
          description: "Experiments, models and metrics for ML workflows.",
          primaryField: "experiment",
          fields: [
            { name: "experiment", label: "Experiment", type: "text" },
            { name: "model", label: "Model", type: "text" },
            { name: "version", label: "Version", type: "text" },
            { name: "metrics", label: "Metrics", type: "text" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Completed", "Running", "Failed"],
            },
          ],
          initialRecords: [
            {
              experiment: "Exp-2026-07-01",
              model: "demand-v2",
              version: "v2.1",
              metrics: "RMSE:1.2",
              status: "Completed",
            },
            {
              experiment: "Exp-2026-06-15",
              model: "match-v2",
              version: "v1.3",
              metrics: "AUC:0.92",
              status: "Completed",
            },
            {
              experiment: "Exp-2026-05-03",
              model: "fraud-v1",
              version: "v1.0",
              metrics: "Precision:0.89",
              status: "Completed",
            },
            {
              experiment: "Exp-2026-07-08",
              model: "demand-test",
              version: "v0.1",
              metrics: "RMSE:2.5",
              status: "Running",
            },
          ],
        },
        incentives: {
          title: "Driver Incentive Engine",
          description: "Schemes, budgets and eligibility rules for driver incentives.",
          primaryField: "engine_id",
          fields: [
            { name: "engine_id", label: "Engine ID", type: "text" },
            { name: "scheme", label: "Scheme", type: "text" },
            { name: "criteria", label: "Criteria", type: "text" },
            { name: "budget", label: "Budget", type: "text" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Paused", "Completed"],
            },
          ],
          initialRecords: [
            {
              engine_id: "INC-001",
              scheme: "Weekly Bonus",
              criteria: ">30 trips",
              budget: "₹2,00,000",
              status: "Active",
            },
            {
              engine_id: "INC-002",
              scheme: "Night Surge",
              criteria: "Night shift >40% acceptance",
              budget: "₹1,00,000",
              status: "Active",
            },
            {
              engine_id: "INC-003",
              scheme: "Referral",
              criteria: "Refer 3 drivers",
              budget: "₹50,000",
              status: "Paused",
            },
            {
              engine_id: "INC-004",
              scheme: "Quality Bonus",
              criteria: "Avg rating >4.8",
              budget: "₹80,000",
              status: "Active",
            },
          ],
        },
      };
      const key = child || "matching";
      return aiTemplates[key] || aiTemplates.matching;
    }
    case "integrations": {
      const integrationsTemplates: Record<string, ModuleTemplate> = {
        payments: {
          title: "Payment Gateway",
          description: "Configure payment processors and merchant accounts.",
          primaryField: "gateway",
          fields: [
            { name: "gateway", label: "Gateway", type: "text" },
            { name: "merchant_id", label: "Merchant ID", type: "text" },
            { name: "status", label: "Status", type: "select", options: ["Active", "Disabled"] },
            { name: "fee", label: "Fee", type: "text" },
            { name: "notes", label: "Notes", type: "textarea" },
          ],
          initialRecords: [
            {
              gateway: "Stripe",
              merchant_id: "acct_001",
              status: "Active",
              fee: "2.9% + 30¢",
              notes: "Primary gateway",
            },
            {
              gateway: "Razorpay",
              merchant_id: "rp_123",
              status: "Active",
              fee: "2% + 3₹",
              notes: "India gateway",
            },
            {
              gateway: "Paytm",
              merchant_id: "ptm_45",
              status: "Disabled",
              fee: "3%",
              notes: "Legacy",
            },
            { gateway: "Mock", merchant_id: "mock", status: "Disabled", fee: "0%", notes: "Test" },
          ],
        },
        maps: {
          title: "Maps API",
          description: "Map providers and API credentials.",
          primaryField: "provider",
          fields: [
            { name: "provider", label: "Provider", type: "text" },
            { name: "api_key", label: "API Key", type: "text" },
            { name: "rate_limit", label: "Rate Limit", type: "text" },
            { name: "region", label: "Region", type: "text" },
            { name: "status", label: "Status", type: "select", options: ["Active", "Disabled"] },
          ],
          initialRecords: [
            {
              provider: "Google Maps",
              api_key: "",
              rate_limit: "1000/s",
              region: "Global",
              status: "Active",
            },
            {
              provider: "Mapbox",
              api_key: "",
              rate_limit: "500/s",
              region: "Global",
              status: "Active",
            },
            {
              provider: "Here",
              api_key: "",
              rate_limit: "200/s",
              region: "APAC",
              status: "Disabled",
            },
            { provider: "Mock", api_key: "", rate_limit: "", region: "", status: "Disabled" },
          ],
        },
        sms: {
          title: "SMS Gateway",
          description: "SMS provider configuration used for OTP and notifications.",
          primaryField: "provider",
          fields: [
            { name: "provider", label: "Provider", type: "text" },
            { name: "sender_id", label: "Sender ID", type: "text" },
            { name: "status", label: "Status", type: "select", options: ["Active", "Disabled"] },
            { name: "throughput", label: "Throughput", type: "text" },
            { name: "notes", label: "Notes", type: "textarea" },
          ],
          initialRecords: [
            {
              provider: "Twilio",
              sender_id: "SORAOTP",
              status: "Active",
              throughput: "200/s",
              notes: "Primary SMS",
            },
            {
              provider: "Msg91",
              sender_id: "SORA",
              status: "Active",
              throughput: "100/s",
              notes: "India provider",
            },
            {
              provider: "Nexmo",
              sender_id: "SORA",
              status: "Disabled",
              throughput: "",
              notes: "Legacy",
            },
            { provider: "Mock", sender_id: "", status: "Disabled", throughput: "", notes: "Test" },
          ],
        },
        email: {
          title: "Email Service",
          description: "Third-party transactional email providers.",
          primaryField: "provider",
          fields: [
            { name: "provider", label: "Provider", type: "text" },
            { name: "from_address", label: "From Address", type: "text" },
            { name: "status", label: "Status", type: "select", options: ["Active", "Disabled"] },
            { name: "throughput", label: "Throughput", type: "text" },
            { name: "notes", label: "Notes", type: "textarea" },
          ],
          initialRecords: [
            {
              provider: "SendGrid",
              from_address: "noreply@sora.com",
              status: "Active",
              throughput: "1000/min",
              notes: "Transactional",
            },
            {
              provider: "Mailgun",
              from_address: "alerts@sora.com",
              status: "Active",
              throughput: "500/min",
              notes: "Fallback",
            },
            {
              provider: "Mock",
              from_address: "",
              status: "Disabled",
              throughput: "",
              notes: "Test",
            },
            { provider: "", from_address: "", status: "Disabled", throughput: "", notes: "" },
          ],
        },
        analytics: {
          title: "Analytics",
          description: "Analytics integrations and properties.",
          primaryField: "provider",
          fields: [
            { name: "provider", label: "Provider", type: "text" },
            { name: "property", label: "Property", type: "text" },
            { name: "data_retention", label: "Retention", type: "text" },
            { name: "status", label: "Status", type: "select", options: ["Active", "Disabled"] },
            { name: "notes", label: "Notes", type: "textarea" },
          ],
          initialRecords: [
            {
              provider: "GA4",
              property: "G-XXXX",
              data_retention: "14 months",
              status: "Active",
              notes: "Web + App",
            },
            {
              provider: "Mixpanel",
              property: "SORA",
              data_retention: "6 months",
              status: "Active",
              notes: "Product analytics",
            },
            {
              provider: "Amplitude",
              property: "",
              data_retention: "",
              status: "Disabled",
              notes: "",
            },
            { provider: "", property: "", data_retention: "", status: "Disabled", notes: "" },
          ],
        },
        "iot-lock": {
          title: "IoT Smart Lock API",
          description: "Integration configuration for smart locks used in bike rentals.",
          primaryField: "device_provider",
          fields: [
            { name: "device_provider", label: "Device Provider", type: "text" },
            { name: "device_model", label: "Device Model", type: "text" },
            { name: "status", label: "Status", type: "select", options: ["Active", "Disabled"] },
            { name: "last_sync", label: "Last Sync", type: "text" },
            { name: "notes", label: "Notes", type: "textarea" },
          ],
          initialRecords: [
            {
              device_provider: "LockCo",
              device_model: "LC-100",
              status: "Active",
              last_sync: "2026-07-10T09:00Z",
              notes: "Deployed on fleet",
            },
            {
              device_provider: "SmartLockX",
              device_model: "SLX-200",
              status: "Active",
              last_sync: "2026-07-09T18:00Z",
              notes: "Test site",
            },
            {
              device_provider: "Mock",
              device_model: "MOCK-1",
              status: "Disabled",
              last_sync: "",
              notes: "",
            },
            { device_provider: "", device_model: "", status: "Disabled", last_sync: "", notes: "" },
          ],
        },
      };
      const key = child || "payments";
      return integrationsTemplates[key] || integrationsTemplates.payments;
    }
    case "subscription": {
      const subscriptionTemplates: Record<string, ModuleTemplate> = {
        plans: {
          title: "Plans",
          description: "Subscription plans available to customers.",
          primaryField: "plan_id",
          fields: [
            { name: "plan_id", label: "Plan ID", type: "text" },
            { name: "name", label: "Name", type: "text" },
            { name: "price", label: "Price", type: "text" },
            { name: "cycle", label: "Cycle", type: "text" },
            { name: "status", label: "Status", type: "select", options: ["Active", "Disabled"] },
          ],
          initialRecords: [
            {
              plan_id: "PLAN-01",
              name: "Basic",
              price: "₹199",
              cycle: "Monthly",
              status: "Active",
            },
            { plan_id: "PLAN-02", name: "Pro", price: "₹499", cycle: "Monthly", status: "Active" },
            {
              plan_id: "PLAN-03",
              name: "Enterprise",
              price: "Contact",
              cycle: "Annual",
              status: "Active",
            },
            { plan_id: "PLAN-04", name: "Trial", price: "0", cycle: "14 days", status: "Disabled" },
          ],
        },
        billing: {
          title: "Billing",
          description: "Billing records and adjustments.",
          primaryField: "bill_id",
          fields: [
            { name: "bill_id", label: "Bill ID", type: "text" },
            { name: "customer_id", label: "Customer ID", type: "text" },
            { name: "amount", label: "Amount", type: "text" },
            { name: "due_date", label: "Due Date", type: "date" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Paid", "Pending", "Overdue"],
            },
          ],
          initialRecords: [
            {
              bill_id: "BILL-1001",
              customer_id: "CUST-101",
              amount: "₹199",
              due_date: "2026-08-01",
              status: "Pending",
            },
            {
              bill_id: "BILL-1002",
              customer_id: "CUST-102",
              amount: "₹499",
              due_date: "2026-07-25",
              status: "Paid",
            },
            {
              bill_id: "BILL-1003",
              customer_id: "CUST-103",
              amount: "₹0",
              due_date: "2026-07-15",
              status: "Overdue",
            },
            {
              bill_id: "BILL-1004",
              customer_id: "CUST-104",
              amount: "₹199",
              due_date: "2026-07-30",
              status: "Pending",
            },
          ],
        },
        invoices: {
          title: "Invoices",
          description: "Invoice generation and tracking.",
          primaryField: "invoice_id",
          fields: [
            { name: "invoice_id", label: "Invoice ID", type: "text" },
            { name: "customer_id", label: "Customer ID", type: "text" },
            { name: "amount", label: "Amount", type: "text" },
            { name: "issued_on", label: "Issued On", type: "date" },
            { name: "status", label: "Status", type: "select", options: ["Paid", "Unpaid"] },
          ],
          initialRecords: [
            {
              invoice_id: "INV-1001",
              customer_id: "CUST-101",
              amount: "₹199",
              issued_on: "2026-07-01",
              status: "Paid",
            },
            {
              invoice_id: "INV-1002",
              customer_id: "CUST-102",
              amount: "₹499",
              issued_on: "2026-07-05",
              status: "Paid",
            },
            {
              invoice_id: "INV-1003",
              customer_id: "CUST-103",
              amount: "₹199",
              issued_on: "2026-06-20",
              status: "Unpaid",
            },
            {
              invoice_id: "INV-1004",
              customer_id: "CUST-104",
              amount: "₹0",
              issued_on: "2026-07-07",
              status: "Paid",
            },
          ],
        },
        renewals: {
          title: "Renewals",
          description: "Subscription renewal schedules and status.",
          primaryField: "renewal_id",
          fields: [
            { name: "renewal_id", label: "Renewal ID", type: "text" },
            { name: "subscription_id", label: "Subscription ID", type: "text" },
            { name: "renewal_date", label: "Renewal Date", type: "date" },
            { name: "amount", label: "Amount", type: "text" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Scheduled", "Completed", "Failed"],
            },
          ],
          initialRecords: [
            {
              renewal_id: "RN-1001",
              subscription_id: "SUB-101",
              renewal_date: "2026-08-01",
              amount: "₹199",
              status: "Scheduled",
            },
            {
              renewal_id: "RN-1002",
              subscription_id: "SUB-102",
              renewal_date: "2026-07-20",
              amount: "₹499",
              status: "Completed",
            },
            {
              renewal_id: "RN-1003",
              subscription_id: "SUB-103",
              renewal_date: "2026-07-15",
              amount: "₹199",
              status: "Failed",
            },
            {
              renewal_id: "RN-1004",
              subscription_id: "SUB-104",
              renewal_date: "2026-09-01",
              amount: "₹199",
              status: "Scheduled",
            },
          ],
        },
        payments: {
          title: "Payments",
          description: "Record of payments against invoices and subscriptions.",
          primaryField: "payment_id",
          fields: [
            { name: "payment_id", label: "Payment ID", type: "text" },
            { name: "invoice_id", label: "Invoice ID", type: "text" },
            { name: "amount", label: "Amount", type: "text" },
            { name: "method", label: "Method", type: "text" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Completed", "Pending", "Failed"],
            },
          ],
          initialRecords: [
            {
              payment_id: "PMT-1001",
              invoice_id: "INV-1001",
              amount: "₹199",
              method: "Card",
              status: "Completed",
            },
            {
              payment_id: "PMT-1002",
              invoice_id: "INV-1002",
              amount: "₹499",
              method: "UPI",
              status: "Completed",
            },
            {
              payment_id: "PMT-1003",
              invoice_id: "INV-1003",
              amount: "₹199",
              method: "Netbanking",
              status: "Failed",
            },
            {
              payment_id: "PMT-1004",
              invoice_id: "INV-1004",
              amount: "₹0",
              method: "Promo",
              status: "Completed",
            },
          ],
        },
      };
      const key = child || "plans";
      return subscriptionTemplates[key] || subscriptionTemplates.plans;
    }
    case "legal": {
      const legalTemplates: Record<string, ModuleTemplate> = {
        kyc: {
          title: "KYC Records",
          description: "KYC entries for customers, drivers, and partners.",
          primaryField: "kyc_id",
          fields: [
            { name: "kyc_id", label: "KYC ID", type: "text" },
            { name: "entity", label: "Entity", type: "text" },
            { name: "document_type", label: "Document Type", type: "text" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Verified", "Pending", "Rejected"],
            },
            { name: "verified_on", label: "Verified On", type: "date" },
          ],
          initialRecords: [
            {
              kyc_id: "KYC-1001",
              entity: "Driver SORA-DRV-101",
              document_type: "Aadhar",
              status: "Verified",
              verified_on: "2026-06-15",
            },
            {
              kyc_id: "KYC-1002",
              entity: "Customer CUST-101",
              document_type: "Passport",
              status: "Pending",
              verified_on: "",
            },
            {
              kyc_id: "KYC-1003",
              entity: "Driver SORA-DRV-102",
              document_type: "PAN",
              status: "Verified",
              verified_on: "2026-05-20",
            },
            {
              kyc_id: "KYC-1004",
              entity: "Partner P-201",
              document_type: "Business ID",
              status: "Rejected",
              verified_on: "2026-04-12",
            },
          ],
        },
        "driver-verify": {
          title: "Driver Verification",
          description: "Manual and automated verification attempts for drivers.",
          primaryField: "verification_id",
          fields: [
            { name: "verification_id", label: "Verification ID", type: "text" },
            { name: "driver_id", label: "Driver ID", type: "text" },
            { name: "verifier", label: "Verifier", type: "text" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Passed", "Failed", "Pending"],
            },
            { name: "notes", label: "Notes", type: "textarea" },
          ],
          initialRecords: [
            {
              verification_id: "DV-1001",
              driver_id: "SORA-DRV-101",
              verifier: "Agent A",
              status: "Passed",
              notes: "All good",
            },
            {
              verification_id: "DV-1002",
              driver_id: "SORA-DRV-102",
              verifier: "Agent B",
              status: "Pending",
              notes: "Awaiting documents",
            },
            {
              verification_id: "DV-1003",
              driver_id: "SORA-DRV-103",
              verifier: "Agent A",
              status: "Failed",
              notes: "Mismatch in name",
            },
            {
              verification_id: "DV-1004",
              driver_id: "SORA-DRV-104",
              verifier: "Agent C",
              status: "Passed",
              notes: "Verified",
            },
          ],
        },
        "vehicle-verify": {
          title: "Vehicle Verification",
          description: "Verification records for vehicle documents and compliance.",
          primaryField: "verification_id",
          fields: [
            { name: "verification_id", label: "Verification ID", type: "text" },
            { name: "vehicle_id", label: "Vehicle ID", type: "text" },
            { name: "inspector", label: "Inspector", type: "text" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Passed", "Failed", "Pending"],
            },
            { name: "expiry", label: "Expiry", type: "date" },
          ],
          initialRecords: [
            {
              verification_id: "VV-1001",
              vehicle_id: "VEH-101",
              inspector: "Inspector 1",
              status: "Passed",
              expiry: "2027-01-01",
            },
            {
              verification_id: "VV-1002",
              vehicle_id: "VEH-102",
              inspector: "Inspector 2",
              status: "Pending",
              expiry: "",
            },
            {
              verification_id: "VV-1003",
              vehicle_id: "VEH-103",
              inspector: "Inspector 1",
              status: "Failed",
              expiry: "",
            },
            {
              verification_id: "VV-1004",
              vehicle_id: "VEH-104",
              inspector: "Inspector 3",
              status: "Passed",
              expiry: "2026-12-12",
            },
          ],
        },
        insurance: {
          title: "Insurance",
          description: "Insurance policies, expiry and provider details.",
          primaryField: "policy_id",
          fields: [
            { name: "policy_id", label: "Policy ID", type: "text" },
            { name: "vehicle_id", label: "Vehicle ID", type: "text" },
            { name: "provider", label: "Provider", type: "text" },
            { name: "expiry_date", label: "Expiry Date", type: "date" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Expired", "Claimed"],
            },
          ],
          initialRecords: [
            {
              policy_id: "POL-1001",
              vehicle_id: "VEH-101",
              provider: "ICICI",
              expiry_date: "2027-03-01",
              status: "Active",
            },
            {
              policy_id: "POL-1002",
              vehicle_id: "VEH-102",
              provider: "Bajaj",
              expiry_date: "2026-08-15",
              status: "Active",
            },
            {
              policy_id: "POL-1003",
              vehicle_id: "VEH-103",
              provider: "HDFC",
              expiry_date: "2025-11-30",
              status: "Expired",
            },
            {
              policy_id: "POL-1004",
              vehicle_id: "VEH-104",
              provider: "Reliance",
              expiry_date: "2028-01-10",
              status: "Active",
            },
          ],
        },
        contracts: {
          title: "Contracts",
          description: "Signed contracts with partners and vendors.",
          primaryField: "contract_id",
          fields: [
            { name: "contract_id", label: "Contract ID", type: "text" },
            { name: "party", label: "Party", type: "text" },
            { name: "start_date", label: "Start Date", type: "date" },
            { name: "end_date", label: "End Date", type: "date" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Expired", "Terminated"],
            },
          ],
          initialRecords: [
            {
              contract_id: "CTR-1001",
              party: "FleetCo",
              start_date: "2025-01-01",
              end_date: "2027-01-01",
              status: "Active",
            },
            {
              contract_id: "CTR-1002",
              party: "InsuranceCo",
              start_date: "2024-06-01",
              end_date: "2026-06-01",
              status: "Expired",
            },
            {
              contract_id: "CTR-1003",
              party: "LockCo",
              start_date: "2026-02-01",
              end_date: "2028-02-01",
              status: "Active",
            },
            {
              contract_id: "CTR-1004",
              party: "MapsCo",
              start_date: "2026-05-01",
              end_date: "2027-05-01",
              status: "Active",
            },
          ],
        },
        licenses: {
          title: "Licenses",
          description: "Licenses issued to drivers and vehicles.",
          primaryField: "license_id",
          fields: [
            { name: "license_id", label: "License ID", type: "text" },
            { name: "license_type", label: "Type", type: "text" },
            { name: "holder", label: "Holder", type: "text" },
            { name: "expiry_date", label: "Expiry Date", type: "date" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Valid", "Expired", "Suspended"],
            },
          ],
          initialRecords: [
            {
              license_id: "LIC-1001",
              license_type: "DL",
              holder: "Ravi Kumar",
              expiry_date: "2028-05-01",
              status: "Valid",
            },
            {
              license_id: "LIC-1002",
              license_type: "RC",
              holder: "VEH-102",
              expiry_date: "2026-09-12",
              status: "Valid",
            },
            {
              license_id: "LIC-1003",
              license_type: "DL",
              holder: "Sana Iqbal",
              expiry_date: "2025-11-20",
              status: "Expired",
            },
            {
              license_id: "LIC-1004",
              license_type: "PUC",
              holder: "VEH-104",
              expiry_date: "2026-12-01",
              status: "Valid",
            },
          ],
        },
        incidents: {
          title: "Incident Records",
          description: "Logged incidents, accidents and investigations.",
          primaryField: "incident_id",
          fields: [
            { name: "incident_id", label: "Incident ID", type: "text" },
            { name: "date", label: "Date", type: "date" },
            { name: "type", label: "Type", type: "text" },
            {
              name: "severity",
              label: "Severity",
              type: "select",
              options: ["Low", "Medium", "High"],
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Open", "Investigating", "Closed"],
            },
          ],
          initialRecords: [
            {
              incident_id: "INC-1001",
              date: "2026-07-08",
              type: "Accident",
              severity: "High",
              status: "Investigating",
            },
            {
              incident_id: "INC-1002",
              date: "2026-06-20",
              type: "Complaint",
              severity: "Low",
              status: "Closed",
            },
            {
              incident_id: "INC-1003",
              date: "2026-05-14",
              type: "Theft",
              severity: "High",
              status: "Open",
            },
            {
              incident_id: "INC-1004",
              date: "2026-07-01",
              type: "Damage",
              severity: "Medium",
              status: "Closed",
            },
          ],
        },
      };
      const key = child || "kyc";
      return legalTemplates[key] || legalTemplates.kyc;
    }
    case "rides": {
      const rideTemplates: Record<string, ModuleTemplate> = {
        booking: {
          title: "Ride Booking",
          description: "Capture ride requests and passenger details.",
          primaryField: "ride_id",
          fields: [
            { name: "ride_id", label: "Ride ID", type: "text", placeholder: "RIDE-1001" },
            { name: "passenger", label: "Passenger", type: "text", placeholder: "Priya S" },
            { name: "route", label: "Route", type: "text", placeholder: "HSR to MG Road" },
            { name: "fare", label: "Fare", type: "number", placeholder: "240" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Scheduled", "In progress", "Completed"],
            },
            {
              name: "notes",
              label: "Notes",
              type: "textarea",
              placeholder: "Special instructions and rider notes",
            },
          ],
          initialRecords: [
            {
              ride_id: "RIDE-1001",
              passenger: "Priya S",
              route: "HSR to MG Road",
              fare: "240",
              status: "Scheduled",
              notes: "Wheelchair assistance",
            },
            {
              ride_id: "RIDE-1002",
              passenger: "Amit K",
              route: "MG Road to Koramangala",
              fare: "180",
              status: "In progress",
              notes: "High-priority",
            },
            {
              ride_id: "RIDE-1003",
              passenger: "Sneha R",
              route: "Whitefield to Sarjapur",
              fare: "260",
              status: "Completed",
              notes: "No issues",
            },
            {
              ride_id: "RIDE-1004",
              passenger: "Rohan T",
              route: "Airport to City",
              fare: "520",
              status: "Scheduled",
              notes: "Requires luggage space",
            },
          ],
        },
        matching: {
          title: "Ride Matching",
          description: "Assign drivers and vehicles to incoming ride requests.",
          primaryField: "match_id",
          fields: [
            { name: "match_id", label: "Match ID", type: "text", placeholder: "MATCH-2001" },
            { name: "ride_id", label: "Ride ID", type: "text", placeholder: "RIDE-1001" },
            { name: "driver_id", label: "Driver ID", type: "text", placeholder: "SORA-DRV-101" },
            { name: "vehicle_id", label: "Vehicle ID", type: "text", placeholder: "KA-01-AB-1234" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Matched", "Pending", "Failed"],
            },
          ],
          initialRecords: [
            {
              match_id: "MATCH-2001",
              ride_id: "RIDE-1001",
              driver_id: "SORA-DRV-101",
              vehicle_id: "KA-01-AB-1234",
              status: "Matched",
            },
            {
              match_id: "MATCH-2002",
              ride_id: "RIDE-1002",
              driver_id: "SORA-DRV-102",
              vehicle_id: "KA-02-CD-5678",
              status: "Matched",
            },
            {
              match_id: "MATCH-2003",
              ride_id: "RIDE-1003",
              driver_id: "SORA-DRV-103",
              vehicle_id: "KA-03-EF-9012",
              status: "Pending",
            },
            {
              match_id: "MATCH-2004",
              ride_id: "RIDE-1004",
              driver_id: "SORA-DRV-104",
              vehicle_id: "KA-04-GH-3456",
              status: "Matched",
            },
          ],
        },
        dispatch: {
          title: "Dispatch",
          description: "Track dispatch status for drivers and rides.",
          primaryField: "dispatch_id",
          fields: [
            { name: "dispatch_id", label: "Dispatch ID", type: "text", placeholder: "DISP-3001" },
            { name: "ride_id", label: "Ride ID", type: "text", placeholder: "RIDE-1001" },
            { name: "driver_id", label: "Driver ID", type: "text", placeholder: "SORA-DRV-101" },
            { name: "eta", label: "ETA", type: "text", placeholder: "08:35 AM" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Dispatched", "On Route", "Delivered"],
            },
          ],
          initialRecords: [
            {
              dispatch_id: "DISP-3001",
              ride_id: "RIDE-1001",
              driver_id: "SORA-DRV-101",
              eta: "08:35 AM",
              status: "Dispatched",
            },
            {
              dispatch_id: "DISP-3002",
              ride_id: "RIDE-1002",
              driver_id: "SORA-DRV-102",
              eta: "09:10 AM",
              status: "On Route",
            },
            {
              dispatch_id: "DISP-3003",
              ride_id: "RIDE-1003",
              driver_id: "SORA-DRV-103",
              eta: "07:40 AM",
              status: "Delivered",
            },
            {
              dispatch_id: "DISP-3004",
              ride_id: "RIDE-1004",
              driver_id: "SORA-DRV-104",
              eta: "08:55 AM",
              status: "Dispatched",
            },
          ],
        },
        tracking: {
          title: "Trip Tracking",
          description: "Monitor trip location and progress in real time.",
          primaryField: "trip_id",
          fields: [
            { name: "trip_id", label: "Trip ID", type: "text", placeholder: "TRIP-4001" },
            { name: "ride_id", label: "Ride ID", type: "text", placeholder: "RIDE-1001" },
            { name: "driver_id", label: "Driver ID", type: "text", placeholder: "SORA-DRV-101" },
            {
              name: "current_location",
              label: "Current Location",
              type: "text",
              placeholder: "MG Road",
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Ongoing", "Completed", "Paused"],
            },
          ],
          initialRecords: [
            {
              trip_id: "TRIP-4001",
              ride_id: "RIDE-1001",
              driver_id: "SORA-DRV-101",
              current_location: "MG Road",
              status: "Ongoing",
            },
            {
              trip_id: "TRIP-4002",
              ride_id: "RIDE-1002",
              driver_id: "SORA-DRV-102",
              current_location: "Whitefield",
              status: "Paused",
            },
            {
              trip_id: "TRIP-4003",
              ride_id: "RIDE-1003",
              driver_id: "SORA-DRV-103",
              current_location: "Koramangala",
              status: "Completed",
            },
            {
              trip_id: "TRIP-4004",
              ride_id: "RIDE-1004",
              driver_id: "SORA-DRV-104",
              current_location: "Airport",
              status: "Ongoing",
            },
          ],
        },
        cancellation: {
          title: "Ride Cancellation",
          description: "Capture cancellations and the reasons behind them.",
          primaryField: "cancel_id",
          fields: [
            { name: "cancel_id", label: "Cancellation ID", type: "text", placeholder: "CANC-5001" },
            { name: "ride_id", label: "Ride ID", type: "text", placeholder: "RIDE-1001" },
            { name: "passenger", label: "Passenger", type: "text", placeholder: "Priya S" },
            { name: "reason", label: "Reason", type: "textarea", placeholder: "Passenger no-show" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Cancelled", "Refunded", "No-show"],
            },
          ],
          initialRecords: [
            {
              cancel_id: "CANC-5001",
              ride_id: "RIDE-1002",
              passenger: "Amit K",
              reason: "Driver delayed",
              status: "Refunded",
            },
            {
              cancel_id: "CANC-5002",
              ride_id: "RIDE-1005",
              passenger: "Nisha M",
              reason: "Passenger no-show",
              status: "Cancelled",
            },
            {
              cancel_id: "CANC-5003",
              ride_id: "RIDE-1006",
              passenger: "Saira L",
              reason: "Route changed",
              status: "No-show",
            },
            {
              cancel_id: "CANC-5004",
              ride_id: "RIDE-1007",
              passenger: "Rahul P",
              reason: "Vehicle issue",
              status: "Refunded",
            },
          ],
        },
        history: {
          title: "Trip History",
          description: "Review completed trips and ride summaries.",
          primaryField: "trip_id",
          fields: [
            { name: "trip_id", label: "Trip ID", type: "text", placeholder: "TRIP-4001" },
            { name: "ride_id", label: "Ride ID", type: "text", placeholder: "RIDE-1001" },
            { name: "date", label: "Date", type: "date" },
            { name: "driver_id", label: "Driver ID", type: "text", placeholder: "SORA-DRV-101" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Completed", "Cancelled"],
            },
          ],
          initialRecords: [
            {
              trip_id: "TRIP-4001",
              ride_id: "RIDE-1001",
              date: "2026-07-01",
              driver_id: "SORA-DRV-101",
              status: "Completed",
            },
            {
              trip_id: "TRIP-4002",
              ride_id: "RIDE-1003",
              date: "2026-07-02",
              driver_id: "SORA-DRV-103",
              status: "Completed",
            },
            {
              trip_id: "TRIP-4003",
              ride_id: "RIDE-1008",
              date: "2026-07-03",
              driver_id: "SORA-DRV-105",
              status: "Completed",
            },
            {
              trip_id: "TRIP-4004",
              ride_id: "RIDE-1004",
              date: "2026-07-04",
              driver_id: "SORA-DRV-104",
              status: "Completed",
            },
          ],
        },
      };
      const key = child || "booking";
      return rideTemplates[key] || rideTemplates.booking;
    }
    case "gps": {
      const gpsTemplates: Record<string, ModuleTemplate> = {
        live: {
          title: "Live Tracking",
          description: "Track live vehicle locations and speed for active rides.",
          primaryField: "device_id",
          fields: [
            { name: "device_id", label: "Device ID", type: "text", placeholder: "GPS-2001" },
            { name: "ride_id", label: "Ride ID", type: "text", placeholder: "RIDE-1001" },
            { name: "driver_id", label: "Driver ID", type: "text", placeholder: "SORA-DRV-101" },
            { name: "latitude", label: "Latitude", type: "text", placeholder: "12.9716" },
            { name: "longitude", label: "Longitude", type: "text", placeholder: "77.5946" },
            { name: "speed", label: "Speed (km/h)", type: "number", placeholder: "35" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Stopped", "Offline"],
            },
          ],
          initialRecords: [
            {
              device_id: "GPS-2001",
              ride_id: "RIDE-1001",
              driver_id: "SORA-DRV-101",
              latitude: "12.9716",
              longitude: "77.5946",
              speed: "34",
              status: "Active",
            },
            {
              device_id: "GPS-2002",
              ride_id: "RIDE-1002",
              driver_id: "SORA-DRV-102",
              latitude: "12.9352",
              longitude: "77.6245",
              speed: "28",
              status: "Active",
            },
            {
              device_id: "GPS-2003",
              ride_id: "RIDE-1003",
              driver_id: "SORA-DRV-103",
              latitude: "12.9141",
              longitude: "77.5728",
              speed: "0",
              status: "Stopped",
            },
            {
              device_id: "GPS-2004",
              ride_id: "RIDE-1004",
              driver_id: "SORA-DRV-104",
              latitude: "12.9864",
              longitude: "77.7071",
              speed: "42",
              status: "Active",
            },
          ],
        },
        eta: {
          title: "ETA",
          description: "Estimate arrival times for ride pickups and drop-offs.",
          primaryField: "eta_id",
          fields: [
            { name: "eta_id", label: "ETA ID", type: "text", placeholder: "ETA-3001" },
            { name: "ride_id", label: "Ride ID", type: "text", placeholder: "RIDE-1001" },
            { name: "driver_id", label: "Driver ID", type: "text", placeholder: "SORA-DRV-101" },
            { name: "pickup_time", label: "Pickup Time", type: "text", placeholder: "08:30 AM" },
            {
              name: "expected_arrival",
              label: "Expected Arrival",
              type: "text",
              placeholder: "08:55 AM",
            },
            {
              name: "eta_status",
              label: "ETA Status",
              type: "select",
              options: ["On time", "Delayed", "Arrived"],
            },
          ],
          initialRecords: [
            {
              eta_id: "ETA-3001",
              ride_id: "RIDE-1001",
              driver_id: "SORA-DRV-101",
              pickup_time: "08:00 AM",
              expected_arrival: "08:25 AM",
              eta_status: "On time",
            },
            {
              eta_id: "ETA-3002",
              ride_id: "RIDE-1002",
              driver_id: "SORA-DRV-102",
              pickup_time: "08:15 AM",
              expected_arrival: "08:40 AM",
              eta_status: "Delayed",
            },
            {
              eta_id: "ETA-3003",
              ride_id: "RIDE-1003",
              driver_id: "SORA-DRV-103",
              pickup_time: "09:00 AM",
              expected_arrival: "09:20 AM",
              eta_status: "On time",
            },
            {
              eta_id: "ETA-3004",
              ride_id: "RIDE-1004",
              driver_id: "SORA-DRV-104",
              pickup_time: "09:30 AM",
              expected_arrival: "09:55 AM",
              eta_status: "On time",
            },
          ],
        },
        routes: {
          title: "Route Optimization",
          description: "Manage optimized routes for efficient trip planning.",
          primaryField: "route_id",
          fields: [
            { name: "route_id", label: "Route ID", type: "text", placeholder: "RT-4001" },
            { name: "ride_id", label: "Ride ID", type: "text", placeholder: "RIDE-1001" },
            { name: "origin", label: "Origin", type: "text", placeholder: "HSR Layout" },
            { name: "destination", label: "Destination", type: "text", placeholder: "MG Road" },
            {
              name: "optimized_distance",
              label: "Optimized Distance",
              type: "text",
              placeholder: "16.5 km",
            },
            {
              name: "estimated_time",
              label: "Estimated Time",
              type: "text",
              placeholder: "24 min",
            },
            {
              name: "algorithm",
              label: "Algorithm",
              type: "select",
              options: ["Shortest", "Fastest", "Balanced"],
            },
          ],
          initialRecords: [
            {
              route_id: "RT-4001",
              ride_id: "RIDE-1001",
              origin: "HSR Layout",
              destination: "MG Road",
              optimized_distance: "16.5 km",
              estimated_time: "24 min",
              algorithm: "Fastest",
            },
            {
              route_id: "RT-4002",
              ride_id: "RIDE-1002",
              origin: "Koramangala",
              destination: "Whitefield",
              optimized_distance: "14.2 km",
              estimated_time: "28 min",
              algorithm: "Balanced",
            },
            {
              route_id: "RT-4003",
              ride_id: "RIDE-1003",
              origin: "Airport",
              destination: "City Center",
              optimized_distance: "35.0 km",
              estimated_time: "42 min",
              algorithm: "Shortest",
            },
            {
              route_id: "RT-4004",
              ride_id: "RIDE-1004",
              origin: "Whitefield",
              destination: "Eco Park",
              optimized_distance: "9.1 km",
              estimated_time: "18 min",
              algorithm: "Fastest",
            },
          ],
        },
        geofence: {
          title: "Geofencing",
          description: "Configure geofence zones and monitor boundary events.",
          primaryField: "geofence_id",
          fields: [
            { name: "geofence_id", label: "Geofence ID", type: "text", placeholder: "GEO-5001" },
            { name: "ride_id", label: "Ride ID", type: "text", placeholder: "RIDE-1001" },
            {
              name: "zone_name",
              label: "Zone Name",
              type: "text",
              placeholder: "Airport Perimeter",
            },
            {
              name: "type",
              label: "Zone Type",
              type: "select",
              options: ["Pickup", "Dropoff", "No-go", "Slow-down"],
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Paused", "Disabled"],
            },
            {
              name: "breach_alert",
              label: "Breach Alert",
              type: "select",
              options: ["Enabled", "Disabled"],
            },
          ],
          initialRecords: [
            {
              geofence_id: "GEO-5001",
              ride_id: "RIDE-1001",
              zone_name: "Airport Perimeter",
              type: "Pickup",
              status: "Active",
              breach_alert: "Enabled",
            },
            {
              geofence_id: "GEO-5002",
              ride_id: "RIDE-1002",
              zone_name: "MG Road Zone",
              type: "Dropoff",
              status: "Active",
              breach_alert: "Enabled",
            },
            {
              geofence_id: "GEO-5003",
              ride_id: "RIDE-1003",
              zone_name: "Business District",
              type: "Slow-down",
              status: "Active",
              breach_alert: "Enabled",
            },
            {
              geofence_id: "GEO-5004",
              ride_id: "RIDE-1004",
              zone_name: "City Center",
              type: "No-go",
              status: "Paused",
              breach_alert: "Disabled",
            },
          ],
        },
      };
      const key = child || "live";
      return gpsTemplates[key] || gpsTemplates.live;
    }
    case "pricing": {
      const pricingTemplates: Record<string, ModuleTemplate> = {
        "fare-rules": {
          title: "Fare Rules",
          description: "Configure base fare, distance pricing and rule status.",
          primaryField: "rule_id",
          fields: [
            { name: "rule_id", label: "Rule ID", type: "text", placeholder: "FR-1001" },
            { name: "name", label: "Rule Name", type: "text", placeholder: "City Standard" },
            { name: "base_fare", label: "Base Fare", type: "number", placeholder: "50" },
            { name: "per_km", label: "Per km", type: "number", placeholder: "12" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Inactive", "Draft"],
            },
            {
              name: "notes",
              label: "Notes",
              type: "textarea",
              placeholder: "Surge conditions, blocking rules",
            },
          ],
          initialRecords: [
            {
              rule_id: "FR-1001",
              name: "City Standard",
              base_fare: "50",
              per_km: "12",
              status: "Active",
              notes: "Applies within city limits",
            },
            {
              rule_id: "FR-1002",
              name: "Night Premium",
              base_fare: "70",
              per_km: "15",
              status: "Active",
              notes: "22:00 to 05:00",
            },
            {
              rule_id: "FR-1003",
              name: "Airport Flat",
              base_fare: "120",
              per_km: "10",
              status: "Draft",
              notes: "Fixed for airport pickups",
            },
            {
              rule_id: "FR-1004",
              name: "Corporate Rate",
              base_fare: "65",
              per_km: "11",
              status: "Inactive",
              notes: "For corporate partners",
            },
          ],
        },
        dynamic: {
          title: "Dynamic Pricing",
          description: "Manage surge and demand-based pricing rules.",
          primaryField: "rule_id",
          fields: [
            { name: "rule_id", label: "Rule ID", type: "text", placeholder: "DP-2001" },
            { name: "name", label: "Rule Name", type: "text", placeholder: "Peak Hour Surge" },
            {
              name: "surge_multiplier",
              label: "Surge Multiplier",
              type: "text",
              placeholder: "1.5x",
            },
            {
              name: "condition",
              label: "Condition",
              type: "text",
              placeholder: "Weekend evening demand",
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Paused", "Off"],
            },
          ],
          initialRecords: [
            {
              rule_id: "DP-2001",
              name: "Peak Hour Surge",
              surge_multiplier: "1.5x",
              condition: "Evening rush hour",
              status: "Active",
            },
            {
              rule_id: "DP-2002",
              name: "Rain Demand",
              surge_multiplier: "1.8x",
              condition: "Heavy rain",
              status: "Active",
            },
            {
              rule_id: "DP-2003",
              name: "Weekend Demand",
              surge_multiplier: "1.3x",
              condition: "Saturday-Sunday",
              status: "Paused",
            },
            {
              rule_id: "DP-2004",
              name: "Holiday Premium",
              surge_multiplier: "2.0x",
              condition: "Public holiday",
              status: "Off",
            },
          ],
        },
        rental: {
          title: "Rental Pricing",
          description: "Set rental plan pricing, duration and special pricing notes.",
          primaryField: "plan_id",
          fields: [
            { name: "plan_id", label: "Plan ID", type: "text", placeholder: "RP-3001" },
            { name: "name", label: "Plan Name", type: "text", placeholder: "Daily Rental" },
            { name: "duration", label: "Duration", type: "text", placeholder: "24 hours" },
            { name: "price", label: "Price", type: "number", placeholder: "499" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Upcoming", "Retired"],
            },
          ],
          initialRecords: [
            {
              plan_id: "RP-3001",
              name: "Daily Rental",
              duration: "24 hours",
              price: "499",
              status: "Active",
            },
            {
              plan_id: "RP-3002",
              name: "Weekend Saver",
              duration: "48 hours",
              price: "899",
              status: "Active",
            },
            {
              plan_id: "RP-3003",
              name: "Weekly Pass",
              duration: "7 days",
              price: "2999",
              status: "Active",
            },
            {
              plan_id: "RP-3004",
              name: "Monthly Lease",
              duration: "30 days",
              price: "9999",
              status: "Upcoming",
            },
          ],
        },
        coupons: {
          title: "Coupons",
          description: "Manage coupon codes, discounts and expiration windows.",
          primaryField: "coupon_id",
          fields: [
            { name: "coupon_id", label: "Coupon ID", type: "text", placeholder: "CP-4001" },
            { name: "code", label: "Coupon Code", type: "text", placeholder: "RIDE20" },
            { name: "discount", label: "Discount", type: "text", placeholder: "20%" },
            { name: "valid_until", label: "Valid Until", type: "date" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Expired", "Scheduled"],
            },
          ],
          initialRecords: [
            {
              coupon_id: "CP-4001",
              code: "RIDE20",
              discount: "20%",
              valid_until: "2026-12-31",
              status: "Active",
            },
            {
              coupon_id: "CP-4002",
              code: "WELCOME50",
              discount: "₹50",
              valid_until: "2026-09-30",
              status: "Active",
            },
            {
              coupon_id: "CP-4003",
              code: "WEEKEND10",
              discount: "10%",
              valid_until: "2026-11-30",
              status: "Scheduled",
            },
            {
              coupon_id: "CP-4004",
              code: "NIGHT15",
              discount: "15%",
              valid_until: "2026-08-31",
              status: "Active",
            },
          ],
        },
        discounts: {
          title: "Discounts",
          description: "Configure broader discount programs and special offers.",
          primaryField: "discount_id",
          fields: [
            { name: "discount_id", label: "Discount ID", type: "text", placeholder: "DC-5001" },
            { name: "name", label: "Discount Name", type: "text", placeholder: "Super Saver" },
            {
              name: "type",
              label: "Type",
              type: "select",
              options: ["Percentage", "Fixed", "Tiered"],
            },
            { name: "amount", label: "Amount", type: "text", placeholder: "15%" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Disabled", "Planned"],
            },
          ],
          initialRecords: [
            {
              discount_id: "DC-5001",
              name: "Super Saver",
              type: "Percentage",
              amount: "15%",
              status: "Active",
            },
            {
              discount_id: "DC-5002",
              name: "Flat Fare",
              type: "Fixed",
              amount: "₹30",
              status: "Active",
            },
            {
              discount_id: "DC-5003",
              name: "Loyalty Tier",
              type: "Tiered",
              amount: "10%-20%",
              status: "Planned",
            },
            {
              discount_id: "DC-5004",
              name: "Late Night",
              type: "Percentage",
              amount: "12%",
              status: "Disabled",
            },
          ],
        },
        promo: {
          title: "Promo Codes",
          description: "Manage promotional campaigns and referral code offers.",
          primaryField: "promo_id",
          fields: [
            { name: "promo_id", label: "Promo ID", type: "text", placeholder: "PR-6001" },
            { name: "code", label: "Promo Code", type: "text", placeholder: "SUMMER30" },
            { name: "offer", label: "Offer", type: "text", placeholder: "30% off" },
            { name: "valid_until", label: "Valid Until", type: "date" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Expired", "Upcoming"],
            },
          ],
          initialRecords: [
            {
              promo_id: "PR-6001",
              code: "SUMMER30",
              offer: "30% off",
              valid_until: "2026-09-15",
              status: "Active",
            },
            {
              promo_id: "PR-6002",
              code: "FESTIVE25",
              offer: "25% off",
              valid_until: "2026-10-31",
              status: "Upcoming",
            },
            {
              promo_id: "PR-6003",
              code: "FAMILY10",
              offer: "₹10 off",
              valid_until: "2026-08-31",
              status: "Active",
            },
            {
              promo_id: "PR-6004",
              code: "RIDE5",
              offer: "5% off",
              valid_until: "2026-12-31",
              status: "Active",
            },
          ],
        },
        toll: {
          title: "Toll Charges",
          description: "Track toll fees applied to rides and automated settlements.",
          primaryField: "toll_id",
          fields: [
            { name: "toll_id", label: "Toll ID", type: "text", placeholder: "TOLL-7001" },
            { name: "ride_id", label: "Ride ID", type: "text", placeholder: "RIDE-1001" },
            { name: "amount", label: "Amount", type: "number", placeholder: "120" },
            { name: "location", label: "Location", type: "text", placeholder: "Hosur Road Toll" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Paid", "Pending", "Waived"],
            },
          ],
          initialRecords: [
            {
              toll_id: "TOLL-7001",
              ride_id: "RIDE-1001",
              amount: "120",
              location: "Hosur Road Toll",
              status: "Paid",
            },
            {
              toll_id: "TOLL-7002",
              ride_id: "RIDE-1002",
              amount: "90",
              location: "Airport Toll",
              status: "Pending",
            },
            {
              toll_id: "TOLL-7003",
              ride_id: "RIDE-1003",
              amount: "75",
              location: "Bellary Road Toll",
              status: "Paid",
            },
            {
              toll_id: "TOLL-7004",
              ride_id: "RIDE-1004",
              amount: "65",
              location: "Outer Ring Road Toll",
              status: "Waived",
            },
          ],
        },
      };
      const key = child || "fare-rules";
      return pricingTemplates[key] || pricingTemplates["fare-rules"];
    }
    case "payroll": {
      const payrollTemplates: Record<string, ModuleTemplate> = {
        "driver-earnings": {
          title: "Driver Earnings",
          description: "Comprehensive breakdown of fares, commissions, and payouts.",
          primaryField: "driver_id",
          fields: [
            { name: "driver_id", label: "Driver ID", type: "text", placeholder: "SORA-DRV-101" },
            { name: "period", label: "Period", type: "text", placeholder: "July 1-15" },
            { name: "total_fare", label: "Total Fare", type: "number", placeholder: "45000" },
            { name: "commission", label: "Commission", type: "number", placeholder: "4500" },
            { name: "net_payout", label: "Net Payout", type: "number", placeholder: "40500" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Paid", "Processing", "Scheduled"],
            },
          ],
          initialRecords: [
            {
              driver_id: "SORA-DRV-101",
              period: "July 1-15",
              total_fare: "45000",
              commission: "4500",
              net_payout: "40500",
              status: "Paid",
            },
            {
              driver_id: "SORA-DRV-102",
              period: "July 1-15",
              total_fare: "28000",
              commission: "2800",
              net_payout: "25200",
              status: "Processing",
            },
            {
              driver_id: "SORA-DRV-103",
              period: "July 1-15",
              total_fare: "33000",
              commission: "3300",
              net_payout: "29700",
              status: "Paid",
            },
            {
              driver_id: "SORA-DRV-104",
              period: "July 1-15",
              total_fare: "39000",
              commission: "3900",
              net_payout: "35100",
              status: "Scheduled",
            },
          ],
        },
        salary: {
          title: "Employee Salary",
          description: "Set employee salary structure, allowances and status.",
          primaryField: "employee_id",
          fields: [
            { name: "employee_id", label: "Employee ID", type: "text", placeholder: "EMP-1001" },
            { name: "name", label: "Name", type: "text", placeholder: "Ritika Nair" },
            { name: "base_salary", label: "Base Salary", type: "number", placeholder: "35000" },
            { name: "allowances", label: "Allowances", type: "text", placeholder: "₹4000" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "On Hold", "Closed"],
            },
          ],
          initialRecords: [
            {
              employee_id: "EMP-1001",
              name: "Ritika Nair",
              base_salary: "35000",
              allowances: "₹4000",
              status: "Active",
            },
            {
              employee_id: "EMP-1002",
              name: "Ankit Sharma",
              base_salary: "42000",
              allowances: "₹5000",
              status: "Active",
            },
            {
              employee_id: "EMP-1003",
              name: "Sneha R",
              base_salary: "31000",
              allowances: "₹3000",
              status: "On Hold",
            },
            {
              employee_id: "EMP-1004",
              name: "Jatin K",
              base_salary: "38000",
              allowances: "₹4500",
              status: "Active",
            },
          ],
        },
        bonuses: {
          title: "Bonuses",
          description: "Record bonus payouts and eligibility reasons.",
          primaryField: "bonus_id",
          fields: [
            { name: "bonus_id", label: "Bonus ID", type: "text", placeholder: "BON-2001" },
            { name: "employee_id", label: "Employee ID", type: "text", placeholder: "EMP-1001" },
            {
              name: "type",
              label: "Bonus Type",
              type: "select",
              options: ["Performance", "Referral", "Retention"],
            },
            { name: "amount", label: "Amount", type: "number", placeholder: "5000" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Released", "Pending", "Cancelled"],
            },
          ],
          initialRecords: [
            {
              bonus_id: "BON-2001",
              employee_id: "EMP-1001",
              type: "Performance",
              amount: "5000",
              status: "Released",
            },
            {
              bonus_id: "BON-2002",
              employee_id: "EMP-1002",
              type: "Referral",
              amount: "3000",
              status: "Pending",
            },
            {
              bonus_id: "BON-2003",
              employee_id: "EMP-1003",
              type: "Retention",
              amount: "4500",
              status: "Released",
            },
            {
              bonus_id: "BON-2004",
              employee_id: "EMP-1004",
              type: "Performance",
              amount: "6000",
              status: "Pending",
            },
          ],
        },
        incentives: {
          title: "Incentives",
          description: "Track incentive programs and payouts.",
          primaryField: "incentive_id",
          fields: [
            { name: "incentive_id", label: "Incentive ID", type: "text", placeholder: "INC-3001" },
            { name: "employee_id", label: "Employee ID", type: "text", placeholder: "EMP-1001" },
            { name: "scheme", label: "Scheme", type: "text", placeholder: "Monthly target" },
            { name: "amount", label: "Amount", type: "number", placeholder: "2500" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Closed", "Planned"],
            },
          ],
          initialRecords: [
            {
              incentive_id: "INC-3001",
              employee_id: "EMP-1001",
              scheme: "Monthly target",
              amount: "2500",
              status: "Active",
            },
            {
              incentive_id: "INC-3002",
              employee_id: "EMP-1002",
              scheme: "Referral drive",
              amount: "1800",
              status: "Closed",
            },
            {
              incentive_id: "INC-3003",
              employee_id: "EMP-1003",
              scheme: "Quarterly bonus",
              amount: "3200",
              status: "Planned",
            },
            {
              incentive_id: "INC-3004",
              employee_id: "EMP-1004",
              scheme: "Retention bonus",
              amount: "4100",
              status: "Active",
            },
          ],
        },
        deductions: {
          title: "Deductions",
          description: "Maintain deduction records for payroll adjustments.",
          primaryField: "deduction_id",
          fields: [
            { name: "deduction_id", label: "Deduction ID", type: "text", placeholder: "DED-4001" },
            { name: "employee_id", label: "Employee ID", type: "text", placeholder: "EMP-1001" },
            { name: "type", label: "Type", type: "select", options: ["Tax", "Penalty", "Advance"] },
            { name: "amount", label: "Amount", type: "number", placeholder: "1200" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Applied", "Pending", "Waived"],
            },
          ],
          initialRecords: [
            {
              deduction_id: "DED-4001",
              employee_id: "EMP-1001",
              type: "Tax",
              amount: "1200",
              status: "Applied",
            },
            {
              deduction_id: "DED-4002",
              employee_id: "EMP-1002",
              type: "Penalty",
              amount: "800",
              status: "Applied",
            },
            {
              deduction_id: "DED-4003",
              employee_id: "EMP-1003",
              type: "Advance",
              amount: "1500",
              status: "Pending",
            },
            {
              deduction_id: "DED-4004",
              employee_id: "EMP-1004",
              type: "Tax",
              amount: "1400",
              status: "Applied",
            },
          ],
        },
      };
      const key = child || "driver-earnings";
      return payrollTemplates[key] || payrollTemplates["driver-earnings"];
    }
    case "payments": {
      const paymentTemplates: Record<string, ModuleTemplate> = {
        cash: {
          title: "Cash Collection",
          description: "Track cash collections, driver submittals, and branch handovers.",
          primaryField: "txn_id",
          fields: [
            { name: "txn_id", label: "Transaction ID", type: "text", placeholder: "CSH-5001" },
            { name: "driver_id", label: "Driver ID", type: "text", placeholder: "DRV-1001" },
            { name: "amount", label: "Cash Amount", type: "number", placeholder: "1500" },
            { name: "collected_by", label: "Received By", type: "text", placeholder: "Amit Singh" },
            { name: "timestamp", label: "Date & Time", type: "date" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Collected", "Pending", "Deposited", "Reconciled"],
            },
            { name: "notes", label: "Notes", type: "textarea", placeholder: "Shift cash details" },
          ],
          initialRecords: [
            {
              txn_id: "CSH-5001",
              driver_id: "DRV-1001",
              amount: "2500",
              collected_by: "Amit Singh",
              timestamp: "2026-07-10",
              status: "Collected",
              notes: "Shift-A collection",
            },
            {
              txn_id: "CSH-5002",
              driver_id: "DRV-1002",
              amount: "1850",
              collected_by: "Amit Singh",
              timestamp: "2026-07-11",
              status: "Deposited",
              notes: "Bank deposit pending",
            },
            {
              txn_id: "CSH-5003",
              driver_id: "DRV-1003",
              amount: "3200",
              collected_by: "Preeti Rao",
              timestamp: "2026-07-12",
              status: "Reconciled",
              notes: "Verified and matched with system",
            },
            {
              txn_id: "CSH-5004",
              driver_id: "DRV-1004",
              amount: "1200",
              collected_by: "Preeti Rao",
              timestamp: "2026-07-13",
              status: "Pending",
              notes: "Driver requested hand-over tomorrow",
            },
          ],
        },
        upi: {
          title: "UPI Transactions",
          description: "Track all UPI payments, intent scans, and transaction hashes.",
          primaryField: "upi_txn_id",
          fields: [
            {
              name: "upi_txn_id",
              label: "UPI Reference No",
              type: "text",
              placeholder: "UPI-9001",
            },
            { name: "sender_upi", label: "Sender VPA", type: "text", placeholder: "cust@okaxis" },
            {
              name: "receiver_upi",
              label: "Receiver VPA",
              type: "text",
              placeholder: "sora@okhdfc",
            },
            { name: "amount", label: "Amount", type: "number", placeholder: "350" },
            { name: "timestamp", label: "Transaction Date", type: "date" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Success", "Pending", "Failed", "Reversed"],
            },
            {
              name: "notes",
              label: "Reference Notes",
              type: "textarea",
              placeholder: "Transaction notes",
            },
          ],
          initialRecords: [
            {
              upi_txn_id: "UPI-9001",
              sender_upi: "rahul.sharma@okicici",
              receiver_upi: "sora@okhdfc",
              amount: "350",
              timestamp: "2026-07-13",
              status: "Success",
              notes: "Ride booking payment",
            },
            {
              upi_txn_id: "UPI-9002",
              sender_upi: "priya.patel@okaxis",
              receiver_upi: "sora@okhdfc",
              amount: "420",
              timestamp: "2026-07-12",
              status: "Success",
              notes: "Immediate payout trigger",
            },
            {
              upi_txn_id: "UPI-9003",
              sender_upi: "vikram.singh@paytm",
              receiver_upi: "sora@okhdfc",
              amount: "150",
              timestamp: "2026-07-12",
              status: "Failed",
              notes: "User bank server timed out",
            },
            {
              upi_txn_id: "UPI-9004",
              sender_upi: "ananya.nair@sbi",
              receiver_upi: "sora@okhdfc",
              amount: "600",
              timestamp: "2026-07-11",
              status: "Reversed",
              notes: "Auto-refunded due to ride cancel",
            },
          ],
        },
        online: {
          title: "Online Payments",
          description: "Monitor and audit credit card, debit card, and net banking transactions.",
          primaryField: "payment_id",
          fields: [
            { name: "payment_id", label: "Payment ID", type: "text", placeholder: "pay_NLK123" },
            {
              name: "gateway",
              label: "Gateway",
              type: "select",
              options: ["Stripe", "Razorpay", "Adyen", "PayPal"],
            },
            {
              name: "card_brand",
              label: "Card Brand",
              type: "select",
              options: ["Visa", "Mastercard", "Amex", "NetBanking", "Wallet"],
            },
            { name: "amount", label: "Amount", type: "number", placeholder: "500" },
            { name: "timestamp", label: "Payment Date", type: "date" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Succeeded", "Pending", "Authorized", "Failed"],
            },
            {
              name: "notes",
              label: "Gateway Reference",
              type: "textarea",
              placeholder: "Gateway payment intent ID",
            },
          ],
          initialRecords: [
            {
              payment_id: "pay_NLK123",
              gateway: "Razorpay",
              card_brand: "Visa",
              amount: "850",
              timestamp: "2026-07-13",
              status: "Succeeded",
              notes: "Order #8921-A",
            },
            {
              payment_id: "pay_PLM456",
              gateway: "Stripe",
              card_brand: "Mastercard",
              amount: "1250",
              timestamp: "2026-07-12",
              status: "Succeeded",
              notes: "Weekly bike lease renewal",
            },
            {
              payment_id: "pay_QWE789",
              gateway: "Razorpay",
              card_brand: "NetBanking",
              amount: "300",
              timestamp: "2026-07-11",
              status: "Failed",
              notes: "Authentication failed (3D Secure)",
            },
            {
              payment_id: "pay_ZXC012",
              gateway: "Stripe",
              card_brand: "Amex",
              amount: "2200",
              timestamp: "2026-07-10",
              status: "Authorized",
              notes: "Security deposit hold",
            },
          ],
        },
        wallet: {
          title: "Customer Wallets",
          description:
            "View customer wallet balances, active statuses, and auto-recharge settings.",
          primaryField: "wallet_id",
          fields: [
            { name: "wallet_id", label: "Wallet ID", type: "text", placeholder: "WLT-2001" },
            {
              name: "customer_name",
              label: "Customer Name",
              type: "text",
              placeholder: "Suresh Kumar",
            },
            { name: "balance", label: "Current Balance", type: "number", placeholder: "750" },
            {
              name: "auto_recharge",
              label: "Auto Recharge",
              type: "select",
              options: ["Enabled", "Disabled"],
            },
            { name: "last_funded", label: "Last Funded", type: "date" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Suspended", "Incomplete KYC"],
            },
            { name: "notes", label: "Notes", type: "textarea" },
          ],
          initialRecords: [
            {
              wallet_id: "WLT-2001",
              customer_name: "Suresh Kumar",
              balance: "1450",
              auto_recharge: "Enabled",
              last_funded: "2026-07-12",
              status: "Active",
              notes: "Regular user wallet",
            },
            {
              wallet_id: "WLT-2002",
              customer_name: "Neelam Sharma",
              balance: "75",
              auto_recharge: "Disabled",
              last_funded: "2026-07-05",
              status: "Active",
              notes: "Low balance alert sent",
            },
            {
              wallet_id: "WLT-2003",
              customer_name: "John Doe",
              balance: "5000",
              auto_recharge: "Disabled",
              last_funded: "2026-07-10",
              status: "Incomplete KYC",
              notes: "KYC verification pending",
            },
            {
              wallet_id: "WLT-2004",
              customer_name: "Ramesh Sen",
              balance: "0",
              auto_recharge: "Disabled",
              last_funded: "2026-06-20",
              status: "Suspended",
              notes: "Suspended due to chargeback attempt",
            },
          ],
        },
        refunds: {
          title: "Refund Requests",
          description:
            "Track passenger or driver refunds, credit adjustments, and chargeback queries.",
          primaryField: "refund_id",
          fields: [
            { name: "refund_id", label: "Refund ID", type: "text", placeholder: "RFD-4001" },
            {
              name: "payment_id",
              label: "Original Payment ID",
              type: "text",
              placeholder: "pay_NLK123",
            },
            { name: "amount", label: "Refund Amount", type: "number", placeholder: "350" },
            {
              name: "reason",
              label: "Reason",
              type: "select",
              options: [
                "Ride Cancelled By Driver",
                "Double Charged",
                "Vehicle Breakdown",
                "Unsatisfactory Service",
              ],
            },
            { name: "requested_at", label: "Requested At", type: "date" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Requested", "Approved", "Processed", "Rejected"],
            },
            { name: "notes", label: "Notes", type: "textarea", placeholder: "Approver remarks" },
          ],
          initialRecords: [
            {
              refund_id: "RFD-4001",
              payment_id: "pay_NLK123",
              amount: "350",
              reason: "Ride Cancelled By Driver",
              requested_at: "2026-07-12",
              status: "Processed",
              notes: "Refunded back to original UPI",
            },
            {
              refund_id: "RFD-4002",
              payment_id: "pay_PLM456",
              amount: "1200",
              reason: "Vehicle Breakdown",
              requested_at: "2026-07-13",
              status: "Approved",
              notes: "Awaiting gateway reconciliation",
            },
            {
              refund_id: "RFD-4003",
              payment_id: "pay_QWE789",
              amount: "300",
              reason: "Double Charged",
              requested_at: "2026-07-11",
              status: "Processed",
              notes: "Instant credit to wallet added",
            },
            {
              refund_id: "RFD-4004",
              payment_id: "pay_ZXC012",
              amount: "50",
              reason: "Unsatisfactory Service",
              requested_at: "2026-07-10",
              status: "Rejected",
              notes: "Ride completed successfully. Not eligible.",
            },
          ],
        },
        payout: {
          title: "Driver Payouts",
          description:
            "Track payouts transferred to drivers' bank accounts, IMPS status, and pending balances.",
          primaryField: "payout_id",
          fields: [
            { name: "payout_id", label: "Payout ID", type: "text", placeholder: "PAY-3001" },
            { name: "driver_name", label: "Driver Name", type: "text", placeholder: "Arjun Verma" },
            { name: "amount", label: "Payout Amount", type: "number", placeholder: "6400" },
            {
              name: "bank_name",
              label: "Bank Name",
              type: "select",
              options: ["SBI", "HDFC", "ICICI", "Axis Bank", "PNB"],
            },
            { name: "processed_at", label: "Processed At", type: "date" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Pending", "Processing", "Succeeded", "Failed"],
            },
            { name: "notes", label: "Notes", type: "textarea" },
          ],
          initialRecords: [
            {
              payout_id: "PAY-3001",
              driver_name: "Arjun Verma",
              amount: "6400",
              bank_name: "HDFC",
              processed_at: "2026-07-13",
              status: "Succeeded",
              notes: "Weekly settlement Cycle-26",
            },
            {
              payout_id: "PAY-3002",
              driver_name: "Harish Patel",
              amount: "5200",
              bank_name: "SBI",
              processed_at: "2026-07-13",
              status: "Succeeded",
              notes: "Weekly settlement Cycle-26",
            },
            {
              payout_id: "PAY-3003",
              driver_name: "Gurpreet Singh",
              amount: "7100",
              bank_name: "ICICI",
              processed_at: "2026-07-12",
              status: "Processing",
              notes: "Awaiting bank response",
            },
            {
              payout_id: "PAY-3004",
              driver_name: "Madan Lal",
              amount: "4500",
              bank_name: "PNB",
              processed_at: "2026-07-11",
              status: "Failed",
              notes: "Incorrect IFSC code submitted",
            },
          ],
        },
        commission: {
          title: "Platform Commission",
          description:
            "Monitor platform commission splits, service charges, and GST deductions per ride.",
          primaryField: "commission_id",
          fields: [
            {
              name: "commission_id",
              label: "Commission ID",
              type: "text",
              placeholder: "COM-7001",
            },
            { name: "ride_id", label: "Ride ID", type: "text", placeholder: "RD-8092" },
            { name: "gross_fare", label: "Gross Fare", type: "number", placeholder: "320" },
            {
              name: "rate_percentage",
              label: "Commission Rate (%)",
              type: "number",
              placeholder: "20",
            },
            {
              name: "commission_amount",
              label: "Commission Amount",
              type: "number",
              placeholder: "64",
            },
            { name: "date", label: "Posting Date", type: "date" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Settled", "Pending", "Adjusted"],
            },
          ],
          initialRecords: [
            {
              commission_id: "COM-7001",
              ride_id: "RD-8092",
              gross_fare: "320",
              rate_percentage: "20",
              commission_amount: "64",
              date: "2026-07-13",
              status: "Settled",
            },
            {
              commission_id: "COM-7002",
              ride_id: "RD-8093",
              gross_fare: "450",
              rate_percentage: "20",
              commission_amount: "90",
              date: "2026-07-13",
              status: "Settled",
            },
            {
              commission_id: "COM-7003",
              ride_id: "RD-8094",
              gross_fare: "150",
              rate_percentage: "15",
              commission_amount: "22.5",
              date: "2026-07-12",
              status: "Pending",
            },
            {
              commission_id: "COM-7004",
              ride_id: "RD-8095",
              gross_fare: "600",
              rate_percentage: "20",
              commission_amount: "120",
              date: "2026-07-11",
              status: "Adjusted",
            },
          ],
        },
      };
      const key = child || "cash";
      return paymentTemplates[key] || paymentTemplates.cash;
    }
    case "finance": {
      const financeTemplates: Record<string, ModuleTemplate> = {
        revenue: {
          title: "Revenue",
          description: "Track all incoming revenue streams.",
          primaryField: "rev_id",
          fields: [
            { name: "rev_id", label: "Rev ID", type: "text", placeholder: "REV-2001" },
            { name: "name", label: "Title", type: "text", placeholder: "Ride Fare" },
            { name: "amount", label: "Amount", type: "number", placeholder: "500" },
            {
              name: "category",
              label: "Category",
              type: "select",
              options: ["Ride", "Subscription", "Other"],
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Draft", "Confirmed", "Reconciled"],
            },
            { name: "notes", label: "Notes", type: "textarea" },
          ],
          initialRecords: [
            {
              rev_id: "REV-2001",
              name: "Ride Fare",
              amount: "500",
              category: "Ride",
              status: "Confirmed",
              notes: "Order #8921",
            },
            {
              rev_id: "REV-2002",
              name: "Subscription",
              amount: "1200",
              category: "Subscription",
              status: "Confirmed",
              notes: "Monthly plan",
            },
          ],
        },
        expenses: {
          title: "Expenses",
          description: "Monitor operational and overhead expenses.",
          primaryField: "exp_id",
          fields: [
            { name: "exp_id", label: "Exp ID", type: "text", placeholder: "EXP-3001" },
            { name: "name", label: "Title", type: "text", placeholder: "Office Rent" },
            { name: "amount", label: "Amount", type: "number", placeholder: "10000" },
            {
              name: "category",
              label: "Category",
              type: "select",
              options: ["Operational", "Marketing", "Payroll", "Maintenance"],
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Draft", "Approved", "Paid"],
            },
            { name: "notes", label: "Notes", type: "textarea" },
          ],
          initialRecords: [
            {
              exp_id: "EXP-3001",
              name: "Office Rent",
              amount: "10000",
              category: "Operational",
              status: "Paid",
              notes: "July rent",
            },
            {
              exp_id: "EXP-3002",
              name: "FB Ads",
              amount: "2500",
              category: "Marketing",
              status: "Approved",
              notes: "Campaign Q3",
            },
          ],
        },
        invoices: {
          title: "Invoices",
          description: "Manage and track outgoing customer/client invoices.",
          primaryField: "invoice_id",
          fields: [
            { name: "invoice_id", label: "Invoice ID", type: "text", placeholder: "INV-4001" },
            {
              name: "name",
              label: "Invoice Name",
              type: "text",
              placeholder: "Corporate Client A",
            },
            { name: "amount", label: "Amount", type: "number", placeholder: "5000" },
            { name: "due_date", label: "Due Date", type: "date" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Draft", "Sent", "Paid", "Overdue"],
            },
            { name: "notes", label: "Notes", type: "textarea" },
          ],
          initialRecords: [
            {
              invoice_id: "INV-4001",
              name: "Corporate Client A",
              amount: "5000",
              due_date: "2026-07-30",
              status: "Sent",
              notes: "Service Q2",
            },
            {
              invoice_id: "INV-4002",
              name: "Tech Corp",
              amount: "2500",
              due_date: "2026-07-20",
              status: "Paid",
              notes: "Service Q1",
            },
          ],
        },
      };
      const key = child || "revenue";
      return financeTemplates[key] || financeTemplates.revenue;
    }
    case "hr": {
      const hrTemplates: Record<string, ModuleTemplate> = {
        employees: {
          title: "Employees",
          description: "Manage employee profiles and employment details.",
          primaryField: "employee_id",

          fields: [
            { name: "employee_id", label: "Employee ID", type: "text", placeholder: "EMP-1001" },
            { name: "name", label: "Employee Name", type: "text", placeholder: "Ritika Nair" },
            {
              name: "department",
              label: "Department",
              type: "select",
              options: ["Support", "Operations", "HR", "Finance", "Engineering"],
            },
            {
              name: "designation",
              label: "Designation",
              type: "text",
              placeholder: "Support Executive",
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Inactive", "Probation"],
            },
          ],

          initialRecords: [
            {
              employee_id: "EMP-1001",
              name: "Ritika Nair",
              department: "Support",
              designation: "Support Executive",
              status: "Active",
            },
            {
              employee_id: "EMP-1002",
              name: "Rahul Verma",
              department: "Finance",
              designation: "Accountant",
              status: "Probation",
            },
          ],
        },

        attendance: {
          title: "Attendance",
          description: "Track employee attendance records.",
          primaryField: "attendance_id",

          fields: [
            { name: "attendance_id", label: "Attendance ID", type: "text", placeholder: "ATT-101" },
            { name: "employee_name", label: "Employee", type: "text", placeholder: "Ritika Nair" },
            { name: "date", label: "Date", type: "date" },
            { name: "check_in", label: "Check In", type: "time" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Present", "Absent", "Late", "Half Day"],
            },
          ],

          initialRecords: [
            {
              attendance_id: "ATT-101",
              employee_name: "Ritika Nair",
              date: "2026-07-12",
              check_in: "09:12",
              status: "Present",
            },
            {
              attendance_id: "ATT-102",
              employee_name: "Rahul Verma",
              date: "2026-07-12",
              check_in: "09:45",
              status: "Late",
            },
          ],
        },

        leave: {
          title: "Leave Management",
          description: "Manage employee leave requests.",
          primaryField: "leave_id",

          fields: [
            { name: "leave_id", label: "Leave ID", type: "text", placeholder: "LV-101" },
            { name: "employee_name", label: "Employee", type: "text", placeholder: "Ritika Nair" },
            {
              name: "leave_type",
              label: "Leave Type",
              type: "select",
              options: ["Casual", "Sick", "Paid", "Emergency"],
            },
            { name: "days", label: "Days", type: "number", placeholder: "2" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Approved", "Pending", "Rejected"],
            },
          ],

          initialRecords: [
            {
              leave_id: "LV-101",
              employee_name: "Ritika Nair",
              leave_type: "Casual",
              days: "2",
              status: "Approved",
            },
            {
              leave_id: "LV-102",
              employee_name: "Rahul Verma",
              leave_type: "Sick",
              days: "1",
              status: "Pending",
            },
          ],
        },

        recruitment: {
          title: "Recruitment",
          description: "Manage recruitment pipeline and candidates.",
          primaryField: "candidate_id",

          fields: [
            { name: "candidate_id", label: "Candidate ID", type: "text", placeholder: "CAN-101" },
            {
              name: "candidate_name",
              label: "Candidate",
              type: "text",
              placeholder: "Anjali Gupta",
            },
            { name: "position", label: "Position", type: "text", placeholder: "Backend Developer" },
            { name: "interviewer", label: "Interviewer", type: "text", placeholder: "Amit Sharma" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Applied", "Interview", "Selected", "Rejected"],
            },
          ],

          initialRecords: [
            {
              candidate_id: "CAN-101",
              candidate_name: "Anjali Gupta",
              position: "Backend Developer",
              interviewer: "Amit Sharma",
              status: "Interview",
            },
            {
              candidate_id: "CAN-102",
              candidate_name: "Deepak Singh",
              position: "UI Designer",
              interviewer: "Priya Nair",
              status: "Selected",
            },
          ],
        },

        training: {
          title: "Training",
          description: "Track employee training sessions.",
          primaryField: "training_id",

          fields: [
            { name: "training_id", label: "Training ID", type: "text", placeholder: "TR-101" },
            { name: "employee_name", label: "Employee", type: "text", placeholder: "Ritika Nair" },
            {
              name: "course",
              label: "Course",
              type: "text",
              placeholder: "Customer Support Basics",
            },
            { name: "trainer", label: "Trainer", type: "text", placeholder: "Rajesh Kumar" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Completed", "Ongoing", "Pending"],
            },
          ],

          initialRecords: [
            {
              training_id: "TR-101",
              employee_name: "Ritika Nair",
              course: "Customer Support Basics",
              trainer: "Rajesh Kumar",
              status: "Completed",
            },
            {
              training_id: "TR-102",
              employee_name: "Rahul Verma",
              course: "Excel Advanced",
              trainer: "Neha Sharma",
              status: "Ongoing",
            },
          ],
        },

        performance: {
          title: "Performance",
          description: "Evaluate employee performance metrics.",
          primaryField: "review_id",

          fields: [
            { name: "review_id", label: "Review ID", type: "text", placeholder: "PR-101" },
            { name: "employee_name", label: "Employee", type: "text", placeholder: "Ritika Nair" },
            { name: "review_period", label: "Review Period", type: "text", placeholder: "Q2-2026" },
            {
              name: "rating",
              label: "Rating",
              type: "select",
              options: ["Excellent", "Good", "Average", "Poor"],
            },
            { name: "status", label: "Status", type: "select", options: ["Completed", "Pending"] },
          ],

          initialRecords: [
            {
              review_id: "PR-101",
              employee_name: "Ritika Nair",
              review_period: "Q2-2026",
              rating: "Excellent",
              status: "Completed",
            },
            {
              review_id: "PR-102",
              employee_name: "Rahul Verma",
              review_period: "Q2-2026",
              rating: "Good",
              status: "Pending",
            },
          ],
        },
      };

      const key = child || "employees";

      return hrTemplates[key] || hrTemplates.employees;
    }
    case "procurement": {
      const procurementTemplates: Record<string, ModuleTemplate> = {
        suppliers: {
          title: "Suppliers",
          description: "Manage supplier information and vendor contacts.",
          primaryField: "supplier_id",

          fields: [
            { name: "supplier_id", label: "Supplier ID", type: "text", placeholder: "SUP-101" },
            {
              name: "supplier_name",
              label: "Supplier Name",
              type: "text",
              placeholder: "Volt Parts Pvt Ltd",
            },
            {
              name: "contact_person",
              label: "Contact Person",
              type: "text",
              placeholder: "Rahul Mehta",
            },
            { name: "phone", label: "Phone", type: "tel", placeholder: "+91 9876543210" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Inactive", "Blacklisted"],
            },
          ],

          initialRecords: [
            {
              supplier_id: "SUP-101",
              supplier_name: "Volt Parts Pvt Ltd",
              contact_person: "Rahul Mehta",
              phone: "+91 9876543210",
              status: "Active",
            },
            {
              supplier_id: "SUP-102",
              supplier_name: "Fuel Corp",
              contact_person: "Neha Sharma",
              phone: "+91 9988776655",
              status: "Active",
            },
          ],
        },

        "purchase-requests": {
          title: "Purchase Requests",
          description: "Create and track purchase requests.",
          primaryField: "request_id",

          fields: [
            { name: "request_id", label: "Request ID", type: "text", placeholder: "PR-101" },
            { name: "item_name", label: "Item", type: "text", placeholder: "Helmet" },
            { name: "requested_by", label: "Requested By", type: "text", placeholder: "Warehouse" },
            { name: "quantity", label: "Quantity", type: "number", placeholder: "50" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Pending", "Approved", "Rejected"],
            },
          ],

          initialRecords: [
            {
              request_id: "PR-101",
              item_name: "Helmet",
              requested_by: "Warehouse",
              quantity: "50",
              status: "Approved",
            },
            {
              request_id: "PR-102",
              item_name: "Engine Oil",
              requested_by: "Service Center",
              quantity: "20",
              status: "Pending",
            },
          ],
        },

        "purchase-orders": {
          title: "Purchase Orders",
          description: "Manage purchase orders sent to suppliers.",
          primaryField: "po_id",

          fields: [
            { name: "po_id", label: "PO ID", type: "text", placeholder: "PO-101" },
            { name: "supplier_name", label: "Supplier", type: "text", placeholder: "Volt Parts" },
            { name: "order_value", label: "Order Value", type: "number", placeholder: "150000" },
            { name: "delivery_date", label: "Delivery Date", type: "date" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Ordered", "Delivered", "Cancelled"],
            },
          ],

          initialRecords: [
            {
              po_id: "PO-101",
              supplier_name: "Volt Parts",
              order_value: "150000",
              delivery_date: "2026-07-20",
              status: "Ordered",
            },
            {
              po_id: "PO-102",
              supplier_name: "Fuel Corp",
              order_value: "75000",
              delivery_date: "2026-07-18",
              status: "Delivered",
            },
          ],
        },

        "vendor-payments": {
          title: "Vendor Payments",
          description: "Track payments made to suppliers.",
          primaryField: "payment_id",

          fields: [
            { name: "payment_id", label: "Payment ID", type: "text", placeholder: "VP-101" },
            { name: "vendor_name", label: "Vendor", type: "text", placeholder: "Volt Parts" },
            { name: "amount", label: "Amount", type: "number", placeholder: "65000" },
            {
              name: "payment_mode",
              label: "Payment Mode",
              type: "select",
              options: ["Bank Transfer", "UPI", "Cheque"],
            },
            { name: "status", label: "Status", type: "select", options: ["Paid", "Pending"] },
          ],

          initialRecords: [
            {
              payment_id: "VP-101",
              vendor_name: "Volt Parts",
              amount: "65000",
              payment_mode: "Bank Transfer",
              status: "Paid",
            },
            {
              payment_id: "VP-102",
              vendor_name: "Fuel Corp",
              amount: "45000",
              payment_mode: "UPI",
              status: "Pending",
            },
          ],
        },

        "spare-parts": {
          title: "Spare Parts",
          description: "Maintain spare parts inventory.",
          primaryField: "part_id",

          fields: [
            { name: "part_id", label: "Part ID", type: "text", placeholder: "SP-101" },
            { name: "part_name", label: "Part Name", type: "text", placeholder: "Brake Pad" },
            { name: "stock", label: "Stock", type: "number", placeholder: "120" },
            { name: "supplier", label: "Supplier", type: "text", placeholder: "Volt Parts" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Available", "Low Stock", "Out of Stock"],
            },
          ],

          initialRecords: [
            {
              part_id: "SP-101",
              part_name: "Brake Pad",
              stock: "120",
              supplier: "Volt Parts",
              status: "Available",
            },
            {
              part_id: "SP-102",
              part_name: "Tyre",
              stock: "12",
              supplier: "Tyre World",
              status: "Low Stock",
            },
          ],
        },

        "fuel-inventory": {
          title: "Fuel Inventory",
          description: "Track fuel stock and usage.",
          primaryField: "fuel_id",

          fields: [
            { name: "fuel_id", label: "Fuel ID", type: "text", placeholder: "FUEL-101" },
            {
              name: "fuel_type",
              label: "Fuel Type",
              type: "select",
              options: ["Petrol", "Diesel", "CNG", "Electric"],
            },
            {
              name: "available_stock",
              label: "Available Stock",
              type: "number",
              placeholder: "2500",
            },
            { name: "unit", label: "Unit", type: "select", options: ["Litres", "kWh"] },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Available", "Low", "Critical"],
            },
          ],

          initialRecords: [
            {
              fuel_id: "FUEL-101",
              fuel_type: "Petrol",
              available_stock: "2500",
              unit: "Litres",
              status: "Available",
            },
            {
              fuel_id: "FUEL-102",
              fuel_type: "Diesel",
              available_stock: "400",
              unit: "Litres",
              status: "Low",
            },
          ],
        },
      };

      const key = child || "suppliers";

      return procurementTemplates[key] || procurementTemplates.suppliers;
    }
    case "crm": {
      const crmTemplates: Record<string, ModuleTemplate> = {
        support: {
          title: "Customer Support",
          description: "Manage customer support requests.",
          primaryField: "support_id",

          fields: [
            { name: "support_id", label: "Support ID", type: "text", placeholder: "SUP-101" },
            { name: "customer_name", label: "Customer", type: "text", placeholder: "Rahul Sharma" },
            {
              name: "issue_type",
              label: "Issue Type",
              type: "select",
              options: ["Ride", "Payment", "Account", "Wallet"],
            },
            {
              name: "assigned_to",
              label: "Assigned To",
              type: "text",
              placeholder: "Ankit Sharma",
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Open", "In Progress", "Resolved"],
            },
          ],

          initialRecords: [
            {
              support_id: "SUP-101",
              customer_name: "Rahul Sharma",
              issue_type: "Ride",
              assigned_to: "Ankit Sharma",
              status: "Open",
            },
            {
              support_id: "SUP-102",
              customer_name: "Priya Patel",
              issue_type: "Payment",
              assigned_to: "Neha Singh",
              status: "Resolved",
            },
          ],
        },

        complaints: {
          title: "Complaints",
          description: "Track customer complaints.",
          primaryField: "complaint_id",

          fields: [
            { name: "complaint_id", label: "Complaint ID", type: "text", placeholder: "CMP-101" },
            { name: "customer_name", label: "Customer", type: "text", placeholder: "Rahul Sharma" },
            {
              name: "category",
              label: "Category",
              type: "select",
              options: ["Driver", "Ride", "Payment", "App"],
            },
            {
              name: "priority",
              label: "Priority",
              type: "select",
              options: ["Low", "Medium", "High"],
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Open", "Pending", "Closed"],
            },
          ],

          initialRecords: [
            {
              complaint_id: "CMP-101",
              customer_name: "Rahul Sharma",
              category: "Driver",
              priority: "High",
              status: "Open",
            },
            {
              complaint_id: "CMP-102",
              customer_name: "Priya Patel",
              category: "Payment",
              priority: "Medium",
              status: "Closed",
            },
          ],
        },

        ticketing: {
          title: "Support Tickets",
          description: "Manage customer service tickets.",
          primaryField: "ticket_id",

          fields: [
            { name: "ticket_id", label: "Ticket ID", type: "text", placeholder: "TKT-101" },
            { name: "customer_name", label: "Customer", type: "text", placeholder: "Rahul Sharma" },
            { name: "subject", label: "Subject", type: "text", placeholder: "Refund Request" },
            {
              name: "priority",
              label: "Priority",
              type: "select",
              options: ["Low", "Medium", "High"],
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Open", "Pending", "Resolved"],
            },
          ],

          initialRecords: [
            {
              ticket_id: "TKT-101",
              customer_name: "Rahul Sharma",
              subject: "Refund Request",
              priority: "High",
              status: "Open",
            },
            {
              ticket_id: "TKT-102",
              customer_name: "Priya Patel",
              subject: "Wallet Issue",
              priority: "Medium",
              status: "Resolved",
            },
          ],
        },

        "live-chat": {
          title: "Live Chat",
          description: "Monitor customer live chat conversations.",
          primaryField: "chat_id",

          fields: [
            { name: "chat_id", label: "Chat ID", type: "text", placeholder: "CHAT-101" },
            { name: "customer_name", label: "Customer", type: "text", placeholder: "Rahul Sharma" },
            { name: "agent_name", label: "Agent", type: "text", placeholder: "Ankit Sharma" },
            { name: "started_at", label: "Started At", type: "datetime-local" },
            { name: "status", label: "Status", type: "select", options: ["Active", "Closed"] },
          ],

          initialRecords: [
            {
              chat_id: "CHAT-101",
              customer_name: "Rahul Sharma",
              agent_name: "Ankit Sharma",
              started_at: "2026-07-12T10:30",
              status: "Active",
            },
            {
              chat_id: "CHAT-102",
              customer_name: "Priya Patel",
              agent_name: "Neha Singh",
              started_at: "2026-07-11T16:00",
              status: "Closed",
            },
          ],
        },

        "call-logs": {
          title: "Call Logs",
          description: "Track customer support calls.",
          primaryField: "call_id",

          fields: [
            { name: "call_id", label: "Call ID", type: "text", placeholder: "CALL-101" },
            { name: "customer_name", label: "Customer", type: "text", placeholder: "Rahul Sharma" },
            { name: "agent_name", label: "Agent", type: "text", placeholder: "Ankit Sharma" },
            { name: "duration", label: "Duration", type: "text", placeholder: "08:45" },
            { name: "status", label: "Status", type: "select", options: ["Completed", "Missed"] },
          ],

          initialRecords: [
            {
              call_id: "CALL-101",
              customer_name: "Rahul Sharma",
              agent_name: "Ankit Sharma",
              duration: "08:45",
              status: "Completed",
            },
            {
              call_id: "CALL-102",
              customer_name: "Priya Patel",
              agent_name: "Neha Singh",
              duration: "03:20",
              status: "Missed",
            },
          ],
        },

        feedback: {
          title: "Customer Feedback",
          description: "Collect and review customer feedback.",
          primaryField: "feedback_id",

          fields: [
            { name: "feedback_id", label: "Feedback ID", type: "text", placeholder: "FDB-101" },
            { name: "customer_name", label: "Customer", type: "text", placeholder: "Rahul Sharma" },
            { name: "rating", label: "Rating", type: "select", options: ["1", "2", "3", "4", "5"] },
            {
              name: "category",
              label: "Category",
              type: "select",
              options: ["Driver", "Ride", "Support", "App"],
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["New", "Reviewed", "Closed"],
            },
          ],

          initialRecords: [
            {
              feedback_id: "FDB-101",
              customer_name: "Rahul Sharma",
              rating: "5",
              category: "Driver",
              status: "Reviewed",
            },
            {
              feedback_id: "FDB-102",
              customer_name: "Priya Patel",
              rating: "4",
              category: "Support",
              status: "New",
            },
          ],
        },
      };

      const key = child || "support";

      return crmTemplates[key] || crmTemplates.support;
    }
    case "marketing": {
      const marketingTemplates: Record<string, ModuleTemplate> = {
        campaigns: {
          title: "Marketing Campaigns",
          description: "Manage marketing campaigns across multiple channels.",
          primaryField: "campaign_id",

          fields: [
            { name: "campaign_id", label: "Campaign ID", type: "text", placeholder: "CMP-101" },
            {
              name: "campaign_name",
              label: "Campaign Name",
              type: "text",
              placeholder: "Weekend Ride Offer",
            },
            {
              name: "channel",
              label: "Channel",
              type: "select",
              options: ["SMS", "Email", "Push Notification", "WhatsApp"],
            },
            { name: "budget", label: "Budget", type: "number", placeholder: "15000" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Draft", "Live", "Paused", "Completed"],
            },
          ],

          initialRecords: [
            {
              campaign_id: "CMP-101",
              campaign_name: "Weekend Ride Offer",
              channel: "SMS",
              budget: "15000",
              status: "Live",
            },
            {
              campaign_id: "CMP-102",
              campaign_name: "Airport Discount",
              channel: "Push Notification",
              budget: "22000",
              status: "Draft",
            },
          ],
        },

        referral: {
          title: "Referral Program",
          description: "Manage customer referral campaigns.",
          primaryField: "referral_id",

          fields: [
            { name: "referral_id", label: "Referral ID", type: "text", placeholder: "REF-101" },
            { name: "customer_name", label: "Customer", type: "text", placeholder: "Rahul Sharma" },
            {
              name: "referred_user",
              label: "Referred User",
              type: "text",
              placeholder: "Priya Patel",
            },
            { name: "reward", label: "Reward", type: "number", placeholder: "100" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Pending", "Completed", "Expired"],
            },
          ],

          initialRecords: [
            {
              referral_id: "REF-101",
              customer_name: "Rahul Sharma",
              referred_user: "Priya Patel",
              reward: "100",
              status: "Completed",
            },
            {
              referral_id: "REF-102",
              customer_name: "Amit Kumar",
              referred_user: "Rohit Singh",
              reward: "150",
              status: "Pending",
            },
          ],
        },

        coupons: {
          title: "Coupons",
          description: "Create and manage promotional coupons.",
          primaryField: "coupon_code",

          fields: [
            { name: "coupon_code", label: "Coupon Code", type: "text", placeholder: "SAVE50" },
            { name: "discount", label: "Discount (%)", type: "number", placeholder: "50" },
            { name: "valid_until", label: "Valid Until", type: "date" },
            { name: "usage_limit", label: "Usage Limit", type: "number", placeholder: "1000" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Expired", "Disabled"],
            },
          ],

          initialRecords: [
            {
              coupon_code: "SAVE50",
              discount: "50",
              valid_until: "2026-07-30",
              usage_limit: "1000",
              status: "Active",
            },
            {
              coupon_code: "FIRST100",
              discount: "100",
              valid_until: "2026-08-10",
              usage_limit: "500",
              status: "Active",
            },
          ],
        },

        loyalty: {
          title: "Loyalty Program",
          description: "Manage customer loyalty rewards.",
          primaryField: "member_id",

          fields: [
            { name: "member_id", label: "Member ID", type: "text", placeholder: "LOY-101" },
            { name: "customer_name", label: "Customer", type: "text", placeholder: "Rahul Sharma" },
            { name: "points", label: "Reward Points", type: "number", placeholder: "2400" },
            {
              name: "tier",
              label: "Tier",
              type: "select",
              options: ["Silver", "Gold", "Platinum"],
            },
            { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
          ],

          initialRecords: [
            {
              member_id: "LOY-101",
              customer_name: "Rahul Sharma",
              points: "2400",
              tier: "Gold",
              status: "Active",
            },
            {
              member_id: "LOY-102",
              customer_name: "Priya Patel",
              points: "5100",
              tier: "Platinum",
              status: "Active",
            },
          ],
        },

        promotions: {
          title: "Promotions",
          description: "Manage seasonal and regional promotions.",
          primaryField: "promotion_id",

          fields: [
            { name: "promotion_id", label: "Promotion ID", type: "text", placeholder: "PRO-101" },
            {
              name: "promotion_name",
              label: "Promotion Name",
              type: "text",
              placeholder: "Monsoon Offer",
            },
            { name: "region", label: "Region", type: "text", placeholder: "Delhi NCR" },
            { name: "discount", label: "Discount (%)", type: "number", placeholder: "20" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Upcoming", "Active", "Ended"],
            },
          ],

          initialRecords: [
            {
              promotion_id: "PRO-101",
              promotion_name: "Monsoon Offer",
              region: "Delhi NCR",
              discount: "20",
              status: "Active",
            },
            {
              promotion_id: "PRO-102",
              promotion_name: "Festival Ride",
              region: "Mumbai",
              discount: "30",
              status: "Upcoming",
            },
          ],
        },
      };

      const key = child || "campaigns";

      return marketingTemplates[key] || marketingTemplates.campaigns;
    }
    case "notifications": {
      const notificationTemplates: Record<string, ModuleTemplate> = {
        sms: {
          title: "SMS Notifications",
          description: "Manage SMS notification campaigns.",
          primaryField: "sms_id",

          fields: [
            { name: "sms_id", label: "SMS ID", type: "text", placeholder: "SMS-101" },
            { name: "title", label: "Title", type: "text", placeholder: "Ride Reminder" },
            { name: "audience", label: "Audience", type: "text", placeholder: "Active Customers" },
            { name: "schedule", label: "Schedule", type: "date" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Draft", "Scheduled", "Sent"],
            },
          ],

          initialRecords: [
            {
              sms_id: "SMS-101",
              title: "Ride Reminder",
              audience: "Active Customers",
              schedule: "2026-07-20",
              status: "Scheduled",
            },
            {
              sms_id: "SMS-102",
              title: "Offer Alert",
              audience: "Premium Users",
              schedule: "2026-07-22",
              status: "Draft",
            },
          ],
        },

        email: {
          title: "Email Notifications",
          description: "Manage promotional and transactional emails.",
          primaryField: "email_id",

          fields: [
            { name: "email_id", label: "Email ID", type: "text", placeholder: "EMAIL-101" },
            { name: "subject", label: "Subject", type: "text", placeholder: "Weekend Offer" },
            { name: "audience", label: "Audience", type: "text", placeholder: "All Customers" },
            { name: "schedule", label: "Schedule", type: "date" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Draft", "Scheduled", "Sent"],
            },
          ],

          initialRecords: [
            {
              email_id: "EMAIL-101",
              subject: "Weekend Offer",
              audience: "All Customers",
              schedule: "2026-07-18",
              status: "Scheduled",
            },
            {
              email_id: "EMAIL-102",
              subject: "Referral Bonus",
              audience: "Premium Users",
              schedule: "2026-07-25",
              status: "Draft",
            },
          ],
        },

        "push-notifications": {
          title: "Push Notifications",
          description: "Manage mobile push notifications.",
          primaryField: "push_id",

          fields: [
            { name: "push_id", label: "Push ID", type: "text", placeholder: "PUSH-101" },
            { name: "title", label: "Title", type: "text", placeholder: "Driver Arriving" },
            { name: "audience", label: "Audience", type: "text", placeholder: "Active Riders" },
            {
              name: "priority",
              label: "Priority",
              type: "select",
              options: ["Low", "Medium", "High"],
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Draft", "Scheduled", "Sent"],
            },
          ],

          initialRecords: [
            {
              push_id: "PUSH-101",
              title: "Driver Arriving",
              audience: "Active Riders",
              priority: "High",
              status: "Sent",
            },
            {
              push_id: "PUSH-102",
              title: "Ride Completed",
              audience: "All Riders",
              priority: "Medium",
              status: "Scheduled",
            },
          ],
        },

        whatsapp: {
          title: "WhatsApp Notifications",
          description: "Send WhatsApp updates to customers.",
          primaryField: "wa_id",

          fields: [
            { name: "wa_id", label: "WhatsApp ID", type: "text", placeholder: "WA-101" },
            { name: "template", label: "Template", type: "text", placeholder: "Ride OTP" },
            { name: "audience", label: "Audience", type: "text", placeholder: "New Riders" },
            { name: "sender", label: "Sender", type: "text", placeholder: "Rapido Business" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Draft", "Scheduled", "Sent"],
            },
          ],

          initialRecords: [
            {
              wa_id: "WA-101",
              template: "Ride OTP",
              audience: "New Riders",
              sender: "Rapido Business",
              status: "Sent",
            },
            {
              wa_id: "WA-102",
              template: "Referral Reward",
              audience: "Premium Users",
              sender: "Rapido Business",
              status: "Scheduled",
            },
          ],
        },

        "in-app-notifications": {
          title: "In-App Notifications",
          description: "Manage notifications displayed inside the application.",
          primaryField: "notification_id",

          fields: [
            {
              name: "notification_id",
              label: "Notification ID",
              type: "text",
              placeholder: "APP-101",
            },
            { name: "title", label: "Title", type: "text", placeholder: "New Coupon Available" },
            { name: "audience", label: "Audience", type: "text", placeholder: "Gold Members" },
            {
              name: "category",
              label: "Category",
              type: "select",
              options: ["Promotion", "Ride", "Wallet", "System"],
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Draft", "Published", "Expired"],
            },
          ],

          initialRecords: [
            {
              notification_id: "APP-101",
              title: "New Coupon Available",
              audience: "Gold Members",
              category: "Promotion",
              status: "Published",
            },
            {
              notification_id: "APP-102",
              title: "Wallet Cashback",
              audience: "All Users",
              category: "Wallet",
              status: "Draft",
            },
          ],
        },
      };

      const key = child || "sms";

      return notificationTemplates[key] || notificationTemplates.sms;
    }
    case "assets": {
      const assetTemplates: Record<string, ModuleTemplate> = {
        office: {
          title: "Office Assets",
          description: "Register and track office assets like furniture and equipment.",
          primaryField: "asset_id",
          fields: [
            { name: "asset_id", label: "Asset ID", type: "text", placeholder: "AS-1001" },
            { name: "name", label: "Asset Name", type: "text", placeholder: "Standing Desk" },
            { name: "department", label: "Department", type: "text", placeholder: "Engineering" },
            {
              name: "condition",
              label: "Condition",
              type: "select",
              options: ["New", "Good", "Fair", "Needs Repair"],
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["In Stock", "Assigned", "Retired"],
            },
          ],
          initialRecords: [
            {
              asset_id: "AS-1001",
              name: "Standing Desk",
              department: "Engineering",
              condition: "Good",
              status: "Assigned",
            },
            {
              asset_id: "AS-1002",
              name: "Conference Table",
              department: "Ops",
              condition: "Fair",
              status: "In Stock",
            },
            {
              asset_id: "AS-1003",
              name: "Projector",
              department: "Sales",
              condition: "New",
              status: "Assigned",
            },
            {
              asset_id: "AS-1004",
              name: "Coffee Machine",
              department: "Facilities",
              condition: "Good",
              status: "In Stock",
            },
          ],
        },
        vehicles: {
          title: "Vehicles",
          description: "Track company vehicles and assignments.",
          primaryField: "vehicle_id",
          fields: [
            { name: "vehicle_id", label: "Vehicle ID", type: "text", placeholder: "KA-01-AB-1234" },
            { name: "plate", label: "Plate", type: "text", placeholder: "KA-01-AB-1234" },
            { name: "model", label: "Model", type: "text", placeholder: "City EV" },
            { name: "owner", label: "Owner", type: "text", placeholder: "Company Fleet" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Maintenance", "Retired"],
            },
          ],
          initialRecords: [
            {
              vehicle_id: "VH-1001",
              plate: "KA-01-AB-1234",
              model: "City EV",
              owner: "Company Fleet",
              status: "Active",
            },
            {
              vehicle_id: "VH-1002",
              plate: "KA-02-CD-5678",
              model: "City Ride",
              owner: "Company Fleet",
              status: "Maintenance",
            },
            {
              vehicle_id: "VH-1003",
              plate: "KA-03-EF-9012",
              model: "Courier Van",
              owner: "Company Fleet",
              status: "Active",
            },
            {
              vehicle_id: "VH-1004",
              plate: "KA-04-GH-3456",
              model: "Service Truck",
              owner: "Company Fleet",
              status: "Retired",
            },
          ],
        },
        computers: {
          title: "Computers",
          description: "Inventory of desktops, laptops and related peripherals.",
          primaryField: "asset_id",
          fields: [
            { name: "asset_id", label: "Asset ID", type: "text", placeholder: "PC-2001" },
            { name: "serial", label: "Serial No.", type: "text", placeholder: "SN-XYZ-001" },
            { name: "model", label: "Model", type: "text", placeholder: "MacBook Pro" },
            { name: "assigned_to", label: "Assigned To", type: "text", placeholder: "Ritika Nair" },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Deployed", "In Stock", "Repair"],
            },
          ],
          initialRecords: [
            {
              asset_id: "PC-2001",
              serial: "SN-001",
              model: "MacBook Pro",
              assigned_to: "Ritika Nair",
              status: "Deployed",
            },
            {
              asset_id: "PC-2002",
              serial: "SN-002",
              model: "Dell XPS",
              assigned_to: "Ankit Sharma",
              status: "Deployed",
            },
            {
              asset_id: "PC-2003",
              serial: "SN-003",
              model: "Lenovo ThinkPad",
              assigned_to: "",
              status: "In Stock",
            },
            {
              asset_id: "PC-2004",
              serial: "SN-004",
              model: "iMac",
              assigned_to: "Design Team",
              status: "Repair",
            },
          ],
        },
        mobile: {
          title: "Mobile Devices",
          description: "Track company mobile devices and SIMs.",
          primaryField: "asset_id",
          fields: [
            { name: "asset_id", label: "Asset ID", type: "text", placeholder: "MB-3001" },
            { name: "imei", label: "IMEI", type: "text", placeholder: "359876543210123" },
            { name: "model", label: "Model", type: "text", placeholder: "iPhone 14" },
            {
              name: "assigned_to",
              label: "Assigned To",
              type: "text",
              placeholder: "Support Team",
            },
            {
              name: "status",
              label: "Status",
              type: "select",
              options: ["Active", "Spare", "Retired"],
            },
          ],
          initialRecords: [
            {
              asset_id: "MB-3001",
              imei: "359876543210123",
              model: "iPhone 14",
              assigned_to: "Support Team",
              status: "Active",
            },
            {
              asset_id: "MB-3002",
              imei: "359876543210124",
              model: "Pixel 7",
              assigned_to: "Field Ops",
              status: "Active",
            },
            {
              asset_id: "MB-3003",
              imei: "359876543210125",
              model: "Samsung S23",
              assigned_to: "",
              status: "Spare",
            },
            {
              asset_id: "MB-3004",
              imei: "359876543210126",
              model: "iPhone SE",
              assigned_to: "",
              status: "Retired",
            },
          ],
        },
      };
      const key = child || "office";
      return assetTemplates[key] || assetTemplates.office;
    }
    case "settings": {
      const settingsTemplates: Record<string, ModuleTemplate> = {
        general: {
          title: "General Settings",
          description: "Core application-wide settings like site name, timezone and defaults.",
          primaryField: "site_name",
          fields: [
            { name: "site_name", label: "Site Name", type: "text", placeholder: "Sora Admin" },
            { name: "timezone", label: "Timezone", type: "text", placeholder: "Asia/Kolkata" },
            { name: "currency", label: "Currency", type: "text", placeholder: "INR" },
            { name: "language", label: "Language", type: "text", placeholder: "en-IN" },
            { name: "status", label: "Status", type: "select", options: ["Active", "Maintenance"] },
          ],
          initialRecords: [
            {
              site_name: "Sora Admin",
              timezone: "Asia/Kolkata",
              currency: "INR",
              language: "en-IN",
              status: "Active",
            },
            {
              site_name: "Sora Staging",
              timezone: "Asia/Kolkata",
              currency: "INR",
              language: "en-IN",
              status: "Maintenance",
            },
            {
              site_name: "Sora EU",
              timezone: "Europe/Berlin",
              currency: "EUR",
              language: "en-GB",
              status: "Active",
            },
            {
              site_name: "Sora US",
              timezone: "America/New_York",
              currency: "USD",
              language: "en-US",
              status: "Active",
            },
          ],
        },
        branding: {
          title: "Branding",
          description: "Manage logos, colors and brand elements.",
          primaryField: "brand_name",
          fields: [
            { name: "brand_name", label: "Brand Name", type: "text", placeholder: "Sora" },
            { name: "logo_url", label: "Logo URL", type: "text", placeholder: "https://..." },
            { name: "primary_color", label: "Primary Color", type: "text", placeholder: "#0EA5A4" },
            {
              name: "secondary_color",
              label: "Secondary Color",
              type: "text",
              placeholder: "#06B6D4",
            },
            { name: "status", label: "Status", type: "select", options: ["Active", "Draft"] },
          ],
          initialRecords: [
            {
              brand_name: "Sora",
              logo_url: "",
              primary_color: "#0EA5A4",
              secondary_color: "#06B6D4",
              status: "Active",
            },
            {
              brand_name: "Sora Dark",
              logo_url: "",
              primary_color: "#0F172A",
              secondary_color: "#0EA5A4",
              status: "Draft",
            },
            {
              brand_name: "Sora Lite",
              logo_url: "",
              primary_color: "#F8FAFC",
              secondary_color: "#06B6D4",
              status: "Active",
            },
            {
              brand_name: "Sora Blue",
              logo_url: "",
              primary_color: "#0EA5A4",
              secondary_color: "#0369A1",
              status: "Active",
            },
          ],
        },
        theme: {
          title: "Theme",
          description: "Application theme and appearance settings.",
          primaryField: "theme",
          fields: [
            { name: "theme", label: "Theme", type: "select", options: ["Light", "Dark", "System"] },
            { name: "dark_mode", label: "Dark Mode", type: "select", options: ["On", "Off"] },
            { name: "accent", label: "Accent Color", type: "text", placeholder: "#06B6D4" },
            { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
            { name: "notes", label: "Notes", type: "textarea" },
          ],
          initialRecords: [
            {
              theme: "Light",
              dark_mode: "Off",
              accent: "#06B6D4",
              status: "Active",
              notes: "Default light theme",
            },
            {
              theme: "Dark",
              dark_mode: "On",
              accent: "#0EA5A4",
              status: "Active",
              notes: "Default dark theme",
            },
            {
              theme: "System",
              dark_mode: "Off",
              accent: "#0369A1",
              status: "Active",
              notes: "Follow system preference",
            },
            {
              theme: "High Contrast",
              dark_mode: "On",
              accent: "#000000",
              status: "Inactive",
              notes: "Accessibility option",
            },
          ],
        },
        currency: {
          title: "Currency",
          description: "Currency settings, symbols and exchange rates.",
          primaryField: "currency",
          fields: [
            { name: "currency", label: "Currency", type: "text", placeholder: "INR" },
            { name: "symbol", label: "Symbol", type: "text", placeholder: "₹" },
            { name: "exchange_rate", label: "Exchange Rate", type: "text", placeholder: "1.00" },
            { name: "status", label: "Status", type: "select", options: ["Active", "Disabled"] },
            { name: "notes", label: "Notes", type: "textarea" },
          ],
          initialRecords: [
            { currency: "INR", symbol: "₹", exchange_rate: "1.00", status: "Active" },
            { currency: "USD", symbol: "$", exchange_rate: "0.012", status: "Active" },
            { currency: "EUR", symbol: "€", exchange_rate: "0.011", status: "Active" },
            { currency: "GBP", symbol: "£", exchange_rate: "0.009", status: "Active" },
          ],
        },
        language: {
          title: "Language",
          description: "Available languages and default locale.",
          primaryField: "language",
          fields: [
            { name: "language", label: "Language", type: "text", placeholder: "English" },
            { name: "default_locale", label: "Default Locale", type: "text", placeholder: "en-IN" },
            { name: "status", label: "Status", type: "select", options: ["Active", "Disabled"] },
            { name: "notes", label: "Notes", type: "textarea" },
            {
              name: "translator",
              label: "Translator",
              type: "text",
              placeholder: "External Service",
            },
          ],
          initialRecords: [
            { language: "English", default_locale: "en-IN", status: "Active", translator: "Local" },
            { language: "Hindi", default_locale: "hi-IN", status: "Active", translator: "Local" },
            { language: "Kannada", default_locale: "kn-IN", status: "Active", translator: "Local" },
            {
              language: "Spanish",
              default_locale: "es-ES",
              status: "Disabled",
              translator: "External",
            },
          ],
        },
        timezone: {
          title: "Timezone",
          description: "Default timezone and offsets used by the app.",
          primaryField: "timezone",
          fields: [
            { name: "timezone", label: "Timezone", type: "text", placeholder: "Asia/Kolkata" },
            {
              name: "default_offset",
              label: "Default Offset",
              type: "text",
              placeholder: "+05:30",
            },
            { name: "status", label: "Status", type: "select", options: ["Active", "Deprecated"] },
            { name: "notes", label: "Notes", type: "textarea" },
            { name: "region", label: "Region", type: "text", placeholder: "Asia" },
          ],
          initialRecords: [
            {
              timezone: "Asia/Kolkata",
              default_offset: "+05:30",
              status: "Active",
              region: "Asia",
            },
            {
              timezone: "Europe/Berlin",
              default_offset: "+02:00",
              status: "Active",
              region: "Europe",
            },
            {
              timezone: "America/New_York",
              default_offset: "-04:00",
              status: "Active",
              region: "America",
            },
            { timezone: "UTC", default_offset: "+00:00", status: "Active", region: "Global" },
          ],
        },
        email: {
          title: "Email",
          description: "Configure SMTP and transactional email settings.",
          primaryField: "smtp_host",
          fields: [
            {
              name: "smtp_host",
              label: "SMTP Host",
              type: "text",
              placeholder: "smtp.mailgun.org",
            },
            { name: "smtp_port", label: "SMTP Port", type: "number", placeholder: "587" },
            {
              name: "from_email",
              label: "From Email",
              type: "text",
              placeholder: "noreply@sora.com",
            },
            { name: "status", label: "Status", type: "select", options: ["Active", "Disabled"] },
            { name: "notes", label: "Notes", type: "textarea" },
          ],
          initialRecords: [
            {
              smtp_host: "smtp.mailgun.org",
              smtp_port: "587",
              from_email: "noreply@sora.com",
              status: "Active",
            },
            {
              smtp_host: "smtp.sendgrid.net",
              smtp_port: "587",
              from_email: "alerts@sora.com",
              status: "Active",
            },
            {
              smtp_host: "smtp.example.com",
              smtp_port: "465",
              from_email: "dev@sora.com",
              status: "Disabled",
            },
            { smtp_host: "", smtp_port: "", from_email: "", status: "Disabled" },
          ],
        },
        sms: {
          title: "SMS",
          description: "SMS gateway and sender configuration.",
          primaryField: "provider",
          fields: [
            { name: "provider", label: "Provider", type: "text", placeholder: "Twilio" },
            { name: "api_key", label: "API Key", type: "text", placeholder: "sk_XXXX" },
            {
              name: "from_number",
              label: "From Number",
              type: "text",
              placeholder: "+919999999999",
            },
            { name: "status", label: "Status", type: "select", options: ["Active", "Disabled"] },
            { name: "notes", label: "Notes", type: "textarea" },
          ],
          initialRecords: [
            { provider: "Twilio", api_key: "", from_number: "+919999999999", status: "Active" },
            { provider: "Msg91", api_key: "", from_number: "+919888888888", status: "Active" },
            { provider: "Mock", api_key: "", from_number: "", status: "Disabled" },
            { provider: "", api_key: "", from_number: "", status: "Disabled" },
          ],
        },
        storage: {
          title: "Storage",
          description: "Object storage providers and buckets for media.",
          primaryField: "provider",
          fields: [
            { name: "provider", label: "Provider", type: "text", placeholder: "S3" },
            { name: "bucket", label: "Bucket", type: "text", placeholder: "sora-assets" },
            { name: "region", label: "Region", type: "text", placeholder: "ap-south-1" },
            { name: "status", label: "Status", type: "select", options: ["Active", "Disabled"] },
            { name: "notes", label: "Notes", type: "textarea" },
          ],
          initialRecords: [
            { provider: "S3", bucket: "sora-assets", region: "ap-south-1", status: "Active" },
            { provider: "GCS", bucket: "sora-assets-gcs", region: "asia-south1", status: "Active" },
            { provider: "Local", bucket: "local-media", region: "local", status: "Disabled" },
            { provider: "", bucket: "", region: "", status: "Disabled" },
          ],
        },
        api: {
          title: "API",
          description: "API keys, rate limits and access control.",
          primaryField: "api_key",
          fields: [
            { name: "api_key", label: "API Key", type: "text", placeholder: "sk_XXXX" },
            { name: "rate_limit", label: "Rate Limit", type: "text", placeholder: "1000/min" },
            { name: "status", label: "Status", type: "select", options: ["Active", "Disabled"] },
            { name: "notes", label: "Notes", type: "textarea" },
            { name: "whitelist", label: "Whitelist", type: "text", placeholder: "127.0.0.1" },
          ],
          initialRecords: [
            { api_key: "sk-prod-001", rate_limit: "1000/min", status: "Active", whitelist: "" },
            { api_key: "sk-stg-001", rate_limit: "500/min", status: "Active", whitelist: "" },
            {
              api_key: "sk-dev-001",
              rate_limit: "100/min",
              status: "Disabled",
              whitelist: "127.0.0.1",
            },
            { api_key: "", rate_limit: "", status: "Disabled", whitelist: "" },
          ],
        },
        seo: {
          title: "SEO",
          description: "Site meta tags and indexing controls.",
          primaryField: "meta_title",
          fields: [
            { name: "meta_title", label: "Meta Title", type: "text", placeholder: "Sora - Admin" },
            {
              name: "meta_description",
              label: "Meta Description",
              type: "textarea",
              placeholder: "Admin panel for Sora",
            },
            {
              name: "meta_keywords",
              label: "Meta Keywords",
              type: "text",
              placeholder: "rides, fleet, admin",
            },
            { name: "robots", label: "Robots", type: "text", placeholder: "index,follow" },
            { name: "status", label: "Status", type: "select", options: ["Active", "Disabled"] },
          ],
          initialRecords: [
            {
              meta_title: "Sora Admin",
              meta_description: "Admin panel",
              meta_keywords: "sora,admin",
              robots: "index,follow",
              status: "Active",
            },
            {
              meta_title: "Sora Staging",
              meta_description: "Staging panel",
              meta_keywords: "staging",
              robots: "noindex",
              status: "Disabled",
            },
            {
              meta_title: "",
              meta_description: "",
              meta_keywords: "",
              robots: "noindex",
              status: "Disabled",
            },
            {
              meta_title: "",
              meta_description: "",
              meta_keywords: "",
              robots: "noindex",
              status: "Disabled",
            },
          ],
        },
        cache: {
          title: "Cache",
          description: "Cache provider and TTL settings.",
          primaryField: "cache_provider",
          fields: [
            { name: "cache_provider", label: "Cache Provider", type: "text", placeholder: "Redis" },
            { name: "ttl", label: "TTL (sec)", type: "number", placeholder: "3600" },
            { name: "status", label: "Status", type: "select", options: ["Active", "Disabled"] },
            { name: "notes", label: "Notes", type: "textarea" },
            { name: "region", label: "Region", type: "text", placeholder: "ap-south-1" },
          ],
          initialRecords: [
            { cache_provider: "Redis", ttl: "3600", status: "Active", region: "ap-south-1" },
            { cache_provider: "Memcached", ttl: "1800", status: "Active", region: "" },
            { cache_provider: "Local", ttl: "60", status: "Disabled", region: "" },
            { cache_provider: "", ttl: "", status: "Disabled", region: "" },
          ],
        },
        ai: {
          title: "AI Settings",
          description: "Configure AI providers, models and keys for features.",
          primaryField: "model",
          fields: [
            { name: "model", label: "Model", type: "text", placeholder: "gpt-5-mini" },
            { name: "provider", label: "Provider", type: "text", placeholder: "OpenAI" },
            { name: "api_key", label: "API Key", type: "text", placeholder: "sk_XXXX" },
            { name: "status", label: "Status", type: "select", options: ["Active", "Disabled"] },
            { name: "notes", label: "Notes", type: "textarea" },
          ],
          initialRecords: [
            { model: "gpt-5-mini", provider: "OpenAI", api_key: "", status: "Active" },
            { model: "sora-ai-1", provider: "SoraAI", api_key: "", status: "Disabled" },
            { model: "", provider: "", api_key: "", status: "Disabled" },
            { model: "", provider: "", api_key: "", status: "Disabled" },
          ],
        },
      };
      const key = child || "general";
      return settingsTemplates[key] || settingsTemplates.general;
    }

    case "security":
      return {
        title: `${titleize(section)} record`,
        description: `Create a sample ${titleize(section).toLowerCase()} entry to prototype the workflow.`,
        primaryField: "name",
        fields: [
          { name: "name", label: "Name", type: "text", placeholder: "Sample entry" },
          { name: "owner", label: "Owner", type: "text", placeholder: "Ops team" },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: ["Draft", "Active", "Review"],
          },
          { name: "notes", label: "Notes", type: "textarea", placeholder: "Implementation notes" },
        ],
        initialRecords: [
          {
            name: "Sample entry",
            owner: "Ops team",
            status: "Active",
            notes: "Ready for development",
          },
        ],
      };
    default:
      return {
        title: "Module entry",
        description: "Create a sample entry for the selected module and see it appear instantly.",
        primaryField: "name",
        fields: [
          { name: "name", label: "Name", type: "text", placeholder: "Entry name" },
          { name: "owner", label: "Owner", type: "text", placeholder: "Operations" },
          {
            name: "status",
            label: "Status",
            type: "select",
            options: ["Draft", "Active", "Review"],
          },
          { name: "notes", label: "Notes", type: "textarea", placeholder: "Notes for the team" },
        ],
        initialRecords: [
          {
            name: "Demo entry",
            owner: "Operations",
            status: "Active",
            notes: "Ready for development",
          },
        ],
      };
  }
}

function ModuleStubPage() {
  const { _splat } = Route.useParams();
  const parts = (_splat ?? "").split("/").filter(Boolean);
  const [sectionId, ...rest] = parts;
  const section = NAV_SECTIONS.find((s) => s.id === sectionId);
  const currentPath = `/m/${parts.join("/")}`;
  let childPath = rest.join("/");
  // Support opening settings via query param like /m/settings?tab=general
  if ((sectionId === "settings" || section?.id === "settings") && !childPath) {
    try {
      const params = new URLSearchParams(
        typeof window !== "undefined" ? window.location.search : "",
      );
      const tab = params.get("tab");
      if (tab) childPath = tab;
    } catch (e) {
      // ignore in non-browser environments
    }
  }
  const child = section?.children?.find((c) => {
    const [base, query] = c.path.split("?");
    if (query) {
      const params = new URLSearchParams(query);
      const tab = params.get("tab") ?? "";
      return tab === childPath;
    }
    // match explicit /m/ paths or simple paths
    if (c.path === currentPath) return true;
    if (c.path.startsWith("/m/") && c.path === `/m/${sectionId}/${childPath}`) return true;
    if (c.path === `/${sectionId}/${childPath}`) return true;
    return false;
  });

  const pageTitle = child?.label ?? (section ? section.label : titleize(sectionId ?? "Module"));
  const parentLabel = section?.label ?? "Modules";
  const template = getModuleTemplate(sectionId ?? "", childPath);
  const templateId = `${sectionId ?? "module"}-${childPath || "index"}`;
  const [records, setRecords] = useState<Record<string, string>[]>([]);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);
  const [viewRecord, setViewRecord] = useState<Record<string, string> | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<Record<string, string> | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editFormValues, setEditFormValues] = useState<Record<string, string>>({});
  const [roles, setRoles] = useState<string[]>([]);
  const [activeRole, setActiveRole] = useState("");
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [rolePermissions, setRolePermissions] = useState<
    Record<string, Record<string, Record<string, boolean>>>
  >({});
  const importRef = useRef<HTMLInputElement | null>(null);
  const isIAMRolesPage = sectionId === "iam" && childPath === "roles";
  const roleModules = [
    "Dashboard",
    "Users",
    "Roles",
    "Customers",
    "Riders",
    "Finance",
    "Accounts",
    "Subscriptions",
    "Billing",
    "Revenue",
  ];
  const permissionActions = [
    "View",
    "Create",
    "Edit",
    "Delete",
    "Import",
    "Export",
    "Approve",
    "Reject",
  ];

  const createDefaultPermissions = () =>
    Object.fromEntries(
      roleModules.map((module) => [
        module,
        Object.fromEntries(permissionActions.map((action) => [action, false])),
      ]),
    );

  useEffect(() => {
    setRecords(
      template.initialRecords.map((record, index) => ({
        id: record.id ?? `record-${templateId}-${index}`,
        ...record,
      })),
    );
    setFormValues(Object.fromEntries(template.fields.map((field) => [field.name, ""])));
    setSearchQuery("");
    setStatusFilter("");
    setSelectedRecordIds([]);

    if (isIAMRolesPage) {
      const initialRoles = [
        "Super Admin",
        "Organization Owner",
        "Branch Manager",
        "Kitchen Manager",
        "Delivery Manager",
      ];
      setRoles(initialRoles);
      setActiveRole("Branch Manager");
      setRolePermissions(
        Object.fromEntries(initialRoles.map((role) => [role, createDefaultPermissions()])),
      );
    }
  }, [templateId, isIAMRolesPage]);
  const handleEditSubmit = () => {
    if (!editRecord) return;
    setRecords((current) =>
      current.map((rec) => (rec.id === editRecord.id ? { ...rec, ...editFormValues } : rec)),
    );
    setEditOpen(false);
    setEditRecord(null);
  };
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextRecord = Object.fromEntries(
      Object.entries(formValues).filter(([, value]) => value.trim() !== ""),
    );

    if (Object.keys(nextRecord).length === 0) {
      return;
    }

    setRecords((current) => [
      {
        ...nextRecord,
        id: `entry-${Date.now().toString().slice(-4)}`,
      },
      ...current,
    ]);
    setFormValues(Object.fromEntries(template.fields.map((field) => [field.name, ""])));
  };

  const filteredRecords = records.filter((r) => {
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      const found = Object.values(r).some((v) =>
        String(v || "")
          .toLowerCase()
          .includes(q),
      );
      if (!found) return false;
    }
    if (statusFilter) {
      if ((r.status || "") !== statusFilter) return false;
    }
    return true;
  });

  const selectedRecords = filteredRecords.filter((r) => selectedRecordIds.includes(String(r.id)));

  const exportCSV = (onlySelected = false) => {
    const source = onlySelected ? selectedRecords : records;
    if (!source.length) return;
    const headers = Array.from(new Set(source.flatMap(Object.keys)));
    const rows = [headers.join(",")];
    for (const rec of source) {
      rows.push(headers.map((h) => `"${String(rec[h] ?? "").replace(/"/g, '""')}"`).join(","));
    }
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${template.title.replace(/\s+/g, "-").toLowerCase()}-export.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const allFilteredSelected =
    filteredRecords.length > 0 &&
    filteredRecords.every((r) => selectedRecordIds.includes(String(r.id)));
  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedRecordIds([]);
    } else {
      setSelectedRecordIds(filteredRecords.map((r) => String(r.id)));
    }
  };

  const toggleRolePermission = (module: string, action: string) => {
    if (!activeRole) return;
    setRolePermissions((current) => ({
      ...current,
      [activeRole]: {
        ...current[activeRole],
        [module]: {
          ...current[activeRole]?.[module],
          [action]: !current[activeRole]?.[module]?.[action],
        },
      },
    }));
  };

  const handleRowToggle = (id: string) => {
    setSelectedRecordIds((current) =>
      current.includes(id) ? current.filter((selectedId) => selectedId !== id) : [...current, id],
    );
  };

  const handleImportFile = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = String(reader.result || "");
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (!lines.length) return;
      const headers = lines[0].split(",").map((h) => h.replace(/(^\s+|\s+$|\"|\')/g, ""));
      const newRecords: Record<string, string>[] = [];
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(",");
        const obj: Record<string, string> = {};
        for (let j = 0; j < headers.length; j++) {
          obj[headers[j]] = (cols[j] || "").replace(/(^\s+|\s+$|\"|\')/g, "");
        }
        obj.id = `imp-${Date.now().toString().slice(-4)}-${i}`;
        newRecords.push(obj);
      }
      if (newRecords.length) {
        setRecords((cur) => [...newRecords, ...cur]);
      }
    };
    reader.readAsText(file);
  };

  const onImportChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    handleImportFile(f);
    if (importRef.current) importRef.current.value = "";
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={pageTitle}
        description={`Manage and configure ${pageTitle.toLowerCase()} across your organization.`}
        breadcrumbs={[
          { label: "Home" },
          { label: parentLabel },
          ...(child ? [{ label: child.label }] : []),
        ]}
        actions={
          <>
            <Button variant="outline" size="sm">
              <Filter className="mr-1.5 h-4 w-4" /> Filter
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="gradient-primary text-primary-foreground">
                  <Plus className="mr-1.5 h-4 w-4" /> Add
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[94vw] max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-8">
                <DialogHeader>
                  <DialogTitle>Create {template.title.toLowerCase()}</DialogTitle>
                  <DialogDescription>{template.description}</DialogDescription>
                </DialogHeader>
                <form
                  className="mt-3 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(e as unknown as FormEvent<HTMLFormElement>);
                  }}
                >
                  {template.fields.map((field) => (
                    <div key={field.name} className="space-y-1.5">
                      <Label htmlFor={field.name}>{field.label}</Label>
                      {field.type === "textarea" ? (
                        <Textarea
                          id={field.name}
                          value={formValues[field.name] ?? ""}
                          placeholder={field.placeholder}
                          onChange={(event) =>
                            setFormValues((current) => ({
                              ...current,
                              [field.name]: event.target.value,
                            }))
                          }
                        />
                      ) : field.type === "select" ? (
                        <Select
                          value={formValues[field.name] ?? ""}
                          onValueChange={(value) =>
                            setFormValues((current) => ({ ...current, [field.name]: value }))
                          }
                        >
                          <SelectTrigger id={field.name}>
                            <SelectValue
                              placeholder={
                                field.placeholder ?? `Select ${field.label.toLowerCase()}`
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id={field.name}
                          type={field.type}
                          value={formValues[field.name] ?? ""}
                          placeholder={field.placeholder}
                          onChange={(event) =>
                            setFormValues((current) => ({
                              ...current,
                              [field.name]: event.target.value,
                            }))
                          }
                        />
                      )}
                    </div>
                  ))}
                  <div className="flex justify-end space-x-2">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" className="gradient-primary text-primary-foreground">
                      <Plus className="mr-2 h-4 w-4" /> Save
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </>
        }
      />

      {section?.children && !child && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {section.children.map((c) => {
            // normalize child path into /m/<section>/<child> when path contains a tab query
            let to = c.path as string;
            if (to.includes("?tab=")) {
              const [, q] = to.split("?");
              const params = new URLSearchParams(q);
              const tab = params.get("tab") ?? "";
              to = `/m/${sectionId}/${tab}`;
            } else if (to.startsWith("/settings")) {
              // convert /settings to /m/settings
              to = `/m${to}`;
            } else if (!to.startsWith("/m/")) {
              // ensure /m prefix for other absolute paths
              to = `/m${to.startsWith("/") ? to : `/${to}`}`;
            }

            return (
              <Link
                key={c.path}
                to={to}
                className="card-premium group flex items-center justify-between p-4 transition hover:shadow-(--shadow-premium)"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{c.label}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Open {c.label.toLowerCase()}
                  </p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  →
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {childPath ? (
        isIAMRolesPage ? (
          <div className="grid gap-4 xl:grid-cols-[280px_1fr]">
            <div className="surface-card rounded-2xl p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">Roles</p>
                  <p className="text-xs text-muted-foreground">
                    Select a role to edit module permissions.
                  </p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setRoleModalOpen(true)}>
                  + New role
                </Button>
              </div>
              <div className="space-y-2">
                {roles.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setActiveRole(role)}
                    className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${activeRole === role ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-foreground hover:border-slate-300"}`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Permissions for {activeRole || "role"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Assign model-level access and actions for this role.
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Duplicate role
                </Button>
              </div>

              <div className="surface-card rounded-2xl p-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                        <th className="pb-2 pr-6">Module</th>
                        {permissionActions.map((action) => (
                          <th key={action} className="pb-2 pr-4 text-center">
                            {action}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {roleModules.map((module) => (
                        <tr key={module} className="text-sm">
                          <td className="py-3 pr-6 font-medium text-foreground">{module}</td>
                          {permissionActions.map((action) => (
                            <td key={`${module}-${action}`} className="py-3 text-center">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border border-border text-primary focus:ring-primary"
                                checked={Boolean(rolePermissions[activeRole]?.[module]?.[action])}
                                onChange={() => toggleRolePermission(module, action)}
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <Dialog open={roleModalOpen} onOpenChange={setRoleModalOpen}>
              <DialogContent className="max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create new role</DialogTitle>
                  <DialogDescription>
                    Define a custom role name and then assign module permissions.
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 space-y-4">
                  <Label htmlFor="new-role">Role name</Label>
                  <Input
                    id="new-role"
                    value={newRoleName}
                    onChange={(e) => setNewRoleName(e.target.value)}
                    placeholder="Enter custom role name"
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    type="button"
                    className="gradient-primary text-primary-foreground"
                    disabled={!newRoleName.trim()}
                    onClick={() => {
                      const trimmed = newRoleName.trim();
                      if (!trimmed) return;
                      setRoles((current) => [trimmed, ...current]);
                      setRolePermissions((current) => ({
                        ...current,
                        [trimmed]: createDefaultPermissions(),
                      }));
                      setActiveRole(trimmed);
                      setNewRoleName("");
                      setRoleModalOpen(false);
                    }}
                  >
                    Create role
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Input
                className="flex-1 min-w-55 h-10"
                placeholder={`Search by ${template.primaryField}, phone, ID...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              {template.fields.find((f) => f.name === "status" || f.type === "select") && (
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v)}>
                  <SelectTrigger className="h-10 w-44">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All</SelectItem>
                    {Array.from(new Set(template.fields.flatMap((f) => f.options ?? []))).map(
                      (opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              )}

              <input
                ref={importRef}
                type="file"
                accept=".csv"
                onChange={onImportChange}
                className="hidden"
              />
              <Button variant="outline" size="sm" onClick={() => importRef.current?.click()}>
                <Upload className="h-4 w-4" /> Import
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportCSV(selectedRecordIds.length > 0)}
              >
                <Download className="h-4 w-4" /> Export
              </Button>
              {selectedRecordIds.length > 0 && (
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                  {selectedRecordIds.length} selected
                </span>
              )}
            </div>
            <div className="surface-card rounded-2xl p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">{pageTitle}</h3>
                <Badge variant="secondary">{filteredRecords.length} shown</Badge>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-180 text-sm">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="whitespace-nowrap px-3 pb-2">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border border-border bg-background text-primary focus:ring-primary"
                          checked={allFilteredSelected}
                          onChange={toggleSelectAll}
                          aria-label="Select all records"
                        />
                      </th>
                      {(() => {
                        const displayFields = getDisplayFields(
                          sectionId,
                          childPath,
                          template.fields,
                        );
                        return displayFields.map((f) => (
                          <th key={f.name} className="whitespace-nowrap px-3 pb-2 font-medium">
                            {f.label}
                          </th>
                        ));
                      })()}

                      <th className="whitespace-nowrap px-3 pb-2 text-right font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredRecords.map((r, idx) => {
                      const id = String(r.id ?? `${r[template.primaryField]}-${idx}`);
                      return (
                        <tr key={id} className="text-sm">
                          <td className="whitespace-nowrap px-3 py-3">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border border-border bg-background text-primary focus:ring-primary"
                              checked={selectedRecordIds.includes(id)}
                              onChange={() => handleRowToggle(id)}
                              aria-label={`Select ${r[template.primaryField] ?? `row ${idx + 1}`}`}
                            />
                          </td>
                          {(() => {
                            const displayFields = getDisplayFields(
                              sectionId,
                              childPath,
                              template.fields,
                            );
                            return displayFields.map((f) => {
                              const val = r[f.name];
                              if (
                                ["image_url", "policy_image", "receipt_image", "qr_image"].includes(
                                  f.name,
                                )
                              ) {
                                return (
                                  <td
                                    key={f.name}
                                    className="whitespace-nowrap px-3 py-3 text-sm text-muted-foreground"
                                  >
                                    {val ? "View" : "—"}
                                  </td>
                                );
                              }
                              return (
                                <td key={f.name} className="whitespace-nowrap px-3 py-3">
                                  {val ?? "—"}
                                </td>
                              );
                            });
                          })()}
                          <td className="whitespace-nowrap px-3 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Eye
                                className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
                                onClick={() => {
                                  setViewRecord(r);
                                  setViewOpen(true);
                                }}
                              />
                              <Pencil
                                className="h-4 w-4 cursor-pointer text-muted-foreground hover:text-foreground"
                                onClick={() => {
                                  setEditRecord(r);
                                  setEditFormValues(
                                    Object.fromEntries(
                                      template.fields.map((f) => [f.name, r[f.name] ?? ""]),
                                    ),
                                  );
                                  setEditOpen(true);
                                }}
                              />
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            {/* View record dialog */}
            <Dialog open={viewOpen} onOpenChange={setViewOpen}>
              <DialogContent className="w-[92vw] max-w-md overflow-hidden rounded-2xl p-0 sm:max-w-lg">
                {/* Signature: brand tab strip */}
                <div className="h-1.5 w-full bg-linear-to-r from-orange-500 via-orange-400 to-orange-500" />

                <div className="px-5 pb-5 pt-4 sm:px-6">
                  <DialogHeader className="space-y-0 text-left">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
                          Record · {template.title}
                        </p>
                        <DialogTitle className="mt-1 truncate font-mono text-lg font-semibold text-foreground">
                          {viewRecord?.[template.primaryField] ?? "—"}
                        </DialogTitle>
                      </div>

                      {viewRecord?.status && (
                        <div className="mt-1 shrink-0 -rotate-6 rounded border-2 border-orange-500/70 px-2.5 py-1 text-center">
                          <span className="block text-[10px] font-bold uppercase tracking-widest text-orange-600">
                            {viewRecord.status}
                          </span>
                        </div>
                      )}
                    </div>
                    <DialogDescription className="sr-only">
                      Viewing record from {template.title}
                    </DialogDescription>
                  </DialogHeader>

                  {/* Dashed ticket-style divider */}
                  <div className="my-4 border-t border-dashed border-border" />

                  {/* Manifest rows */}
                  <div className="max-h-[55vh] overflow-y-auto">
                    <dl className="text-sm">
                      {(viewRecord ? Object.entries(viewRecord) : [])
                        .filter(([k]) => k.toLowerCase() !== "status")
                        .map(([k, v], idx) => (
                          <div
                            key={k}
                            className={cn(
                              "flex flex-col gap-0.5 px-2 py-2.5 sm:flex-row sm:items-center sm:justify-between",
                              idx % 2 === 0 && "bg-muted/40 rounded-md",
                            )}
                          >
                            <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                              {k.replace(/_/g, " ")}
                            </dt>
                            <dd className="wrap-break-words font-mono text-sm font-medium text-foreground sm:text-right">
                              {v !== null && v !== undefined && v !== "" ? String(v) : "—"}
                            </dd>
                          </div>
                        ))}
                    </dl>
                  </div>
                </div>

                <DialogFooter className="border-t border-border bg-muted/30 px-5 py-3 sm:px-6">
                  <DialogClose asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      Close
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog open={editOpen} onOpenChange={setEditOpen}>
              <DialogContent className="w-[94vw] max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-6 sm:p-8">
                <DialogHeader>
                  <DialogTitle>Edit {template.title.toLowerCase()}</DialogTitle>
                  <DialogDescription>{template.description}</DialogDescription>
                </DialogHeader>
                <form
                  className="mt-3 space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleEditSubmit();
                  }}
                >
                  {template.fields.map((field) => (
                    <div key={field.name} className="space-y-1.5">
                      <Label htmlFor={`edit-${field.name}`}>{field.label}</Label>
                      {field.type === "textarea" ? (
                        <Textarea
                          id={`edit-${field.name}`}
                          value={editFormValues[field.name] ?? ""}
                          placeholder={field.placeholder}
                          onChange={(event) =>
                            setEditFormValues((current) => ({
                              ...current,
                              [field.name]: event.target.value,
                            }))
                          }
                        />
                      ) : field.type === "select" ? (
                        <Select
                          value={editFormValues[field.name] ?? ""}
                          onValueChange={(value) =>
                            setEditFormValues((current) => ({ ...current, [field.name]: value }))
                          }
                        >
                          <SelectTrigger id={`edit-${field.name}`}>
                            <SelectValue
                              placeholder={
                                field.placeholder ?? `Select ${field.label.toLowerCase()}`
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {field.options?.map((option) => (
                              <SelectItem key={option} value={option}>
                                {option}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          id={`edit-${field.name}`}
                          type={field.type}
                          value={editFormValues[field.name] ?? ""}
                          placeholder={field.placeholder}
                          onChange={(event) =>
                            setEditFormValues((current) => ({
                              ...current,
                              [field.name]: event.target.value,
                            }))
                          }
                        />
                      )}
                    </div>
                  ))}
                  <div className="flex justify-end space-x-2">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" className="gradient-primary text-primary-foreground">
                      <Pencil className="mr-2 h-4 w-4" /> Update
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        )
      ) : (
        <EmptyState
          icon={Rocket}
          title={`${pageTitle} — module scaffolded`}
          description="This module now includes working form fields and dummy records that can be used during development and demo flows."
          action={
            <Button variant="default" size="sm">
              Ready for development
            </Button>
          }
        />
      )}

      {childPath && (
        <p className="text-center text-[11px] text-muted-foreground">
          Path: <span className="font-mono">/m/{parts.join("/")}</span>
        </p>
      )}
    </div>
  );
}
