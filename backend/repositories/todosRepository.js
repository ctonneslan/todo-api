import pool from "../db/config.js";

/**
 * Get paginated todos with optional filters.
 * @param {number} userId - Owner's user ID
 * @param {number} page - Page number
 * @param {number} limit - Items per page
 * @param {string} [completed] - Filter by completion status ("true"/"false")
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
  const offset = (page - 1) * limit;

  const conditions = ["t.user_id = $1"];
  const params = [userId];
  let paramIndex = 2;

  if (completed !== undefined) {
    conditions.push(`t.completed = $${paramIndex}`);
    params.push(completed === "true");
    paramIndex++;
  }

  if (search) {
    conditions.push(`t.title ILIKE $${paramIndex}`);
    params.push(`%${search}%`);
    paramIndex++;
  }

  if (categoryId) {
    conditions.push(`tc.category_id = $${paramIndex}`);
    params.push(categoryId);
    paramIndex++;
  }

  const whereClause = conditions.join(" AND ");

  const joinClause = categoryId
    ? "INNER JOIN todo_categories tc ON t.id = tc.todo_id"
    : "";

  const countResult = await pool.query(
    `SELECT COUNT(DISTINCT t.id) FROM todos t ${joinClause} WHERE ${whereClause}`,
    params
  );

  const total = parseInt(countResult.rows[0].count);

  const dataResult = await pool.query(
    `SELECT DISTINCT t.* FROM todos t ${joinClause} WHERE ${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${
      paramIndex + 1
    }`,
    [...params, limit, offset]
  );
  return {
    data: dataResult.rows,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

/**
 * Get a single todo by ID.
 * @param {number} todoId - Todo ID
 * @param {number} userId - Owner's user ID
 * @returns {Promise<object|undefined>} Todo or undefined if not found
 */
export async function getTodo(todoId, userId) {
  const result = await pool.query(
    "SELECT * FROM todos WHERE id = $1 AND user_id = $2",
    [todoId, userId]
  );
  return result.rows[0];
}

/**
 * Create a new todo.
 * @param {string} title - Todo title
 * @param {boolean} completed - Completion status
 * @param {number} userId - Owner's user ID
 * @param {string} [description] - Todo description
 * @param {string} [due_date] - Due date (ISO string)
 * @param {string} [priority] - Priority level (low/medium/high)
 * @returns {Promise<object>} Created todo
 */
export async function createTodo(
  title,
  completed,
  userId,
  description,
  due_date,
  priority
) {
  const result = await pool.query(
    "INSERT INTO todos (title, completed, user_id, description, due_date, priority) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [title, completed, userId, description, due_date, priority]
  );
  return result.rows[0];
}

/**
 * Update a todo.
 * @param {number} todoId - Todo ID
 * @param {string} title - Todo title
 * @param {boolean} completed - Completion status
 * @param {number} userId - Owner's user ID
 * @param {string} [description] - Todo description
 * @param {string} [due_date] - Due date (ISO string)
 * @param {string} [priority] - Priority level (low/medium/high)
 * @returns {Promise<object|undefined>} Updated todo or undefined if not found
 */
export async function updateTodo(
  todoId,
  title,
  completed,
  userId,
  description,
  due_date,
  priority
) {
  const result = await pool.query(
    "UPDATE todos SET title = $1, completed = $2, description = $5, due_date = $6, priority = $7, updated_at = CURRENT_TIMESTAMP \
     WHERE id = $3 AND user_id = $4 RETURNING *",
    [title, completed, todoId, userId, description, due_date, priority]
  );
  return result.rows[0];
}

/**
 * Delete a todo.
 * @param {number} todoId - Todo ID
 * @param {number} userId - Owner's user ID
 * @returns {Promise<object|undefined>} Deleted todo or undefined if not found
 */
export async function deleteTodo(todoId, userId) {
  const result = await pool.query(
    "DELETE FROM todos WHERE id = $1 AND user_id = $2 RETURNING *",
    [todoId, userId]
  );
  return result.rows[0];
}

/**
 * Link a category to a todo.
 * @param {number} todoId - Todo ID
 * @param {number} categoryId - Category ID
 * @returns {Promise<object|null>} Junction record or null if already linked
 */
export async function addTodoCategory(todoId, categoryId) {
  try {
    const result = await pool.query(
      "INSERT INTO todo_categories (todo_id, category_id) VALUES ($1, $2) RETURNING *",
      [todoId, categoryId]
    );
    return result.rows[0];
  } catch (err) {
    if (err.code === "23505") return null;
    throw err;
  }
}

/**
 * Unlink a category from a todo.
 * @param {number} todoId - Todo ID
 * @param {number} categoryId - Category ID
 * @returns {Promise<object|undefined>} Deleted junction record or undefined if not linked
 */
export async function deleteTodoCategory(todoId, categoryId) {
  const result = await pool.query(
    "DELETE FROM todo_categories WHERE todo_id = $1 AND category_id = $2 RETURNING *",
    [todoId, categoryId]
  );
  return result.rows[0];
}

/**
 * Get all categories linked to a todo.
 * @param {number} todoId - Todo ID
 * @returns {Promise<object[]>} Array of categories
 */
export async function getTodoCategories(todoId) {
  const result = await pool.query(
    "SELECT c.* FROM categories c JOIN todo_categories tc ON c.id = tc.category_id WHERE tc.todo_id = $1",
    [todoId]
  );
  return result.rows;
}
