import React, { useState, useEffect } from "react";
import SearchHero from "../components/SearchHero";
import TopContributors from "../components/TopContributors";
import DealCard from "../components/DealCard";
import FeaturesSection from "../components/FeaturesSection";
import { Search, Loader, AlertCircle, RefreshCw, Laptop, Shirt, Home as HomeIcon, Gamepad2, Dumbbell, LayoutGrid } from "lucide-react";

const CATEGORIES = [
  { id: "all",         label: "All Deals",        icon: LayoutGrid },
  { id: "electronics", label: "Electronics",      icon: Laptop },
  { id: "fashion",     label: "Fashion",          icon: Shirt },
  { id: "home",        label: "Home & Garden",    icon: HomeIcon },
  { id: "gaming",      label: "Gaming",           icon: Gamepad2 },
  { id: "sports",      label: "Sports & Outdoors", icon: Dumbbell },
];

export default function DealsPage({
  onViewProduct,
  cachedProducts,
  cacheQuery,
  cacheLoading,
  cacheError,
  onFetch,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category,    setCategory]    = useState("all");
  const [tab,         setTab]         = useState("Hot");

  // Fetch once on first mount
  useEffect(() => {
    if (cachedProducts.length === 0 && !cacheLoading && !cacheError) {
      onFetch("all");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setSearchQuery("");
    onFetch(cat); // sends "all", "electronics", "fashion" etc. — matches productApi.js exactly
  };

  const handleSearch = (q) => {
    if (!q.trim()) return;
    setSearchQuery(q);
    setCategory("all");
    onFetch(q); // sends raw search text e.g. "iphone"
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    onFetch(category);
  };

  const sorted = [...cachedProducts].sort((a, b) => {
    if (tab === "Top") return (b.reviews || 0) - (a.reviews || 0);
    if (tab === "Hot") return (b.off || 0) - (a.off || 0);
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <SearchHero onSearch={handleSearch} />

      {!searchQuery && !cacheLoading && <FeaturesSection />}

      {searchQuery && !cacheLoading && (
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5">
          <Search size={14} className="text-blue-500" />
          {cachedProducts.length} result{cachedProducts.length !== 1 ? "s" : ""} for{" "}
          <strong>"{searchQuery}"</strong>
          <button onClick={handleClearSearch} className="ml-auto text-blue-600 hover:underline text-xs font-medium">
            Clear search
          </button>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-3">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-xs font-semibold tracking-wide text-slate-400 mb-3">CATEGORIES</h3>
            <div className="flex flex-col gap-1">
              {CATEGORIES.map((c) => {
                const Icon = c.icon;
                return (
                  <button key={c.id} onClick={() => handleCategorySelect(c.id)}
                    className={`flex items-center gap-2.5 text-sm px-2.5 py-2 rounded-lg text-left transition-colors ${
                      category === c.id && !searchQuery ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-600 hover:bg-slate-50"
                    }`}>
                    <Icon size={16} /> {c.label}
                  </button>
                );
              })}
            </div>
          </div>
          <TopContributors />
        </div>

        <div className="col-span-9">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-5">
              {["Hot", "New", "Top"].map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`text-sm pb-1 border-b-2 ${tab === t ? "text-blue-700 border-blue-700 font-medium" : "text-slate-500 border-transparent"}`}>
                  {t}
                </button>
              ))}
            </div>
            <button onClick={() => onFetch(cacheQuery || "all")}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600 transition-colors">
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          {cacheLoading && (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <Loader size={36} className="animate-spin mb-4 text-blue-500" />
              <p className="text-sm font-medium text-slate-600">Loading products...</p>
            </div>
          )}

          {!cacheLoading && cacheError && (
            <div className="flex flex-col items-center justify-center py-24">
              <AlertCircle size={36} className="mb-4 text-red-400" />
              <p className="text-sm font-medium text-slate-700">Something went wrong</p>
              <p className="text-xs mt-1 text-slate-500 max-w-xs text-center">{cacheError}</p>
              <button onClick={() => onFetch(cacheQuery || "all")}
                className="mt-4 bg-blue-700 text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-800">
                Try Again
              </button>
            </div>
          )}

          {!cacheLoading && !cacheError && sorted.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <Search size={36} className="mb-4 opacity-40" />
              <p className="text-sm font-medium text-slate-600">No products found</p>
              <p className="text-xs mt-1">Try: iphone, nike, keyboard, headphones, vacuum, chair</p>
            </div>
          )}

          {!cacheLoading && !cacheError && sorted.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {sorted.map((deal) => (
                <DealCard key={deal.id} deal={deal} onView={() => onViewProduct(deal)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
