import pool from "../db/config.js";

/**
 * Create a new category.
 * @param {string} name - Category name
 * @param {number} userId - Owner's user ID
 * @returns {Promise<object|null>} Created category or null if duplicate
 */
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

/**
 * Delete a category.
 * @param {number} categoryId - Category ID
 * @param {number} userId - Owner's user ID
 * @returns {Promise<object|undefined>} Deleted category or undefined if not found
 */
export async function deleteCategory(categoryId, userId) {
  const result = await pool.query(
    "DELETE FROM categories WHERE id = $1 AND user_id = $2 RETURNING *",
    [categoryId, userId]
  );
  return result.rows[0];
}

/**
 * Update a category name.
 * @param {number} categoryId - Category ID
 * @param {number} userId - Owner's user ID
 * @param {string} name - New category name
 * @returns {Promise<object|null>} Updated category, null if duplicate name, undefined if not found
 */
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

/**
 * Get all categories for a user.
 * @param {number} userId - Owner's user ID
 * @returns {Promise<object[]>} Array of categories
 */
export async function getAllCategories(userId) {
  const result = await pool.query(
    "SELECT * FROM categories WHERE user_id = $1",
    [userId]
  );
  return result.rows;
}

/**
 * Get a single category by ID.
 * @param {number} categoryId - Category ID
 * @param {number} userId - Owner's user ID
 * @returns {Promise<object|undefined>} Category or undefined if not found
 */
export async function getCategory(categoryId, userId) {
  const result = await pool.query(
    "SELECT * FROM categories WHERE id = $1 AND user_id = $2",
    [categoryId, userId]
  );
  return result.rows[0];
}
