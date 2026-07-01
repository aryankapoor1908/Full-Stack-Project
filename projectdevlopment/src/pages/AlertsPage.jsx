import React, { useState } from "react";
import { Bell, TrendingDown, Settings, Mail, MessageSquare, BellRing, Plus, Trash2, ExternalLink, X, Link } from "lucide-react";

/* ── Extract clean product name from any store URL ── */
function extractProductName(url) {
  try {
    const u = new URL(url.startsWith("http") ? url : "https://" + url);
    const host = u.hostname.toLowerCase();
    if (host.includes("amazon")) {
      const parts = u.pathname.split("/").filter(Boolean);
      const dpIndex = parts.indexOf("dp");
      if (dpIndex > 0) return decodeURIComponent(parts[dpIndex - 1]).replace(/-/g, " ");
      return u.searchParams.get("k") || u.searchParams.get("field-keywords") || "";
    }
    if (host.includes("flipkart")) {
      const parts = u.pathname.split("/").filter(Boolean);
      return parts.length > 0 ? decodeURIComponent(parts[0]).replace(/-/g, " ") : "";
    }
    if (host.includes("myntra")) {
      const parts = u.pathname.split("/").filter(Boolean);
      return parts.length >= 2 ? decodeURIComponent(parts.slice(0,2).join(" ")).replace(/-/g, " ") : "";
    }
    const parts = u.pathname.split("/").filter((p) => p.length > 3 && !/^\d+$/.test(p));
    if (parts.length > 0) return decodeURIComponent(parts[0]).replace(/[-_]/g, " ");
    return "";
  } catch { return ""; }
}

function detectStore(url) {
  const u = url.toLowerCase();
  if (u.includes("amazon"))          return "Amazon";
  if (u.includes("flipkart"))        return "Flipkart";
  if (u.includes("myntra"))          return "Myntra";
  if (u.includes("croma"))           return "Croma";
  if (u.includes("reliancedigital")) return "Reliance Digital";
  if (u.includes("tatacliq"))        return "Tata CLiQ";
  if (u.includes("meesho"))          return "Meesho";
  if (u.includes("snapdeal"))        return "Snapdeal";
  return "Online Store";
}

const formatINR = (n) => "₹" + Number(n).toLocaleString("en-IN");

function AlertRow({ alert, onDelete }) {
  const priceDiff = alert.currentPrice - alert.targetPrice;
  const reached   = alert.currentPrice <= alert.targetPrice;

  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <img
          src={alert.image || "https://via.placeholder.com/64?text=No+Image"}
          alt={alert.title}
          className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0"
        />
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate">{alert.title}</p>
          <p className="text-xs text-slate-400">
            {alert.store} • Target: {formatINR(alert.targetPrice)}
          </p>
        </div>
      </div>

      <div className="text-right mr-4 shrink-0">
        <p className="text-sm font-semibold text-slate-800">{formatINR(alert.currentPrice)}</p>
        {reached ? (
          <p className="text-xs text-emerald-600 font-medium">🎉 Target reached!</p>
        ) : (
          <p className="text-xs text-amber-600">{formatINR(priceDiff)} to go</p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button onClick={() => onDelete(alert.id)} className="text-slate-400 hover:text-red-500 transition-colors">
          <Trash2 size={16} />
        </button>
        <a
          href={alert.url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium px-4 py-2 rounded-lg flex items-center gap-1"
        >
          View Deal <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}

function PreferenceToggle({ icon: Icon, label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-2 text-sm text-slate-600"><Icon size={15} /> {label}</div>
      <button
        onClick={onChange}
        className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
          checked ? "bg-emerald-600" : "bg-white border border-slate-300"
        }`}
      >
        {checked && <span className="text-white text-[10px]">✓</span>}
      </button>
    </div>
  );
}

function AddTrackingModal({ onClose, onAdd }) {
  const [url,          setUrl]          = useState("");
  const [productName,  setProductName]  = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [targetPrice,  setTargetPrice]  = useState("");
  const [error,        setError]        = useState("");

  const handleUrlChange = (e) => {
    const v = e.target.value;
    setUrl(v);
    setError("");
    if (v.trim()) {
      const extracted = extractProductName(v.trim());
      setProductName(extracted);
    } else {
      setProductName("");
    }
  };

  const handleAdd = () => {
    if (!url.trim()) return setError("Please paste a product URL.");
    if (!currentPrice.trim() || isNaN(Number(currentPrice)) || Number(currentPrice) <= 0) {
      return setError("Please enter the current price of the product.");
    }
    if (!targetPrice.trim() || isNaN(Number(targetPrice)) || Number(targetPrice) <= 0) {
      return setError("Please enter a valid target price.");
    }
    if (Number(targetPrice) >= Number(currentPrice)) {
      return setError("Target price must be lower than the current price.");
    }
    const name = productName.trim() || "Tracked Product";
    onAdd({
      id: Date.now().toString(),
      title: name.charAt(0).toUpperCase() + name.slice(1),
      store: detectStore(url),
      image: "",
      url,
      targetPrice:  Number(targetPrice),
      currentPrice: Number(currentPrice),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <X size={18} />
        </button>
        <h3 className="text-lg font-bold text-slate-900 mb-1">Add New Tracking URL</h3>
        <p className="text-sm text-slate-500 mb-4">Paste a product link and set your target price.</p>

        <label className="text-xs font-semibold text-slate-500 mb-1 block">PRODUCT URL</label>
        <input
          value={url}
          onChange={handleUrlChange}
          placeholder="https://amazon.in/product/..."
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 mb-2"
        />
        {productName && (
          <div className="flex items-center gap-1.5 text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2 mb-3">
            <Link size={11} />
            Detected: <strong>{productName}</strong> from <strong>{detectStore(url)}</strong>
          </div>
        )}

        <label className="text-xs font-semibold text-slate-500 mb-1 block">CURRENT PRICE (₹)</label>
        <input
          value={currentPrice}
          onChange={(e) => { setCurrentPrice(e.target.value); setError(""); }}
          placeholder="e.g. 41400"
          type="number"
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400 mb-3"
        />

        <label className="text-xs font-semibold text-slate-500 mb-1 block">TARGET PRICE (₹)</label>
        <input
          value={targetPrice}
          onChange={(e) => { setTargetPrice(e.target.value); setError(""); }}
          placeholder="e.g. 25000"
          type="number"
          className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-blue-400"
        />

        {error && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2 mt-3">{error}</p>}

        <button onClick={handleAdd} className="w-full mt-4 bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold py-3 rounded-xl">
          Start Tracking
        </button>
      </div>
    </div>
  );
}

export default function AlertsPage({ alerts, onAddAlert, onDeleteAlert }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [prefs, setPrefs] = useState({ email: true, push: true, whatsapp: false });
  const [frequency, setFrequency] = useState("Instant Notifications");
  const [saved, setSaved] = useState(false);

  const recentDrops = alerts
    .filter((a) => a.currentPrice <= a.targetPrice)
    .slice(0, 3);

  const handleSavePrefs = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <h1 className="text-2xl font-bold text-slate-900">Personal Tracking Center</h1>
      <p className="text-slate-500 mt-1">
        Monitor your favorite products, manage price alerts, and optimize your shopping with real-time analytics.
      </p>

      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* Active Alerts */}
        <div className="col-span-8 bg-white border border-slate-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <Bell size={16} /> Active Alerts
            </div>
            <span className="text-xs bg-blue-50 text-blue-700 font-medium px-3 py-1 rounded-full">
              {alerts.length} Item{alerts.length !== 1 ? "s" : ""} Tracking
            </span>
          </div>

          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Bell size={32} className="mb-3 opacity-40" />
              <p className="text-sm font-medium text-slate-600">No alerts yet</p>
              <p className="text-xs mt-1">Set a price alert from any product page, or add one manually below</p>
            </div>
          ) : (
            alerts.map((a) => <AlertRow key={a.id} alert={a} onDelete={onDeleteAlert} />)
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="w-full mt-4 border border-dashed border-slate-300 rounded-lg py-3 flex items-center justify-center gap-2 text-sm text-slate-500 hover:bg-slate-50 hover:border-blue-300 transition-colors"
          >
            <Plus size={15} /> Add New Tracking URL
          </button>
        </div>

        {/* Sidebar */}
        <div className="col-span-4 flex flex-col gap-6">
          {/* Recent Drops */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2 font-semibold text-slate-800 mb-3">
              <TrendingDown size={16} /> Recent Drops
            </div>
            {recentDrops.length === 0 ? (
              <p className="text-xs text-slate-400">No price drops yet. Check back soon!</p>
            ) : (
              <div className="flex flex-col gap-3">
                {recentDrops.map((d) => (
                  <div key={d.id} className="flex items-start gap-2.5">
                    <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 bg-emerald-100 text-emerald-600">
                      <TrendingDown size={13} />
                    </span>
                    <div>
                      <p className="text-sm text-slate-700 leading-snug">
                        <strong>{d.title}</strong> hit your target price!
                      </p>
                      <p className="text-xs text-slate-400">{formatINR(d.currentPrice)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Preferences */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center gap-2 font-semibold text-slate-800 mb-3">
              <Settings size={16} /> Preferences
            </div>
            <p className="text-xs font-medium text-slate-400 mb-1">Notification Channels</p>
            <PreferenceToggle icon={Mail} label="Email" checked={prefs.email}
              onChange={() => setPrefs((p) => ({ ...p, email: !p.email }))} />
            <PreferenceToggle icon={BellRing} label="Push Alerts" checked={prefs.push}
              onChange={() => setPrefs((p) => ({ ...p, push: !p.push }))} />
            <PreferenceToggle icon={MessageSquare} label="WhatsApp" checked={prefs.whatsapp}
              onChange={() => setPrefs((p) => ({ ...p, whatsapp: !p.whatsapp }))} />

            <p className="text-xs font-medium text-slate-400 mt-3 mb-1">Alert Frequency</p>
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value)}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700"
            >
              <option>Instant Notifications</option>
              <option>Daily Digest</option>
              <option>Weekly Digest</option>
            </select>

            <button
              onClick={handleSavePrefs}
              className="w-full mt-4 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium py-2.5 rounded-lg transition-colors"
            >
              {saved ? "✓ Saved!" : "Save Preferences"}
            </button>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddTrackingModal onClose={() => setShowAddModal(false)} onAdd={onAddAlert} />
      )}
    </div>
  );
}
