import React, { useState } from "react";
import { X, Eye, EyeOff, Mail, Lock, User, LogIn, Loader } from "lucide-react";

export default function LoginModal({ onClose, onLogin }) {
  const [tab, setTab]         = useState("login");
  const [showPass, setShowPass] = useState(false);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm]       = useState({ username: "", email: "", password: "" });

  const set = (field) => (e) => { setForm((f) => ({ ...f, [field]: e.target.value })); setError(""); };

  const handleSubmit = async () => {
    setError("");
    if (tab === "login") {
      if (!form.email.trim() || !form.password.trim()) return setError("Please fill in all fields.");
      if (!form.email.includes("@")) return setError("Enter a valid email address.");
      if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    } else {
      if (!form.username.trim() || !form.email.trim() || !form.password.trim()) return setError("Please fill in all fields.");
      if (!form.email.includes("@")) return setError("Enter a valid email address.");
      if (form.password.length < 6) return setError("Password must be at least 6 characters.");
    }
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/auth/${tab === "login" ? "login" : "register"}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tab === "login"
          ? { email: form.email, password: form.password }
          : { username: form.username, email: form.email, password: form.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong.");
      localStorage.setItem("pt_token", data.token);
      onLogin({ username: data.username, email: data.email });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
        <div className="text-center mb-6">
          <span className="text-2xl font-bold text-emerald-700 tracking-tight">PriceTracker</span>
          <p className="text-slate-500 text-sm mt-1">{tab === "login" ? "Welcome back! Sign in to continue." : "Create your free account."}</p>
        </div>
        <div className="flex bg-slate-100 rounded-xl p-1 mb-6">
          {["login","signup"].map((t) => (
            <button key={t} onClick={() => { setTab(t); setError(""); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${tab === t ? "bg-white text-slate-800 shadow" : "text-slate-500 hover:text-slate-700"}`}>
              {t === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-4">
          {tab === "signup" && (
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-1.5 block">USERNAME</label>
              <div className="flex items-center border border-slate-200 rounded-xl px-3 focus-within:border-blue-400 transition-colors">
                <User size={15} className="text-slate-400 mr-2 shrink-0" />
                <input value={form.username} onChange={set("username")} onKeyDown={handleKeyDown} placeholder="e.g. aryan99" className="flex-1 py-2.5 text-sm outline-none text-slate-800 bg-transparent" />
              </div>
            </div>
          )}
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">EMAIL</label>
            <div className="flex items-center border border-slate-200 rounded-xl px-3 focus-within:border-blue-400 transition-colors">
              <Mail size={15} className="text-slate-400 mr-2 shrink-0" />
              <input value={form.email} onChange={set("email")} onKeyDown={handleKeyDown} type="email" placeholder="you@example.com" className="flex-1 py-2.5 text-sm outline-none text-slate-800 bg-transparent" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-500 mb-1.5 block">PASSWORD</label>
            <div className="flex items-center border border-slate-200 rounded-xl px-3 focus-within:border-blue-400 transition-colors">
              <Lock size={15} className="text-slate-400 mr-2 shrink-0" />
              <input value={form.password} onChange={set("password")} onKeyDown={handleKeyDown} type={showPass ? "text" : "password"} placeholder="Minimum 6 characters" className="flex-1 py-2.5 text-sm outline-none text-slate-800 bg-transparent" />
              <button type="button" onClick={() => setShowPass((s) => !s)} className="text-slate-400 hover:text-slate-600 ml-2">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-xs bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>}
          <button onClick={handleSubmit} disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors mt-1">
            {loading ? <Loader size={16} className="animate-spin" /> : <LogIn size={16} />}
            {loading ? "Please wait..." : tab === "login" ? "Sign In" : "Create Account"}
          </button>
          {tab === "login" && (
            <p className="text-center text-xs text-slate-400">
              Don't have an account?{" "}
              <button onClick={() => { setTab("signup"); setError(""); }} className="text-blue-600 hover:underline font-medium">Sign up free</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
