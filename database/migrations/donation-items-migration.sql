-- Add donations table to Project Ganesh Dashboard

-- Create donation_items table
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

-- Add RLS (Row Level Security) policy
ALTER TABLE donation_items ENABLE ROW LEVEL SECURITY;

-- Create policies for donation_items table
CREATE POLICY "Users can view their own donation items" ON donation_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own donation items" ON donation_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own donation items" ON donation_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own donation items" ON donation_items FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS donation_items_user_id_idx ON donation_items(user_id);

-- Create trigger for updated_at (assuming the function already exists)
CREATE TRIGGER update_donation_items_updated_at BEFORE UPDATE ON donation_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
