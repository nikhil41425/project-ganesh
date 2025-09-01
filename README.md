# Project Ganesh - Dashboard Application

A full-stack Next.js application with Supabase authentication and a dashboard featuring three fixed tabs: Auction, Membership, and Spents with specific data management functionality.

## Features

- 🔐 **User Authentication**: Register, login, and logout functionality
- 📊 **Dashboard**: Three fixed tabs (Auction, Membership, Spents)
- ➕ **Data Management**: Add, view, edit, and delete items in each tab
- 🛡️ **Global Edit/Delete Control**: Centralized flag to disable edit and delete functionality across all components
- 💰 **Currency Formatting**: Prices/amounts displayed in Indian Rupees (INR)
- 🎨 **Modern UI**: Clean design with Tailwind CSS
- ✅ **Form Validation**: Zod schemas with react-hook-form

## Tab Structure

### Auction Tab
- **Columns**: Name, Item, Price, Actions (Delete)
- **Purpose**: Track auction items and their winning bids

### Membership Tab
- **Columns**: Name, Amount, Due Date, Comment, Actions (Delete)
- **Purpose**: Track membership fees and due dates

### Spents Tab
- **Columns**: Item, Amount, Price, Comment, Actions (Delete)
- **Purpose**: Track expenses and expenditures

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Backend**: Supabase (Auth + PostgreSQL)
- **UI Components**: Lucide React icons
- **Form Handling**: React Hook Form + Zod validation
- **Authentication**: Supabase Auth with SSR support

## Setup Instructions

### 1. Environment Setup

1. Clone this repository
2. Copy `.env.local.example` to `.env.local`
3. Update the environment variables with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 2. Supabase Database Setup

Run the SQL commands from `database-schema.sql` in your Supabase SQL Editor. This will create:

- `auction_items` table with Name, Item, Price columns
- `membership_items` table with Name, Amount, Due, Comment columns  
- `spent_items` table with Item, Amount, Price, Comment columns
- RLS (Row Level Security) policies for user data isolation
- Proper indexes for performance
### 3. Install Dependencies

```bash
npm install
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx          # Login page
│   │   └── register/page.tsx       # Registration page
│   ├── dashboard/page.tsx          # Main dashboard
│   ├── globals.css                 # Global styles
│   ├── layout.tsx                  # Root layout
│   └── page.tsx                    # Landing page
├── lib/
│   └── supabase/
│       ├── client.ts               # Client-side Supabase
│       ├── middleware.ts           # Auth middleware
│       └── server.ts               # Server-side Supabase
└── middleware.ts                   # Next.js middleware
```

## Global Configuration

### Edit/Delete Control

The application includes a global configuration system to control edit and delete functionality across all components.

**Configuration File**: `src/lib/config.ts`

```typescript
// To disable edit/delete functionality globally
export const appConfig = {
  disableEditDelete: true  // Set to true to disable, false to enable
}
```

**Usage in Components:**
- All components (`Auction.tsx`, `Expenses.tsx`, `Membership.tsx`) automatically respect this flag
- When `disableEditDelete` is `true`, edit and delete buttons are hidden
- When `disableEditDelete` is `false`, edit and delete functionality is available

**Dynamic Control:**
```typescript
import { setEditDeleteEnabled } from '@/lib/config'

// Disable edit/delete functionality
setEditDeleteEnabled(false)

// Enable edit/delete functionality  
setEditDeleteEnabled(true)
```

## Features Overview

### Authentication
- User registration with email verification
- Secure login/logout
- Protected routes using middleware

### Dashboard
- **Three Fixed Tabs**: Auction, Membership, Spents (tab names are hardcoded)
- **Tab-Specific Tables**: Each tab has its own table structure and data
- **Add Items**: Form to add new items to the active tab (form fields change per tab)
- **Delete Items**: Remove items from tables
- **Currency Formatting**: Prices/amounts displayed in Indian Rupees (₹)
- **Summary**: Shows total items and total value per tab

### Data Management
- All data is stored in Supabase PostgreSQL with separate tables per tab type
- Row Level Security ensures users only see their own data
- Real-time updates when data changes

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
