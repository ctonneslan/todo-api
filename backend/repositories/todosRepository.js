import pool from "../db/config.js";

export async function getAllTodos(userId, page, limit, completed, search) {
  const offset = (page - 1) * limit;

  const conditions = ["user_id = $1"];
  const params = [userId];
  let paramIndex = 2;

  if (completed !== undefined) {
    conditions.push(`completed = $${paramIndex}`);
    params.push(completed === "true");
    paramIndex++;
  }

  if (search) {
    conditions.push(`title ILIKE $${paramIndex}`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  const whereClause = conditions.join(" AND ");

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM todos WHERE ${whereClause}`,
    params
  );

  const total = parseInt(countResult.rows[0].count);

  const dataResult = await pool.query(
    `SELECT * FROM todos WHERE ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${
      paramIndex + 1
    }`,
    [...params, limit, offset]
  );
  return {
    data: dataResult.rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
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
