import * as todosService from "../services/todosService.js";
import * as errors from "../utils/errors.js";

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

export async function getTodo(req, res, next) {
  const todoId = req.params.id;
  const userId = req.user.id;

  try {
    if (isNaN(todoId)) {
      throw new errors.ValidationError("Invalid ID");
    }

    const result = await todosService.getTodo(todoId, userId);
    if (!result) {
      throw new errors.NotFoundError("Todo not found");
    }
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

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
    if (!result) {
      throw new errors.NotFoundError("Todo not found");
    }
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

export async function deleteTodo(req, res, next) {
  const todoId = req.params.id;
  const userId = req.user.id;

  try {
    if (isNaN(todoId)) {
      throw new errors.ValidationError("Invalid ID");
    }

    const result = await todosService.deleteTodo(todoId, userId);
    if (!result) {
      throw new errors.NotFoundError("Todo not found");
    }
    return res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}
