-- Create tables for Project Ganesh Dashboard

-- Create auction_items table
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

-- Create spent_items table
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

-- Add RLS (Row Level Security) policies
ALTER TABLE auction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE spent_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE donation_items ENABLE ROW LEVEL SECURITY;

-- Create policies for auction_items table
CREATE POLICY "Users can view their own auction items" ON auction_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own auction items" ON auction_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own auction items" ON auction_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own auction items" ON auction_items FOR DELETE USING (auth.uid() = user_id);

-- Create policies for membership_items table
CREATE POLICY "Users can view their own membership items" ON membership_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own membership items" ON membership_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own membership items" ON membership_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own membership items" ON membership_items FOR DELETE USING (auth.uid() = user_id);

-- Create policies for spent_items table
CREATE POLICY "Users can view their own spent items" ON spent_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own spent items" ON spent_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own spent items" ON spent_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own spent items" ON spent_items FOR DELETE USING (auth.uid() = user_id);

-- Create policies for donation_items table
CREATE POLICY "Users can view their own donation items" ON donation_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own donation items" ON donation_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own donation items" ON donation_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own donation items" ON donation_items FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS auction_items_user_id_idx ON auction_items(user_id);
CREATE INDEX IF NOT EXISTS membership_items_user_id_idx ON membership_items(user_id);
CREATE INDEX IF NOT EXISTS spent_items_user_id_idx ON spent_items(user_id);
CREATE INDEX IF NOT EXISTS donation_items_user_id_idx ON donation_items(user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_auction_items_updated_at BEFORE UPDATE ON auction_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_membership_items_updated_at BEFORE UPDATE ON membership_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_spent_items_updated_at BEFORE UPDATE ON spent_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_donation_items_updated_at BEFORE UPDATE ON donation_items FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
