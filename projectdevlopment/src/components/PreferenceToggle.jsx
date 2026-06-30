import React, { useState } from "react";
import { Check } from "lucide-react";

export default function PreferenceToggle({ icon: Icon, label, checked }) {
  const [on, setOn] = useState(checked);
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2 text-sm text-slate-600"><Icon size={15} /> {label}</div>
      <button onClick={() => setOn(!on)} className={`w-5 h-5 rounded flex items-center justify-center ${on ? "bg-emerald-600" : "bg-white border border-slate-300"}`}>
        {on && <Check size={13} className="text-white" />}
      </button>
    </div>
  );
}
