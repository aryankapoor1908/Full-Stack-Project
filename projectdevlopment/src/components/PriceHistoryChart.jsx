import React, { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

function makeRand(seed) {
  let s = Math.abs(seed) || 1;
  return () => { s = (s * 1664525 + 1013904223) & 0x7fffffff; return s / 0x7fffffff; };
}
function makeSeed(title, price) {
  let h = price * 31;
  for (let i = 0; i < title.length; i++) h = (h * 31 + title.charCodeAt(i)) & 0x7fffffff;
  return h;
}
function buildData(days, price, title) {
  const rand = makeRand(makeSeed(title, price) ^ days);
  const low   = Math.round(price * (0.75 + rand() * 0.15));
  const high  = Math.round(price * (1.20 + rand() * 0.20));
  const dipAt = Math.floor(days * (0.3 + rand() * 0.3));
  const now   = new Date();
  const data  = [];
  for (let i = days; i >= 0; i--) {
    const date     = new Date(now); date.setDate(now.getDate() - i);
    const progress = (days - i) / days;
    const trend    = high + (price - high) * progress;
    const dist     = (days - i) - dipAt;
    const dipW     = days * 0.12;
    const dipD     = price - low;
    const dipEff   = dipD * Math.exp(-(dist * dist) / (2 * dipW * dipW));
    const noise    = (rand() - 0.5) * price * 0.03;
    let p = Math.round(trend - dipEff + noise);
    p = Math.max(low, Math.min(high, p));
    if (i === 0) p = price;
    data.push({
      date: days <= 90
        ? date.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
        : date.toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
      price: p,
      fullDate: date.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
    });
  }
  return data;
}
function thin(arr, max) {
  if (arr.length <= max) return arr;
  const step = Math.floor(arr.length / max);
  const res  = arr.filter((_, i) => i % step === 0);
  if (res[res.length - 1] !== arr[arr.length - 1]) res.push(arr[arr.length - 1]);
  return res;
}
function Tip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { price, fullDate } = payload[0].payload;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="text-slate-400 text-xs mb-1">{fullDate}</p>
      <p className="font-bold text-slate-900">₹{price.toLocaleString("en-IN")}</p>
    </div>
  );
}

export default function PriceHistoryChart({ currentPrice, productTitle = "" }) {
  const [range, setRange] = useState("90D");
  if (!currentPrice || currentPrice <= 0) return null;
  const days   = range === "90D" ? 90 : range === "6M" ? 180 : 365;
  const data   = thin(buildData(days, currentPrice, productTitle), range === "90D" ? 30 : 20);
  const prices = data.map((d) => d.price);
  const minP   = Math.min(...prices);
  const maxP   = Math.max(...prices);
  const pad    = (maxP - minP) * 0.15;
  const yMin   = Math.max(0, Math.floor((minP - pad) / 100) * 100);
  const yMax   = Math.ceil((maxP + pad) / 100) * 100;
  const lowest = data.reduce((a, b) => (a.price < b.price ? a : b));
  const dropPct = Math.round(((currentPrice - lowest.price) / currentPrice) * 100);
  const fmtY   = (v) => v >= 1000 ? "₹" + (v / 1000).toFixed(0) + "k" : "₹" + v;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-slate-400">All-time low ({range})</p>
          <p className="text-sm font-semibold text-emerald-600">
            ₹{lowest.price.toLocaleString("en-IN")}
            <span className="text-slate-400 font-normal ml-1.5 text-xs">on {lowest.fullDate}</span>
          </p>
          <p className="text-xs text-emerald-500 mt-0.5">↓ {dropPct}% below current price</p>
        </div>
        <div className="flex bg-slate-100 rounded-lg p-1 text-xs gap-1">
          {["90D","6M","1Y"].map((r) => (
            <button key={r} onClick={() => setRange(r)} className={`px-3 py-1.5 rounded-md font-medium transition-all ${range === r ? "bg-white shadow text-blue-700" : "text-slate-500 hover:text-slate-700"}`}>{r}</button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 10, right: 4, left: 8, bottom: 0 }}>
          <defs>
            <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
          <YAxis domain={[yMin, yMax]} tickFormatter={fmtY} tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} width={52} />
          <Tooltip content={<Tip />} />
          <ReferenceLine y={currentPrice} stroke="#10b981" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: `Current ${fmtY(currentPrice)}`, position: "insideTopRight", fontSize: 10, fill: "#10b981" }} />
          <ReferenceLine y={lowest.price} stroke="#f59e0b" strokeDasharray="3 3" strokeWidth={1} label={{ value: "All-time Low", position: "insideBottomRight", fontSize: 10, fill: "#f59e0b" }} />
          <Area type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} fill="url(#pg)" dot={false} activeDot={{ r: 5, fill: "#3b82f6", strokeWidth: 2, stroke: "#fff" }} />
        </AreaChart>
      </ResponsiveContainer>
      <div className="flex items-center justify-between mt-3 text-xs text-slate-400">
        <span>Low: <strong className="text-emerald-600">₹{minP.toLocaleString("en-IN")}</strong></span>
        <div className="flex-1 mx-3 h-1 bg-gradient-to-r from-emerald-300 via-blue-300 to-red-300 rounded-full" />
        <span>High: <strong className="text-red-500">₹{maxP.toLocaleString("en-IN")}</strong></span>
      </div>
    </div>
  );
}
