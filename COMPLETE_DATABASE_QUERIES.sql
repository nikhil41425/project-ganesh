-- =============================================================================
-- PROJECT GANESH - COMPLETE DATABASE QUERIES
-- Updated: September 1, 2025
-- Includes: Auction, Membership, Expenses, and Donations (NEW)
-- =============================================================================

-- =============================================================================
-- 1. DATABASE SCHEMA CREATION
-- =============================================================================

-- Create auction_items table (Updated with paid and due columns)
CREATE TABLE IF NOT EXISTS auction_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    item VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    paid DECIMAL(10,2) NOT NULL DEFAULT 0,
    due DECIMAL(10,2) NOT NULL DEFAULT 0,
    comment TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create membership_items table
CREATE TABLE IF NOT EXISTS membership_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    due DECIMAL(10,2) NOT NULL DEFAULT 0,
    paid DECIMAL(10,2) NOT NULL DEFAULT 0,
    comment TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create spent_items table (Expenses)
CREATE TABLE IF NOT EXISTS spent_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    paid DECIMAL(10,2) NOT NULL DEFAULT 0,
    due DECIMAL(10,2) NOT NULL DEFAULT 0,
    comment TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create donation_items table (NEW)
CREATE TABLE IF NOT EXISTS donation_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    paid DECIMAL(10,2) NOT NULL DEFAULT 0,
    due DECIMAL(10,2) NOT NULL DEFAULT 0,
    comment TEXT,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =============================================================================
-- 2. ROW LEVEL SECURITY (RLS) SETUP
-- =============================================================================

-- Enable RLS on all tables
ALTER TABLE auction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE spent_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_items ENABLE ROW LEVEL SECURITY;

-- Auction Items Policies
CREATE POLICY "Users can view their own auction items" ON auction_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own auction items" ON auction_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own auction items" ON auction_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own auction items" ON auction_items FOR DELETE USING (auth.uid() = user_id);

-- Membership Items Policies
CREATE POLICY "Users can view their own membership items" ON membership_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own membership items" ON membership_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own membership items" ON membership_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own membership items" ON membership_items FOR DELETE USING (auth.uid() = user_id);

-- Spent Items Policies
CREATE POLICY "Users can view their own spent items" ON spent_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own spent items" ON spent_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own spent items" ON spent_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own spent items" ON spent_items FOR DELETE USING (auth.uid() = user_id);

-- Donation Items Policies (NEW)
CREATE POLICY "Users can view their own donation items" ON donation_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own donation items" ON donation_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own donation items" ON donation_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own donation items" ON donation_items FOR DELETE USING (auth.uid() = user_id);

-- =============================================================================
-- 3. INDEXES FOR PERFORMANCE
-- =============================================================================

CREATE INDEX IF NOT EXISTS auction_items_user_id_idx ON auction_items(user_id);
CREATE INDEX IF NOT EXISTS membership_items_user_id_idx ON membership_items(user_id);
CREATE INDEX IF NOT EXISTS spent_items_user_id_idx ON spent_items(user_id);
CREATE INDEX IF NOT EXISTS donation_items_user_id_idx ON donation_items(user_id);

-- Additional indexes for search functionality
CREATE INDEX IF NOT EXISTS auction_items_name_idx ON auction_items USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS auction_items_item_idx ON auction_items USING gin(to_tsvector('english', item));
CREATE INDEX IF NOT EXISTS membership_items_name_idx ON membership_items USING gin(to_tsvector('english', name));
CREATE INDEX IF NOT EXISTS spent_items_item_idx ON spent_items USING gin(to_tsvector('english', item));
CREATE INDEX IF NOT EXISTS donation_items_name_idx ON donation_items USING gin(to_tsvector('english', name));

-- =============================================================================
-- 4. TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- =============================================================================

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for all tables
CREATE TRIGGER update_auction_items_updated_at BEFORE UPDATE ON auction_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_membership_items_updated_at BEFORE UPDATE ON membership_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_spent_items_updated_at BEFORE UPDATE ON spent_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_donation_items_updated_at BEFORE UPDATE ON donation_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- =============================================================================
-- 5. CRUD QUERIES FOR AUCTION ITEMS
-- =============================================================================

-- SELECT - Get all auction items for user with search
SELECT * FROM auction_items 
WHERE user_id = $1 
AND (name ILIKE '%' || $2 || '%' OR item ILIKE '%' || $2 || '%')
ORDER BY created_at DESC;

-- INSERT - Add new auction item
INSERT INTO auction_items (name, item, amount, paid, due, comment, user_id)
VALUES ($1, $2, $3, $4, $5, $6, $7)
RETURNING *;

-- UPDATE - Update auction item
UPDATE auction_items 
SET name = $1, item = $2, amount = $3, paid = $4, due = $5, comment = $6
WHERE id = $7 AND user_id = $8
RETURNING *;

-- DELETE - Delete auction item
DELETE FROM auction_items 
WHERE id = $1 AND user_id = $2;

-- =============================================================================
-- 6. CRUD QUERIES FOR MEMBERSHIP ITEMS
-- =============================================================================

-- SELECT - Get all membership items for user
SELECT * FROM membership_items 
WHERE user_id = $1 
ORDER BY created_at DESC;

-- INSERT - Add new membership item
INSERT INTO membership_items (name, amount, paid, due, comment, user_id)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- UPDATE - Update membership item
UPDATE membership_items 
SET name = $1, amount = $2, paid = $3, due = $4, comment = $5
WHERE id = $6 AND user_id = $7
RETURNING *;

-- DELETE - Delete membership item
DELETE FROM membership_items 
WHERE id = $1 AND user_id = $2;

-- =============================================================================
-- 7. CRUD QUERIES FOR SPENT ITEMS (EXPENSES)
-- =============================================================================

-- SELECT - Get all spent items for user with search
SELECT * FROM spent_items 
WHERE user_id = $1 
AND (item ILIKE '%' || $2 || '%' OR comment ILIKE '%' || $2 || '%')
ORDER BY created_at DESC;

-- INSERT - Add new spent item
INSERT INTO spent_items (item, amount, paid, due, comment, user_id)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- UPDATE - Update spent item
UPDATE spent_items 
SET item = $1, amount = $2, paid = $3, due = $4, comment = $5
WHERE id = $6 AND user_id = $7
RETURNING *;

-- DELETE - Delete spent item
DELETE FROM spent_items 
WHERE id = $1 AND user_id = $2;

-- =============================================================================
-- 8. CRUD QUERIES FOR DONATION ITEMS (NEW)
-- =============================================================================

-- SELECT - Get all donation items for user with search
SELECT * FROM donation_items 
WHERE user_id = $1 
AND (name ILIKE '%' || $2 || '%' OR comment ILIKE '%' || $2 || '%')
ORDER BY created_at DESC;

-- INSERT - Add new donation item
INSERT INTO donation_items (name, amount, paid, due, comment, user_id)
VALUES ($1, $2, $3, $4, $5, $6)
RETURNING *;

-- UPDATE - Update donation item
UPDATE donation_items 
SET name = $1, amount = $2, paid = $3, due = $4, comment = $5
WHERE id = $6 AND user_id = $7
RETURNING *;

-- DELETE - Delete donation item
DELETE FROM donation_items 
WHERE id = $1 AND user_id = $2;

-- =============================================================================
-- 9. SUMMARY/ANALYTICS QUERIES
-- =============================================================================

-- Auction Items Summary
SELECT 
    COUNT(*) as total_items,
    COALESCE(SUM(amount), 0) as total_amount,
    COALESCE(SUM(paid), 0) as total_paid,
    COALESCE(SUM(due), 0) as total_due
FROM auction_items 
WHERE user_id = $1;

-- Membership Items Summary
SELECT 
    COUNT(*) as total_members,
    COALESCE(SUM(amount), 0) as total_amount,
    COALESCE(SUM(paid), 0) as total_paid,
    COALESCE(SUM(due), 0) as total_due
FROM membership_items 
WHERE user_id = $1;

-- Spent Items Summary
SELECT 
    COUNT(*) as total_expenses,
    COALESCE(SUM(amount), 0) as total_amount,
    COALESCE(SUM(paid), 0) as total_paid,
    COALESCE(SUM(due), 0) as total_due
FROM spent_items 
WHERE user_id = $1;

-- Donation Items Summary (NEW)
SELECT 
    COUNT(*) as total_donations,
    COALESCE(SUM(amount), 0) as total_amount,
    COALESCE(SUM(paid), 0) as total_paid,
    COALESCE(SUM(due), 0) as total_due
FROM donation_items 
WHERE user_id = $1;

-- Overall Dashboard Summary
SELECT 
    'auction' as category,
    COUNT(*) as count,
    COALESCE(SUM(amount), 0) as total_amount,
    COALESCE(SUM(paid), 0) as total_paid,
    COALESCE(SUM(due), 0) as total_due
FROM auction_items WHERE user_id = $1
UNION ALL
SELECT 
    'membership' as category,
    COUNT(*) as count,
    COALESCE(SUM(amount), 0) as total_amount,
    COALESCE(SUM(paid), 0) as total_paid,
    COALESCE(SUM(due), 0) as total_due
FROM membership_items WHERE user_id = $1
UNION ALL
SELECT 
    'expenses' as category,
    COUNT(*) as count,
    COALESCE(SUM(amount), 0) as total_amount,
    COALESCE(SUM(paid), 0) as total_paid,
    COALESCE(SUM(due), 0) as total_due
FROM spent_items WHERE user_id = $1
UNION ALL
SELECT 
    'donations' as category,
    COUNT(*) as count,
    COALESCE(SUM(amount), 0) as total_amount,
    COALESCE(SUM(paid), 0) as total_paid,
    COALESCE(SUM(due), 0) as total_due
FROM donation_items WHERE user_id = $1;

-- =============================================================================
-- 10. UTILITY QUERIES
-- =============================================================================

-- Get user statistics
SELECT 
    u.email,
    u.created_at as user_created,
    (SELECT COUNT(*) FROM auction_items WHERE user_id = u.id) as auction_count,
    (SELECT COUNT(*) FROM membership_items WHERE user_id = u.id) as membership_count,
    (SELECT COUNT(*) FROM spent_items WHERE user_id = u.id) as expenses_count,
    (SELECT COUNT(*) FROM donation_items WHERE user_id = u.id) as donations_count
FROM auth.users u
WHERE u.id = $1;

-- Recent activity across all categories
(SELECT 'auction' as type, name as title, item as subtitle, amount, created_at FROM auction_items WHERE user_id = $1)
UNION ALL
(SELECT 'membership' as type, name as title, '' as subtitle, amount, created_at FROM membership_items WHERE user_id = $1)
UNION ALL
(SELECT 'expenses' as type, item as title, '' as subtitle, amount, created_at FROM spent_items WHERE user_id = $1)
UNION ALL
(SELECT 'donations' as type, name as title, '' as subtitle, amount, created_at FROM donation_items WHERE user_id = $1)
ORDER BY created_at DESC
LIMIT 10;

-- =============================================================================
-- 11. MIGRATION QUERIES (For existing databases)
-- =============================================================================

-- Add paid and due columns to auction_items if they don't exist
ALTER TABLE auction_items 
ADD COLUMN IF NOT EXISTS paid DECIMAL(10,2) NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS due DECIMAL(10,2) NOT NULL DEFAULT 0;

-- Update existing auction items to calculate due amount
UPDATE auction_items 
SET due = amount - paid 
WHERE due = 0 AND amount > 0;

-- =============================================================================
-- 12. CLEANUP QUERIES (Use with caution!)
-- =============================================================================

-- Delete all data for a specific user (DANGEROUS!)
-- DELETE FROM auction_items WHERE user_id = $1;
-- DELETE FROM membership_items WHERE user_id = $1;
-- DELETE FROM spent_items WHERE user_id = $1;
-- DELETE FROM donation_items WHERE user_id = $1;

-- Reset auto-increment sequences if needed
-- SELECT setval('auction_items_id_seq', 1, false);
-- SELECT setval('membership_items_id_seq', 1, false);
-- SELECT setval('spent_items_id_seq', 1, false);
-- SELECT setval('donation_items_id_seq', 1, false);

-- =============================================================================
-- END OF FILE
-- =============================================================================

/*
USAGE NOTES:
1. Replace $1, $2, etc. with actual parameter values when using these queries
2. All queries include user_id filtering for security
3. Search queries use ILIKE for case-insensitive matching
4. Due amounts should be calculated as: amount - paid
5. All timestamps are in UTC
6. Make sure to run the schema creation queries first
7. Enable RLS policies before inserting any data
8. Create indexes after initial data load for better performance

PARAMETER EXAMPLES:
- $1 = user_id (UUID)
- $2 = search_term (STRING) 
- $3 = amount (DECIMAL)
- $4 = paid (DECIMAL)
- $5 = due (DECIMAL)
- $6 = comment (TEXT)
- $7 = id (UUID)

FEATURES INCLUDED:
✅ Auction Items (with search)
✅ Membership Items
✅ Expenses/Spent Items (with search)
✅ Donations Items (NEW - with search)
✅ Row Level Security
✅ Performance Indexes
✅ Auto-updating timestamps
✅ Summary/Analytics queries
✅ Migration support
*/
