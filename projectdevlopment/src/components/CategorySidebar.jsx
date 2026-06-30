import React from "react";
import { CATEGORIES } from "../data/deals";
import { LayoutGrid } from "lucide-react";

const ALL = [{ id: "all", label: "All Deals", icon: LayoutGrid }, ...CATEGORIES];

export default function CategorySidebar({ active, onSelect }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4">
      <h3 className="text-xs font-semibold tracking-wide text-slate-400 mb-3">CATEGORIES</h3>
      <div className="flex flex-col gap-1">
        {ALL.map((c) => {
          const Icon = c.icon;
          return (
            <button key={c.id} onClick={() => onSelect(c.id)}
              className={`flex items-center gap-2.5 text-sm px-2.5 py-2 rounded-lg text-left transition-colors ${active === c.id ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-600 hover:bg-slate-50"}`}>
              <Icon size={16} /> {c.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
