import React, { useState } from "react";
import { TrendingDown, ExternalLink, Bookmark, BellRing, CheckCircle, AlertCircle, X, Star, Truck, ShoppingBag, ImageOff } from "lucide-react";
import Breadcrumb from "../components/Breadcrumb";
import PriceHistoryChart from "../components/PriceHistoryChart";
import StoreComparison from "../components/StoreComparison";

const formatINR = (n) => n ? "₹" + Number(n).toLocaleString("en-IN") : null;

function Toast({ type, message, onClose }) {
  React.useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
  const styles = type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-800" : "bg-red-50 border-red-200 text-red-800";
  const Icon = type === "success" ? CheckCircle : AlertCircle;
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-start gap-3 border rounded-xl px-4 py-3 shadow-lg max-w-sm ${styles}`}>
      <Icon size={18} className="shrink-0 mt-0.5" />
      <p className="text-sm font-medium">{message}</p>
      <button onClick={onClose} className="ml-auto shrink-0 opacity-60 hover:opacity-100"><X size={15} /></button>
    </div>
  );
}

export default function ProductDetailPage({ product, onBack, onAddAlert }) {
  const [target, setTarget]     = useState("");
  const [saved,  setSaved]      = useState(false);
  const [toast,  setToast]      = useState(null);
  const [imgFailed, setImgFailed] = useState(false);

  const showToast  = (type, message) => setToast({ type, message });
  const closeToast = () => setToast(null);

  const handleSetAlert = () => {
    const val = Number(target.replace(/,/g, ""));
    if (!target.trim())         return showToast("error", "Please enter a target price.");
    if (isNaN(val) || val <= 0) return showToast("error", "Please enter a valid price.");
    if (product.price && val >= product.price) return showToast("error", `Target must be below current price of ${formatINR(product.price)}.`);

    if (onAddAlert) {
      onAddAlert({
        id: Date.now().toString(),
        title: product.title,
        store: product.store,
        image: product.image,
        url: product.url,
        targetPrice: val,
        currentPrice: product.price,
      });
    }

    showToast("success", `Alert set! Check the Alerts page — we'll track this for you.`);
    setTarget("");
  };

  const discountPct = product.original && product.price && product.original > product.price
    ? Math.round(((product.original - product.price) / product.original) * 100)
    : product.off;

  const dealScore = product.dealScore || (discountPct ? Math.min(99, 60 + discountPct) : 70);

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      {toast && <Toast type={toast.type} message={toast.message} onClose={closeToast} />}

      <button onClick={onBack} className="text-sm text-blue-700 hover:underline mb-4">← Back to deals</button>
      <Breadcrumb items={product.breadcrumb || ["Shopping", "Product"]} />

      <div className="grid grid-cols-12 gap-8 mt-3">
        {/* Image */}
        <div className="col-span-5">
          <div className="relative bg-slate-50 rounded-xl overflow-hidden">
            {product.image && !imgFailed
              ? <img src={product.image} alt={product.title} className="w-full h-72 object-cover"
                  onError={() => setImgFailed(true)} />
              : (
                <div className="w-full h-72 bg-gradient-to-br from-slate-100 to-slate-200 flex flex-col items-center justify-center text-slate-400 gap-2">
                  <ImageOff size={36} strokeWidth={1.5} />
                  <span className="text-sm font-medium">No Image Available</span>
                </div>
              )
            }
            {product.drop > 0 && (
              <span className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
                <TrendingDown size={13} /> Price Drop: {product.drop}%
              </span>
            )}
          </div>
          {/* Extra images */}
          {product.images?.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {product.images.slice(0, 5).map((img, i) => (
                <img key={i} src={img} alt="" className="w-16 h-16 rounded-lg object-cover border border-slate-200 shrink-0 cursor-pointer hover:border-blue-400 transition-colors" />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="col-span-7">
          <h1 className="text-2xl font-bold text-slate-900 leading-snug">{product.title}</h1>

          {product.rating > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((s) => (
                  <Star key={s} size={14} className={s <= Math.round(product.rating) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                ))}
              </div>
              <span className="text-sm font-medium text-slate-700">{product.rating}</span>
              {product.reviews > 0 && <span className="text-sm text-slate-400">({Number(product.reviews).toLocaleString("en-IN")} reviews)</span>}
              {product.onSale && <span className="ml-2 text-xs bg-rose-100 text-rose-600 font-semibold px-2 py-0.5 rounded-full">ON SALE</span>}
            </div>
          )}

          {/* Price box */}
          <div className="bg-blue-50 rounded-xl p-5 mt-4">
            <div className="flex items-baseline gap-3">
              {product.price
                ? <>
                    <span className="text-3xl font-bold text-blue-700">{formatINR(product.price)}</span>
                    {product.original && product.original > product.price && <span className="text-lg text-slate-400 line-through">{formatINR(product.original)}</span>}
                    {discountPct > 0 && <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{discountPct}% off</span>}
                  </>
                : <span className="text-slate-500 text-lg">Price not available</span>
              }
            </div>
            {product.store && <p className="text-sm text-slate-500 mt-1">Best price found at <strong>{product.store}</strong></p>}
            {product.shipping && <div className="flex items-center gap-1 mt-1 text-xs text-emerald-600"><Truck size={12} />{product.shipping}</div>}
            <div className="flex gap-3 mt-4">
              <a href={product.url || "#"} target="_blank" rel="noopener noreferrer"
                className="flex-1 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors">
                Go to Store <ExternalLink size={14} />
              </a>
              <button onClick={() => { setSaved((s) => !s); showToast("success", saved ? "Removed from saved." : "Saved for later!"); }}
                className={`flex-1 border text-sm font-medium py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors ${saved ? "bg-blue-50 border-blue-300 text-blue-700" : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"}`}>
                <Bookmark size={14} className={saved ? "fill-blue-600" : ""} />
                {saved ? "Saved!" : "Save for Later"}
              </button>
            </div>
          </div>

          {/* Price alert */}
          <div className="bg-emerald-50 rounded-xl p-5 mt-4">
            <div className="flex items-center gap-2 text-emerald-700 font-medium text-sm mb-3"><BellRing size={15} /> Set Price Alert</div>
            <div className="flex gap-2">
              <div className="flex items-center flex-1 bg-white border border-slate-200 rounded-lg px-3 focus-within:border-emerald-400">
                <span className="text-slate-400 text-sm mr-1">₹</span>
                <input value={target} onChange={(e) => setTarget(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSetAlert()}
                  placeholder="Target Price" type="number" min="0" className="flex-1 py-2.5 text-sm outline-none bg-transparent" />
              </div>
              <button onClick={handleSetAlert} className="bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-medium px-5 rounded-lg transition-colors">Set</button>
            </div>
            <p className="text-xs text-slate-500 mt-2">We'll email you once the price drops to your target.{product.price ? ` Current: ${formatINR(product.price)}` : ""}</p>
          </div>
        </div>
      </div>

      {/* ── Store Comparison ── */}
      <StoreComparison
        basePrice={product.price}
        productTitle={product.title}
        productUrl={product.url}
      />

      {/* ── Price history + Deal score ── */}
      <div className="grid grid-cols-12 gap-6 mt-6">
        <div className="col-span-8 bg-white border border-slate-200 rounded-xl p-5">
          <h3 className="font-semibold text-slate-800 mb-4">Price History</h3>
          <PriceHistoryChart key={product.title} currentPrice={product.price} productTitle={product.title} />
        </div>
        <div className="col-span-4 bg-blue-700 rounded-xl p-5 text-white">
          <h3 className="font-semibold mb-1">Is it a good time to buy?</h3>
          <p className="text-sm text-blue-100 mb-4">{product.history || "Our analysis suggests the price is near a historic low."}</p>
          <div className="bg-blue-800/60 rounded-lg p-3">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-medium">Deal Score</span>
              <span className="font-bold text-emerald-300">{dealScore}/100</span>
            </div>
            <div className="w-full h-2 bg-blue-900/50 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full transition-all duration-700" style={{ width: `${dealScore}%` }} />
            </div>
            <p className="text-xs text-blue-200 mt-2">
              {dealScore >= 80 ? "🔥 Excellent deal — buy now!" : dealScore >= 60 ? "👍 Good deal" : "⏳ Wait for a better price"}
            </p>
          </div>
          {product.reviews > 0 && (
            <div className="mt-3 bg-blue-800/40 rounded-lg p-3 flex items-center gap-2">
              <ShoppingBag size={14} className="text-blue-200" />
              <span className="text-xs text-blue-100">{Number(product.reviews).toLocaleString("en-IN")} people reviewed this</span>
            </div>
          )}
          {product.onSale && (
            <div className="mt-2 bg-rose-500/30 rounded-lg p-2 text-center">
              <span className="text-xs font-semibold text-white">🏷️ Currently On Sale!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
