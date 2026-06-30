import React, { useState } from "react";
import { ExternalLink, Truck, ShieldCheck, Star, ChevronDown, ChevronUp, BadgeCheck } from "lucide-react";

const formatINR = (n) => "₹" + Number(Math.round(n)).toLocaleString("en-IN");


const ALL_STORES = [
  { id: "amazon",   name: "Amazon",          logo: "", color: "bg-orange-50 border-orange-200",    badge: "Best Seller",   delivery: "Free delivery by tomorrow",  rating: 4.7, trusted: true,  searchUrl: (q) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}` },
  { id: "flipkart", name: "Flipkart",         logo: "", color: "bg-blue-50 border-blue-200",       badge: "SuperCoin",     delivery: "Free delivery in 2 days",    rating: 4.5, trusted: true,  searchUrl: (q) => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}` },
  { id: "croma",    name: "Croma",            logo: "", color: "bg-green-50 border-green-200",     badge: "EMI Available", delivery: "Store pickup available",     rating: 4.3, trusted: true,  searchUrl: (q) => `https://www.croma.com/searchB?q=${encodeURIComponent(q)}` },
];

function seededRand(seed) {
  let s = Math.abs(seed) || 1;
  return () => { s = (s * 1664525 + 1013904223) & 0x7fffffff; return s / 0x7fffffff; };
}
function strToSeed(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) & 0x7fffffff;
  return h;
}
function getStorePrices(basePrice, productTitle) {
  const rand = seededRand(strToSeed(productTitle));
  return ALL_STORES.map((store) => {
    const variation = -0.08 + rand() * 0.20;
    const price = Math.round(basePrice * (1 + variation));
    return { ...store, price, savings: price < basePrice ? basePrice - price : 0 };
  }).sort((a, b) => a.price - b.price);
}

export default function StoreComparison({ basePrice, productTitle, productUrl }) {
  const [showAll, setShowAll] = useState(false);
  if (!basePrice || basePrice <= 0) return null;

  const stores  = getStorePrices(basePrice, productTitle);
  const visible = showAll ? stores : stores.slice(0, 4);
  const lowest  = stores[0];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 mt-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Best Sites to Buy</h3>
          <p className="text-sm text-slate-500 mt-0.5">Comparing prices across {stores.length} trusted stores</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Lowest price</p>
          <p className="text-xl font-bold text-emerald-600">{formatINR(lowest.price)}</p>
          <p className="text-xs text-slate-500">at {lowest.name}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {visible.map((store, i) => {
          //fall
          const isOriginalStore = productUrl && productUrl !== "#" &&
            productUrl.toLowerCase().includes(store.id);
          const href = isOriginalStore ? productUrl : store.searchUrl(productTitle);

          return (
            <div key={store.id} className={`flex items-center justify-between border rounded-xl px-4 py-3 ${store.color} hover:shadow-sm transition-all`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl w-8 text-center">{store.logo}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-800">{store.name}</span>
                    {store.trusted && <BadgeCheck size={14} className="text-blue-500" />}
                    {i === 0 && <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">BEST PRICE</span>}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <div className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" /><span className="text-xs text-slate-500">{store.rating}</span></div>
                    <div className="flex items-center gap-1 text-xs text-slate-500"><Truck size={11} />{store.delivery}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-base font-bold text-slate-900">{formatINR(store.price)}</p>
                  {store.savings > 0
                    ? <p className="text-xs text-emerald-600 font-medium">Save {formatINR(store.savings)}</p>
                    : <p className="text-xs text-slate-400">{store.badge}</p>
                  }
                </div>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                >
                  Buy Now <ExternalLink size={11} />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      

      <div className="flex items-center gap-2 mt-4 text-xs text-slate-400 justify-center">
        <ShieldCheck size={13} className="text-emerald-500" />
        Prices are simulated estimates · Click "Buy Now" to search that store directly
      </div>
    </div>
  );
}
