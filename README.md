# CROW - Configurable React Operational Workspace

A highly flexible, TypeScript-powered data grid system for React that adapts to multiple display modes and use cases.

## Overview

CROW is a demonstration of a versatile data grid component that can be configured to display data in various formats:

- **Fullbleed Gallery Mode**: Borderless image grid with click handlers and modal support
- **Spreadsheet Mode**: Excel/Sheets-like interface with sortable headers and searchable data
- **Nested List Mode**: Tree/hierarchical data display with ASCII connectors and expand/collapse
- **Workflow/Planning Mode**: Editable cells for task management and planning applications  
- **Custom Modes**: Fully extensible to support any custom data presentation needs

## Key Features

- 🎨 **Multiple Display Modes**: Switch between gallery, nested list, spreadsheet, and workflow views
- 🌲 **Tree Diagrams**: ASCII-style tree connectors (├──, │, └──) for hierarchical data visualization
- ⚡ **Virtual Scrolling**: Handles 10,000+ rows with smooth 60fps performance
- 🔧 **Highly Configurable**: Declarative API for customizing every aspect
- 📊 **Data Agnostic**: Works with any JSON data source (API, mock, local)
- 🚀 **Smart Rendering**: Only ~20 visible rows rendered at any time
- 🎯 **Synchronized Scrolling**: Headers scroll perfectly with body content
- ✅ **Row Selection**: Multi-select with checkboxes, shift-click ranges, export selected
- 📤 **Export Capability**: CSV and Excel export with no external dependencies
- 🔍 **Advanced Filtering**: Type-aware filters (text, select, number, date) with debouncing
- 🔄 **Expand/Collapse**: Interactive tree navigation with keyboard support
- 🎭 **Smooth Animations**: GPU-accelerated transforms for optimal performance
- 📝 **TypeScript First**: Full type safety and IntelliSense support
- ♿ **Accessible**: WCAG compliant with keyboard navigation and ARIA attributes
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
│   ├── DataGrid/          # Core grid components (19 files)
│   │   ├── GridContainer.tsx      # Main orchestrator
│   │   ├── GridContext.tsx        # State management
│   │   ├── GridHeader.tsx         # Sortable column headers
│   │   ├── GridBody.tsx           # Row container with virtualization + gallery mode
│   │   ├── VirtualScroller.tsx    # Virtual scrolling engine
│   │   ├── GridRow.tsx            # Individual row rendering
│   │   ├── GridCell.tsx           # Cell with formatters
│   │   ├── ImageCell.tsx          # Gallery mode image cell
│   │   ├── ImageModal.tsx         # Full-screen image viewer
│   │   ├── ColumnFilter.tsx       # Type-aware column filters
│   │   └── GridPagination.tsx     # Pagination controls
│   ├── features/          # Feature modules (planned)
│   └── demo/              # Demo pages
│       ├── VirtualScrollDemo.tsx  # 10K row demo
│       └── GalleryDemo.tsx        # Fullbleed gallery mode demo
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
│   ├── dataTransforms.ts  # Sort, filter, paginate
│   └── exportUtils.ts     # CSV & Excel export
└── data/                  # Mock datasets
    ├── mockLargeDataset.ts # 1K-100K row generator
    ├── mockSpreadsheet.ts  # Employee demo data
    └── mockImages.ts       # Gallery mode image data (25 images)
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

**Phase 7 COMPLETE** ✅ - Gallery Mode 🎉

**Completed Phases:**
- ✅ Phase 0: Project setup & tooling
- ✅ Phase 1: Type system (75+ types, strict TypeScript)
- ✅ Phase 2: Mock data & DataProvider architecture
- ✅ Phase 3: Core grid (sorting, pagination)
- ✅ Phase 4: Virtual scrolling (10K rows, 60fps performance)
- ✅ Phase 5: Column filtering + CSV/Excel export + Row selection
- ✅ Phase 7: Fullbleed gallery mode with image modal viewer

**Current Status:**
- 167 tests passing (146 grid + 21 gallery tests)
- Virtual scrolling demo with 10,000 employee records
- **Fullbleed gallery mode** with CSS Grid responsive layout
- **ImageCell** with lazy loading, error handling, and loading states
- **ImageModal** full-screen viewer with metadata panel
- Enhanced image URL detection (Unsplash, Pexels, file extensions)
- Type-aware column filters (text, select, number, date)
- Row selection with checkboxes, multi-select, shift-click ranges
- CSV and Excel export (no external dependencies)
- Export selected rows or all data
- Smooth 60fps scrolling with GPU acceleration
- Synchronized horizontal scroll between headers and body
- Custom themed scrollbars matching brand palette
- Only ~20 rows rendered at any time (memory efficient)

**Live Demos**: 
Run `npm run dev` and visit http://localhost:5173 to see:
- **Gallery Mode**: 25 professional images in responsive fullbleed layout
  - Click images to open full-screen modal viewer
  - View metadata (photographer, description, tags, date)
  - Keyboard navigation (Tab, Enter, Escape)
  - Progressive image loading with spinners
- **Virtual Scrolling**: 10,000 rows with instant rendering
  - 14 sortable and filterable columns with formatted data
  - Row selection with checkboxes (select all, shift-click ranges)
  - Selection counter and clear button
  - Export buttons for CSV and Excel (selected or all rows)
  - Horizontal and vertical scrolling
  - Real-time performance metrics display
  - Earthy warm color palette (chamoisee, van-dyke, champagne, bistre, beaver)

See [PLANNING.md](./PLANNING.md) for detailed roadmap and [PHASE_5_COMPLETE.md](./PHASE_5_COMPLETE.md) for Phase 5 details.

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
