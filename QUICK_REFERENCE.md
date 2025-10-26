# CROW - Quick Reference

## What is CROW?

A highly configurable TypeScript-powered data grid for React that can display data in multiple modes:

```
┌─────────────────────────────────────────────────────────────┐
│                    CROW Data Grid                            │
├─────────────────────────────────────────────────────────────┤
│  📸 Fullbleed Gallery  │  📊 Spreadsheet  │  ✏️ Workflow     │
│  Square image grid     │  Excel-like      │  Editable cells  │
│  Click for modals      │  Sortable        │  Planning tool   │
│                        │  Searchable      │                  │
├─────────────────────────────────────────────────────────────┤
│  📋 Nested Lists       │  🔧 Custom       │  💾 Export       │
│  Hierarchical data     │  Your config     │  CSV, JSON, etc  │
│  Expand/collapse       │  Flexible API    │                  │
└─────────────────────────────────────────────────────────────┘
```

## Display Modes

### 1. Fullbleed Gallery
```typescript
displayMode: 'fullbleed'
```
- Borderless image grid
- Click handlers for each cell
- Modal overlay for details
- Perfect for: Photo galleries, product catalogs, media libraries

### 2. Spreadsheet
```typescript
displayMode: 'spreadsheet'
```
- Excel/Google Sheets style
- Sortable column headers
- Search and filter
- Perfect for: Data tables, reports, admin panels

### 3. Workflow/Planning
```typescript
displayMode: 'workflow'
```
- Inline editable cells
- Date pickers, dropdowns
- Save/cancel actions
- Perfect for: Task managers, project planning, CRM

### 4. Nested Lists
```typescript
displayMode: 'nested-list'
```
- Hierarchical data
- Expand/collapse rows
- Unlimited depth
- Perfect for: File explorers, org charts, category trees

## Quick Start

```typescript
import { GridContainer } from './components/DataGrid';
import { createSpreadsheetDataProvider } from './services/mockDataProviders';
import type { GridConfig, RowData, DataProvider } from './types';

const config: GridConfig<RowData> = {
  columns: [
    { key: 'id', header: 'ID', width: '80px', sortable: true },
    { key: 'name', header: 'Name', width: '200px', sortable: true },
    { key: 'email', header: 'Email', width: '250px', sortable: true },
  ],
  displayMode: 'spreadsheet',
  features: {
    sorting: { enabled: true },
    pagination: { enabled: true, pageSize: 20 },
  }
};

const dataProvider = createSpreadsheetDataProvider(0) as unknown as DataProvider<RowData>;

<GridContainer config={config} dataProvider={dataProvider} />
```

## Key Features

| Feature | Description | Status |
|---------|-------------|--------|
| 🎨 Multiple Display Modes | Switch between 4+ view modes | Planned |
| ⚡ Virtual Scrolling | Handle 10,000+ rows | Phase 4 (Next) |
| 🔧 Configurable API | Declarative configuration | ✅ Complete |
| 📊 Data Agnostic | Works with any JSON API | ✅ Complete |
| 🔄 Sorting | Multi-column sorting | ✅ Complete |
| 📄 Pagination | Page controls & row selector | ✅ Complete |
| 💾 Export | CSV, JSON export | Planned |
| 🎭 Smooth Animations | Elegant transitions | Planned |
| 📝 TypeScript First | Full type safety | In Progress |
| ♿ Accessible | WCAG compliant | Planned |

## Architecture at a Glance

```
User Configuration
        ↓
    DataGrid Component
        ↓
    ┌───┴────┬─────────┬──────────┐
    │        │         │          │
  Header   Body    Features   Virtual
    │        │         │       Scroller
    │        ↓         ↓          │
    │     Rows ← Sort/Filter      │
    │        ↓         ↓          │
    └───→  Cells ← Renderers ←───┘
            ↓
       Data Provider
```

## File Structure

```
src/
├── components/DataGrid/    # Core grid components
├── features/               # Sorting, filtering, editing, etc.
├── demo/                   # Demo pages for each mode
├── types/                  # TypeScript definitions
├── services/               # Data providers, export engine
├── hooks/                  # Custom React hooks
├── utils/                  # Helper functions
└── data/                   # Mock data for demos
```

## Development Phases

| Phase | Focus | Status |
|-------|-------|--------|
| 0 | Setup & Planning | ✅ Complete |
| 1 | Type System | ⏳ Next |
| 2 | Mock Data | 📋 Planned |
| 3 | Core Grid | 📋 Planned |
| 4 | Virtual Scrolling | 📋 Planned |
| 5-8 | Display Modes | 📋 Planned |
| 9 | Filtering/Search | 📋 Planned |
| 10 | Export | 📋 Planned |
| 11 | Polish | 📋 Planned |
| 12 | Demo Site | 📋 Planned |
| 13 | Testing | 📋 Planned |
| 14 | Release | 📋 Planned |

## Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm run test             # Run tests in watch mode
npm run test:ui          # Run tests with UI
npm run test:coverage    # Generate coverage report

# Code Quality
npm run lint             # Run ESLint
```

## Type System Preview

```typescript
// Core types
type CellValue = string | number | boolean | null | undefined;
type RowData = Record<string, CellValue>;
type DisplayMode = 'fullbleed' | 'spreadsheet' | 'workflow' | 'nested-list';

// Configuration
interface GridConfig<T extends RowData> {
  columns: ColumnDefinition<T>[];
  displayMode: DisplayMode;
  features?: GridFeatures;
}

// Column definition
interface ColumnDefinition<T> {
  key: keyof T;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  editable?: boolean;
  renderer?: CellRenderer<T>;
}
```

## Resources

- 📖 [README.md](./README.md) - Getting started
- 🏗️ [ARCHITECTURE.md](./ARCHITECTURE.md) - System design
- 📋 [PLANNING.md](./PLANNING.md) - Development roadmap
- ✅ [PHASE_0_COMPLETE.md](./PHASE_0_COMPLETE.md) - Setup completion

## Current Status

**Phase 0 Complete! ✅**

- ✅ Documentation created
- ✅ Dependencies installed
- ✅ Directory structure ready
- ✅ Testing framework configured
- ✅ Build verified
- ⏳ Ready for Phase 1

---

**Next:** Begin Phase 1 - Type System & Core Interfaces
