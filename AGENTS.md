# AGENTS.md - Coding Guidelines for AI Agents

## Project Overview

This is a Next.js 15 blog system with TypeScript, Tailwind CSS, and MDX/Markdown support.

## Build Commands

```bash
# Development
npm run dev                 # Start development server on http://localhost:3000

# Build
npm run build              # Generate search index + build static site to dist/
npm run generate-index     # Generate search-index.json only

# Linting
npm run lint               # Run ESLint on all files
npx eslint src/app/page.tsx # Lint specific file

# Production
npm run start              # Start production server (after build)
```

## Code Style Guidelines

### TypeScript

- Use strict TypeScript (`strict: true` in tsconfig.json)
- Always define explicit return types for functions
- Use interfaces for object types, type for unions/aliases
- Prefer `interface` over `type` for extensibility

```typescript
// Good
interface Post {
  slug: string
  title: string
  date: string
}

export async function getAllPosts(): Promise<Post[]> {
  // implementation
}
```

### Imports

- Use `@/*` alias for src directory imports
- Group imports: React/Next → Third-party → Local
- Use named imports when possible

```typescript
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Fuse from 'fuse.js'
import { SearchBox } from '@/components/SearchBox'
import { getAllPosts } from '@/lib/posts'
```

### Naming Conventions

- Components: PascalCase (e.g., `SearchBox.tsx`)
- Functions: camelCase (e.g., `getAllPosts`)
- Constants: UPPER_SNAKE_CASE for true constants
- Files: camelCase for utilities, PascalCase for components
- Types/Interfaces: PascalCase with descriptive names

### Component Structure

```typescript
'use client'  // For client components only

import { useState } from 'react'

interface Props {
  title: string
}

export function ComponentName({ title }: Props) {
  const [state, setState] = useState('')
  
  return <div>{title}</div>
}
```

### Error Handling

- Use try-catch for async operations
- Return null or default values on failure, not undefined
- Log errors with descriptive messages

```typescript
try {
  const data = await fetchData()
  return data
} catch (error) {
  console.error('Failed to fetch data:', error)
  return null
}
```

### Styling (Tailwind CSS)

- Use Tailwind utility classes
- Support dark mode with `dark:` prefix
- Use arbitrary values sparingly
- Group related classes

```tsx
<div className="bg-white dark:bg-gray-800 
                text-gray-900 dark:text-gray-100
                rounded-lg p-4">
```

### File Organization

```
src/
  app/              # Next.js App Router pages
    blog/[slug]/    # Dynamic blog post pages
    page.tsx        # Home page
    layout.tsx      # Root layout
  components/       # React components
  lib/              # Utility functions
content/blog/       # Markdown/MDX blog posts
public/             # Static assets
scripts/            # Build scripts
```

### Blog Post Format

```markdown
---
title: "Post Title"
date: "2025-02-14"
excerpt: "Brief description"
tags: ["tag1", "tag2"]
author: "Author Name"
---

# Content here
```

### Static Export Configuration

- All dynamic routes must use `generateStaticParams()`
- API routes not supported in static export
- Use `export const dynamic = 'force-static'` for route handlers

### Comments

- Use Chinese for all code comments
- Use JSDoc for public functions
- Keep comments concise and meaningful

```typescript
// 计算阅读时间（假设每分钟阅读 200 字）
const readingTime = Math.ceil(wordCount / 200)
```

### Git

- No specific commit message format required
- Do not modify git config
- Do not create commits unless explicitly requested
