const pool = require("../config/db.config");

// Unified database query helper
const executeQuery = async (sql, params = []) => {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows; // Return only rows for consistency
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
      VALUES (?, ?, ?, ?)
    `;
    const result = await pool.execute(sql, [name, description, price, quantity || 0]);
    const [insertInfo] = result;

    return { id: insertInfo.insertId, name, description, price, quantity: quantity || 0 };
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
      WHERE id = ?
    `;
    const rows = await executeQuery(sql, [id]);
    return rows[0] || null;
  }

  // ✅ UPDATE
  static async update(id, { name, description, price, quantity }) {
    const sql = `
      UPDATE beautyproducts
      SET name = ?, description = ?, price = ?, quantity = ?
      WHERE id = ?
    `;
    const result = await pool.execute(sql, [name, description, price, quantity || 0, id]);
    const [updateInfo] = result;
    return updateInfo.affectedRows === 1;
  }

  // ✅ DELETE
  static async delete(id) {
    const sql = "DELETE FROM beautyproducts WHERE id = ?";
    const result = await pool.execute(sql, [id]);
    const [deleteInfo] = result;
    return deleteInfo.affectedRows === 1;
  }
}

module.exports = Product;
