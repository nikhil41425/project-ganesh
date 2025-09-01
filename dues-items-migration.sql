-- Create dues_items table
CREATE TABLE IF NOT EXISTS dues_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    paid DECIMAL(10,2) NOT NULL DEFAULT 0,
    due DECIMAL(10,2) NOT NULL DEFAULT 0,
    comment TEXT,
    user_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create RLS (Row Level Security) policy
ALTER TABLE dues_items ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to only see their own dues items
CREATE POLICY "Users can view own dues items" ON dues_items
    FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own dues items
CREATE POLICY "Users can insert own dues items" ON dues_items
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own dues items
CREATE POLICY "Users can update own dues items" ON dues_items
    FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own dues items
CREATE POLICY "Users can delete own dues items" ON dues_items
    FOR DELETE USING (auth.uid() = user_id);

-- Create trigger to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_dues_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_dues_items_updated_at
    BEFORE UPDATE ON dues_items
    FOR EACH ROW
    EXECUTE FUNCTION update_dues_items_updated_at();

-- Create trigger to automatically calculate due amount
CREATE OR REPLACE FUNCTION calculate_dues_due_amount()
RETURNS TRIGGER AS $$
BEGIN
    NEW.due = NEW.amount - NEW.paid;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_dues_due_amount
    BEFORE INSERT OR UPDATE ON dues_items
    FOR EACH ROW
    EXECUTE FUNCTION calculate_dues_due_amount();
