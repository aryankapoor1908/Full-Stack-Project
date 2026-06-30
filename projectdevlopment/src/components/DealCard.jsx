import React from "react";
import { ThumbsUp, ExternalLink, Star, Truck } from "lucide-react";

const formatINR = (n) => n ? "₹" + Number(n).toLocaleString("en-IN") : null;

export default function DealCard({ deal, onView }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-200 flex flex-col">
      <div className="relative">
        {deal.image
          ? <img src={deal.image} alt={deal.title} className="w-full h-44 object-cover bg-slate-100" onError={(e) => { e.target.src = "https://via.placeholder.com/400x300?text=No+Image"; }} />
          : <div className="w-full h-44 bg-slate-100 flex items-center justify-center text-slate-400 text-sm">No Image</div>
        }
        {deal.off && deal.off > 0 && <span className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-semibold px-2 py-1 rounded-md">{deal.off}% OFF</span>}
        {deal.onSale && !deal.off && <span className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-semibold px-2 py-1 rounded-md">ON SALE</span>}
        {deal.store && <span className="absolute bottom-2 left-2 bg-white/90 text-slate-700 text-xs font-medium px-2 py-1 rounded-md shadow-sm">{deal.store}</span>}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="text-sm font-medium text-slate-800 leading-snug line-clamp-2 h-10">{deal.title}</p>
        {deal.rating > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-medium text-slate-700">{deal.rating}</span>
            {deal.reviews > 0 && <span className="text-xs text-slate-400">({Number(deal.reviews).toLocaleString("en-IN")} reviews)</span>}
          </div>
        )}
        <div className="flex items-baseline gap-2 mt-2">
          {deal.price
            ? <><span className="text-lg font-bold text-slate-900">{formatINR(deal.price)}</span>{deal.original && deal.original > deal.price && <span className="text-sm text-slate-400 line-through">{formatINR(deal.original)}</span>}</>
            : <span className="text-sm text-slate-400 italic">Price not available</span>
          }
        </div>
        {deal.shipping && <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600"><Truck size={11} />{deal.shipping}</div>}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1 text-slate-400 text-xs"><ThumbsUp size={12} /><span>{deal.reviews > 0 ? deal.reviews : "—"}</span></div>
          <button onClick={onView} className="flex items-center gap-1 text-blue-700 text-sm font-medium hover:underline">View Deal <ExternalLink size={13} /></button>
        </div>
      </div>
    </div>
  );
}
