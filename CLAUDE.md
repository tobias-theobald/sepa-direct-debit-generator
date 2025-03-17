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
- Each step's state is maintained at the App level and passed down via props

## Internationalization (i18n)
- Uses react-i18next and i18next for translations
- All UI text is stored in translation files: `/src/locales/{en|de}/translation.json`
- Use the useTranslation hook at the top level of components: `const { t } = useTranslation()`
- Access translations with the t() function: `t('namespace.key')`
- Namespaces follow component/feature structure (e.g., fileUpload, clubInfo, etc.)
- For conditional text based on language: `const locale = i18n.language === 'de' ? 'de-DE' : 'en-US'`
- Support for English and German, with language switcher component

## Responsive Design Patterns
- Mobile-first approach with Tailwind breakpoints (sm:, md:, etc.)
- Component-specific mobile adaptations:
  - Hide page titles on mobile with `hidden sm:block`
  - Stack buttons vertically with `flex-col sm:flex-row`
  - Reorder elements with `order-1 order-2` classes
  - Abbreviate table content on small screens
  - Use responsive text sizes: `text-sm md:text-base`
- Custom mobile components like the radial stepper indicator
- Use `justify-center` for better alignment on mobile
- Tables use `-mx-4 sm:mx-0` for full width on mobile

## SEPA-Specific Logic
- IBAN validation with checksum verification
- BIC format validation
- Mandate reference combining (prefix from club + suffix from member)
- XML generation following SEPA Direct Debit standard
- CSV/Excel parsing with flexible column mapping
- Date handling:
  - Execution date (Ausführungsdatum) is calculated as current date + number of days in future
  - Mandate dates from imported member data
- Currency formatting with locale-specific patterns