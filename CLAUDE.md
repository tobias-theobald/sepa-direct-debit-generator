# SEPA Project Developer Guide

## Build & Development Commands
- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn lint` - Run ESLint on all files
- `yarn preview` - Preview production build locally

## Code Style Guidelines
- **TypeScript:** Use strict type checking with Zod for schema validation
- **Imports:** Group imports by type (React, components, types, utils)
- **Components:** React functional components with useState/useEffect hooks
- **Naming:** PascalCase for components, camelCase for functions/variables
- **Types:** Define types in /src/types, use z.infer for Zod schemas
- **Error Handling:** Use Zod validation with helpful error messages
- **Formatting:** Follow ESLint rules, use modern ES features
- **CSS:** Use Tailwind utility classes for styling

## Architecture
- Multi-step form flow with component-based structure
- Strong type validation with Zod
- Form data processing with CSV/Excel parsing and SEPA XML generation