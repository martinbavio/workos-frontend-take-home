# Project Instructions for Claude

## Project Overview

This is a React application built with Vite, TypeScript, and designed to use Radix UI for component primitives.

## Tech Stack

- **Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Language**: TypeScript 5.9.3
- **Data Fetching**: React Query (TanStack Query) - for server state management and API communication
- **UI Components**:
  - Radix UI Primitives (accessible, unstyled component primitives)
  - Radix Themes (pre-styled component system for rapid UI development)
- **Styling**: CSS (with potential for CSS Modules or styled-components)

## Project Structure

```
workos-frontend-take-home/
├── client/              # Frontend React application (ALL WORK HAPPENS HERE)
│   ├── src/
│   │   ├── App.tsx      # Main application component
│   │   ├── App.css      # Application styles
│   │   ├── main.tsx     # Application entry point
│   │   ├── index.css    # Global styles
│   │   └── assets/      # Static assets
│   ├── package.json     # Project dependencies and scripts
│   ├── vite.config.ts   # Vite configuration
│   ├── tsconfig.json    # TypeScript configuration
│   └── eslint.config.js # ESLint configuration
└── server/              # Backend API (DO NOT MODIFY - READ ONLY)
    └── ...              # Working backend - treat as external service
```

## CRITICAL: Server Folder Rules

**⚠️ DO NOT MODIFY THE `/server` FOLDER UNDER ANY CIRCUMSTANCES ⚠️**

- The `/server` folder contains a working backend API
- Treat it as an external, read-only service
- All development work must be done in the `/client` folder
- If you need to understand API endpoints, you may read server files but NEVER modify them

## Backend API Reference

The backend API runs on **http://localhost:3002** (configurable via `SERVER_PORT` env var).

### Data Models

#### User
```typescript
interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  first: string;
  last: string;
  roleId: string;
  photo?: string;
}
```

#### Role
```typescript
interface Role {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  description?: string;
  isDefault: boolean;
}
```

#### PagedData
```typescript
interface PagedData<T> {
  data: T[];
  next: number | null;  // Next page number or null
  prev: number | null;  // Previous page number or null
  pages: number;        // Total number of pages
}
```

### API Endpoints

#### Users

##### `GET /users`
Get paginated list of users.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `search` (optional): Search term (searches in `first` and `last` fields)

**Response:** `PagedData<User>`

**Example:**
```typescript
// Fetch first page
fetch('http://localhost:3002/users')

// Fetch second page
fetch('http://localhost:3002/users?page=2')

// Search for users
fetch('http://localhost:3002/users?search=john')
```

##### `GET /users/:id`
Get a specific user by ID.

**Response:** `User` or `404 Not Found`

**Example:**
```typescript
fetch('http://localhost:3002/users/abc-123')
```

##### `POST /users`
Create a new user.

**Request Body:**
```typescript
{
  first: string;      // Required
  last: string;       // Required
  roleId: string;     // Required - must be a valid role ID
}
```

**Response:** `User` (with auto-generated `id`, `createdAt`, `updatedAt`, and `photo`)

**Errors:**
- `400 Bad Request` - Missing required field (e.g., "Missing required field: first") or invalid roleId ("Referenced role not found")

**Example:**
```typescript
fetch('http://localhost:3002/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    first: 'John',
    last: 'Doe',
    roleId: 'role-123'
  })
})
```

##### `PATCH /users/:id`
Update an existing user.

**Request Body (all optional):**
```typescript
{
  first?: string;
  last?: string;
  roleId?: string;  // Must be a valid role ID
}
```

**Response:** `User` (with updated `updatedAt`)

**Errors:**
- `404 Not Found` - User not found
- `400 Bad Request` - Referenced role not found

**Example:**
```typescript
fetch('http://localhost:3002/users/abc-123', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ first: 'Jane' })
})
```

##### `DELETE /users/:id`
Delete a user.

**Response:** `User` (the deleted user)

**Errors:**
- `404 Not Found` - User not found

**Example:**
```typescript
fetch('http://localhost:3002/users/abc-123', {
  method: 'DELETE'
})
```

#### Roles

##### `GET /roles`
Get paginated list of roles.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `search` (optional): Search term (searches in `name` and `description` fields)

**Response:** `PagedData<Role>`

**Example:**
```typescript
// Fetch first page
fetch('http://localhost:3002/roles')

// Search for roles
fetch('http://localhost:3002/roles?search=admin')
```

##### `GET /roles/:id`
Get a specific role by ID.

**Response:** `Role` or `404 Not Found`

**Example:**
```typescript
fetch('http://localhost:3002/roles/role-123')
```

##### `POST /roles`
Create a new role.

**Request Body:**
```typescript
{
  name: string;            // Required - must be unique
  description?: string;    // Optional
  isDefault?: boolean;     // Optional (default: false)
}
```

**Response:** `Role` (with auto-generated `id`, `createdAt`, `updatedAt`)

**Errors:**
- `400 Bad Request` - Missing name or duplicate name

**Notes:**
- If `isDefault: true`, the previously default role will be unset

**Example:**
```typescript
fetch('http://localhost:3002/roles', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Administrator',
    description: 'Full system access',
    isDefault: false
  })
})
```

##### `PATCH /roles/:id`
Update an existing role.

**Request Body (all optional):**
```typescript
{
  name?: string;         // Must be unique
  description?: string;
  isDefault?: boolean;   // Can only set to true, not false
}
```

**Response:** `Role` (with updated `updatedAt`)

**Errors:**
- `404 Not Found` - Role not found
- `400 Bad Request` - Duplicate name or attempting to unset default

**Notes:**
- Cannot set `isDefault: false` (use `PATCH` on another role with `isDefault: true` instead)
- If setting `isDefault: true`, the previously default role will be unset

**Example:**
```typescript
fetch('http://localhost:3002/roles/role-123', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'Super Admin',
    isDefault: true
  })
})
```

##### `DELETE /roles/:id`
Delete a role.

**Response:** `Role` (the deleted role)

**Errors:**
- `404 Not Found` - Role not found
- `400 Bad Request` - Attempting to delete the default role

**Notes:**
- Cannot delete the default role
- All users assigned to this role will be reassigned to the default role

**Example:**
```typescript
fetch('http://localhost:3002/roles/role-123', {
  method: 'DELETE'
})
```

## Development Commands

**All commands must be run from the `/client` directory:**

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build for production (TypeScript check + Vite build)
- `npm run lint` - Run ESLint to check code quality
- `npm run preview` - Preview production build locally

## UI Component Guidelines

### Radix Themes for Figma-to-Code Workflow

**Radix Themes is the primary UI component library for this project.** When translating Figma designs to React components:

1. **Analyze the Figma design** - Identify UI patterns, layouts, and components
2. **Map to Radix Themes components** - Look for matching components in Radix Themes
3. **Use Theme components first** - Radix Themes provides pre-styled, accessible components
4. **Customize as needed** - Use theming and CSS to match Figma designs exactly

#### Installing Radix Themes

```bash
cd client
npm add @radix-ui/themes
```

Then wrap your app with the Theme provider:

```tsx
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

function App() {
  return (
    <Theme>
      {/* Your app content */}
    </Theme>
  );
}
```

#### Common Radix Themes Components

Radix Themes includes pre-styled versions of common UI elements:

- **Layout**: `Box`, `Flex`, `Grid`, `Container`, `Section`
- **Typography**: `Text`, `Heading`, `Code`, `Em`, `Strong`
- **Forms**: `TextField`, `TextArea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Slider`
- **Actions**: `Button`, `IconButton`, `Link`
- **Data Display**: `Badge`, `Card`, `Table`, `Avatar`, `Callout`, `Quote`
- **Overlays**: `Dialog`, `AlertDialog`, `DropdownMenu`, `ContextMenu`, `HoverCard`, `Popover`, `Tooltip`
- **Navigation**: `Tabs`
- **Feedback**: `Spinner`, `Progress`

#### Figma-to-Radix Themes Mapping Strategy

When implementing a Figma design:

1. **Identify layout structure** → Use `Flex`, `Grid`, or `Box` components
2. **Text elements** → Use `Text` or `Heading` with appropriate size variants
3. **Buttons** → Use `Button` component with variant props (solid, soft, outline, ghost)
4. **Form inputs** → Use `TextField`, `Select`, `Checkbox`, etc.
5. **Cards/Containers** → Use `Card` component
6. **Spacing** → Use Radix Themes spacing scale (e.g., `p="4"`, `m="2"`)
7. **Colors** → Use Radix Themes color system or customize the theme

#### Example: Translating a Figma Card

```tsx
import { Card, Flex, Text, Button, Avatar } from '@radix-ui/themes';

function UserCard({ name, email, avatarUrl }) {
  return (
    <Card>
      <Flex direction="column" gap="3">
        <Flex align="center" gap="3">
          <Avatar src={avatarUrl} fallback={name[0]} />
          <Flex direction="column">
            <Text size="3" weight="bold">{name}</Text>
            <Text size="2" color="gray">{email}</Text>
          </Flex>
        </Flex>
        <Button>View Profile</Button>
      </Flex>
    </Card>
  );
}
```

### Radix UI Primitives (When to Use)

Use Radix UI Primitives when:

1. **Radix Themes doesn't have the component** you need
2. **You need full styling control** without Theme defaults
3. **Building highly custom components** that don't match Theme patterns

When building UI components with primitives, prefer Radix UI for:

1. **Accessibility**: Radix UI components are built with accessibility in mind
2. **Unstyled**: They provide functionality without imposing styles
3. **Composability**: Build custom components by composing primitives

#### Common Radix UI Packages

Install as needed (from `/client` directory):

```bash
npm add @radix-ui/react-dialog
npm add @radix-ui/react-dropdown-menu
npm add @radix-ui/react-select
npm add @radix-ui/react-tabs
npm add @radix-ui/react-tooltip
npm add @radix-ui/react-popover
npm add @radix-ui/react-accordion
npm add @radix-ui/react-checkbox
npm add @radix-ui/react-radio-group
npm add @radix-ui/react-switch
```

#### Example Usage Pattern

```tsx
import * as Dialog from '@radix-ui/react-dialog';

function MyDialog() {
  return (
    <Dialog.Root>
      <Dialog.Trigger>Open Dialog</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <Dialog.Title>Dialog Title</Dialog.Title>
          <Dialog.Description>
            Dialog description here
          </Dialog.Description>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

## Code Style Guidelines

### TypeScript

- Use TypeScript for all new files
- Define proper types and interfaces (avoid `any`)
- Use type inference where appropriate
- Export types that may be reused

### React

- Use functional components with hooks
- Prefer named exports for components
- Use proper TypeScript types for props
- Follow React 19 best practices
- Use `StrictMode` (already enabled in main.tsx)

### Component Organization

```tsx
// 1. Imports
import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import './ComponentName.css';

// 2. Types/Interfaces
interface ComponentProps {
  title: string;
  onClose: () => void;
}

// 3. Component
export function ComponentName({ title, onClose }: ComponentProps) {
  // 4. Hooks
  const [state, setState] = useState(false);

  // 5. Handlers
  const handleClick = () => {
    setState(true);
  };

  // 6. Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
}
```

### File Naming

- Components: `ComponentName.tsx`
- Styles: `ComponentName.css`
- Types: `types.ts` or inline in component files
- Utils: `utilName.ts`

## Styling Approach

1. **Use CSS custom properties** for theming and consistent values
2. **Scope styles** to components using CSS Modules or unique class names
3. **Style Radix UI primitives** by targeting their data attributes or adding custom classes
4. **Maintain accessibility** - don't remove focus indicators without providing alternatives

## API Communication with React Query

**React Query (TanStack Query) is the primary tool for communicating with the backend API.**

### Installation

```bash
cd client
npm add @tanstack/react-query
```

### Setup

Wrap your app with the QueryClientProvider:

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Your app content */}
    </QueryClientProvider>
  );
}
```

### Usage Patterns

#### Fetching Data (useQuery)

```tsx
import { useQuery } from '@tanstack/react-query';

interface User {
  id: string;
  name: string;
  email: string;
}

function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json() as Promise<User>;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>{data.name}</h1>
      <p>{data.email}</p>
    </div>
  );
}
```

#### Mutations (useMutation)

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreateUserForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newUser: { name: string; email: string }) => {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });
      if (!response.ok) throw new Error('Failed to create user');
      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch user list
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutation.mutate({
      name: formData.get('name') as string,
      email: formData.get('email') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Creating...' : 'Create User'}
      </button>
      {mutation.isError && <div>Error: {mutation.error.message}</div>}
    </form>
  );
}
```

#### Organizing API Functions

Create a separate `api` directory for API functions:

```tsx
// src/api/users.ts
export async function fetchUsers() {
  const response = await fetch('/api/users');
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

export async function fetchUser(userId: string) {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
}

// src/hooks/useUsers.ts
import { useQuery } from '@tanstack/react-query';
import { fetchUsers } from '../api/users';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });
}
```

### Best Practices

1. **Define Query Keys Consistently**: Use arrays with hierarchical structure
   - `['users']` - all users
   - `['users', userId]` - specific user
   - `['users', userId, 'posts']` - user's posts

2. **Type Your API Responses**: Always define TypeScript interfaces for API data

3. **Handle Loading and Error States**: Provide good UX for all states

4. **Use Query Invalidation**: After mutations, invalidate related queries to keep data fresh

5. **Organize API Logic**: Keep API functions separate from components

6. **Configure Sensible Defaults**: Set staleTime, cacheTime, and retry options globally

## State Management

- **Server State**: Use React Query for all API data and server state
- **Client State**: Use React's built-in hooks (`useState`, `useReducer`, `useContext`)
- **Global Client State**: Use Context API when needed
- Consider state management libraries only when complexity requires it

## Important Notes

- **Accessibility First**: Always ensure components are keyboard navigable and screen-reader friendly
- **Type Safety**: Leverage TypeScript's type system to catch errors early
- **Performance**: Use React.memo, useMemo, and useCallback judiciously
- **Testing**: Write tests for complex logic and user interactions (when test framework is added)

## Adding New Features

1. Identify required Radix UI components
2. Install necessary packages
3. Create component file with proper TypeScript types
4. Style the component appropriately
5. Test accessibility (keyboard navigation, screen readers)
6. Update this documentation if adding new patterns

## Resources

- [React Documentation](https://react.dev)
- [TanStack Query (React Query) Documentation](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Radix Themes Documentation](https://www.radix-ui.com/themes/docs/overview/getting-started)
- [Radix UI Primitives Documentation](https://www.radix-ui.com/primitives/docs/overview/introduction)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Vite Documentation](https://vite.dev)
