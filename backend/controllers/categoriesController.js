import * as errors from "../utils/errors.js";
import * as categoriesService from "../services/categoriesService.js";

/**
 * POST /categories - Create a new category.
 * @body {string} name - Category name (required)
 */
export async function createCategory(req, res, next) {
  const userId = req.user.id;
  const name = req.body.name;

  try {
    if (!name || name.trim() === "") {
      throw new errors.ValidationError("Category name is required");
    }

    const result = await categoriesService.createCategory(name, userId);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /categories/:id - Delete a category.
 * @param {string} id - Category ID
 */
export async function deleteCategory(req, res, next) {
  const userId = req.user.id;
  const categoryId = req.params.id;

  try {
    if (isNaN(categoryId)) {
      throw new errors.ValidationError("Invalid ID");
    }

    const result = await categoriesService.deleteCategory(categoryId, userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /categories/:id - Update a category.
 * @param {string} id - Category ID
 * @body {string} name - New category name (required)
 */
export async function updateCategory(req, res, next) {
  const userId = req.user.id;
  const categoryId = req.params.id;
  const name = req.body.name;

  try {
    if (isNaN(categoryId)) {
      throw new errors.ValidationError("Invalid ID");
    }

    if (!name || name.trim() === "") {
      throw new errors.ValidationError("Category name is required");
    }

    const result = await categoriesService.updateCategory(
      categoryId,
      userId,
      name
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /categories - Get all categories for the authenticated user.
 */
export async function getAllCategories(req, res, next) {
  const userId = req.user.id;
  try {
    const result = await categoriesService.getAllCategories(userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /categories/:id - Get a single category.
 * @param {string} id - Category ID
 */
export async function getCategory(req, res, next) {
  const userId = req.user.id;
  const categoryId = req.params.id;

  try {
    if (isNaN(categoryId)) {
      throw new errors.ValidationError("Invalid ID");
    }

    const result = await categoriesService.getCategory(categoryId, userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
