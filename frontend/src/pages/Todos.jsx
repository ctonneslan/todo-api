import { useState, useEffect, useRef } from "react";
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
  const [filterStatus, setFilterStatus] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(true);
  const searchTimeout = useRef(null);
  const [submitting, setSubmitting] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [toast, setToast] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { logout } = useAuth();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const buildFilterParams = (overrides = {}) => {
    const params = { page, limit: 10, ...overrides };
    const category = overrides.categoryId ?? filterCategory;
    const status = overrides.completed ?? filterStatus;
    const search = overrides.search ?? searchQuery;

    if (category) params.categoryId = category;
    if (status) params.completed = status;
    if (search) params.search = search;

    return params;
  };

  const fetchTodos = async (params = {}) => {
    try {
      const data = await todos.getAll(buildFilterParams(params));
      setTodoList(data.data);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const [todosData, categoriesData] = await Promise.all([
          todos.getAll({ page: 1, limit: 10 }),
          categories.getAll(),
        ]);
        setTodoList(todosData.data);
        setTotalPages(todosData.pagination?.totalPages || 1);
        setCategoryList(categoriesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      const newTodo = await todos.create({ title, completed: false });
      setTodoList([newTodo, ...todoList]);
      setTitle("");
      showToast("Task created successfully");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
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
      showToast(updated.completed ? "Task completed" : "Task reopened");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await todos.delete(id);
      setTodoList(todoList.filter((t) => t.id !== id));
      showToast("Task deleted");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    setSubmitting(true);
    try {
      const newCategory = await categories.create({ name: categoryName });
      setCategoryList([...categoryList, newCategory]);
      setCategoryName("");
      showToast("Category created");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await categories.delete(id);
      setCategoryList(categoryList.filter((c) => c.id !== id));
      showToast("Category deleted");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddCategory = async (todoId, categoryId) => {
    try {
      await todos.addCategory(todoId, categoryId);
      const params = filterCategory ? { categoryId: filterCategory, page, limit: 10 } : { page, limit: 10 };
      await fetchTodos(params);
      showToast("Category added to task");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFilterChange = async (type, value) => {
    setPage(1);
    setLoading(true);

    if (type === "category") {
      setFilterCategory(value);
    } else if (type === "status") {
      setFilterStatus(value);
    } else if (type === "search") {
      setSearchQuery(value);
    }

    try {
      const overrides = { page: 1 };
      if (type === "category") overrides.categoryId = value;
      if (type === "status") overrides.completed = value;
      if (type === "search") overrides.search = value;

      await fetchTodos(overrides);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value) => {
    setSearchInput(value);
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    searchTimeout.current = setTimeout(() => {
      handleFilterChange("search", value);
    }, 300);
  };

  const handleClearFilters = async () => {
    setFilterCategory("");
    setFilterStatus("");
    setSearchQuery("");
    setSearchInput("");
    setPage(1);
    setLoading(true);
    try {
      const data = await todos.getAll({ page: 1, limit: 10 });
      setTodoList(data.data);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = async (newPage) => {
    setPage(newPage);
    setLoading(true);
    try {
      await fetchTodos({ page: newPage });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const hasActiveFilters = filterCategory || filterStatus || searchQuery;

  const handleEditSave = async (updatedTodo) => {
    try {
      const updated = await todos.update(updatedTodo.id, {
        title: updatedTodo.title,
        completed: updatedTodo.completed,
        description: updatedTodo.description,
        dueDate: updatedTodo.dueDate,
        priority: updatedTodo.priority,
      });
      setTodoList(todoList.map((t) => (t.id === updated.id ? updated : t)));
      setEditingTodo(null);
      showToast("Task updated");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading && todoList.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.loader}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {toast && (
          <div className={`${styles.toast} ${styles[toast.type]}`}>
            {toast.message}
          </div>
        )}

        <header className={styles.header}>
          <h1 className={styles.title}>Tasks</h1>
          <button onClick={logout} className={styles.logoutBtn}>
            Log out
          </button>
        </header>

        {error && (
          <div className={styles.error}>
            {error}
            <button onClick={() => setError("")} className={styles.errorClose}>×</button>
          </div>
        )}

        <section className={styles.section}>
          <form onSubmit={handleCreate} className={styles.addForm}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add a new task..."
              className={styles.addInput}
              disabled={submitting}
            />
            <button type="submit" className={styles.addBtn} disabled={submitting}>
              {submitting ? "Adding..." : "Add"}
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
              disabled={submitting}
            />
            <button type="submit" className={styles.addBtn} disabled={submitting}>
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
            <span className={styles.filterLabel}>Filter:</span>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search tasks..."
              className={styles.searchInput}
            />
            <select
              value={filterCategory}
              onChange={(e) => handleFilterChange("category", e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All categories</option>
              {categoryList.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className={styles.filterSelect}
            >
              <option value="">All status</option>
              <option value="false">Active</option>
              <option value="true">Completed</option>
            </select>
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className={styles.clearFiltersBtn}
              >
                Clear
              </button>
            )}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Tasks</h2>
          {loading ? (
            <div className={styles.loader}>Loading...</div>
          ) : todoList.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No tasks yet. Add one above!</p>
            </div>
          ) : (
            <>
              <ul className={styles.todoList}>
                {todoList.map((todo) => (
                  <li key={todo.id} className={styles.todoItem}>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggle(todo)}
                      className={styles.checkbox}
                    />
                    <div className={styles.todoContent}>
                      <span
                        className={`${styles.todoText} ${
                          todo.completed ? styles.todoTextCompleted : ""
                        }`}
                      >
                        {todo.title}
                      </span>
                      {todo.description && (
                        <span className={styles.todoDescription}>{todo.description}</span>
                      )}
                    </div>
                    <div className={styles.todoActions}>
                      <button
                        onClick={() => setEditingTodo(todo)}
                        className={styles.editBtn}
                      >
                        Edit
                      </button>
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

              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className={styles.pageBtn}
                  >
                    Previous
                  </button>
                  <span className={styles.pageInfo}>
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className={styles.pageBtn}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {editingTodo && (
          <EditModal
            todo={editingTodo}
            onSave={handleEditSave}
            onClose={() => setEditingTodo(null)}
          />
        )}
      </div>
    </div>
  );
}

function EditModal({ todo, onSave, onClose }) {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [dueDate, setDueDate] = useState(todo.due_date?.split("T")[0] || "");
  const [priority, setPriority] = useState(todo.priority || "medium");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setSaving(true);
    await onSave({
      ...todo,
      title,
      description,
      dueDate: dueDate || null,
      priority,
    });
    setSaving(false);
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Edit Task</h2>
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.modalField}>
            <label className={styles.modalLabel}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.modalInput}
            />
          </div>
          <div className={styles.modalField}>
            <label className={styles.modalLabel}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.modalTextarea}
              rows={3}
            />
          </div>
          <div className={styles.modalRow}>
            <div className={styles.modalField}>
              <label className={styles.modalLabel}>Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={styles.modalInput}
              />
            </div>
            <div className={styles.modalField}>
              <label className={styles.modalLabel}>Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className={styles.modalInput}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.modalCancelBtn}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.modalSaveBtn}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
