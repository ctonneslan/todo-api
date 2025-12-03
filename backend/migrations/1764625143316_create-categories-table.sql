-- Up Migration
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, user_id)
);

CREATE TABLE todo_categories (
    todo_id INTEGER NOT NULL REFERENCES todos(id) ON DELETE CASCADE,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (todo_id, category_id)
);

CREATE INDEX idx_categories_user_id ON categories(user_id);
CREATE INDEX idx_todos_categories_todo_id ON todo_categories(todo_id);
CREATE INDEX idx_todos_categories_category_id ON todo_categories(category_id);

-- Down Migration
DROP TABLE todo_categories;
DROP TABLE categories;