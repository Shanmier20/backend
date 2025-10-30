// config/db.config.js
const mysql = require("mysql2/promise");
require("dotenv").config();

// ✅ Create MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "testdb",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === "true" ? { rejectUnauthorized: true } : undefined,
});

// ✅ Verify connection on startup
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL connection established successfully!");
    connection.release();
  } catch (error) {
    console.error("❌ MySQL connection failed:");
    console.error("Error details:", error.message);
    if (error.code === "ECONNREFUSED") {
      console.error("⚠️ Check if your MySQL server is online and accepting remote connections.");
    } else if (error.code === "ER_ACCESS_DENIED_ERROR") {
      console.error("⚠️ Invalid username or password in your .env file.");
    } else if (error.code === "ENOTFOUND") {
      console.error("⚠️ The DB_HOST is incorrect or unreachable from your server.");
    }
  }
})();

// ✅ Export pool for use in models
module.exports = pool;
