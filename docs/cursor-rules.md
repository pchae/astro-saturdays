# Cursor Rules

## File Organization and Modification

1. Always check existing file structure before creating new components or files
2. Prefer modifying existing files over creating new ones when the functionality is similar
3. Follow established patterns in the codebase
4. Keep related files in their designated directories:
   - `/layouts` for page layouts and layout components
   - `/components` for reusable UI components
   - `/lib` for utilities and shared logic
   - `/types` for TypeScript type definitions

## Code Style and Structure

- Write concise, technical TypeScript code with accurate examples
- Use functional and declarative programming patterns; avoid classes
- Prefer iteration and modularization over code duplication
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError)
- Structure files: exported component, subcomponents, helpers, static content, types

## Naming Conventions

- Use lowercase with dashes for directories (e.g., components/auth-wizard)
- Favor named exports for components

## TypeScript Usage

- Use TypeScript for all code; prefer interfaces over types
- Avoid enums; use maps instead
- Use functional components with TypeScript interfaces

## Syntax and Formatting

- Use the "function" keyword for pure functions
- Avoid unnecessary curly braces in conditionals
- Use declarative JSX

## UI and Styling

- Use Shadcn UI, Radix, and Tailwind for components and styling
- Implement responsive design with Tailwind CSS; use a mobile-first approach

## Performance Optimization

- Minimize 'use client', 'useEffect', and 'setState'
- Wrap client components in Suspense with fallback
- Use dynamic loading for non-critical components
- Optimize images: use WebP format, include size data, implement lazy loading 