import * as todosService from "../services/todosService.js";

export async function getAllTodos(req, res) {
  const userId = req.user.id;
  try {
    const result = await todosService.getAllTodos(userId);
    return res.status(200).json(result);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json(err);
  }
}

export async function getTodo(req, res) {
  const todoId = req.params.id;
  const userId = req.user.id;

  if (isNaN(todoId)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const result = await todosService.getTodo(todoId, userId);
    if (!result) {
      return res.status(404).json({ error: "Todo not found" });
    }
    return res.status(200).json(result);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json(err);
  }
}

export async function createTodo(req, res) {
  const title = req.body.title;
  const completed = req.body.completed ?? false;
  const userId = req.user.id;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required" });
  }

  try {
    const result = await todosService.createTodo({ title, completed }, userId);
    return res.status(201).json(result);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json(err);
  }
}

export async function updateTodo(req, res) {
  const todoId = req.params.id;
  const title = req.body.title;
  const completed = req.body.completed;
  const userId = req.user.id;

  if (isNaN(todoId)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const result = await todosService.updateTodo(
      todoId,
      { title, completed },
      userId
    );
    if (!result) {
      return res.status(404).json({ error: "Todo not found" });
    }
    return res.status(200).json(result);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json(err);
  }
}

export async function deleteTodo(req, res) {
  const todoId = req.params.id;
  const userId = req.user.id;

  if (isNaN(todoId)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const result = await todosService.deleteTodo(todoId, userId);
    if (!result) {
      return res.status(404).json({ error: "Todo not found" });
    }
    return res.status(200).json(result);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json(err);
  }
}
