import React, { useState, useRef, useEffect } from "react";
import { Bell, User, LogOut, Settings, ChevronDown } from "lucide-react";

function NavLink({ children, active }) {
  return (
    <span className={`text-sm cursor-pointer ${active ? "text-blue-700 font-semibold" : "text-slate-600 hover:text-slate-900"}`}>
      {children}
    </span>
  );
}

function Avatar({ username, onClick }) {
  const letter = username.charAt(0).toUpperCase();
  const colors = ["bg-blue-500","bg-emerald-500","bg-violet-500","bg-orange-500","bg-rose-500","bg-cyan-500"];
  const color  = colors[username.charCodeAt(0) % colors.length];
  return (
    <button onClick={onClick} className={`w-8 h-8 rounded-full ${color} text-white text-sm font-bold flex items-center justify-center shadow-sm hover:opacity-90 transition-opacity`}>
      {letter}
    </button>
  );
}

function ProfileDropdown({ user, onLogout, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [onClose]);

  return (
    <div ref={ref} className="absolute right-0 top-11 w-52 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100">
        <p className="text-sm font-semibold text-slate-800 truncate">{user.username}</p>
        <p className="text-xs text-slate-400 truncate">{user.email}</p>
      </div>
      <div className="py-1">
        <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"><User size={15} className="text-slate-400" /> My Profile</button>
        <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"><Settings size={15} className="text-slate-400" /> Settings</button>
        <div className="border-t border-slate-100 mt-1 pt-1">
          <button onClick={onLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"><LogOut size={15} /> Sign Out</button>
        </div>
      </div>
    </div>
  );
}

export default function Navbar({ page, onNavigate, user, onLoginClick, onLogout }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 relative z-40">
      <div className="flex items-center gap-8">
        <span className="text-xl font-bold text-emerald-700 tracking-tight">PriceTracker</span>
        <nav className="flex items-center gap-6">
          <button onClick={() => onNavigate("deals")}><NavLink active={page === "deals" || page === "product"}>Deals</NavLink></button>
          <button onClick={() => onNavigate("alerts")}><NavLink active={page === "alerts"}>Alerts</NavLink></button>
          <button onClick={() => onNavigate("submit")}><NavLink active={page === "submit"}>Submit Deal</NavLink></button>
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <Bell size={18} className="text-slate-500 cursor-pointer hover:text-slate-800 transition-colors" />
        {user ? (
          <div className="relative">
            <button onClick={() => setDropdownOpen((o) => !o)} className="flex items-center gap-1.5">
              <Avatar username={user.username} />
              <span className="text-sm text-slate-600 font-medium max-w-24 truncate hidden sm:block">{user.username}</span>
              <ChevronDown size={14} className="text-slate-400" />
            </button>
            {dropdownOpen && (
              <ProfileDropdown user={user} onLogout={() => { onLogout(); setDropdownOpen(false); }} onClose={() => setDropdownOpen(false)} />
            )}
          </div>
        ) : (
          <button onClick={onLoginClick} className="flex items-center gap-1.5 text-sm text-slate-600 border border-slate-200 rounded-full px-3 py-1.5 cursor-pointer hover:bg-slate-50 transition-colors">
            <User size={16} /> Profile
          </button>
        )}
      </div>
    </header>
  );
}
