import React, { useState, useCallback, useEffect } from "react";
import Navbar from "./components/Navbar";
import DealsPage from "./pages/DealsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import AlertsPage from "./pages/AlertsPage";
import SubmitDealPage from "./pages/SubmitDealPage";
import LoginModal from "./components/LoginModal";
import { searchProducts } from "./services/productApi";

const BACKEND_URL = "http://localhost:5000";

export default function App() {
  const [page,            setPage]            = useState("deals");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [user,            setUser]            = useState(null);
  const [showLogin,       setShowLogin]       = useState(false);
  const [authChecked,     setAuthChecked]     = useState(false); // avoids flash of "logged out" state

  const [cachedProducts,  setCachedProducts]  = useState([]);
  const [cacheQuery,      setCacheQuery]      = useState("");
  const [cacheLoading,    setCacheLoading]    = useState(false);
  const [cacheError,      setCacheError]      = useState(null);

  const [alerts, setAlerts] = useState([]);

  /* ─── On app load: check if a token exists, and if valid, restore session ─── */
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("pt_token");
      if (!token) {
        setAuthChecked(true);
        return;
      }
      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setUser({ username: data.username, email: data.email });
        } else {
          // Token invalid/expired — clear it
          localStorage.removeItem("pt_token");
        }
      } catch (err) {
        console.warn("Could not restore session:", err.message);
      } finally {
        setAuthChecked(true);
      }
    };
    restoreSession();
  }, []);

  const fetchAndCache = useCallback(async (query) => {
    setCacheLoading(true);
    setCacheError(null);
    try {
      const data = await searchProducts(query);
      setCachedProducts(data);
      setCacheQuery(query);
    } catch (err) {
      setCacheError(err.message || "Failed to load products.");
      setCachedProducts([]);
    } finally {
      setCacheLoading(false);
    }
  }, []);

  const handleViewProduct = (deal) => {
    setSelectedProduct({
      title:      deal.title,
      price:      deal.price,
      original:   deal.original,
      image:      deal.image,
      images:     deal.images || [],
      breadcrumb: deal.breadcrumb || ["Shopping", "Product"],
      drop:       deal.off,
      off:        deal.off,
      store:      deal.store,
      url:        deal.url,
      rating:     deal.rating,
      reviews:    deal.reviews,
      onSale:     deal.onSale,
      shipping:   deal.shipping,
      dealScore:  deal.off ? Math.min(99, 60 + deal.off) : 70,
      history:    deal.off >= 30 ? "near a historic low" : "slightly below average",
    });
    setPage("product");
  };

  const handleAddAlert = (alertData) => {
    setAlerts((prev) => [
      {
        id: alertData.id || Date.now().toString(),
        title: alertData.title,
        store: alertData.store,
        image: alertData.image,
        url: alertData.url,
        targetPrice: alertData.targetPrice,
        currentPrice: alertData.currentPrice,
      },
      ...prev,
    ]);
  };

  const handleDeleteAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  /* ─── Logout: clear both state and stored token ─── */
  const handleLogout = () => {
    localStorage.removeItem("pt_token");
    setUser(null);
  };

  // Don't render the navbar's logged-in/out state until we've checked for a token
  if (!authChecked) {
    return <div className="min-h-screen bg-slate-50" />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar
        page={page}
        onNavigate={setPage}
        user={user}
        onLoginClick={() => setShowLogin(true)}
        onLogout={handleLogout}
      />

      {page === "deals" && (
        <DealsPage
          onViewProduct={handleViewProduct}
          cachedProducts={cachedProducts}
          cacheQuery={cacheQuery}
          cacheLoading={cacheLoading}
          cacheError={cacheError}
          onFetch={fetchAndCache}
        />
      )}

      {page === "product" && selectedProduct && (
        <ProductDetailPage
          product={selectedProduct}
          onBack={() => setPage("deals")}
          onAddAlert={handleAddAlert}
        />
      )}

      {page === "alerts" && (
        <AlertsPage
          alerts={alerts}
          onAddAlert={handleAddAlert}
          onDeleteAlert={handleDeleteAlert}
        />
      )}

      {page === "submit" && <SubmitDealPage />}

      {showLogin && (
        <LoginModal onClose={() => setShowLogin(false)} onLogin={(u) => setUser(u)} />
      )}
    </div>
  );
}
