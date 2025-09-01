-- Update auction_items table to add paid and due columns

-- Add paid and due columns to auction_items table
ALTER TABLE auction_items 
ADD COLUMN IF NOT EXISTS paid DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS due DECIMAL(10,2) NOT NULL DEFAULT 0;
