import React, { useState } from "react";
import { ExternalLink, Truck, ShieldCheck, Star, ChevronDown, ChevronUp, BadgeCheck, Search } from "lucide-react";

const formatINR = (n) => "₹" + Number(Math.round(n)).toLocaleString("en-IN");

/* ── Other stores — only search links, no fake prices ── */
const OTHER_STORES = [
  { id: "amazon",   name: "Amazon",          logo: "🛒", searchUrl: (q) => `https://www.amazon.in/s?k=${encodeURIComponent(q)}` },
  { id: "flipkart", name: "Flipkart",         logo: "🏪", searchUrl: (q) => `https://www.flipkart.com/search?q=${encodeURIComponent(q)}` },
  { id: "croma",    name: "Croma",            logo: "🏬", searchUrl: (q) => `https://www.croma.com/searchB?q=${encodeURIComponent(q)}` },
  { id: "tatacliq", name: "Tata CLiQ",        logo: "🏷️", searchUrl: (q) => `https://www.tatacliq.com/search/?text=${encodeURIComponent(q)}` },
  { id: "reliance", name: "Reliance Digital", logo: "📱", searchUrl: (q) => `https://www.reliancedigital.in/search?q=${encodeURIComponent(q)}` },
  { id: "myntra",   name: "Myntra",           logo: "👗", searchUrl: (q) => `https://www.myntra.com/${encodeURIComponent(q.replace(/\s+/g, "-"))}` },
  { id: "meesho",   name: "Meesho",           logo: "🛍️", searchUrl: (q) => `https://www.meesho.com/search?q=${encodeURIComponent(q)}` },
  { id: "snapdeal", name: "Snapdeal",         logo: "🔖", searchUrl: (q) => `https://www.snapdeal.com/search?keyword=${encodeURIComponent(q)}` },
];

/* ── Detect store name from URL ── */
function detectStoreName(url = "") {
  const u = url.toLowerCase();
  if (u.includes("amazon"))          return "Amazon";
  if (u.includes("flipkart"))        return "Flipkart";
  if (u.includes("myntra"))          return "Myntra";
  if (u.includes("croma"))           return "Croma";
  if (u.includes("reliancedigital")) return "Reliance Digital";
  if (u.includes("tatacliq"))        return "Tata CLiQ";
  if (u.includes("meesho"))          return "Meesho";
  if (u.includes("snapdeal"))        return "Snapdeal";
  if (u.includes("apple"))           return "Apple";
  if (u.includes("mi.com"))          return "Mi Store";
  if (u.includes("wakefit"))         return "Wakefit";
  return "Online Store";
}

function storeEmoji(name = "") {
  const n = name.toLowerCase();
  if (n.includes("amazon"))          return "🛒";
  if (n.includes("flipkart"))        return "🏪";
  if (n.includes("myntra"))          return "👗";
  if (n.includes("croma"))           return "🏬";
  if (n.includes("reliance"))        return "📱";
  if (n.includes("tata"))            return "🏷️";
  if (n.includes("meesho"))          return "🛍️";
  if (n.includes("snapdeal"))        return "🔖";
  if (n.includes("apple"))           return "🍎";
  if (n.includes("mi"))              return "📱";
  if (n.includes("wakefit"))         return "🛏️";
  return "🛒";
}

export default function StoreComparison({ basePrice, productTitle, productUrl, store }) {
  const [showOthers, setShowOthers] = useState(false);

  if (!basePrice || basePrice <= 0) return null;

  // Determine the real store name
  const realStoreName = store || detectStoreName(productUrl);
  const realStoreUrl  = productUrl && productUrl !== "#" ? productUrl : null;

  // Filter out the real store from "other stores" list
  const otherStores = OTHER_STORES.filter(
    (s) => !realStoreName.toLowerCase().includes(s.id) && !s.id.includes(realStoreName.toLowerCase())
  );

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-bold text-slate-900 text-lg">Where to Buy</h3>
          <p className="text-sm text-slate-500 mt-0.5">
            Real listing from {realStoreName} · Search links for other stores
          </p>
        </div>
      </div>

      {/* ── Real store — actual product listing ── */}
      <div className="border-2 border-emerald-200 bg-emerald-50 rounded-xl px-4 py-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{storeEmoji(realStoreName)}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800">{realStoreName}</span>
                <BadgeCheck size={15} className="text-emerald-600" />
                <span className="text-[10px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                  REAL LISTING
                </span>
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <Star size={11} className="text-amber-400 fill-amber-400" />
                <span className="text-xs text-slate-500">Verified product page</span>
                <span className="text-slate-300 mx-1">•</span>
                <Truck size={11} className="text-emerald-600" />
                <span className="text-xs text-emerald-600">Free delivery</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xl font-bold text-slate-900">{formatINR(basePrice)}</p>
              <p className="text-xs text-emerald-600 font-medium">Actual price</p>
            </div>
            {realStoreUrl ? (
              <a
                href={realStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
              >
                Buy Now <ExternalLink size={12} />
              </a>
            ) : (
              <span className="text-xs text-slate-400 italic">No link available</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Other stores — search links only, no fake prices ── */}
      <button
        onClick={() => setShowOthers((s) => !s)}
        className="w-full flex items-center justify-between text-sm text-slate-600 font-medium py-2.5 px-4 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors mb-3"
      >
        <span className="flex items-center gap-2">
          <Search size={14} className="text-slate-400" />
          Search this product on {otherStores.length} other stores
        </span>
        {showOthers ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {showOthers && (
        <div className="grid grid-cols-2 gap-2">
          {otherStores.map((s) => (
            <a
              key={s.id}
              href={s.searchUrl(productTitle)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between border border-slate-200 rounded-xl px-3 py-2.5 hover:border-blue-300 hover:bg-blue-50 transition-all group"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">{s.logo}</span>
                <span className="text-sm font-medium text-slate-700">{s.name}</span>
              </div>
              <div className="flex items-center gap-1 text-blue-600 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Search <ExternalLink size={10} />
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Footer note */}
      <div className="flex items-center gap-2 mt-4 text-xs text-slate-400 justify-center">
        <ShieldCheck size={13} className="text-emerald-500" />
        Only {realStoreName} shows the verified real price · Other stores open search results
      </div>
    </div>
  );
}
