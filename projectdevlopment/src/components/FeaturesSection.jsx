import React from "react";
import { Globe, BellRing, TrendingDown, ShoppingCart, BadgeDollarSign } from "lucide-react";

const FEATURES = [
  { icon: Globe,          color: "bg-blue-50 text-blue-600",    title: "Track Prices from Any Source",       desc: "Paste any product URL from Amazon, Flipkart, Myntra and more — we monitor prices across thousands of retailers automatically." },
  { icon: BellRing,       color: "bg-emerald-50 text-emerald-600", title: "Get Notified on Price Drops",     desc: "Set a target price and we'll instantly alert you via email the moment the price falls to your desired amount." },
  { icon: TrendingDown,   color: "bg-violet-50 text-violet-600",   title: "View Price History & Trends",     desc: "See how a product's price has changed over 90 days, 6 months, or 1 year. Know if today's price is a real deal." },
  { icon: ShoppingCart,   color: "bg-orange-50 text-orange-600",   title: "Make Informed Decisions",         desc: "Our Deal Score tells you whether it's a good time to buy right now, based on historical pricing patterns." },
  { icon: BadgeDollarSign,color: "bg-rose-50 text-rose-600",       title: "Find Best Deals & Save Money",   desc: "Browse community-submitted hot deals, filter by category, and never overpay again." },
];

export default function FeaturesSection() {
  return (
    <section className="my-12">
      <div className="text-center mb-8">
        <span className="text-xs font-semibold tracking-widest text-blue-600 uppercase">Why PriceTracker?</span>
        <h2 className="text-2xl font-bold text-slate-900 mt-2">Everything you need to shop smarter</h2>
        <p className="text-slate-500 text-sm mt-2 max-w-xl mx-auto">PriceTracker gives you the tools to track, compare, and save — all in one place.</p>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {FEATURES.map((f, i) => {
          const Icon = f.icon;
          return (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-1 transition-all duration-200">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${f.color}`}><Icon size={20} /></div>
              <h3 className="text-sm font-semibold text-slate-800 leading-snug">{f.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-6 bg-blue-700 rounded-2xl px-8 py-5 grid grid-cols-4 gap-4 text-center">
        {[
          { value: "50,000+",  label: "Products Tracked" },
          { value: "₹2.4Cr+",  label: "Saved by Users" },
          { value: "1,200+",   label: "Retailers Monitored" },
          { value: "98%",      label: "Alert Accuracy" },
        ].map((stat, i) => (
          <div key={i}>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-blue-200 text-xs mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
