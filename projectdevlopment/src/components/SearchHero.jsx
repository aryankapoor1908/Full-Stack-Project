import React, { useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchHero({ onSearch }) {
  const [value, setValue] = useState("");
  const handleSearch = () => { if (onSearch) onSearch(value.trim()); };
  const handleClear  = () => { setValue(""); if (onSearch) onSearch(""); };
  return (
    <div className="bg-blue-50 rounded-2xl px-8 py-12 text-center">
      <h1 className="text-3xl font-bold text-slate-900 max-w-2xl mx-auto leading-snug">Never pay full price again. Track any product instantly.</h1>
      <p className="text-slate-600 mt-3 max-w-xl mx-auto">We monitor prices across thousands of retailers. Paste a URL or search for an item to start saving.</p>
      <div className="mt-6 flex justify-center">
        <div className="flex items-center bg-white rounded-xl shadow-sm border border-slate-200 w-full max-w-2xl px-4 py-1">
          <Search size={18} className="text-slate-400 mr-2 shrink-0" />
          <input value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="Search products or paste a URL..." className="flex-1 py-2.5 text-sm text-slate-600 outline-none bg-transparent" />
          {value && <button onClick={handleClear} className="mr-2 text-slate-400 hover:text-slate-600"><X size={15} /></button>}
          <button onClick={handleSearch} className="ml-1 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-5 py-2.5 rounded-lg shrink-0">Track Now</button>
        </div>
      </div>
    </div>
  );
}
