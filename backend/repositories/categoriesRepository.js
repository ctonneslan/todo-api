import pool from "../db/config.js";

export async function createCategory(name, userId) {
  try {
    const result = await pool.query(
      "INSERT INTO categories (name, user_id) VALUES ($1, $2) RETURNING *",
      [name, userId]
    );
    return result.rows[0];
  } catch (err) {
    if (err.code === "23505") {
      return null;
    }
    throw err;
  }
}

export async function deleteCategory(categoryId, userId) {
  const result = await pool.query(
    "DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING *",
    [categoryId, userId]
  );
  return result.rows[0];
}

export async function updateCategory(categoryId, userId, name) {
  try {
    const result = await pool.query(
      "UPDATE categories SET name = $1 WHERE id = $2 AND user_id = $3 RETURNING *",
      [name, categoryId, userId]
    );
    return result.rows[0];
  } catch (err) {
    if (err.code === "23505") {
      return null;
    }
    throw err;
  }
}

export async function getAllCategories(userId) {
  const result = await pool.query(
    "SELECT * FROM categories WHERE user_id = $1",
    [userId]
  );
  return result.rows;
}

export async function getCategory(categoryId, userId) {
  const result = await pool.query(
    "SELECT * FROM categories WHERE id = $1 AND user_id = $2",
    [categoryId, userId]
  );
  return result.rows[0];
}
