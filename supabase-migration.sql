-- Migration script to update database schema for Project Ganesh
-- Copy and paste these queries one by one into Supabase SQL Editor

-- 1. Add comment column to auction_items table and rename price to amount
ALTER TABLE auction_items ADD COLUMN IF NOT EXISTS comment TEXT;
ALTER TABLE auction_items RENAME COLUMN price TO amount;

-- 2. Add paid column to membership_items table and change due from DATE to DECIMAL
ALTER TABLE membership_items ADD COLUMN IF NOT EXISTS paid DECIMAL(10,2) NOT NULL DEFAULT 0;
-- First, add a new due_amount column
ALTER TABLE membership_items ADD COLUMN IF NOT EXISTS due_amount DECIMAL(10,2) NOT NULL DEFAULT 0;
-- Update the new column with existing due data (if any exists)
UPDATE membership_items SET due_amount = 0 WHERE due_amount IS NULL;
-- Drop the old due column
ALTER TABLE membership_items DROP COLUMN IF EXISTS due;
-- Rename the new column to due
ALTER TABLE membership_items RENAME COLUMN due_amount TO due;

-- 3. Add paid and due columns to spent_items table
ALTER TABLE spent_items ADD COLUMN IF NOT EXISTS paid DECIMAL(10,2) DEFAULT 0;
ALTER TABLE spent_items ADD COLUMN IF NOT EXISTS due DECIMAL(10,2) DEFAULT 0;

-- Update any existing null values to default values for spent_items
UPDATE spent_items SET paid = 0 WHERE paid IS NULL;
UPDATE spent_items SET due = 0 WHERE due IS NULL;

-- 4. Remove price column from spent_items table (if it exists)
ALTER TABLE spent_items DROP COLUMN IF EXISTS price;

-- 4. Verify the updated table structures
-- You can run these SELECT statements to confirm the changes:

-- Check auction_items structure
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'auction_items' 
-- ORDER BY ordinal_position;

-- Check membership_items structure  
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'membership_items' 
-- ORDER BY ordinal_position;

-- Check spent_items structure
-- SELECT column_name, data_type, is_nullable, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'spent_items' 
-- ORDER BY ordinal_position;
