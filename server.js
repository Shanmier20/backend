// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const productRoutes = require("./routes/product.routes");

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ CORS configuration — allows localhost and ngrok frontend
app.use(cors({
  origin: [
    "http://localhost:5173", // local dev frontend
    "https://frontend-six-psi-68.vercel.app", // your deployed frontend
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"],
}));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Test route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Simple Products Inventory Management System API." });
});

// ✅ API routes
app.use("/api/products", productRoutes);

// ✅ Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error("💥 Server Error:", err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    detail: process.env.NODE_ENV === "production" ? null : err.message,
  });
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Access API via: http://localhost:${PORT} or your ngrok URL`);
});

