import * as todosService from "../services/todosService.js";
import * as errors from "../utils/errors.js";

/**
 * GET /todos - Get paginated todos with optional filters.
 * @query {number} [page=1] - Page number
 * @query {number} [limit=10] - Items per page (max 100)
 * @query {string} [completed] - Filter by completion status
 * @query {string} [search] - Search term for title
 */
export async function getAllTodos(req, res, next) {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = Math.min(parseInt(req.query.limit) || 10, 100);
  const completed = req.query.completed;
  const search = req.query.search;

  try {
    const result = await todosService.getAllTodos(
      userId,
      page,
      limit,
      completed,
      search
    );
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /todos/:id - Get a single todo.
 * @param {string} id - Todo ID
 */
export async function getTodo(req, res, next) {
  const todoId = req.params.id;
  const userId = req.user.id;

  try {
    if (isNaN(todoId)) {
      throw new errors.ValidationError("Invalid ID");
    }

    const result = await todosService.getTodo(todoId, userId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /todos - Create a new todo.
 * @body {string} title - Todo title (required)
 * @body {boolean} [completed=false] - Completion status
 * @body {string} [description] - Todo description
 * @body {string} [dueDate] - Due date (ISO string)
 * @body {string} [priority] - Priority (low/medium/high)
 */
export async function createTodo(req, res, next) {
  const title = req.body.title;
  const completed = req.body.completed ?? false;
  const userId = req.user.id;
  const description = req.body.description;
  const dueDate = req.body.dueDate;
  const priority = req.body.priority;

  try {
    if (!title || title.trim() === "") {
      throw new errors.ValidationError("Title is required");
    }

    if (dueDate && isNaN(Date.parse(dueDate))) {
      throw new errors.ValidationError("Invalid due date format");
    }

    const validPriorities = ["low", "medium", "high"];
    if (priority && !validPriorities.includes(priority)) {
      throw new errors.ValidationError(
        "Priority must be 'low', 'medium', or 'high'"
      );
    }

    const result = await todosService.createTodo(
      { title, completed, description, dueDate, priority },
      userId
    );
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /todos/:id - Update a todo.
 * @param {string} id - Todo ID
 * @body {string} [title] - Todo title
 * @body {boolean} [completed] - Completion status
 * @body {string} [description] - Todo description
 * @body {string} [dueDate] - Due date (ISO string)
 * @body {string} [priority] - Priority (low/medium/high)
 */
export async function updateTodo(req, res, next) {
  const todoId = req.params.id;
  const title = req.body.title;
  const completed = req.body.completed;
  const userId = req.user.id;
  const description = req.body.description;
  const dueDate = req.body.dueDate;
  const priority = req.body.priority;

  try {
    if (isNaN(todoId)) {
      throw new errors.ValidationError("Invalid ID");
    }

    if (dueDate && isNaN(Date.parse(dueDate))) {
      throw new errors.ValidationError("Invalid due date format");
    }

    const validPriorities = ["low", "medium", "high"];
    if (priority && !validPriorities.includes(priority)) {
      throw new errors.ValidationError(
        "Priority must be 'low', 'medium', or 'high'"
      );
    }

    const result = await todosService.updateTodo(
      todoId,
      { title, completed, description, dueDate, priority },
      userId
    );
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /todos/:id - Delete a todo.
 * @param {string} id - Todo ID
 */
export async function deleteTodo(req, res, next) {
  const todoId = req.params.id;
  const userId = req.user.id;

  try {
    if (isNaN(todoId)) {
      throw new errors.ValidationError("Invalid ID");
    }

    const result = await todosService.deleteTodo(todoId, userId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /todos/:id/categories - Link a category to a todo.
 * @param {string} id - Todo ID
 * @body {number} categoryId - Category ID to link
 */
export async function addTodoCategory(req, res, next) {
  const todoId = req.params.id;
  const userId = req.user.id;
  const categoryId = req.body.categoryId;

  try {
    if (isNaN(todoId)) {
      throw new errors.ValidationError("Invalid todo ID");
    }

    if (isNaN(categoryId)) {
      throw new errors.ValidationError("Invalid category ID");
    }

    const result = await todosService.addTodoCategory(
      todoId,
      categoryId,
      userId
    );
    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /todos/:id/categories/:categoryId - Unlink a category from a todo.
 * @param {string} id - Todo ID
 * @param {string} categoryId - Category ID to unlink
 */
export async function deleteTodoCategory(req, res, next) {
  const todoId = req.params.id;
  const categoryId = req.params.categoryId;
  const userId = req.user.id;

  try {
    if (isNaN(todoId)) {
      throw new errors.ValidationError("Invalid todo ID");
    }

    if (isNaN(categoryId)) {
      throw new errors.ValidationError("Invalid category ID");
    }

    const result = await todosService.deleteTodoCategory(
      todoId,
      categoryId,
      userId
    );
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /todos/:id/categories - Get all categories for a todo.
 * @param {string} id - Todo ID
 */
export async function getTodoCategories(req, res, next) {
  const todoId = req.params.id;
  const userId = req.user.id;

  try {
    if (isNaN(todoId)) {
      throw new errors.ValidationError("Invalid todo ID");
    }

    const result = await todosService.getTodoCategories(todoId, userId);
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
