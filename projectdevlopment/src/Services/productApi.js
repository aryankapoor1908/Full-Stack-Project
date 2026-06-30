// ─────────────────────────────────────────────────────────
//  OpenWebNinja - Real-Time Product Search API
//  Used ONLY when the user searches a specific product.
//  Homepage / categories use fast built-in fallback data.
//
//  👇 PASTE YOUR API KEY HERE
const API_KEY = "ak_u61zkblc3xgzrh9tor8opekpflwqj23148w33yw9ws4nutr";
// ─────────────────────────────────────────────────────────

const BASE_URL   = "https://api.openwebninja.com/realtime-product-search/v2/search";
const USD_TO_INR = 84;

/* ──────────────────────────────────────────────────────────
   Main entry point used by DealsPage.
   - "all" / "electronics" / "fashion" etc. → fallback data (fast, free)
   - anything else (a real search term)     → real API call
────────────────────────────────────────────────────────── */
export async function searchProducts(query = "") {
  const q = query.toLowerCase().trim();
  const isCategoryOrHome = ["all", "electronics", "fashion", "home", "gaming", "sports", ""].includes(q);

  if (isCategoryOrHome) {
    return getFallbackProducts(q);
  }

  // ── Real search — call the live API ──
  return searchLiveAPI(query);
}

async function searchLiveAPI(query) {
  if (!API_KEY || API_KEY === "YOUR_API_KEY_HERE") {
    console.warn("⚠️ No API key set — falling back to local search for:", query);
    return getFallbackProducts(query);
  }

  try {
    const url = `${BASE_URL}?q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      method: "GET",
      headers: { "x-api-key": API_KEY },
    });

    if (!res.ok) {
      console.error("API error:", res.status, res.statusText);
      return getFallbackProducts(query); // graceful fallback on API failure
    }

    const json = await res.json();
    console.log("Live API response:", json);

    const raw =
      json?.data?.products ||
      json?.data ||
      json?.products ||
      json?.results ||
      [];

    if (!Array.isArray(raw) || raw.length === 0) {
      // API succeeded but found nothing — try local fallback too, then give up
      const local = getFallbackProducts(query);
      return local.length > 0 ? local : [];
    }

    return raw.map(normalizeApiProduct).filter(Boolean);

  } catch (err) {
    console.error("Live search failed:", err.message);
    return getFallbackProducts(query);
  }
}

/* ── Convert a real API product into our app's shape ── */
function normalizeApiProduct(p) {
  if (!p) return null;

  const toINR = (str) => {
    if (!str) return null;
    const num = parseFloat(String(str).replace(/[^0-9.]/g, ""));
    if (isNaN(num) || num <= 0) return null;
    return Math.round(num * USD_TO_INR);
  };

  const parseDiscount = (str) => {
    if (!str) return null;
    const num = parseFloat(String(str).replace(/[^0-9.]/g, ""));
    return isNaN(num) ? null : num;
  };

  const price    = toINR(p.price);
  const original = toINR(p.original_price) || (price ? Math.round(price * 1.2) : null);
  const off      = parseDiscount(p.discount_percent) ||
    (price && original && original > price
      ? Math.round(((original - price) / original) * 100) : null);

  return {
    id:         p.product_id || Math.random().toString(36).slice(2),
    title:      p.product_title || "Unknown Product",
    image:      p.product_photos?.[0] || p.product_photo || "",
    images:     p.product_photos || [],
    price,
    original,
    off,
    store:      p.store_name || "Online Store",
    rating:     p.product_rating ?? null,
    reviews:    p.product_num_reviews || 0,
    url:        p.product_page_url || "#",
    onSale:     p.on_sale || false,
    shipping:   p.shipping || "Free delivery",
    breadcrumb: ["Shopping", p.store_name || "Online"],
  };
}

/* ──────────────────────────────────────────────────────────
   Fallback data — fast, offline, used for homepage + categories
   and as a backup if the live API fails or returns nothing
────────────────────────────────────────────────────────── */
function getFallbackProducts(query = "") {
  const q = query.toLowerCase().trim();

  if (!q || q === "all") return FALLBACK_PRODUCTS;

  const categoryTags = {
    electronics: ["electronics"],
    fashion:     ["fashion"],
    home:        ["home"],
    gaming:      ["gaming"],
    sports:      ["sports"],
  };
  if (categoryTags[q]) {
    const tags = categoryTags[q];
    return FALLBACK_PRODUCTS.filter((p) => tags.some((t) => p.category.includes(t)));
  }

  const words = q.split(" ").filter((w) => w.length > 1);
  return FALLBACK_PRODUCTS.filter((p) =>
    words.some((w) =>
      p.title.toLowerCase().includes(w) ||
      p.store.toLowerCase().includes(w) ||
      p.category.toLowerCase().includes(w)
    )
  );
}

const FALLBACK_PRODUCTS = [
  { id:"e1",  category:"electronics smartphones", title:"Apple iPhone 15 Pro (128GB, Natural Titanium)",           image:"https://images.unsplash.com/photo-1696446702183-cbd13d31aa42?w=400&q=80", price:119900, original:134900, off:11, store:"Amazon",    rating:4.8, reviews:2847,  url:"https://www.amazon.in/s?k=iphone+15+pro",       onSale:true,  shipping:"Free delivery", breadcrumb:["Electronics","Smartphones"] },
  { id:"e2",  category:"electronics smartphones", title:"Samsung Galaxy S24 Ultra (256GB, Titanium Black)",        image:"https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80", price:109999, original:134999, off:19, store:"Flipkart",  rating:4.7, reviews:1923,  url:"https://www.flipkart.com/search?q=samsung+s24+ultra", onSale:true,  shipping:"Free delivery", breadcrumb:["Electronics","Smartphones"] },
  { id:"e3",  category:"electronics smartphones", title:"OnePlus 12 5G (16GB RAM, 512GB) — Silky Black",           image:"https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400&q=80", price:64999,  original:69999,  off:7,  store:"Amazon",    rating:4.5, reviews:3421,  url:"https://www.amazon.in/s?k=oneplus+12",          onSale:false, shipping:"Free delivery", breadcrumb:["Electronics","Smartphones"] },
  { id:"e4",  category:"electronics smartphones", title:"Xiaomi 14 5G (12GB RAM, 256GB) — Black",                  image:"https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80", price:69999,  original:79999,  off:13, store:"Mi Store",   rating:4.4, reviews:987,   url:"https://www.mi.com/in",                         onSale:true,  shipping:"Free delivery", breadcrumb:["Electronics","Smartphones"] },
  { id:"e5",  category:"electronics laptops",     title:"MacBook Air M3 13-inch (8GB RAM, 256GB SSD)",             image:"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80", price:114900, original:124900, off:8,  store:"Apple",     rating:4.9, reviews:1876,  url:"https://www.apple.com/in/shop",                 onSale:false, shipping:"Free delivery", breadcrumb:["Electronics","Laptops"] },
  { id:"e6",  category:"electronics laptops",     title:"Dell XPS 15 Intel Core i7 (16GB RAM, 512GB SSD)",         image:"https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80", price:139990, original:159990, off:13, store:"Croma",     rating:4.6, reviews:654,   url:"https://www.croma.com/search/?text=dell+xps",   onSale:true,  shipping:"Free delivery", breadcrumb:["Electronics","Laptops"] },
  { id:"e7",  category:"electronics audio",       title:"Sony WH-1000XM5 Wireless Noise Cancelling Headphones",   image:"https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400&q=80", price:26990,  original:34990,  off:23, store:"Flipkart",  rating:4.7, reviews:1203,  url:"https://www.flipkart.com/search?q=sony+wh1000xm5", onSale:true,  shipping:"Free delivery", breadcrumb:["Electronics","Audio"] },
  { id:"e8",  category:"electronics audio",       title:"boAt Rockerz 550 Wireless Over-Ear Headphones",          image:"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80", price:1299,   original:3990,   off:67, store:"Amazon",    rating:4.1, reviews:8923,  url:"https://www.amazon.in/s?k=boat+rockerz+550",    onSale:true,  shipping:"Free delivery", breadcrumb:["Electronics","Audio"] },
  { id:"e9",  category:"electronics tvs",         title:"Samsung 55\" 4K OLED Smart TV with AI Processor",        image:"https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&q=80", price:74999,  original:99999,  off:25, store:"Croma",     rating:4.5, reviews:892,   url:"https://www.croma.com/search/?text=samsung+tv",  onSale:true,  shipping:"Free delivery", breadcrumb:["Electronics","TVs"] },
  { id:"e10", category:"electronics accessories", title:"20000mAh Fast Charging Power Bank 65W USB-C",            image:"https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&q=80", price:2799,   original:3999,   off:30, store:"Flipkart",  rating:4.2, reviews:1234,  url:"https://www.flipkart.com/search?q=power+bank",  onSale:false, shipping:"Free delivery", breadcrumb:["Electronics","Accessories"] },
  { id:"e11", category:"electronics accessories", title:"Apple AirPods Pro (2nd Gen) with MagSafe Case",           image:"https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400&q=80", price:24900,  original:26900,  off:7,  store:"Amazon",    rating:4.8, reviews:5672,  url:"https://www.amazon.in/s?k=airpods+pro",         onSale:false, shipping:"Free delivery", breadcrumb:["Electronics","Accessories"] },

  { id:"g1",  category:"gaming peripherals",      title:"Mechanical Gaming Keyboard with RGB Hot-Swap Switches",  image:"https://images.unsplash.com/photo-1595044426077-d36d9236d54a?w=400&q=80", price:5499,   original:9999,   off:45, store:"Amazon",    rating:4.4, reviews:654,   url:"https://www.amazon.in/s?k=gaming+keyboard",     onSale:false, shipping:"Free delivery", breadcrumb:["Gaming","Peripherals"] },
  { id:"g2",  category:"gaming controllers",      title:"PS5 DualSense Wireless Controller — Midnight Black",    image:"https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400&q=80", price:5990,   original:7490,   off:20, store:"Flipkart",  rating:4.6, reviews:2341,  url:"https://www.flipkart.com/search?q=ps5+controller", onSale:true,  shipping:"Free delivery", breadcrumb:["Gaming","Controllers"] },
  { id:"g3",  category:"gaming headset",          title:"Razer BlackShark V2 X Gaming Headset 7.1 Surround",     image:"https://images.unsplash.com/photo-1599669454699-248893623440?w=400&q=80", price:4999,   original:7999,   off:38, store:"Amazon",    rating:4.3, reviews:1876,  url:"https://www.amazon.in/s?k=razer+blackshark",    onSale:true,  shipping:"Free delivery", breadcrumb:["Gaming","Headsets"] },
  { id:"g4",  category:"gaming mouse",            title:"Logitech G502 X PLUS Wireless Gaming Mouse",            image:"https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&q=80", price:9999,   original:14999,  off:33, store:"Flipkart",  rating:4.5, reviews:876,   url:"https://www.flipkart.com/search?q=logitech+g502", onSale:true,  shipping:"Free delivery", breadcrumb:["Gaming","Mouse"] },

  { id:"fa1", category:"fashion shoes",           title:"Nike Air Max 270 Running Shoes Men's",                  image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80", price:7495,   original:12995,  off:42, store:"Myntra",    rating:4.3, reviews:3210,  url:"https://www.myntra.com/nike",                   onSale:true,  shipping:"Free delivery", breadcrumb:["Fashion","Shoes"] },
  { id:"fa2", category:"fashion shoes",           title:"Adidas Ultraboost 22 Running Shoes Men's",              image:"https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&q=80", price:8999,   original:17999,  off:50, store:"Myntra",    rating:4.4, reviews:2109,  url:"https://www.myntra.com/adidas",                 onSale:true,  shipping:"Free delivery", breadcrumb:["Fashion","Shoes"] },
  { id:"fa3", category:"fashion clothing",        title:"Levi's Men's Slim Fit Jeans 511",                       image:"https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80", price:1999,   original:3999,   off:50, store:"Myntra",    rating:4.3, reviews:5621,  url:"https://www.myntra.com/levis",                  onSale:true,  shipping:"Free delivery", breadcrumb:["Fashion","Clothing"] },
  { id:"fa4", category:"fashion clothing",        title:"Allen Solly Men's Regular Fit Formal Shirt",            image:"https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&q=80", price:899,    original:1999,   off:55, store:"Flipkart",  rating:4.1, reviews:4320,  url:"https://www.flipkart.com/search?q=allen+solly",  onSale:true,  shipping:"Free delivery", breadcrumb:["Fashion","Clothing"] },
  { id:"fa5", category:"fashion bags",            title:"Wildcraft Unisex Backpack 30L — Navy Blue",             image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80", price:1299,   original:2499,   off:48, store:"Amazon",    rating:4.2, reviews:7832,  url:"https://www.amazon.in/s?k=wildcraft+backpack",  onSale:true,  shipping:"Free delivery", breadcrumb:["Fashion","Bags"] },

  { id:"h1",  category:"home furniture",          title:"Ergonomic Mesh Office Chair with Lumbar Support",       image:"https://images.unsplash.com/photo-1505843490578-d4799a0c2873?w=400&q=80", price:12499,  original:24999,  off:50, store:"Amazon",    rating:4.2, reviews:445,   url:"https://www.amazon.in/s?k=ergonomic+chair",     onSale:true,  shipping:"Free delivery", breadcrumb:["Home & Garden","Furniture"] },
  { id:"h2",  category:"home kitchen appliances", title:"Instant Pot Duo 7-in-1 Electric Pressure Cooker 6L",   image:"https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&q=80", price:8999,   original:12999,  off:31, store:"Amazon",    rating:4.6, reviews:7823,  url:"https://www.amazon.in/s?k=instant+pot",         onSale:true,  shipping:"Free delivery", breadcrumb:["Home & Garden","Kitchen"] },
  { id:"h3",  category:"home appliances",         title:"Dyson V15 Detect Cordless Vacuum Cleaner",             image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", price:42900,  original:52900,  off:19, store:"Croma",     rating:4.7, reviews:567,   url:"https://www.croma.com/search/?text=dyson",       onSale:false, shipping:"Free delivery", breadcrumb:["Home & Garden","Appliances"] },
  { id:"h4",  category:"home kitchen",            title:"Philips Air Fryer HD9200 4.1L — Black",                 image:"https://images.unsplash.com/photo-1585325701954-5a0a4832a4b7?w=400&q=80", price:7995,   original:11995,  off:33, store:"Flipkart",  rating:4.4, reviews:3421,  url:"https://www.flipkart.com/search?q=philips+air+fryer", onSale:true, shipping:"Free delivery", breadcrumb:["Home & Garden","Kitchen"] },
  { id:"h5",  category:"home bedroom",            title:"Wakefit Orthopedic Memory Foam Mattress — Queen",       image:"https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&q=80", price:14999,  original:24999,  off:40, store:"Wakefit",   rating:4.5, reviews:12430, url:"https://www.wakefit.co",                         onSale:true,  shipping:"Free delivery", breadcrumb:["Home & Garden","Bedroom"] },

  { id:"s1",  category:"sports fitness gym",      title:"Boldfit Gym Gloves for Weight Lifting — Black",         image:"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80", price:449,    original:999,    off:55, store:"Amazon",    rating:4.1, reviews:9234,  url:"https://www.amazon.in/s?k=gym+gloves",          onSale:true,  shipping:"Free delivery", breadcrumb:["Sports","Fitness"] },
  { id:"s2",  category:"sports fitness gym",      title:"Lifelong Adjustable Dumbbell Set 10kg with Rod",        image:"https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400&q=80", price:1899,   original:3499,   off:46, store:"Flipkart",  rating:4.3, reviews:5621,  url:"https://www.flipkart.com/search?q=dumbbell+set",  onSale:true, shipping:"Free delivery", breadcrumb:["Sports","Fitness"] },
  { id:"s3",  category:"sports outdoor",          title:"Nivia Storm Football Size 5 — Orange",                  image:"https://images.unsplash.com/photo-1614632537239-e2258bce6a51?w=400&q=80", price:599,    original:999,    off:40, store:"Amazon",    rating:4.2, reviews:3210,  url:"https://www.amazon.in/s?k=football",             onSale:true,  shipping:"Free delivery", breadcrumb:["Sports","Outdoor"] },
  { id:"s4",  category:"sports cycling",          title:"Hero Sprint Thorn 26T Mountain Cycle — 21 Gear",        image:"https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&q=80", price:7499,   original:12999,  off:42, store:"Flipkart",  rating:4.0, reviews:1876,  url:"https://www.flipkart.com/search?q=mountain+cycle", onSale:true, shipping:"Free delivery", breadcrumb:["Sports","Cycling"] },
];
