import React, { useState, useEffect, useCallback } from "react";
import SearchHero from "../components/SearchHero";
import CategorySidebar from "../components/CategorySidebar";
import TopContributors from "../components/TopContributors";
import DealCard from "../components/DealCard";
import FeaturesSection from "../components/FeaturesSection";
import { searchProducts } from "../services/productapi";
import { Search, Loader, AlertCircle, RefreshCw } from "lucide-react";

const CATEGORY_QUERIES = {
  all:         "best deals today",
  electronics: "electronics gadgets",
  fashion:     "fashion clothing",
  home:        "home garden furniture",
  gaming:      "gaming accessories",
  sports:      "sports outdoors",
};

export default function DealsPage({ onViewProduct }) {
  const [products, setProducts]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory]     = useState("all");
  const [tab, setTab]               = useState("Hot");
  const [lastQuery, setLastQuery]   = useState("");

  const fetchProducts = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const data = await searchProducts(query);
      setProducts(data);
      setLastQuery(query);
    } catch (err) {
      setError(err.message || "Failed to load products. Please try again.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load default products on mount
  useEffect(() => {
    fetchProducts(CATEGORY_QUERIES["all"]);
  }, [fetchProducts]);

  // Fetch when category changes
  const handleCategorySelect = (cat) => {
    setCategory(cat);
    setSearchQuery("");
    fetchProducts(CATEGORY_QUERIES[cat] || "deals");
  };

  // Fetch when search is triggered
  const handleSearch = (q) => {
    if (!q.trim()) return;
    setSearchQuery(q);
    setCategory("all");
    fetchProducts(q);
  };

  // Sort products based on tab
  const sorted = [...products].sort((a, b) => {
    if (tab === "Top")  return (b.reviews || 0) - (a.reviews || 0);
    if (tab === "New")  return 0; // API order = newest
    return (b.off || 0) - (a.off || 0); // Hot = biggest discount
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <SearchHero onSearch={handleSearch} />

      {/* Features only on default load */}
      {!searchQuery && !loading && <FeaturesSection />}

      {/* Search result banner */}
      {searchQuery && !loading && (
        <div className="mt-4 flex items-center gap-2 text-sm text-slate-600 bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5">
          <Search size={14} className="text-blue-500" />
          {products.length} result{products.length !== 1 ? "s" : ""} for{" "}
          <strong>"{searchQuery}"</strong>
          <button
            onClick={() => { setSearchQuery(""); fetchProducts(CATEGORY_QUERIES["all"]); }}
            className="ml-auto text-blue-600 hover:underline text-xs font-medium"
          >
            Clear search
          </button>
        </div>
      )}

      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* Sidebar */}
        <div className="col-span-3">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <h3 className="text-xs font-semibold tracking-wide text-slate-400 mb-3">CATEGORIES</h3>
            <div className="flex flex-col gap-1">
              {Object.entries(CATEGORY_QUERIES).map(([id]) => (
                <button
                  key={id}
                  onClick={() => handleCategorySelect(id)}
                  className={`text-left text-sm px-3 py-2 rounded-lg capitalize transition-colors ${
                    category === id
                      ? "bg-blue-50 text-blue-700 font-medium"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {id === "all" ? "All Deals" : id.charAt(0).toUpperCase() + id.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <TopContributors />
        </div>

        {/* Main content */}
        <div className="col-span-9">

          {/* Tabs + Timeframe */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-5">
              {["Hot", "New", "Top"].map((t) => (
                <button key={t} onClick={() => setTab(t)}
                  className={`text-sm pb-1 border-b-2 ${
                    tab === t ? "text-blue-700 border-blue-700 font-medium" : "text-slate-500 border-transparent"
                  }`}>{t}</button>
              ))}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <button
                onClick={() => fetchProducts(lastQuery || CATEGORY_QUERIES["all"])}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-blue-600 transition-colors"
              >
                <RefreshCw size={13} /> Refresh
              </button>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <Loader size={36} className="animate-spin mb-4 text-blue-500" />
              <p className="text-sm font-medium text-slate-600">Fetching live deals...</p>
              <p className="text-xs mt-1">Searching across thousands of stores</p>
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <AlertCircle size={36} className="mb-4 text-red-400" />
              <p className="text-sm font-medium text-slate-700">Something went wrong</p>
              <p className="text-xs mt-1 text-slate-500 max-w-xs text-center">{error}</p>
              <button
                onClick={() => fetchProducts(lastQuery || CATEGORY_QUERIES["all"])}
                className="mt-4 bg-blue-700 text-white text-sm px-5 py-2 rounded-lg hover:bg-blue-800"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && sorted.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <Search size={36} className="mb-4 opacity-40" />
              <p className="text-sm font-medium text-slate-600">No products found</p>
              <p className="text-xs mt-1">Try a different search or category</p>
            </div>
          )}

          {/* Products grid */}
          {!loading && !error && sorted.length > 0 && (
            <div className="grid grid-cols-3 gap-4">
              {sorted.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onView={() => onViewProduct(deal)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
