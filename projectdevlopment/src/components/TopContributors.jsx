import React from "react";
import { CONTRIBUTORS } from "../data/deals";

export default function TopContributors() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 mt-4">
      <h3 className="text-xs font-semibold tracking-wide text-slate-400 mb-3">TOP CONTRIBUTORS</h3>
      <div className="flex flex-col gap-3">
        {CONTRIBUTORS.map((c) => (
          <div key={c.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-6 h-6 rounded-full ${c.color} text-white text-[10px] flex items-center justify-center font-semibold`}>{c.initials}</span>
              <span className="text-sm text-slate-700">{c.name}</span>
            </div>
            <span className="text-sm text-slate-400">{c.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
