-- Up Migration
DELETE FROM todos;

ALTER TABLE todos
ADD COLUMN user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE;

CREATE INDEX idx_todos_user_id ON todos(user_id);

-- Down Migration
DROP INDEX idx_todos_user_id;

ALTER TABLE todos
DROP COLUMN user_id;