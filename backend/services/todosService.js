import * as todosRepository from "../repositories/todosRepository.js";
import * as categoriesRepository from "../repositories/categoriesRepository.js";
import * as errors from "../utils/errors.js";

/**
 * Get paginated todos with optional filters.
 * @param {number} userId - Owner's user ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} [completed] - Filter by completion status
 * @param {string} [search] - Search term for title
 * @param {string} [categoryId] - Filter by category
 * @returns {Promise<{data: object[], pagination: object}>} Paginated todos
 */
export async function getAllTodos(
  userId,
  page,
  limit,
  completed,
  search,
  categoryId
) {
  const todos = await todosRepository.getAllTodos(
    userId,
    page,
    limit,
    completed,
    search,
    categoryId
  );
  return todos;
}

/**
 * Get a single todo by ID.
 * @param {number} todoId - Todo ID
 * @param {number} userId - Owner's user ID
 * @returns {Promise<object>} Todo
 * @throws {NotFoundError} If todo not found
 */
export async function getTodo(todoId, userId) {
  const todo = await todosRepository.getTodo(todoId, userId);
  if (!todo) throw new errors.NotFoundError("Todo not found");
  return todo;
}

/**
 * Create a new todo.
 * @param {object} data - Todo data
 * @param {string} data.title - Todo title
 * @param {boolean} data.completed - Completion status
 * @param {string} [data.description] - Todo description
 * @param {string} [data.dueDate] - Due date (ISO string)
 * @param {string} [data.priority] - Priority level (low/medium/high)
 * @param {number} userId - Owner's user ID
 * @returns {Promise<object>} Created todo
 */
export async function createTodo(data, userId) {
  const title = data.title;
  const completed = data.completed;
  const description = data.description;
  const dueDate = data.dueDate;
  const priority = data.priority;

  const todo = await todosRepository.createTodo(
    title,
    completed,
    userId,
    description,
    dueDate,
    priority
  );
  return todo;
}

/**
 * Update a todo.
 * @param {number} todoId - Todo ID
 * @param {object} data - Todo data
 * @param {number} userId - Owner's user ID
 * @returns {Promise<object>} Updated todo
 * @throws {NotFoundError} If todo not found
 */
export async function updateTodo(todoId, data, userId) {
  const title = data.title;
  const completed = data.completed;
  const description = data.description;
  const dueDate = data.dueDate;
  const priority = data.priority;

  const todo = await todosRepository.updateTodo(
    todoId,
    title,
    completed,
    userId,
    description,
    dueDate,
    priority
  );
  if (!todo) throw new errors.NotFoundError("Todo not found");
  return todo;
}

/**
 * Delete a todo.
 * @param {number} todoId - Todo ID
 * @param {number} userId - Owner's user ID
 * @returns {Promise<object>} Deleted todo
 * @throws {NotFoundError} If todo not found
 */
export async function deleteTodo(todoId, userId) {
  const todo = await todosRepository.deleteTodo(todoId, userId);
  if (!todo) throw new errors.NotFoundError("Todo not found");
  return todo;
}

/**
 * Link a category to a todo.
 * @param {number} todoId - Todo ID
 * @param {number} categoryId - Category ID
 * @param {number} userId - Owner's user ID
 * @returns {Promise<object>} Junction record
 * @throws {NotFoundError} If todo or category not found
 * @throws {ConflictError} If already linked
 */
export async function addTodoCategory(todoId, categoryId, userId) {
  const todo = await todosRepository.getTodo(todoId, userId);
  if (!todo) throw new errors.NotFoundError("Todo not found");

  const category = await categoriesRepository.getCategory(categoryId, userId);
  if (!category) throw new errors.NotFoundError("Category not found");

  const result = await todosRepository.addTodoCategory(todoId, categoryId);
  if (!result)
    throw new errors.ConflictError("Category already assigned to todo");

  return result;
}

/**
 * Unlink a category from a todo.
 * @param {number} todoId - Todo ID
 * @param {number} categoryId - Category ID
 * @param {number} userId - Owner's user ID
 * @returns {Promise<object|undefined>} Deleted junction record
 * @throws {NotFoundError} If todo or category not found
 */
export async function deleteTodoCategory(todoId, categoryId, userId) {
  const todo = await todosRepository.getTodo(todoId, userId);
  if (!todo) throw new errors.NotFoundError("Todo not found");

  const category = await categoriesRepository.getCategory(categoryId, userId);
  if (!category) throw new errors.NotFoundError("Category not found");

  const result = await todosRepository.deleteTodoCategory(todoId, categoryId);
  return result;
}

/**
 * Get all categories linked to a todo.
 * @param {number} todoId - Todo ID
 * @param {number} userId - Owner's user ID
 * @returns {Promise<object[]>} Array of categories
 * @throws {NotFoundError} If todo not found
 */
export async function getTodoCategories(todoId, userId) {
  const todo = await todosRepository.getTodo(todoId, userId);
  if (!todo) throw new errors.NotFoundError("Todo not found");

  const result = await todosRepository.getTodoCategories(todoId);
  return result;
}
