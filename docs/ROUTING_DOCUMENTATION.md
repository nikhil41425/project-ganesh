# Routing Structure Documentation

## Application Routes

This application now has a proper routing structure with separate pages for each component. Here are the available routes:

### Main Routes

1. **Analytics Dashboard** - `/dashboard`
   - Default dashboard page showing analytics and overview
   - Displays comprehensive financial data and charts

2. **Auction Management** - `/dashboard/auction`
   - Manage auction items
   - Add, edit, delete auction items
   - Track payments and dues

3. **Membership Management** - `/dashboard/membership`
   - Manage membership fees
   - Track member payments
   - View membership analytics

4. **Donations Management** - `/dashboard/donations`
   - Track donations received
   - Manage donor information
   - View donation history

5. **Dues Management** - `/dashboard/dues`
   - Track dues from members
   - Manage payment schedules
   - Monitor outstanding amounts

6. **Expenses Management** - `/dashboard/expenses`
   - Track organizational expenses
   - Manage spending records
   - Monitor budget utilization

### Authentication Routes

- **Login** - `/auth/login`
- **Register** - `/auth/register`

### Features

- **Persistent Navigation**: Each route maintains state when refreshing the page
- **Responsive Design**: All routes work on desktop and mobile devices
- **Protected Routes**: All dashboard routes require authentication
- **Search Functionality**: Each component page includes search capabilities
- **Real-time Updates**: Data is synchronized with Supabase database

### Navigation

The application includes a shared navigation layout for all dashboard routes with:
- Desktop horizontal navigation bar
- Mobile hamburger menu
- Active route highlighting
- Sign out functionality
- PWA install prompts

### URL Structure

```
/                          → Redirects to dashboard
/dashboard                 → Analytics dashboard (default)
/dashboard/analytics       → Same as /dashboard
/dashboard/auction         → Auction management
/dashboard/membership      → Membership management
/dashboard/donations       → Donations management
/dashboard/dues           → Dues management
/dashboard/expenses       → Expenses management
/auth/login               → Login page
/auth/register            → Registration page
```

### State Management

Each route page manages its own state for:
- Data fetching and loading states
- Search functionality
- Form states (add/edit)
- User authentication checks

All routes share the authentication state through the layout component.
