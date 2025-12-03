import * as categoriesRepository from "../repositories/categoriesRepository.js";

export async function createCategory(name, userId) {
  const result = await categoriesRepository.createCategory(name, userId);
  return result;
}

export async function deleteCategory(categoryId, userId) {
  const result = await categoriesRepository.deleteCategory(categoryId, userId);
  return result;
}

export async function updateCategory(categoryId, userId, name) {
  const result = await categoriesRepository.updateCategory(
    categoryId,
    userId,
    name
  );
  return result;
}

export async function getAllCategories(userId) {
  const result = await categoriesRepository.getAllCategories(userId);
  return result;
}

export async function getCategory(categoryId, userId) {
  const result = await categoriesRepository.getCategory(categoryId, userId);
  return result;
}
