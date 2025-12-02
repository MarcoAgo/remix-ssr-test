# Server-to-Server GET/POST Flow Documentation

## Overview

This project implements a complete server-to-server request flow using React Router v7 SSR with Zustand for state management. All API calls happen server-side and are never exposed to the client.

## Architecture

### Components

1. **Mock API** (`server/api/jobs.ts`)
   - Simulates external backend API calls
   - Server-only module (never imported in client code)
   - Functions: `getJobs()`, `getJobById()`, `submitApplication()`

2. **Zustand Store** (`app/lib/stores/useFiltersStore.ts`)
   - Manages filter state
   - Syncs with URL query parameters
   - Hydrates from URL on initial load and from loader data

3. **Job Filters Component** (`app/components/JobFilters.tsx`)
   - UI component for filters
   - Uses Zustand store
   - Automatically syncs store ↔ URL

4. **Routes**
   - `app/routes/_index.tsx`: Job list with GET-based filtering
   - `app/routes/jobs.$id.tsx`: Job detail page
   - `app/routes/jobs.apply.$id.tsx`: Application form with POST action

## Flow Diagrams

### GET Flow (Filter Changes)

```
User changes filter
    ↓
Zustand store updates
    ↓
URL query params update
    ↓
React Router detects URL change
    ↓
Loader runs on server
    ↓
Loader calls server/api/jobs.ts (server-to-server)
    ↓
Mock API returns filtered results
    ↓
Loader returns data
    ↓
Component hydrates store from loader data
    ↓
UI updates with filtered jobs
```

### POST Flow (Form Submission)

```
User submits application form
    ↓
React Router Form submits POST
    ↓
Action runs on server
    ↓
Action calls server/api/jobs.ts (server-to-server POST)
    ↓
Mock API validates and processes application
    ↓
Action returns success/error response
    ↓
UI displays result message
```

## Key Features

### 1. Server-to-Server Only

- All API calls happen in loaders/actions (server-side)
- `server/api/jobs.ts` is never imported in client code
- No API endpoints exposed to browser

### 2. URL Synchronization

- Filters stored in URL query params
- Shareable/bookmarkable URLs
- Browser back/forward works correctly
- Initial SSR load respects URL filters

### 3. Zustand Store Integration

- Prevents prop drilling
- Single source of truth for filters
- Hydrates from URL on mount
- Syncs with loader data after server response

### 4. Type Safety

- Full TypeScript support
- React Router type generation
- Type-safe API responses

## Usage

### Running the Application

```bash
# Development
npm run dev

# Production build
npm run build
npm start

# Type checking
npm run typecheck
```

### Testing the Flows

1. **Filter Flow (GET)**:
   - Navigate to `/`
   - Change any filter (search, type, location, minSalary)
   - Observe URL updates
   - See filtered results load from server

2. **Application Flow (POST)**:
   - Navigate to `/jobs/1`
   - Click "Apply Now"
   - Fill out application form
   - Submit
   - See success/error message from server

### Example URLs

- Job list: `http://localhost:5173/`
- Filtered list: `http://localhost:5173/?type=full-time&location=San%20Francisco`
- Job detail: `http://localhost:5173/jobs/1`
- Application form: `http://localhost:5173/jobs/1/apply`

## File Structure

```
app/
├── components/
│   └── JobFilters.tsx          # Filter UI component
├── lib/
│   ├── jobs.ts                # Type definitions & re-exports
│   └── stores/
│       └── useFiltersStore.ts  # Zustand store
├── routes/
│   ├── _index.tsx              # Job list (GET filters)
│   ├── jobs.$id.tsx           # Job detail
│   └── jobs.apply.$id.tsx     # Application form (POST)
└── routes.ts                   # Route configuration

server/
└── api/
    └── jobs.ts                 # Mock API (server-only)
```

## Important Notes

1. **Server-Only Imports**: `server/api/jobs.ts` should only be imported in loaders/actions. The re-exports in `app/lib/jobs.ts` make this safe.

2. **Store Hydration**: The store hydrates twice:
   - From URL on component mount
   - From loader data after server response

3. **URL Updates**: The store updates the URL, which triggers React Router to re-run the loader. This creates a clean cycle: Store → URL → Loader → Store.

4. **POST Actions**: Form submissions use React Router's `<Form>` component, which automatically handles the POST action on the server.

## Future Enhancements

- Add pagination with URL params
- Add debouncing for search input
- Add loading states during filter changes
- Add error boundaries for API failures
- Add optimistic updates for form submissions

