# SEPA Direct Debit Generator

A web application for generating SEPA (Single Euro Payments Area) direct debit XML files for clubs and organizations.

Please note: This project has been generated with the help of bold.diy and Claude Code.

## What It Does

This application streamlines the process of creating standardized SEPA direct debit files for collecting membership fees or other regular payments. It allows clubs and organizations to:

1. Import member data from CSV or Excel files
2. Map spreadsheet columns to required SEPA fields
3. Validate banking information (IBAN, BIC)
4. Generate valid SEPA XML files that can be uploaded to banking systems

## Main Features

- **Multi-step workflow** with a guided process for generating SEPA direct debits
- **File import** supporting CSV and Excel formats
- **Flexible column mapping** to accommodate different spreadsheet structures
- **Data validation** for IBAN, BIC, and creditor ID with helpful error messages
- **Preview of member data** before XML generation
- **XML generation** following the SEPA Direct Debit standard (pain.008.001.02)
- **Multilingual support** for English and German
- **Responsive design** that works on mobile and desktop devices

## Technologies Used

- **Frontend**: React with TypeScript
- **UI Framework**: Tailwind CSS
- **Build Tool**: Vite
- **Form Validation**: Zod for schema validation
- **File Parsing**: PapaParse for CSV, read-excel-file for Excel
- **SEPA Generation**: sepa.js library
- **Internationalization**: i18next and react-i18next

## Project Structure

```
/src
  /components        # React components for each step of the process
  /locales           # Translation files for i18n (en/de)
  /types             # TypeScript types and Zod schemas
  /utils             # Utility functions for validation, parsing, and XML generation
  App.tsx            # Main application component
  main.tsx           # Application entry point
```

## How It Works

The application follows a 5-step workflow:

1. **Club Information**: Enter club details, IBAN, BIC, creditor ID, and payment information
2. **File Upload**: Import member data from a CSV or Excel file
3. **Column Mapping**: Map spreadsheet columns to required SEPA fields
4. **Preview**: Review and verify imported member data
5. **Generate XML**: Create the SEPA XML file and download it

The application handles various aspects of SEPA direct debit generation:
- IBAN and BIC validation with checksums
- Proper formatting of mandate references
- Date handling for execution and mandate dates
- Currency formatting based on locale
- XML generation according to SEPA standards

## Development

```bash
# Install dependencies
npm

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```