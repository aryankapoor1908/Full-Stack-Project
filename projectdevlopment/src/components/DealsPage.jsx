import React, { useState, useEffect } from "react";
import SearchHero from "../components/SearchHero";
import CategorySidebar from "../components/CategorySidebar";
import TopContributors from "../components/TopContributors";
import DealCard from "../components/DealCard";
import FeaturesSection from "../components/FeaturesSection";
import { Search, Loader, AlertCircle, RefreshCw } from "lucide-react";

const CATEGORY_QUERIES = {
  all:         "best deals today",
  electronics: "electronics gadgets",
  fashion:     "fashion clothing",
  home:        "home garden furniture",
  gaming:      "gaming accessories",
  sports:      "sports outdoors fitness",
};

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

  // Only fetch on first mount if no cache exists yet
  useEffect(() => {
    if (cachedProducts.length === 0 && !cacheLoading && !cacheError) {
      onFetch(CATEGORY_QUERIES["all"]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setSearchQuery("");
    onFetch(CATEGORY_QUERIES[cat] || "deals");
  };

  const handleSearch = (q) => {
    if (!q.trim()) return;
    setSearchQuery(q);
    setCategory("all");
    onFetch(q);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    onFetch(CATEGORY_QUERIES[category] || CATEGORY_QUERIES["all"]);
  };

  // Sort cached products by selected tab
  const sorted = [...cachedProducts].sort((a, b) => {
    if (tab === "Top") return (b.reviews || 0) - (a.reviews || 0);
    if (tab === "Hot") return (b.off || 0) - (a.off || 0);
    return 0;
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <SearchHero onSearch={handleSearch} />

      {/* Features only shown on default load */}
      {!searchQuery && !cacheLoading && <FeaturesSection />}

      {/* Search result banner */}
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
        {/* Sidebar */}
        <div className="col-span-3">
          <CategorySidebar active={category} onSelect={handleCategorySelect} />
          <TopContributors />
        </div>

        {/* Main content */}
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
            {/* Refresh only re-fetches if user explicitly asks */}
            <button
              onClick={() => onFetch(cacheQuery || CATEGORY_QUERIES["all"])}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600 transition-colors"
            >
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          {/* Loading */}
          {cacheLoading && (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <Loader size={36} className="animate-spin mb-4 text-blue-500" />
              <p className="text-sm font-medium text-slate-600">Fetching live deals...</p>
              <p className="text-xs mt-1">Searching across thousands of stores</p>
            </div>
          )}

          {/* Error */}
          {!cacheLoading && cacheError && (
            <div className="flex flex-col items-center justify-center py-24">
              <AlertCircle size={36} className="mb-4 text-red-400" />
              <p className="text-sm font-medium text-slate-700">Something went wrong</p>
              <p className="text-xs mt-1 text-slate-500 max-w-xs text-center">{cacheError}</p>
              <button
                onClick={() => onFetch(cacheQuery || CATEGORY_QUERIES["all"])}
                className="mt-4 bg-blue-700 text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-800"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty */}
          {!cacheLoading && !cacheError && sorted.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <Search size={36} className="mb-4 opacity-40" />
              <p className="text-sm font-medium text-slate-600">No products found</p>
              <p className="text-xs mt-1">Try a different search or category</p>
            </div>
          )}

          {/* Products grid */}
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
