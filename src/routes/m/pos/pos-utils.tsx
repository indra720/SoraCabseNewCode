import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";

export type PosProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  isVeg: boolean;
  tags: string[];
  image: string;
  available: boolean;
};

export type PosBill = {
  id: string;
  table: string;
  guests: number;
  status: "open" | "hold" | "paid";
  total: number;
  cashier: string;
  openedAt: string;
  items: { name: string; qty: number; price: number }[];
};

export type PosTransaction = {
  id: string;
  billId: string;
  method: "Cash" | "Card" | "UPI" | "Wallet" | "Split";
  amount: number;
  status: "Completed" | "Refunded" | "Pending";
  paymentDate: string;
  customer: string;
};

export type PosShift = {
  id: string;
  openedBy: string;
  status: "open" | "closed";
  cashIn: number;
  cashOut: number;
  expectedCash: number;
  actualCash: number;
  openedAt: string;
  closedAt?: string;
};

export const formatCurrency = (value: number) => `₹${value.toFixed(2)}`;

export const posCategories = [
  "All",
  "Starters",
  "Mains",
  "Desserts",
  "Beverages",
  "Sides",
  "Combos",
];

export const posProducts: PosProduct[] = [
  {
    id: "P-101",
    name: "Paneer Tikka Masala",
    category: "Mains",
    price: 319,
    isVeg: true,
    tags: ["Spicy", "Signature"],
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=700&q=80",
    available: true,
  },
  {
    id: "P-102",
    name: "Chicken Shawarma",
    category: "Starters",
    price: 249,
    isVeg: false,
    tags: ["Popular", "Quick"],
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80",
    available: true,
  },
  {
    id: "P-103",
    name: "Veg Spring Rolls",
    category: "Starters",
    price: 179,
    isVeg: true,
    tags: ["Crispy"],
    image: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=700&q=80",
    available: true,
  },
  {
    id: "P-104",
    name: "Grilled Fish Steak",
    category: "Mains",
    price: 399,
    isVeg: false,
    tags: ["Chef's Special"],
    image: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?auto=format&fit=crop&w=700&q=80",
    available: true,
  },
  {
    id: "P-105",
    name: "Chocolate Brownie",
    category: "Desserts",
    price: 149,
    isVeg: true,
    tags: ["Sweet"],
    image: "https://images.unsplash.com/photo-1542826438-94e3ee8a84a0?auto=format&fit=crop&w=700&q=80",
    available: true,
  },
  {
    id: "P-106",
    name: "Mango Lassi",
    category: "Beverages",
    price: 99,
    isVeg: true,
    tags: ["Cold", "Popular"],
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=700&q=80",
    available: true,
  },
  {
    id: "P-107",
    name: "French Fries",
    category: "Sides",
    price: 129,
    isVeg: true,
    tags: ["Crispy"],
    image: "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=700&q=80",
    available: true,
  },
];

export const posSampleBills: PosBill[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `B-${1000 + i}`,
  table: `T${(i % 10) + 1}`,
  guests: (i % 5) + 1,
  status: i % 5 === 0 ? "open" : i % 3 === 0 ? "hold" : "paid",
  total: Math.floor(Math.random() * 5000) + 500,
  cashier: ["Neha", "Arjun", "Priya", "Aarav"][i % 4],
  openedAt: `2026-07-14 ${String(10 + Math.floor(i / 2)).padStart(2, '0')}:${String(i * 5 % 60).padStart(2, '0')}`,
  items: [
    { name: "Paneer Tikka Masala", qty: 1, price: 319 },
    { name: "Mango Lassi", qty: 1, price: 99 },
  ],
}));

export const posTransactions: PosTransaction[] = Array.from({ length: 20 }).map((_, i) => ({
  id: `TXN-${9000 + i}`,
  billId: `B-${1000 + i}`,
  method: ["Cash", "Card", "UPI", "Wallet", "Split"][i % 5] as any,
  amount: Math.floor(Math.random() * 5000) + 500,
  status: i % 10 === 0 ? "Refunded" : i % 5 === 0 ? "Pending" : "Completed",
  paymentDate: `2026-07-14 ${String(10 + Math.floor(i / 2)).padStart(2, '0')}:${String(i * 5 % 60).padStart(2, '0')}`,
  customer: ["Sanjay Sharma", "Ritu Singh", "Amit Jain", "Neha Kapoor", "Rahul Verma"][i % 5],
}));

export const posShifts: PosShift[] = Array.from({ length: 15 }).map((_, i) => ({
  id: `S-${2100 + i}`,
  openedBy: ["Aarav", "Priya", "Neha", "Arjun"][i % 4],
  status: i === 0 ? "open" : "closed",
  cashIn: 10000 + Math.random() * 5000,
  cashOut: 500 + Math.random() * 1000,
  expectedCash: 12000 + Math.random() * 2000,
  actualCash: 12000 + Math.random() * 2000,
  openedAt: `2026-07-${String(14 - Math.floor(i / 2)).padStart(2, '0')} 09:00`,
  closedAt: i === 0 ? undefined : `2026-07-${String(14 - Math.floor(i / 2)).padStart(2, '0')} 21:00`,
}));

export type SectionConfig = {
  label: string;
  icon: LucideIcon;
  value: string;
  description?: string;
  count?: number;
  trailing?: ReactNode;
};
