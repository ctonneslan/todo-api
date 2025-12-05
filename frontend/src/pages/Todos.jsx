import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth.js";
import { todos, categories } from "../api/client.js";
import styles from "./Todos.module.css";

export default function Todos() {
  const [todoList, setTodoList] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const { logout } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const [todosData, categoriesData] = await Promise.all([
          todos.getAll(),
          categories.getAll(),
        ]);
        setTodoList(todosData.data);
        setCategoryList(categoriesData);
      } catch (err) {
        setError(err.message);
      }
    })();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const newTodo = await todos.create({ title, completed: false });
      setTodoList([newTodo, ...todoList]);
      setTitle("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggle = async (todo) => {
    try {
      const updated = await todos.update(todo.id, {
        title: todo.title,
        completed: !todo.completed,
        description: todo.description,
        dueDate: todo.due_date,
        priority: todo.priority,
      });
      setTodoList(todoList.map((t) => (t.id === todo.id ? updated : t)));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await todos.delete(id);
      setTodoList(todoList.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      const newCategory = await categories.create({ name: categoryName });
      setCategoryList([...categoryList, newCategory]);
      setCategoryName("");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await categories.delete(id);
      setCategoryList(categoryList.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddCategory = async (todoId, categoryId) => {
    try {
      await todos.addCategory(todoId, categoryId);
      const data = await todos.getAll(
        filterCategory ? { categoryId: filterCategory } : {}
      );
      setTodoList(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFilterChange = async (categoryId) => {
    setFilterCategory(categoryId);
    try {
      const params = categoryId ? { categoryId } : {};
      const data = await todos.getAll(params);
      setTodoList(data.data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.title}>Tasks</h1>
          <button onClick={logout} className={styles.logoutBtn}>
            Log out
          </button>
        </header>

        {error && <div className={styles.error}>{error}</div>}

        <section className={styles.section}>
          <form onSubmit={handleCreate} className={styles.addForm}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a new task..."
              className={styles.addInput}
            />
            <button type="submit" className={styles.addBtn}>
              Add
            </button>
          </form>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Categories</h2>
          <form onSubmit={handleCreateCategory} className={styles.addForm}>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="New category name..."
              className={styles.addInput}
            />
            <button type="submit" className={styles.addBtn}>
              Add
            </button>
          </form>

          <div className={styles.categoryList}>
            {categoryList.map((cat) => (
              <span key={cat.id} className={styles.categoryTag}>
                {cat.name}
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className={styles.categoryDeleteBtn}
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className={styles.filterBar}>
            <span className={styles.filterLabel}>Filter by:</span>
            <select
              value={filterCategory}
              onChange={(e) => handleFilterChange(e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All categories</option>
              {categoryList.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Tasks</h2>
          {todoList.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No tasks yet. Add one above!</p>
            </div>
          ) : (
            <ul className={styles.todoList}>
              {todoList.map((todo) => (
                <li key={todo.id} className={styles.todoItem}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo)}
                    className={styles.checkbox}
                  />
                  <span
                    className={`${styles.todoText} ${
                      todo.completed ? styles.todoTextCompleted : ""
                    }`}
                  >
                    {todo.title}
                  </span>
                  <div className={styles.todoActions}>
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddCategory(todo.id, e.target.value);
                          e.target.value = "";
                        }
                      }}
                      className={styles.todoSelect}
                    >
                      <option value="">Add category</option>
                      {categoryList.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
