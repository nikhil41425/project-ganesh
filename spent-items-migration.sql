-- Migration script to add paid and due columns to spent_items table

-- Add paid column to spent_items table
ALTER TABLE spent_items 
ADD COLUMN IF NOT EXISTS paid DECIMAL(10,2) DEFAULT 0;

-- Add due column to spent_items table
ALTER TABLE spent_items 
ADD COLUMN IF NOT EXISTS due DECIMAL(10,2) DEFAULT 0;

-- Update any existing null values to default values
UPDATE spent_items 
SET paid = 0 
WHERE paid IS NULL;

UPDATE spent_items 
SET due = 0 
WHERE due IS NULL;

-- Add comments to the columns for clarity
COMMENT ON COLUMN spent_items.paid IS 'Amount paid for the expense item';
COMMENT ON COLUMN spent_items.due IS 'Due amount for the expense item';

-- Verify the table structure after migration
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'spent_items' 
ORDER BY ordinal_position;
