import React, { useState } from "react";
import { Search, X, Link } from "lucide-react";

/* ── Extract a searchable product name from a pasted URL ── */
function extractProductFromUrl(url) {
  try {
    const u = new URL(url);
    const host = u.hostname.toLowerCase();

    // Amazon: /dp/ASIN or /product-name/dp/ASIN
    if (host.includes("amazon")) {
      // Try to get product name from path segments
      const parts = u.pathname.split("/").filter(Boolean);
      const dpIndex = parts.indexOf("dp");
      if (dpIndex > 0) {
        // slug before "dp" is the product name
        return decodeURIComponent(parts[dpIndex - 1])
          .replace(/-/g, " ")
          .replace(/\+/g, " ");
      }
      // Fallback: search query param
      return u.searchParams.get("k") || u.searchParams.get("field-keywords") || "";
    }

    // Flipkart: /product-name/p/itemid
    if (host.includes("flipkart")) {
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length > 0) {
        return decodeURIComponent(parts[0]).replace(/-/g, " ");
      }
    }

    // Myntra: /brand/product-name/buy
    if (host.includes("myntra")) {
      const parts = u.pathname.split("/").filter(Boolean);
      if (parts.length >= 2) {
        return decodeURIComponent(parts.slice(0, 2).join(" ")).replace(/-/g, " ");
      }
    }

    // Croma / Reliance Digital / others
    const parts = u.pathname.split("/").filter(Boolean);
    if (parts.length > 0) {
      const last = parts[parts.length - 1];
      // skip if it's just an ID like "p/12345"
      if (!/^\d+$/.test(last)) {
        return decodeURIComponent(last).replace(/[-_]/g, " ");
      }
      if (parts.length > 1) {
        return decodeURIComponent(parts[parts.length - 2]).replace(/[-_]/g, " ");
      }
    }

    return "";
  } catch {
    return "";
  }
}

function isUrl(str) {
  return str.startsWith("http://") ||
         str.startsWith("https://") ||
         str.startsWith("www.") ||
         /^[a-z0-9-]+\.(com|in|org|net|co)/.test(str.toLowerCase());
}

export default function SearchHero({ onSearch }) {
  const [value,      setValue]      = useState("");
  const [urlParsed,  setUrlParsed]  = useState(""); // extracted product name from URL
  const [isUrlMode,  setIsUrlMode]  = useState(false);

  const handleChange = (e) => {
    const v = e.target.value;
    setValue(v);
    setUrlParsed("");

    if (isUrl(v.trim())) {
      setIsUrlMode(true);
      const extracted = extractProductFromUrl(v.trim());
      setUrlParsed(extracted);
    } else {
      setIsUrlMode(false);
    }
  };

  const handleSearch = () => {
    const query = isUrlMode ? (urlParsed || value.trim()) : value.trim();
    if (!query) return;
    if (onSearch) onSearch(query);
  };

  const handleClear = () => {
    setValue("");
    setUrlParsed("");
    setIsUrlMode(false);
    if (onSearch) onSearch("");
  };

  return (
    <div className="bg-blue-50 rounded-2xl px-8 py-12 text-center">
      <h1 className="text-3xl font-bold text-slate-900 max-w-2xl mx-auto leading-snug">
        Never pay full price again. Track any product instantly.
      </h1>
      <p className="text-slate-600 mt-3 max-w-xl mx-auto">
        We monitor prices across thousands of retailers. Paste a URL or search for an item to start saving.
      </p>

      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="flex items-center bg-white rounded-xl shadow-sm border border-slate-200 w-full max-w-2xl px-4 py-1">
          {isUrlMode
            ? <Link size={18} className="text-blue-500 mr-2 shrink-0" />
            : <Search size={18} className="text-slate-400 mr-2 shrink-0" />
          }
          <input
            value={value}
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search products or paste a URL (amazon.in, flipkart.com...)"
            className="flex-1 py-2.5 text-sm text-slate-600 outline-none bg-transparent"
          />
          {value && (
            <button onClick={handleClear} className="mr-2 text-slate-400 hover:text-slate-600">
              <X size={15} />
            </button>
          )}
          <button
            onClick={handleSearch}
            className="ml-1 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg shrink-0"
          >
            Track Now
          </button>
        </div>

        {/* Show what we extracted from the URL */}
        {isUrlMode && urlParsed && (
          <div className="flex items-center gap-2 text-xs bg-blue-100 text-blue-700 px-4 py-2 rounded-lg max-w-2xl w-full">
            <Link size={12} />
            <span>URL detected — searching for: <strong>"{urlParsed}"</strong></span>
          </div>
        )}
        {isUrlMode && !urlParsed && (
          <div className="flex items-center gap-2 text-xs bg-amber-50 text-amber-700 px-4 py-2 rounded-lg max-w-2xl w-full">
            <span>⚠️ Could not extract product name from this URL. Try searching by product name instead.</span>
          </div>
        )}
      </div>
    </div>
  );
}
