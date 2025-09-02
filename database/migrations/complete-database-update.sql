-- Complete Database Update Script for Project Ganesh
-- Execute these queries in your Supabase SQL Editor one by one
-- This script brings the database up to date with all recent changes

-- =============================================================================
-- STEP 1: UPDATE AUCTION_ITEMS TABLE
-- =============================================================================

-- Add comment column to auction_items table (if not exists)
ALTER TABLE auction_items ADD COLUMN IF NOT EXISTS comment TEXT;

-- Add paid and due columns to auction_items table (if not exists)
ALTER TABLE auction_items ADD COLUMN IF NOT EXISTS paid DECIMAL(10,2) DEFAULT 0;
ALTER TABLE auction_items ADD COLUMN IF NOT EXISTS due DECIMAL(10,2) DEFAULT 0;

-- Rename price column to amount in auction_items (if price column exists)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'auction_items' 
        AND column_name = 'price'
    ) THEN
        ALTER TABLE auction_items RENAME COLUMN price TO amount;
    END IF;
END $$;

-- Update any existing null values to default values for auction_items
UPDATE auction_items SET paid = 0 WHERE paid IS NULL;
UPDATE auction_items SET due = 0 WHERE due IS NULL;

-- Add comments to auction_items columns for clarity
COMMENT ON COLUMN auction_items.paid IS 'Amount paid for the auction item';
COMMENT ON COLUMN auction_items.due IS 'Due amount for the auction item';
COMMENT ON COLUMN auction_items.comment IS 'Additional comments or notes for the auction item';

-- =============================================================================
-- STEP 2: UPDATE MEMBERSHIP_ITEMS TABLE
-- =============================================================================

-- Add paid column to membership_items table (if not exists)
ALTER TABLE membership_items ADD COLUMN IF NOT EXISTS paid DECIMAL(10,2) NOT NULL DEFAULT 0;

-- Handle due column conversion from DATE to DECIMAL
DO $$ 
BEGIN
    -- Check if due column exists and is of type date, then alter it to decimal
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'membership_items' 
        AND column_name = 'due' 
        AND data_type = 'date'
    ) THEN
        -- First, add a new due_amount column
        ALTER TABLE membership_items ADD COLUMN IF NOT EXISTS due_amount DECIMAL(10,2) NOT NULL DEFAULT 0;
        -- Update the new column with default values
        UPDATE membership_items SET due_amount = 0 WHERE due_amount IS NULL;
        -- Drop the old due column
        ALTER TABLE membership_items DROP COLUMN due;
        -- Rename the new column to due
        ALTER TABLE membership_items RENAME COLUMN due_amount TO due;
    ELSE
        -- If due column doesn't exist or is not date type, just add it as decimal
        ALTER TABLE membership_items ADD COLUMN IF NOT EXISTS due DECIMAL(10,2) NOT NULL DEFAULT 0;
    END IF;
END $$;

-- Update any existing null values to default values for membership_items
UPDATE membership_items SET paid = 0 WHERE paid IS NULL;
UPDATE membership_items SET due = 0 WHERE due IS NULL;

-- Add comments to membership_items columns for clarity
COMMENT ON COLUMN membership_items.paid IS 'Amount paid for the membership';
COMMENT ON COLUMN membership_items.due IS 'Due amount for the membership';

-- =============================================================================
-- STEP 3: UPDATE SPENT_ITEMS TABLE
-- =============================================================================

-- Add paid and due columns to spent_items table (if not exists)
ALTER TABLE spent_items ADD COLUMN IF NOT EXISTS paid DECIMAL(10,2) DEFAULT 0;
ALTER TABLE spent_items ADD COLUMN IF NOT EXISTS due DECIMAL(10,2) DEFAULT 0;

-- Remove price column from spent_items table (if it exists)
ALTER TABLE spent_items DROP COLUMN IF EXISTS price;

-- Update any existing null values to default values for spent_items
UPDATE spent_items SET paid = 0 WHERE paid IS NULL;
UPDATE spent_items SET due = 0 WHERE due IS NULL;

-- Add comments to spent_items columns for clarity
COMMENT ON COLUMN spent_items.paid IS 'Amount paid for the expense item';
COMMENT ON COLUMN spent_items.due IS 'Due amount for the expense item';

-- =============================================================================
-- STEP 4: VERIFY TABLE STRUCTURES
-- =============================================================================

-- Check auction_items table structure
SELECT 
    'auction_items' as table_name,
    column_name, 
    data_type, 
    is_nullable, 
    column_default 
FROM information_schema.columns 
WHERE table_name = 'auction_items' 
ORDER BY ordinal_position;

-- Check membership_items table structure
SELECT 
    'membership_items' as table_name,
    column_name, 
    data_type, 
    is_nullable, 
    column_default 
FROM information_schema.columns 
WHERE table_name = 'membership_items' 
ORDER BY ordinal_position;

-- Check spent_items table structure
SELECT 
    'spent_items' as table_name,
    column_name, 
    data_type, 
    is_nullable, 
    column_default 
FROM information_schema.columns 
WHERE table_name = 'spent_items' 
ORDER BY ordinal_position;

-- =============================================================================
-- STEP 5: UPDATE TRIGGERS FOR UPDATED_AT (if not already present)
-- =============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables to auto-update updated_at column
DROP TRIGGER IF EXISTS update_auction_items_updated_at ON auction_items;
CREATE TRIGGER update_auction_items_updated_at
    BEFORE UPDATE ON auction_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_membership_items_updated_at ON membership_items;
CREATE TRIGGER update_membership_items_updated_at
    BEFORE UPDATE ON membership_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_spent_items_updated_at ON spent_items;
CREATE TRIGGER update_spent_items_updated_at
    BEFORE UPDATE ON spent_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- STEP 6: FINAL VERIFICATION QUERIES
-- =============================================================================

-- Count records in each table
SELECT 
    'auction_items' as table_name, 
    COUNT(*) as record_count 
FROM auction_items
UNION ALL
SELECT 
    'membership_items' as table_name, 
    COUNT(*) as record_count 
FROM membership_items
UNION ALL
SELECT 
    'spent_items' as table_name, 
    COUNT(*) as record_count 
FROM spent_items;

-- Sample data from each table (first 3 records)
SELECT 'auction_items' as source, id, name, item, amount, paid, due, comment, created_at FROM auction_items ORDER BY created_at DESC LIMIT 3;
SELECT 'membership_items' as source, id, name, '' as item, amount, paid, due, comment, created_at FROM membership_items ORDER BY created_at DESC LIMIT 3;
SELECT 'spent_items' as source, id, '' as name, item, amount, paid, due, comment, created_at FROM spent_items ORDER BY created_at DESC LIMIT 3;

-- =============================================================================
-- SCRIPT COMPLETION MESSAGE
-- =============================================================================

DO $$
BEGIN
    RAISE NOTICE '=============================================================================';
    RAISE NOTICE 'DATABASE UPDATE COMPLETED SUCCESSFULLY!';
    RAISE NOTICE '=============================================================================';
    RAISE NOTICE 'All tables have been updated with the following changes:';
    RAISE NOTICE '1. auction_items: Added comment, paid, due columns; renamed price to amount';
    RAISE NOTICE '2. membership_items: Added paid column; converted due from DATE to DECIMAL';
    RAISE NOTICE '3. spent_items: Added paid, due columns; removed price column';
    RAISE NOTICE '4. All tables have updated_at triggers for automatic timestamp updates';
    RAISE NOTICE '=============================================================================';
    RAISE NOTICE 'Your Project Ganesh database is now ready to use with the updated frontend!';
    RAISE NOTICE '=============================================================================';
END $$;
