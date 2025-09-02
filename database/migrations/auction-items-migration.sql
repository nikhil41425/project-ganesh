-- Migration script to add paid and due columns to auction_items table

-- Add paid column to auction_items table
ALTER TABLE auction_items 
ADD COLUMN IF NOT EXISTS paid DECIMAL(10,2) DEFAULT 0;

-- Check if due column exists and is of type date, then alter it to decimal
-- First, drop the existing due column if it exists as DATE type
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'auction_items' 
        AND column_name = 'due' 
        AND data_type = 'date'
    ) THEN
        ALTER TABLE auction_items DROP COLUMN due;
    END IF;
END $$;

-- Add due column as DECIMAL type
ALTER TABLE auction_items 
ADD COLUMN IF NOT EXISTS due DECIMAL(10,2) DEFAULT 0;

-- Update any existing null values to default values
UPDATE auction_items 
SET paid = 0 
WHERE paid IS NULL;

UPDATE auction_items 
SET due = 0 
WHERE due IS NULL;

-- Add comments to the columns for clarity
COMMENT ON COLUMN auction_items.paid IS 'Amount paid for the auction item';
COMMENT ON COLUMN auction_items.due IS 'Due amount for the auction item';
