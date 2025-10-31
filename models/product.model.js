const pool = require("../config/db.config");

// Unified database query helper
const executeQuery = async (sql, params = []) => {
  try {
    const result = await pool.query(sql, params);
    return result.rows; // PostgreSQL uses "rows" for returned data
  } catch (error) {
    console.error("Database query error:", error.message);
    throw new Error("Database operation failed.");
  }
};

class Product {
  // ✅ CREATE
  static async create({ name, description, price, quantity }) {
    const sql = `
      INSERT INTO beautyproducts (name, description, price, quantity)
      VALUES ($1, $2, $3, $4)
      RETURNING id, name, description, price, quantity, created_at
    `;
    const result = await pool.query(sql, [name, description, price, quantity || 0]);
    return result.rows[0];
  }

  // ✅ READ ALL
  static async findAll() {
    const sql = `
      SELECT id, name, description, price, quantity, created_at
      FROM beautyproducts
      ORDER BY id DESC
    `;
    return await executeQuery(sql);
  }

  // ✅ READ ONE
  static async findById(id) {
    const sql = `
      SELECT id, name, description, price, quantity, created_at
      FROM beautyproducts
      WHERE id = $1
    `;
    const rows = await executeQuery(sql, [id]);
    return rows[0] || null;
  }

  // ✅ UPDATE
  static async update(id, { name, description, price, quantity }) {
    const sql = `
      UPDATE beautyproducts
      SET name = $1, description = $2, price = $3, quantity = $4
      WHERE id = $5
      RETURNING id
    `;
    const result = await pool.query(sql, [name, description, price, quantity || 0, id]);
    return result.rowCount === 1;
  }

  // ✅ DELETE
  static async delete(id) {
    const sql = "DELETE FROM beautyproducts WHERE id = $1";
    const result = await pool.query(sql, [id]);
    return result.rowCount === 1;
  }
}

module.exports = Product;

