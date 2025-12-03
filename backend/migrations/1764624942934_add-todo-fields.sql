-- Up Migration
ALTER TABLE todos
ADD COLUMN description TEXT,
ADD COLUMN due_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high'));

-- Down Migration
ALTER TABLE todos
DROP COLUMN description,
DROP COLUMN due_date,
DROP COLUMN priority;