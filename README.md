# CROW - Configurable React Operational Workspace

A highly flexible, TypeScript-powered data grid system for React that adapts to multiple display modes and use cases.

## Overview

CROW is a demonstration of a versatile data grid component that can be configured to display data in various formats:

- **Fullbleed Gallery Mode**: Borderless image grid with click handlers and modal support
- **Spreadsheet Mode**: Excel/Sheets-like interface with sortable headers and searchable data
- **Workflow/Planning Mode**: Editable cells for task management and planning applications  
- **Nested List Mode**: Hierarchical data display with collapsible sections
- **Custom Modes**: Fully extensible to support any custom data presentation needs

## Key Features

- 🎨 **Multiple Display Modes**: Switch between gallery, spreadsheet, workflow, and list views
- ⚡ **Virtual Scrolling**: Handles 10,000+ rows with smooth 60fps performance
- 🔧 **Highly Configurable**: Declarative API for customizing every aspect
- 📊 **Data Agnostic**: Works with any JSON data source (API, mock, local)
- � **Smart Rendering**: Only ~20 visible rows rendered at any time
- 🎯 **Synchronized Scrolling**: Headers scroll perfectly with body content
- �💾 **Export Capability**: CSV export with extensible format support
- 🎭 **Smooth Animations**: GPU-accelerated transforms for optimal performance
- 📝 **TypeScript First**: Full type safety and IntelliSense support
- ♿ **Accessible**: WCAG compliant with keyboard navigation
- 🎨 **Themeable**: Custom color palettes and styled scrollbars

## Tech Stack

- **React 19** with hooks
- **TypeScript 5.9** for type safety
- **Vite** for fast development and building
- **CSS Custom Properties** for theming
- **Vitest** for testing

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173` to see the demo application.

### Build

```bash
npm run build
```

### Test

```bash
npm run test
```

## Project Structure

```
src/
├── components/
│   ├── DataGrid/          # Core grid components (17 files)
│   │   ├── GridContainer.tsx      # Main orchestrator
│   │   ├── GridContext.tsx        # State management
│   │   ├── GridHeader.tsx         # Sortable column headers
│   │   ├── GridBody.tsx           # Row container with virtualization
│   │   ├── VirtualScroller.tsx    # Virtual scrolling engine
│   │   ├── GridRow.tsx            # Individual row rendering
│   │   ├── GridCell.tsx           # Cell with formatters
│   │   └── GridPagination.tsx     # Pagination controls
│   ├── features/          # Feature modules (planned)
│   └── demo/              # Demo pages
│       └── VirtualScrollDemo.tsx  # 10K row demo
├── types/                 # TypeScript definitions (75+ exports)
│   ├── grid.types.ts      # Core grid types
│   ├── config.types.ts    # Configuration interfaces
│   ├── feature.types.ts   # Feature configs (sorting, pagination, virtualization)
│   └── data.types.ts      # DataProvider interface
├── services/              # Data providers
│   └── InMemoryDataProvider.ts   # CRUD mock provider
├── hooks/                 # Custom React hooks
│   ├── useGridReducer.ts  # State management (17 actions)
│   ├── useVirtualScroll.ts # Virtualization logic
│   └── useDataFetching.ts # Reactive data fetching
├── utils/                 # Helper functions
│   └── dataTransforms.ts  # Sort, filter, paginate
└── data/                  # Mock datasets
    ├── mockLargeDataset.ts # 1K-100K row generator
    └── mockSpreadsheet.ts  # Employee demo data
```

## Documentation

- [Architecture Guide](./ARCHITECTURE.md) - System design and technical decisions
- [Development Plan](./PLANNING.md) - Phased development roadmap
- API Documentation - Coming soon

## Usage Example

```typescript
import { GridContainer } from './components/DataGrid';
import { InMemoryDataProvider } from './services/InMemoryDataProvider';
import type { GridConfig, RowData } from './types';

const config: GridConfig<RowData> = {
  columns: [
    { key: 'id', header: 'ID', width: '80px', sortable: true },
    { key: 'name', header: 'Name', width: '200px', sortable: true },
    { 
      key: 'salary', 
      header: 'Salary', 
      width: '120px',
      sortable: true,
      formatter: (value) => `$${value.toLocaleString()}`
    }
  ],
  displayMode: 'spreadsheet',
  features: {
    sorting: { enabled: true },
    virtualization: {
      enabled: true,
      containerHeight: 600,
      rowHeight: 40,
      overscanCount: 10
    },
    pagination: {
      enabled: false,
      pageSize: 100000  // Fetch all for virtual scrolling
    }
  }
};

const dataProvider = new InMemoryDataProvider({
  data: myLargeDataset,
  getItemId: (item) => item.id,
  delay: 0
});

function MyApp() {
  return (
    <GridContainer 
      config={config} 
      dataProvider={dataProvider}
      initialData={myLargeDataset}
    />
  );
}
```

## Development Status

**Phase 4 COMPLETE** ✅ - Virtual Scrolling with 10,000+ rows

**Completed Phases:**
- ✅ Phase 0: Project setup & tooling
- ✅ Phase 1: Type system (75+ types, strict TypeScript)
- ✅ Phase 2: Mock data & DataProvider architecture
- ✅ Phase 3: Core grid (sorting, pagination, 97 tests)
- ✅ Phase 4: Virtual scrolling (10K rows, 60fps performance)

**Current Status:**
- 106 tests passing
- Virtual scrolling demo with 10,000 employee records
- Smooth 60fps scrolling with GPU acceleration
- Synchronized horizontal scroll between headers and body
- Custom themed scrollbars matching brand palette
- Only ~20 rows rendered at any time (memory efficient)

**Live Demo**: 
Run `npm run dev` and visit http://localhost:5173 to see the virtual scrolling demo featuring:
- 10,000 rows with instant rendering
- 14 sortable columns with formatted data
- Horizontal and vertical scrolling
- Real-time performance metrics display
- Earthy warm color palette (chamoisee, van-dyke, champagne, bistre, beaver)

See [PLANNING.md](./PLANNING.md) for detailed roadmap and [PHASE_4_COMPLETE.md](./PHASE_4_COMPLETE.md) for Phase 4 details.

## License

MIT

---

## ESLint Configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
