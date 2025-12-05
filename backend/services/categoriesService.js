import * as categoriesRepository from "../repositories/categoriesRepository.js";
import * as errors from "../utils/errors.js";

/**
 * Create a new category.
 * @param {string} name - Category name
 * @param {number} userId - Owner's user ID
 * @returns {Promise<object>} Created category
 * @throws {ConflictError} If category name already exists for user
 */
export async function createCategory(name, userId) {
  const result = await categoriesRepository.createCategory(name, userId);
  if (!result) throw new errors.ConflictError("Category name already exists");
  return result;
}

/**
 * Delete a category.
 * @param {number} categoryId - Category ID
 * @param {number} userId - Owner's user ID
 * @returns {Promise<object>} Deleted category
 * @throws {NotFoundError} If category not found
 */
export async function deleteCategory(categoryId, userId) {
  const result = await categoriesRepository.deleteCategory(categoryId, userId);
  if (!result) throw new errors.NotFoundError("Category not found");
  return result;
}

/**
 * Update a category name.
 * @param {number} categoryId - Category ID
 * @param {number} userId - Owner's user ID
 * @param {string} name - New category name
 * @returns {Promise<object>} Updated category
 * @throws {NotFoundError} If category not found
 * @throws {ConflictError} If new name already exists for user
 */
export async function updateCategory(categoryId, userId, name) {
  const category = await categoriesRepository.getCategory(categoryId, userId);
  if (!category) throw new errors.NotFoundError("Category not found");

  const result = await categoriesRepository.updateCategory(
    categoryId,
    userId,
    name
  );
  if (!result) throw new errors.ConflictError("Category name already exists");
  return result;
}

/**
 * Get all categories for a user.
 * @param {number} userId - Owner's user ID
 * @returns {Promise<object[]>} Array of categories
 */
export async function getAllCategories(userId) {
  const result = await categoriesRepository.getAllCategories(userId);
  return result;
}

/**
 * Get a single category by ID.
 * @param {number} categoryId - Category ID
 * @param {number} userId - Owner's user ID
 * @returns {Promise<object>} Category
 * @throws {NotFoundError} If category not found
 */
export async function getCategory(categoryId, userId) {
  const result = await categoriesRepository.getCategory(categoryId, userId);
  if (!result) throw new errors.NotFoundError("Category not found");
  return result;
}
