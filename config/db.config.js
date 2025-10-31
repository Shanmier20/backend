// config/db.config.js
const { Pool } = require("pg");
require("dotenv").config();

// ✅ Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Neon
  },
});

// ✅ Verify connection on startup
(async () => {
  try {
    const client = await pool.connect();
    console.log("✅ PostgreSQL connection established successfully!");
    client.release();
  } catch (error) {
    console.error("❌ PostgreSQL connection failed:");
    console.error("Error details:", error.message);
    if (error.code === "ECONNREFUSED") {
      console.error("⚠️ Check if your Neon server is online or your connection string is correct.");
    } else if (error.code === "28P01") {
      console.error("⚠️ Invalid username or password in your DATABASE_URL.");
    } else if (error.code === "ENOTFOUND") {
      console.error("⚠️ The host is incorrect or unreachable from your server.");
    }
  }
})();

// ✅ Export pool for use in models
module.exports = pool;
