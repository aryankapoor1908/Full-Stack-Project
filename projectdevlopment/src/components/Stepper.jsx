import React from "react";
import { Check } from "lucide-react";

export default function Stepper({ step }) {
  const steps = ["Source", "Details", "Preview"];
  return (
    <div className="flex items-center justify-center gap-3 my-10">
      {steps.map((label, i) => {
        const num  = i + 1;
        const done = num < step;
        const active = num === step;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${done || active ? "bg-emerald-700 text-white" : "bg-slate-200 text-slate-500"}`}>
                {done ? <Check size={15} /> : num}
              </div>
              <span className={`text-xs ${active ? "text-slate-800 font-medium" : "text-slate-400"}`}>{label}</span>
            </div>
            {num < steps.length && <div className="w-20 h-px bg-slate-200 mb-5" />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
