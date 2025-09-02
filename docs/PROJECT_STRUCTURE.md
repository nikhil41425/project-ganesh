# Project Structure

This document outlines the organized structure of the Project Ganesh application.

## Root Directory Structure

```
project-ganesh/
├── docs/                           # All documentation files
├── database/                       # Database related files
│   └── migrations/                 # SQL migration files
├── scripts/                        # Build and utility scripts
├── public/                         # Static assets
│   ├── icons/                      # PWA icons
│   ├── manifest.json               # PWA manifest
│   └── sw.js                       # Service worker
├── src/                            # Source code
│   ├── app/                        # Next.js 14+ app router
│   │   ├── auth/                   # Authentication pages
│   │   ├── dashboard/              # Dashboard pages
│   │   │   ├── analytics/          # Analytics page
│   │   │   ├── auction/            # Auction management
│   │   │   ├── donations/          # Donations management  
│   │   │   ├── dues/               # Dues management
│   │   │   ├── expenses/           # Expenses management
│   │   │   └── membership/         # Membership management
│   │   ├── offline/                # Offline page
│   │   ├── pwa-test/               # PWA testing page
│   │   └── setup/                  # Initial setup page
│   ├── components/                 # Reusable React components
│   ├── hooks/                      # Custom React hooks
│   ├── lib/                        # Third-party library configurations
│   │   └── supabase/               # Supabase client configuration
│   ├── types/                      # TypeScript type definitions
│   └── utils/                      # Utility functions and constants
├── .env.local.example              # Environment variables template
├── .eslintrc.json                  # ESLint configuration
├── .gitignore                      # Git ignore rules
├── next.config.js                  # Next.js configuration
├── package.json                    # Dependencies and scripts
├── postcss.config.js               # PostCSS configuration
├── tailwind.config.js              # Tailwind CSS configuration
└── tsconfig.json                   # TypeScript configuration
```

## Key Principles Applied

1. **Separation of Concerns**: Each folder has a specific purpose
2. **Documentation Organization**: All docs moved to `/docs` folder
3. **Database Organization**: All SQL files moved to `/database/migrations`
4. **Type Safety**: Centralized TypeScript types in `/src/types`
5. **Utility Organization**: Constants and utilities in `/src/utils`
6. **Component Modularity**: Each feature has its own component
7. **Clean Root**: Minimal files in root directory

## Benefits of This Structure

- **Maintainability**: Easy to locate and modify specific functionality
- **Scalability**: Clear structure for adding new features
- **Team Collaboration**: Standardized organization for multiple developers
- **Documentation**: Centralized documentation for easy reference
- **Build Optimization**: Clear separation of build files and source code
