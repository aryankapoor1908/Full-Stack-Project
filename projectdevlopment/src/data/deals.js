import { Laptop, Shirt, Home as HomeIcon, Gamepad2, Dumbbell, Info, Zap } from "lucide-react";

export const CATEGORIES = [
  { id: "electronics", label: "Electronics", icon: Laptop },
  { id: "fashion",     label: "Fashion",     icon: Shirt },
  { id: "home",        label: "Home & Garden", icon: HomeIcon },
  { id: "gaming",      label: "Gaming",      icon: Gamepad2 },
  { id: "sports",      label: "Sports & Outdoors", icon: Dumbbell },
];

export const CONTRIBUTORS = [
  { name: "DealHunter_99", count: "1.2k", color: "bg-emerald-500", initials: "JD" },
  { name: "SavingsMaster",  count: "942",  color: "bg-blue-500",    initials: "SM" },
  { name: "TechCheap",      count: "815",  color: "bg-orange-500",  initials: "TC" },
];

export const ALERTS = [
  { id: "macbook", name: 'MacBook Pro M3 Max 14"', store: "Amazon", tracked: "Tracked for 45 days", price: 207999, change: "↓ ₹16,600 (8%)", changeColor: "text-emerald-600", image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200&q=80" },
  { id: "sony-headphones", name: "Sony WH-1000XM5", store: "Best Buy", tracked: "Tracked for 12 days", price: 28899, change: "↑ ₹1,660 (6%)", changeColor: "text-red-500", image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&q=80" },
  { id: "sony-a7iv", name: "Sony Alpha a7 IV", store: "B&H Photo", tracked: "Tracked for 82 days", price: 190699, change: "No change", changeColor: "text-slate-400", image: "https://images.unsplash.com/photo-1606980707620-7a9b4f5b04a8?w=200&q=80" },
];

export const RECENT_DROPS = [
  { icon: Zap,  color: "text-emerald-600 bg-emerald-100", text: "iPhone 15 Pro dropped 12% at Target", time: "2 minutes ago" },
  { icon: Zap,  color: "text-emerald-600 bg-emerald-100", text: "Dyson V15 hit Historical Low (₹41,500)", time: "14 minutes ago" },
  { icon: Info, color: "text-blue-600 bg-blue-100",       text: "Price Tracking started for 'Ergonomic Desk'", time: "1 hour ago" },
];
