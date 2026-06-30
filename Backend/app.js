import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

//Middleware 
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);

app.get("/api/search", async (req, res) => {
  try {
    const q = req.query.q;

    if (!q) {
      return res.status(400).json({ message: "Query is required" });
    }

    const response = await fetch(
      `https://api.openwebninja.com/realtime-product-search/v2/search?q=${encodeURIComponent(
        q
      )}`
    );

    
    if (!response.ok) {
      return res.status(response.status).json({
        message: "Failed to fetch data from external API",
      });
    }

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Search API Error:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

// HEALTH CHECK 
app.get("/", (req, res) => {
  res.json({ message: "PriceTracker API is running " });
});

// 404 HANDLER 
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

//GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    message: err.message || "Something went wrong on the server.",
  });
});


export default app;