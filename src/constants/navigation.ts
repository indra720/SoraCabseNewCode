import {
  LayoutDashboard, Shield, Users, UserCog, IdCard, UserCheck,
  Contact, Wallet, History, LifeBuoy, Star,
  UserPlus, FileCheck2, FileText, BadgeCheck, Clock3, TrendingUp, Coins,
  Car, FileSpreadsheet, ShieldCheck, Wrench, Fuel,
  Truck, Route as RouteIcon, Gauge,
  Bike, Boxes, QrCode, ClipboardList, CalendarRange, Receipt, Repeat, AlertTriangle, CreditCard, PieChart,
  MapPin, Timer, MapPinned, Map, Compass,
  Ticket, DollarSign, Percent, TicketPercent, Milestone,
  Banknote, Smartphone, Globe, RefreshCcw, HandCoins, Handshake,
  BarChart3, ReceiptText, FileBarChart, BookOpen, TrendingDown,
  PiggyBank, UsersRound, GraduationCap, CalendarCheck2, UserSearch, Award,
  Package, ShoppingCart, ClipboardCheck, Store, Cog, Droplets,
  Monitor, Laptop, Smartphone as PhoneIcon,
  Headphones, MessageSquare, MessagesSquare, Phone, ThumbsUp,
  Megaphone, Share2, Gift, Trophy,
  Bell, Mail, Send, MessageCircle,
  BarChart, LineChart as LineIcon, Activity,
  BrainCircuit, Sparkles, ShieldAlert, Flame, Lightbulb, Cpu,
  Plug, CreditCard as CreditIcon, MapIcon, Signal, Server,
  BadgePercent, FileClock,
  Lock, KeyRound, ShieldEllipsis, ScrollText,
  FileSignature, FileBadge, FolderKanban,
  Settings, Palette, Languages, Clock, DatabaseZap,
  type LucideIcon,
  ShoppingBasket
} from "lucide-react";
import type { Role } from "./roles";

export interface NavChild {
  label: string;
  path: string;
}
export interface NavSection {
  id: string;
  label: string;
  icon: LucideIcon;
  path?: string;
  children?: NavChild[];
}

const m = (slug: string, sub?: string) => (sub ? `/m/${slug}/${sub}` : `/m/${slug}`);

export const NAV_SECTIONS: NavSection[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  {
    id: "pos",
    label: "POS & Billing",
    icon: ShoppingBasket,
    children: [
      { label: "Dashboard", path: m("pos", "dashboard") },
      { label: "Billing Terminal", path: m("pos", "billing-terminal") },
      { label: "Open Bills", path: m("pos", "open-bills") },
      { label: "Hold Bills", path: m("pos", "hold-bills") },
      { label: "Split Bills", path: m("pos", "split-bills") },
      { label: "Merge Bills", path: m("pos", "merge-bills") },
      { label: "Payments", path: m("pos", "payments") },
      { label: "Shift Management", path: m("pos", "shift-management") },
    ],
  },
  // Restaurant & related modules
  {
    id: "restaurant",
    label: "Restaurant Management",
    icon: Store,
    children: [
      { label: "All Restaurants", path: m("restaurant", "all-restaurants") },
      { label: "Pending Approvals", path: m("restaurant", "pending-approvals") },
      { label: "Restaurant Owners", path: m("restaurant", "owners") },
      { label: "Branches", path: m("restaurant", "branches") },
      { label: "Restaurant Categories", path: m("restaurant", "categories") },
    ],
  },
  {
    id: "menu",
    label: "Menu Management",
    icon: FileText,
    children: [
      { label: "Categories", path: m("menu", "categories") },
      { label: "Menu Items", path: m("menu", "items") },
      { label: "Add-ons", path: m("menu", "addons") },
      { label: "Combo Meals", path: m("menu", "combos") },
      { label: "Menu Approval", path: m("menu", "approval") },
    ],
  },
  {
    id: "kitchen",
    label: "Kitchen Management",
    icon: Monitor,
    children: [
      { label: "Kitchen Display (KDS)", path: m("kitchen", "kds") },
      { label: "Live Orders", path: m("kitchen", "live-orders") },
      { label: "Chef Assignment", path: m("kitchen", "chef-assignment") },
    ],
  },
  {
    id: "orders",
    label: "Order Management",
    icon: ClipboardList,
    children: [
      { label: "All Orders", path: m("orders", "all-orders") },
      { label: "Dine-In Orders", path: m("orders", "dinein") },
      { label: "Delivery Orders", path: m("orders", "delivery") },
      { label: "Takeaway Orders", path: m("orders", "takeaway") },
      { label: "Scheduled Orders", path: m("orders", "scheduled") },
      { label: "Refunds", path: m("orders", "refunds") },
    ],
  },
  {
    id: "tables",
    label: "Table & Reservation",
    icon: CalendarRange,
    children: [
      { label: "Tables", path: m("tables", "tables") },
      { label: "Reservations", path: m("tables", "reservations") },
      { label: "QR Table Ordering", path: m("tables", "qr-ordering") },
    ],
  },
  {
    id: "iam", label: "Identity & Access", icon: Shield,
    children: [
      { label: "Users", path: m("iam", "users") },
      { label: "Roles", path: m("iam", "roles") },
      { label: "Customers", path: m("iam", "customers") },
      { label: "Riders", path: m("iam", "riders") },
    ],
  },
  {
    id: "customers", label: "Customer Management", icon: Contact,
    children: [
      { label: "Customers", path: m("customers", "list") },
      { label: "Wallet", path: m("customers", "wallet") },
      { label: "Ride History", path: m("customers", "rides") },
      { label: "Support Requests", path: m("customers", "support") },
      { label: "Ratings", path: m("customers", "ratings") },
    ],
  },
  {
    id: "drivers", label: "Driver Management", icon: IdCard,
    children: [
      { label: "Driver Registration", path: m("drivers", "registration") },
      { label: "Driver KYC", path: m("drivers", "kyc") },
      { label: "Documents", path: m("drivers", "documents") },
      { label: "License Verification", path: m("drivers", "license") },
      { label: "Availability", path: m("drivers", "availability") },
      { label: "Performance", path: m("drivers", "performance") },
      { label: "Driver Wallet", path: m("drivers", "wallet") },
      { label: "Driver Earnings", path: m("drivers", "earnings") },
    ],
  },
  {
    id: "vehicles", label: "Vehicle Management", icon: Car,
    children: [
      { label: "Vehicle Registration", path: m("vehicles", "registration") },
      { label: "Vehicle Documents", path: m("vehicles", "documents") },
      { label: "Insurance", path: m("vehicles", "insurance") },
      { label: "Maintenance", path: m("vehicles", "maintenance") },
      { label: "Fuel / EV", path: m("vehicles", "fuel") },
    ],
  },
  {
    id: "fleet", label: "Fleet Management", icon: Truck,
    children: [
      { label: "Fleet Owners", path: m("fleet", "owners") },
      { label: "Vehicle Allocation", path: m("fleet", "allocation") },
      { label: "Fleet Performance", path: m("fleet", "performance") },
      { label: "Fuel Tracking", path: m("fleet", "fuel") },
      { label: "Maintenance", path: m("fleet", "maintenance") },
    ],
  },
  {
    id: "rental", label: "Bike Rental (Lease)", icon: Bike,
    children: [
      { label: "Bike Inventory", path: m("rental", "inventory") },
      { label: "Bike Registration", path: m("rental", "registration") },
      { label: "QR Code", path: m("rental", "qr") },
      { label: "Bike Allocation", path: m("rental", "allocation") },
      { label: "Rental Plans", path: m("rental", "plans") },
      { label: "Rental Billing", path: m("rental", "billing") },
      { label: "Bike Exchange", path: m("rental", "exchange") },
      { label: "Maintenance", path: m("rental", "maintenance") },
      { label: "Driver Eligibility", path: m("rental", "eligibility") },
      { label: "Fine & Penalty", path: m("rental", "penalty") },
      { label: "Payments", path: m("rental", "payments") },
      { label: "Reports", path: m("rental", "reports") },
    ],
  },
  {
    id: "rides", label: "Ride Operations", icon: RouteIcon,
    children: [
      { label: "Ride Booking", path: m("rides", "booking") },
      { label: "Ride Matching", path: m("rides", "matching") },
      { label: "Dispatch", path: m("rides", "dispatch") },
      { label: "Trip Tracking", path: m("rides", "tracking") },
      { label: "Ride Cancellation", path: m("rides", "cancellation") },
      { label: "Trip History", path: m("rides", "history") },
    ],
  },
  {
    id: "gps", label: "GPS & Tracking", icon: MapPinned,
    children: [
      { label: "Live Tracking", path: m("gps", "live") },
      { label: "ETA", path: m("gps", "eta") },
      { label: "Route Optimization", path: m("gps", "routes") },
      { label: "Geofencing", path: m("gps", "geofence") },
    ],
  },
  {
    id: "pricing", label: "Pricing & Fare", icon: Ticket,
    children: [
      { label: "Fare Rules", path: m("pricing", "fare-rules") },
      { label: "Dynamic Pricing", path: m("pricing", "dynamic") },
      { label: "Rental Pricing", path: m("pricing", "rental") },
      { label: "Coupons", path: m("pricing", "coupons") },
      { label: "Discounts", path: m("pricing", "discounts") },
      { label: "Promo Codes", path: m("pricing", "promo") },
      { label: "Toll Charges", path: m("pricing", "toll") },
    ],
  },
  {
    id: "payments", label: "Payment Management", icon: CreditCard,
    children: [
      { label: "Cash", path: m("payments", "cash") },
      { label: "UPI", path: m("payments", "upi") },
      { label: "Online Payments", path: m("payments", "online") },
      { label: "Wallet", path: m("payments", "wallet") },
      { label: "Refunds", path: m("payments", "refunds") },
      { label: "Driver Payout", path: m("payments", "payout") },
      { label: "Commission", path: m("payments", "commission") },
    ],
  },
  {
    id: "finance", label: "Finance & Accounting", icon: BarChart3,
    children: [
      { label: "Revenue", path: m("finance", "revenue") },
      { label: "Expenses", path: m("finance", "expenses") },
      { label: "Invoices", path: m("finance", "invoices") },
      { label: "Taxes", path: m("finance", "taxes") },
      { label: "General Ledger", path: m("finance", "ledger") },
      { label: "Profit & Loss", path: m("finance", "pnl") },
    ],
  },
  {
    id: "payroll", label: "Payroll", icon: PiggyBank,
    children: [
      { label: "Driver Earnings", path: m("payroll", "driver-earnings") },
      { label: "Employee Salary", path: m("payroll", "salary") },
      { label: "Bonuses", path: m("payroll", "bonuses") },
      { label: "Incentives", path: m("payroll", "incentives") },
      { label: "Deductions", path: m("payroll", "deductions") },
    ],
  },
  {
    id: "hr", label: "HR Management", icon: UsersRound,
    children: [
      { label: "Employees", path: m("hr", "employees") },
      { label: "Attendance", path: m("hr", "attendance") },
      { label: "Leave", path: m("hr", "leave") },
      { label: "Recruitment", path: m("hr", "recruitment") },
      { label: "Training", path: m("hr", "training") },
      { label: "Performance", path: m("hr", "performance") },
    ],
  },
  {
    id: "procurement", label: "Procurement & Inventory", icon: Package,
    children: [
      { label: "Suppliers", path: m("procurement", "suppliers") },
      { label: "Purchase Requests", path: m("procurement", "requests") },
      { label: "Purchase Orders", path: m("procurement", "orders") },
      { label: "Vendor Payments", path: m("procurement", "vendor-payments") },
      { label: "Spare Parts", path: m("procurement", "spare-parts") },
      { label: "Fuel Inventory", path: m("procurement", "fuel") },
    ],
  },
  {
    id: "assets", label: "Asset Management", icon: FolderKanban,
    children: [
      { label: "Office Assets", path: m("assets", "office") },
      { label: "Vehicles", path: m("assets", "vehicles") },
      { label: "Computers", path: m("assets", "computers") },
      { label: "Mobile Devices", path: m("assets", "mobile") },
    ],
  },
  {
    id: "crm", label: "CRM & Help Desk", icon: Headphones,
    children: [
      { label: "Support", path: m("crm", "support") },
      { label: "Complaints", path: m("crm", "complaints") },
      { label: "Ticketing", path: m("crm", "ticketing") },
      { label: "Live Chat", path: m("crm", "chat") },
      { label: "Call Logs", path: m("crm", "calls") },
      { label: "Feedback", path: m("crm", "feedback") },
    ],
  },
  {
    id: "marketing", label: "Marketing", icon: Megaphone,
    children: [
      { label: "Campaigns", path: m("marketing", "campaigns") },
      { label: "Referral", path: m("marketing", "referral") },
      { label: "Coupons", path: m("marketing", "coupons") },
      { label: "Loyalty", path: m("marketing", "loyalty") },
      { label: "Promotions", path: m("marketing", "promotions") },
    ],
  },
  {
    id: "notifications", label: "Notifications", icon: Bell,
    children: [
      { label: "SMS", path: m("notifications", "sms") },
      { label: "Email", path: m("notifications", "email") },
      { label: "Push Notifications", path: m("notifications", "push") },
      { label: "WhatsApp", path: m("notifications", "whatsapp") },
      { label: "In-App Notifications", path: m("notifications", "in-app") },
    ],
  },
  {
    id: "reports", label: "Reports & Analytics", icon: FileBarChart,
    children: [
      { label: "Revenue Report", path: m("reports", "revenue") },
      { label: "Ride Report", path: m("reports", "rides") },
      { label: "Driver Report", path: m("reports", "drivers") },
      { label: "Fleet Report", path: m("reports", "fleet") },
      { label: "Bike Rental Report", path: m("reports", "rental") },
      { label: "Customer Report", path: m("reports", "customers") },
    ],
  },
  {
    id: "ai", label: "AI & Business Intelligence", icon: BrainCircuit,
    children: [
      { label: "AI Ride Matching", path: m("ai", "matching") },
      { label: "Demand Prediction", path: m("ai", "demand") },
      { label: "Fraud Detection", path: m("ai", "fraud") },
      { label: "Heat Maps", path: m("ai", "heatmaps") },
      { label: "Business Intelligence", path: m("ai", "bi") },
      { label: "Machine Learning", path: m("ai", "ml") },
      { label: "Driver Incentive Engine", path: m("ai", "incentive") },
    ],
  },
  {
    id: "integrations", label: "Integrations", icon: Plug,
    children: [
      { label: "Payment Gateway", path: m("integrations", "payment") },
      { label: "Maps API", path: m("integrations", "maps") },
      { label: "SMS Gateway", path: m("integrations", "sms") },
      { label: "Email Service", path: m("integrations", "email") },
      { label: "Analytics", path: m("integrations", "analytics") },
      { label: "IoT Smart Lock API", path: m("integrations", "iot") },
    ],
  },
  {
    id: "subscription", label: "Subscription & Billing", icon: BadgePercent,
    children: [
      { label: "Plans", path: m("subscription", "plans") },
      { label: "Billing", path: m("subscription", "billing") },
      { label: "Invoices", path: m("subscription", "invoices") },
      { label: "Renewals", path: m("subscription", "renewals") },
      { label: "Payments", path: m("subscription", "payments") },
    ],
  },
  {
    id: "security", label: "Security", icon: Lock,
    children: [
      { label: "Login", path: m("security", "login") },
      { label: "OTP", path: m("security", "otp") },
      { label: "Two Factor Authentication", path: m("security", "2fa") },
      { label: "Audit Logs", path: m("security", "audit") },
      { label: "Access Control", path: m("security", "access") },
    ],
  },
  {
    id: "legal", label: "Legal & Compliance", icon: FileSignature,
    children: [
      { label: "KYC", path: m("legal", "kyc") },
      { label: "Driver Verification", path: m("legal", "driver-verify") },
      { label: "Vehicle Verification", path: m("legal", "vehicle-verify") },
      { label: "Insurance", path: m("legal", "insurance") },
      { label: "Contracts", path: m("legal", "contracts") },
      { label: "Licenses", path: m("legal", "licenses") },
      { label: "Incident Records", path: m("legal", "incidents") },
    ],
  },
  {
    id: "settings", label: "Settings", icon: Settings, path: "/settings",
    children: [
      { label: "General", path: "/settings?tab=general" },
      { label: "Branding", path: "/settings?tab=branding" },
      { label: "Theme", path: "/settings?tab=theme" },
      { label: "Currency", path: "/settings?tab=currency" },
      { label: "Language", path: "/settings?tab=language" },
      { label: "Timezone", path: "/settings?tab=timezone" },
      { label: "Email", path: "/settings?tab=email" },
      { label: "SMS", path: "/settings?tab=sms" },
      { label: "Storage", path: "/settings?tab=storage" },
      { label: "API", path: "/settings?tab=api" },
      { label: "SEO", path: "/settings?tab=seo" },
      { label: "Cache", path: "/settings?tab=cache" },
      { label: "AI Settings", path: "/settings?tab=ai" },
    ],
  },
];

// Which top-level module IDs each role can access. super_admin sees all.
export const ROLE_MODULE_ACCESS: Record<Role, "all" | string[]> = {
  super_admin: "all",
  organization_owner: "all",
  fleet_owner: ["dashboard", "pos", "fleet", "vehicles", "drivers", "reports", "finance", "settings"],
  operations_manager: ["dashboard", "pos", "rides", "gps", "drivers", "vehicles", "fleet", "reports", "crm", "notifications"],
  branch_manager: ["dashboard", "pos", "drivers", "vehicles", "rides", "reports", "hr", "crm"],
  dispatch_manager: ["dashboard", "pos", "rides", "gps", "drivers", "notifications"],
  finance_manager: ["dashboard", "pos", "finance", "payroll", "payments", "reports", "subscription", "procurement"],
  hr_manager: ["dashboard", "hr", "payroll", "iam"],
  support_executive: ["dashboard", "crm", "customers", "notifications"],
  bike_rental_staff: ["dashboard", "pos", "rental", "customers", "payments"],
  maintenance_staff: ["dashboard", "vehicles", "fleet", "rental", "assets"],
  driver: ["dashboard", "rides", "gps", "drivers"],
  customer: ["dashboard", "customers", "rides"],
  employee: ["dashboard", "hr", "notifications"],
  vendor: ["dashboard", "procurement"],
};

export function getNavForRole(role: Role): NavSection[] {
  const allowed = ROLE_MODULE_ACCESS[role];
  if (allowed === "all") return NAV_SECTIONS;
  const set = new Set(allowed);
  return NAV_SECTIONS.filter((s) => set.has(s.id));
}
