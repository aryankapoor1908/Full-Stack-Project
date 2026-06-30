import React from "react";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb({ items }) {
  return (
    <div className="flex items-center gap-1.5 text-sm text-slate-500">
      {items.map((item, i) => (
        <React.Fragment key={item}>
          {i > 0 && <ChevronRight size={14} />}
          <span>{item}</span>
        </React.Fragment>
      ))}
    </div>
  );
}
