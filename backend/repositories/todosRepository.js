import pool from "../db/config.js";

export async function getAllTodos(userId) {
  const result = await pool.query(
    "SELECT * FROM todos WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
}

export async function getTodo(todoId, userId) {
  const result = await pool.query(
    "SELECT * FROM todos WHERE id = $1 AND user_id = $2",
    [todoId, userId]
  );
  return result.rows[0];
}

export async function createTodo(title, completed, userId) {
  const result = await pool.query(
    "INSERT INTO todos (title, completed, user_id) VALUES ($1, $2, $3) RETURNING *",
    [title, completed, userId]
  );
  return result.rows[0];
}

export async function updateTodo(todoId, title, completed, userId) {
  const result = await pool.query(
    "UPDATE todos SET title = $1, completed = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND user_id = $4 RETURNING *",
    [title, completed, todoId, userId]
  );
  return result.rows[0];
}

export async function deleteTodo(todoId, userId) {
  const result = await pool.query(
    "DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *",
    [todoId, userId]
  );
  return result.rows[0];
}
