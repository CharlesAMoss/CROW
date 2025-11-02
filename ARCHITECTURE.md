# CROW Architecture

## System Overview

CROW is designed as a modular, composable data grid system that prioritizes flexibility, type safety, and performance.

## Core Architecture Principles

1. **Declarative Configuration**: Simple, declarative config objects passed to the grid component
2. **Type-Driven Development**: Leverage TypeScript's type system for compile-time guarantees
3. **Component-Based Rendering**: React components for custom cell renderers
4. **Hybrid State Management**: Support both controlled and uncontrolled patterns
5. **Performance First**: Virtual scrolling + optional pagination for datasets <1000 rows typical
6. **Developer Experience**: Simple API with powerful customization options

## Key Decisions (Confirmed)

- ✅ **Performance**: Virtualization + minimal pagination (typical use: <1000 rows)
- ✅ **Configuration**: Declarative config objects
- ✅ **Cell Renderers**: React components
- ✅ **State Management**: Hybrid (controlled + uncontrolled)
- ✅ **Demo Site**: Multi-page navigation
- ✅ **Export Formats**: CSV, Excel (.xlsx), PDF
- ✅ **Styling**: CSS Modules

## System Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      Demo Application                        │
│  (Showcase different grid configurations and use cases)     │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                   Grid Configuration API                     │
│  - Column Definitions    - Display Modes                    │
│  - Cell Renderers        - Interaction Handlers             │
│  - Formatters            - Export Configs                   │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Core Grid Component                       │
│  - DataGrid (main component)                                │
│  - GridContext (state management)                           │
│  - Virtual Scroller                                         │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                    Feature Modules                           │
│  - Sorting           - Search/Filter                        │
│  - Inline Editing    - Row Selection                        │
│  - Click Handlers    - Modal System                         │
│  - Nested Data       - Export Engine                        │
└─────────────────────────────────────────────────────────────┘
                              │
┌─────────────────────────────────────────────────────────────┐
│                     Data Layer                               │
│  - Data Provider Interface                                  │
│  - Mock API Service                                         │
│  - Data Transformers                                        │
└─────────────────────────────────────────────────────────────┘
```

## Type System Architecture

### Core Types

```typescript
// Base data types
type CellValue = string | number | boolean | null | undefined;
type RowData = Record<string, CellValue>;

// Grid configuration
interface GridConfig<T extends RowData> {
  columns: ColumnDefinition<T>[];
  displayMode: DisplayMode;
  features?: GridFeatures;
  styling?: GridStyling;
}

// Column definition
interface ColumnDefinition<T extends RowData> {
  key: keyof T;
  header: string;
  width?: string | number;
  sortable?: boolean;
  filterable?: boolean;
  editable?: boolean;
  renderer?: CellRenderer<T>;
  formatter?: CellFormatter<T>;
}

// Display modes
type DisplayMode = 
  | 'fullbleed'    // Gallery view
  | 'spreadsheet'  // Excel-like
  | 'workflow'     // Planning/editable
  | 'nested-list'  // Hierarchical
  | 'custom';

// Cell rendering
type CellRenderer<T> = (props: CellRendererProps<T>) => React.ReactNode;

interface CellRendererProps<T extends RowData> {
  value: CellValue;
  row: T;
  column: ColumnDefinition<T>;
  rowIndex: number;
  columnIndex: number;
}
```

### Feature Types

```typescript
interface GridFeatures {
  sorting?: SortingConfig;
  filtering?: FilteringConfig;
  editing?: EditingConfig;
  selection?: SelectionConfig;
  export?: ExportConfig;
  virtualization?: VirtualizationConfig;
  pagination?: PaginationConfig;
  modal?: ModalConfig;
}

interface SortingConfig {
  enabled: boolean;
  multi?: boolean; // Multi-column sort
  defaultSort?: SortState[];
}

interface EditingConfig {
  enabled: boolean;
  mode: 'inline' | 'modal' | 'row';
  onEdit?: (row: RowData, changes: Partial<RowData>) => void;
}

interface ExportConfig {
  formats: ExportFormat[];
  filename?: string;
  transformers?: Record<ExportFormat, DataTransformer>;
}

type ExportFormat = 'csv' | 'json' | 'xlsx' | 'pdf';

interface PaginationConfig {
  enabled: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
}
```

## Component Architecture

### Core Components

1. **DataGrid**: Main container component
   - Manages grid state via Context
   - Orchestrates child components
   - Handles viewport sizing

2. **GridHeader**: Column headers
   - Sortable column headers
   - Resize handles
   - Filter toggles

3. **GridBody**: Data rows container
   - Virtual scrolling integration
   - Row rendering
   - Cell rendering delegation

4. **GridCell**: Individual cell component
   - Applies cell renderer
   - Handles edit mode
   - Click/interaction handlers

5. **VirtualScroller**: Performance optimization
   - Renders only visible rows
   - Smooth scrolling
   - Dynamic row heights

### Feature Components

1. **GridControls**: Unified control bar (Phase 5)
   - Filter status and clear button
   - Selection status and clear button
   - Scalable pattern for future controls (export, actions, etc.)
   - Only visible when filters or selections active

2. **SelectionColumn**: Row selection (Phase 5)
   - Checkbox column for multi-select
   - Works across all display modes
   - Hidden header checkbox (non-functional Select All)
   - Shift-click range selection, Ctrl-click multi-select

3. **ColumnFilter**: Type-aware filtering (Phase 5)
   - Text, select, number, date input types
   - Debounced updates (300ms)
   - Active state styling
   - Clear button per filter

4. **SortIndicator**: Visual sort state
5. **FilterPanel**: Search and filter UI
6. **EditCell**: Inline editing interface
7. **ExportButton**: Export trigger
8. **ModalOverlay**: Cell detail modal
9. **NestedRow**: Expandable row for hierarchical data

## Data Flow

```
User Action
    │
    ↓
Event Handler
    │
    ↓
Grid Context Update (state change)
    │
    ↓
React Re-render (optimized with memo)
    │
    ↓
Virtual Scroller (calculates visible rows)
    │
    ↓
Cell Renderers (custom or default)
    │
    ↓
UI Update (with animations)
```

## State Management Strategy

### Grid Context
Use React Context + useReducer for grid-level state:
- Sort state
- Filter state
- Selection state
- Edit mode state
- Modal state

### Local Component State
Use useState for:
- Hover states
- Animation triggers
- Temporary UI state

### Props for Configuration
All configuration passed as props:
- Column definitions
- Display mode
- Feature flags
- Callbacks

## Performance Optimizations

1. **Virtual Scrolling**: Only render visible rows (React Window or custom)
2. **Memoization**: React.memo on cells, rows, and expensive computations
3. **Callback Stability**: useCallback for all event handlers
4. **Layout Calculations**: CSS Grid/Flexbox for efficient layouts
5. **Debouncing**: Filter and search inputs
6. **Lazy Loading**: Code-split feature modules

### Styling Strategy

### CSS Modules
Component-scoped styles with CSS Modules:
```css
/* DataGrid.module.css */
.grid {
  display: grid;
  width: 100%;
}

.cell {
  padding: var(--grid-cell-padding);
  border: 1px solid var(--grid-border);
}
```

Usage:
```tsx
import styles from './DataGrid.module.css';

<div className={styles.grid}>
  <div className={styles.cell}>Content</div>
</div>
```

### CSS Custom Properties (Variables)
Define themeable properties:
```css
:root {
  --grid-bg: #ffffff;
  --grid-border: #e0e0e0;
  --grid-header-bg: #f5f5f5;
  --grid-cell-padding: 12px;
  --grid-hover-bg: #f9f9f9;
  --grid-selected-bg: #e3f2fd;
  --grid-transition: 150ms ease-in-out;
}
```

### Component Scoping
- Use CSS modules for component-specific styles
- BEM naming convention for clarity within modules
- Utility classes for common patterns

### Animations
- CSS transitions for hover/selection
- CSS animations for loading states
- React Spring or Framer Motion for complex animations (if needed)

## Display Mode Implementations

### 1. Fullbleed Gallery Mode
- CSS Grid with equal-sized squares
- `object-fit: cover` for images
- Click handler opens modal with row data
- No borders, minimal padding

### 2. Spreadsheet Mode
- Fixed header row
- Sortable columns
- Search bar above grid
- Alternating row colors
- Resizable columns

### 3. Workflow/Planning Mode
- Editable cells (inline editing)
- Save/cancel buttons per row
- Status indicators
- Date pickers, dropdowns for specific fields

### 4. Nested List Mode
- Expand/collapse icons
- Indentation for hierarchy
- Recursive rendering for children
- Breadcrumb navigation

## Data Provider Interface

```typescript
interface DataProvider<T extends RowData> {
  fetch: (params?: QueryParams) => Promise<DataResponse<T>>;
  update?: (id: string, changes: Partial<T>) => Promise<T>;
  create?: (data: T) => Promise<T>;
  delete?: (id: string) => Promise<void>;
}

interface QueryParams {
  page?: number;
  pageSize?: number;
  sort?: SortState[];
  filters?: FilterState[];
  search?: string;
}

interface DataResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
```

## Export Architecture

```typescript
interface ExportEngine {
  export: <T extends RowData>(
    data: T[],
    columns: ColumnDefinition<T>[],
    format: ExportFormat
  ) => Blob;
}

// Format-specific exporters
class CsvExporter implements Exporter {
  export<T>(data: T[], columns: ColumnDefinition<T>[]): Blob;
}

class XlsxExporter implements Exporter {
  export<T>(data: T[], columns: ColumnDefinition<T>[]): Blob;
  // Uses library like 'xlsx' or 'exceljs'
}

class PdfExporter implements Exporter {
  export<T>(data: T[], columns: ColumnDefinition<T>[]): Blob;
  // Uses library like 'jspdf' with autoTable plugin
}
```

### Export Dependencies (to be installed when needed)
- `xlsx` - Excel file generation
- `jspdf` + `jspdf-autotable` - PDF generation

## Testing Strategy

### Unit Tests
- Cell renderers
- Data transformers
- Export functions
- Utility functions

### Component Tests
- Grid rendering with mock data
- Interaction handlers
- Feature toggles
- Display mode switching

### Integration Tests
- Full grid with all features
- Data fetching and display
- Export functionality
- Edit and save workflows

## File Structure

```
src/
├── components/
│   ├── DataGrid/
│   │   ├── DataGrid.tsx
│   │   ├── DataGrid.module.css
│   │   ├── GridContext.tsx
│   │   ├── GridHeader.tsx
│   │   ├── GridBody.tsx
│   │   ├── GridCell.tsx
│   │   └── VirtualScroller.tsx
│   ├── features/
│   │   ├── Sorting/
│   │   ├── Filtering/
│   │   ├── Editing/
│   │   ├── Export/
│   │   ├── Modal/
│   │   └── NestedList/
│   └── demo/
│       ├── FullbleedDemo.tsx
│       ├── SpreadsheetDemo.tsx
│       ├── WorkflowDemo.tsx
│       └── NestedListDemo.tsx
├── types/
│   ├── grid.types.ts
│   ├── config.types.ts
│   ├── feature.types.ts
│   └── data.types.ts
├── services/
│   ├── dataProvider.ts
│   ├── mockApi.ts
│   └── exportEngine.ts
├── hooks/
│   ├── useGrid.ts
│   ├── useSort.ts
│   ├── useFilter.ts
│   └── useVirtualScroll.ts
├── utils/
│   ├── formatters.ts
│   ├── validators.ts
│   └── helpers.ts
└── data/
    ├── mockImages.ts
    ├── mockSpreadsheet.ts
    ├── mockWorkflow.ts
    └── mockNested.ts
```

## Next Steps

See PLANNING.md for phased development approach and milestones.
