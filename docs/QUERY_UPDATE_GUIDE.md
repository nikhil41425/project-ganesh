# Query Update Guide for Project Ganesh

This guide shows you different ways to update queries in your Project Ganesh application.

## 1. Database Schema Updates (SQL)

### Adding New Columns
```sql
-- Add new columns to existing tables
ALTER TABLE auction_items ADD COLUMN description TEXT;
ALTER TABLE auction_items ADD COLUMN category VARCHAR(100);
ALTER TABLE membership_items ADD COLUMN status VARCHAR(50) DEFAULT 'active';
ALTER TABLE spent_items ADD COLUMN receipt_url TEXT;
```

### Creating New Tables
```sql
-- Create a new categories table
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    color VARCHAR(7), -- For hex color codes
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
```

### Adding Indexes for Performance
```sql
-- Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS auction_items_price_idx ON auction_items(price);
CREATE INDEX IF NOT EXISTS membership_items_due_idx ON membership_items(due);
CREATE INDEX IF NOT EXISTS spent_items_created_at_idx ON spent_items(created_at);
```

## 2. Application Query Updates (TypeScript)

### Basic CRUD Operations

#### SELECT with Filters
```typescript
// Get items with price filter
const getAuctionItemsByPrice = async (minPrice: number, maxPrice: number) => {
  const { data, error } = await supabase
    .from('auction_items')
    .select('*')
    .eq('user_id', user.id)
    .gte('price', minPrice)
    .lte('price', maxPrice)
    .order('price', { ascending: false })
}

// Get items with date range
const getMembershipItemsByDateRange = async (startDate: string, endDate: string) => {
  const { data, error } = await supabase
    .from('membership_items')
    .select('*')
    .eq('user_id', user.id)
    .gte('due', startDate)
    .lte('due', endDate)
    .order('due')
}
```

#### SELECT with Search
```typescript
// Search across multiple columns
const searchItems = async (tableName: string, searchTerm: string) => {
  let query = supabase
    .from(tableName)
    .select('*')
    .eq('user_id', user.id)

  if (tableName === 'auction_items') {
    query = query.or(`name.ilike.%${searchTerm}%,item.ilike.%${searchTerm}%`)
  } else if (tableName === 'membership_items') {
    query = query.or(`name.ilike.%${searchTerm}%,comment.ilike.%${searchTerm}%`)
  } else if (tableName === 'spent_items') {
    query = query.or(`item.ilike.%${searchTerm}%,comment.ilike.%${searchTerm}%`)
  }

  return await query.order('created_at', { ascending: false })
}
```

#### INSERT with Error Handling
```typescript
const addItemWithValidation = async (tableName: string, data: any) => {
  try {
    const { data: insertedData, error } = await supabase
      .from(tableName)
      .insert({ ...data, user_id: user.id })
      .select()
      .single()

    if (error) {
      console.error('Insert error:', error)
      throw new Error(error.message)
    }

    return insertedData
  } catch (err) {
    console.error('Failed to add item:', err)
    throw err
  }
}
```

#### UPDATE Operations
```typescript
const updateAuctionItem = async (id: string, updates: Partial<AuctionItem>) => {
  const { data, error } = await supabase
    .from('auction_items')
    .update(updates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (!error) {
    // Refresh the data
    getAuctionItems()
  }
  
  return { data, error }
}
```

#### BULK Operations
```typescript
// Bulk delete
const bulkDeleteItems = async (tableName: string, ids: string[]) => {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .in('id', ids)
    .eq('user_id', user.id)

  return error
}

// Bulk update
const bulkUpdatePrices = async (items: Array<{id: string, price: number}>) => {
  const updates = items.map(item => 
    supabase
      .from('auction_items')
      .update({ price: item.price })
      .eq('id', item.id)
      .eq('user_id', user.id)
  )

  const results = await Promise.all(updates)
  return results
}
```

### Advanced Queries

#### Aggregation
```typescript
// Get spending summary
const getSpendingSummary = async () => {
  const { data, error } = await supabase
    .from('spent_items')
    .select('price, amount, created_at')
    .eq('user_id', user.id)

  if (data && !error) {
    const total = data.reduce((sum, item) => sum + item.price, 0)
    const count = data.length
    const average = count > 0 ? total / count : 0
    
    return { total, count, average }
  }
}

// Get monthly spending
const getMonthlySpending = async (year: number) => {
  const { data, error } = await supabase
    .from('spent_items')
    .select('price, created_at')
    .eq('user_id', user.id)
    .gte('created_at', `${year}-01-01`)
    .lt('created_at', `${year + 1}-01-01`)

  if (data && !error) {
    const monthlyData = data.reduce((acc, item) => {
      const month = new Date(item.created_at).getMonth()
      acc[month] = (acc[month] || 0) + item.price
      return acc
    }, {} as Record<number, number>)
    
    return monthlyData
  }
}
```

#### Pagination
```typescript
const getPaginatedItems = async (
  tableName: string, 
  page: number = 0, 
  pageSize: number = 10
) => {
  const from = page * pageSize
  const to = from + pageSize - 1

  const { data, error, count } = await supabase
    .from(tableName)
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(from, to)

  return { data, error, count, totalPages: Math.ceil((count || 0) / pageSize) }
}
```

#### Real-time Subscriptions
```typescript
// Set up real-time subscription
const setupRealtimeSubscription = () => {
  const subscription = supabase
    .channel('auction_items_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'auction_items',
        filter: `user_id=eq.${user.id}`
      },
      (payload) => {
        console.log('Change received!', payload)
        // Refresh data
        getAuctionItems()
      }
    )
    .subscribe()

  return subscription
}
```

## 3. Query Optimization Tips

### Use Indexes
```sql
-- Create indexes for frequently filtered columns
CREATE INDEX CONCURRENTLY idx_auction_items_user_price ON auction_items(user_id, price);
CREATE INDEX CONCURRENTLY idx_membership_items_user_due ON membership_items(user_id, due);
```

### Select Only Needed Columns
```typescript
// Instead of select('*')
const { data } = await supabase
  .from('auction_items')
  .select('id, name, price') // Only select needed columns
  .eq('user_id', user.id)
```

### Use Proper Filtering
```typescript
// Filter on the database side, not in JavaScript
const { data } = await supabase
  .from('auction_items')
  .select('*')
  .eq('user_id', user.id)
  .gte('price', 100) // Database filter
  // Don't do: .filter(item => item.price >= 100) // JavaScript filter
```

## 4. Error Handling Best Practices

```typescript
const safeQuery = async (queryFn: () => Promise<any>) => {
  try {
    const { data, error } = await queryFn()
    
    if (error) {
      console.error('Database error:', error)
      // Show user-friendly error message
      alert('Failed to load data. Please try again.')
      return null
    }
    
    return data
  } catch (err) {
    console.error('Unexpected error:', err)
    alert('Something went wrong. Please refresh the page.')
    return null
  }
}

// Usage
const data = await safeQuery(() => 
  supabase.from('auction_items').select('*').eq('user_id', user.id)
)
```

## 5. Testing Queries

### Test in Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Test your queries before implementing them in code

### Example Test Queries
```sql
-- Test search functionality
SELECT * FROM auction_items 
WHERE user_id = 'your-user-id' 
AND (name ILIKE '%search%' OR item ILIKE '%search%');

-- Test date filtering
SELECT * FROM membership_items 
WHERE user_id = 'your-user-id' 
AND due < CURRENT_DATE;

-- Test aggregation
SELECT 
  COUNT(*) as total_items,
  SUM(price) as total_value,
  AVG(price) as average_price
FROM auction_items 
WHERE user_id = 'your-user-id';
```

This guide covers the most common ways to update and optimize queries in your Project Ganesh application. Remember to always test queries in the Supabase dashboard before implementing them in your code!
