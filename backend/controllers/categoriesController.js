import * as errors from "../utils/errors.js";
import * as categoriesService from "../services/categoriesService.js";

export async function createCategory(req, res, next) {
  const userId = req.user.id;
  const name = req.body.name;

  try {
    if (!name || name.trim() === "") {
      throw new errors.ValidationError("Category name is required");
    }

    const result = await categoriesService.createCategory(name, userId);
    if (!result) {
      throw new errors.ConflictError("Category name already exists");
    }
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req, res, next) {
  const userId = req.user.id;
  const categoryId = req.params.id;

  try {
    if (isNaN(categoryId)) {
      throw new errors.ValidationError("Invalid ID");
    }

    const result = await categoriesService.deleteCategory(categoryId, userId);

    if (!result) {
      throw new errors.NotFoundError("Category not found");
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

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

    const existing = await categoriesService.getCategory(categoryId, userId);

    if (!existing) {
      throw new errors.NotFoundError("Category not found");
    }

    const result = await categoriesService.updateCategory(
      categoryId,
      userId,
      name
    );

    if (!result) {
      throw new errors.ConflictError("Category name already exists");
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getAllCategories(req, res, next) {
  const userId = req.user.id;
  try {
    const result = await categoriesService.getAllCategories(userId);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function getCategory(req, res, next) {
  const userId = req.user.id;
  const categoryId = req.params.id;

  try {
    if (isNaN(categoryId)) {
      throw new errors.ValidationError("Invalid ID");
    }

    const result = await categoriesService.getCategory(categoryId, userId);

    if (!result) {
      throw new errors.NotFoundError("Category not found");
    }

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
