# CROW - GitHub Copilot Agent Instructions

## Repository Overview

**CROW** (Configurable React Operational Workspace) is a highly flexible, TypeScript-powered data grid system for React that supports multiple display modes: fullbleed gallery, spreadsheet, workflow/planning, and nested lists. It features virtual scrolling, sorting, filtering, row selection, and export capabilities.

**Size**: Medium (~3,900 lines of production code)  
**Type**: React component library with demo application  
**Stack**: React 19, TypeScript 5.9, Vite 7, Vitest 4, CSS Modules  
**Test Coverage**: 146 tests across 10 test files (all passing)  
**Development Status**: Phase 5 complete (filtering + export + row selection), Phase 6 next (advanced features)

## Critical Build & Validation Commands

### **ALWAYS follow this order when making changes:**

1. **TypeScript compilation** (fastest, catches type errors):
   ```bash
   npx tsc -b
   ```
   - Runs in <1 second
   - Must pass with zero errors before committing
   - Uses composite project refs (tsconfig.json, tsconfig.app.json, tsconfig.node.json)

2. **Tests** (comprehensive, required):
   ```bash
   npx vitest run
   ```
   - Takes ~1.9 seconds
   - Currently 146 tests across 10 files - all must pass
   - Uses jsdom environment for React component testing
   - Coverage reports available with: `npm run test:coverage`

3. **Linting** (has known warnings, see below):
   ```bash
   npm run lint
   ```
   - **KNOWN ISSUES** (safe to ignore for now):
     - 1 error in GridContext.tsx: "react-refresh/only-export-components" (exports useGridContext hook)
     - 6 warnings: "exhaustive-deps" for useEffect/useCallback with JSON.stringify dependencies
   - These are intentional design choices - JSON.stringify used for deep equality checks
   - New code should not introduce additional errors

4. **Production build**:
   ```bash
   npm run build
   ```
   - Runs `tsc -b && vite build`
   - Takes ~1 second
   - Outputs to `dist/` directory
   - Must complete without errors

5. **Development server** (for manual testing):
   ```bash
   npm run dev
   ```
   - Starts Vite dev server on http://localhost:5173
   - Hot Module Replacement (HMR) enabled
   - Press Ctrl+C to stop

### Common Build Issues & Workarounds

**Issue**: VS Code TypeScript server shows import errors but `tsc -b` succeeds  
**Solution**: Restart TypeScript server (Cmd/Ctrl+Shift+P → "Restart TypeScript Server") or ignore - it's a cache issue

**Issue**: Lint warnings about missing dependencies in useEffect  
**Solution**: Safe to ignore - we use `JSON.stringify(state.sort)` for deep equality, which is intentional

**Issue**: Tests fail with "Cannot find module" after adding new files  
**Solution**: Ensure exports are added to index.ts files and imports use correct paths

## Project Structure

```
crow/
├── .github/                     # GitHub configuration (this file)
├── src/
│   ├── components/
│   │   ├── DataGrid/           # Core grid components (19 files)
│   │   │   ├── GridContainer.tsx      # Main orchestrator (controlled/uncontrolled modes)
│   │   │   ├── GridContext.tsx        # React Context for state management
│   │   │   ├── GridHeader.tsx         # Column headers with sorting & Clear All button
│   │   │   ├── GridBody.tsx           # Row container with virtual scrolling
│   │   │   ├── GridRow.tsx            # Individual row rendering
│   │   │   ├── GridCell.tsx           # Cell rendering with formatters
│   │   │   ├── GridPagination.tsx     # Pagination controls
│   │   │   ├── GridDataFetcher.tsx    # Reactive data fetching
│   │   │   ├── ColumnFilter.tsx       # Type-aware filter inputs (NEW)
│   │   │   ├── VirtualScrollContainer.tsx  # Virtual scrolling logic
│   │   │   ├── *.module.css           # CSS modules for each component
│   │   │   └── index.ts               # Public exports
│   │   ├── demo/               # Demo pages
│   │   │   ├── DemoPage.tsx           # Basic spreadsheet demo
│   │   │   ├── VirtualScrollDemo.tsx  # 10K rows with filters (NEW)
│   │   │   └── *.module.css
│   │   └── features/           # Future feature modules (empty for now)
│   ├── types/                  # TypeScript definitions (75+ exports)
│   │   ├── grid.types.ts              # RowData, CellValue, GridState, GridAction (17 actions)
│   │   ├── config.types.ts            # GridConfig, ColumnConfig
│   │   ├── feature.types.ts           # SortingConfig, PaginationConfig, FilterConfig
│   │   ├── data.types.ts              # DataProvider interface, QueryParams
│   │   ├── renderer.types.ts          # CellRenderer component types
│   │   ├── index.ts                   # Central exports
│   │   └── types.test.ts              # Type system tests (15 tests)
│   ├── hooks/
│   │   ├── useGridReducer.ts          # Grid state reducer (17 action types, 24 tests)
│   │   └── useDataFetching.ts         # Data fetching hook
│   ├── services/
│   │   ├── InMemoryDataProvider.ts    # CRUD mock provider (22 tests)
│   │   └── mockDataProviders.ts       # Factory functions for 4 display modes
│   ├── data/                   # Mock datasets
│   │   ├── mockImages.ts              # Gallery mode (25 images)
│   │   ├── mockSpreadsheet.ts         # Employee data (120 rows)
│   │   ├── mockWorkflow.ts            # Task data (60 tasks)
│   │   └── mockNested.ts              # Hierarchical data
│   ├── utils/
│   │   ├── dataTransforms.ts          # sortData, filterData, paginateData (27 tests)
│   │   ├── exportUtils.ts             # CSV/Excel export (20 tests) (NEW)
│   │   └── exportUtils.test.ts        # Export utilities tests
│   ├── test/
│   │   └── setup.ts                   # Vitest configuration
│   ├── App.tsx                 # Main app (renders DemoPage)
│   └── main.tsx                # React entry point
├── public/                     # Static assets
├── dist/                       # Build output (gitignored)
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript project references
├── tsconfig.app.json           # App TypeScript config (strict mode)
├── tsconfig.node.json          # Node/Vite TypeScript config
├── vite.config.ts              # Vite build configuration
├── vitest.config.ts            # Test configuration (jsdom, coverage)
├── eslint.config.js            # ESLint flat config
├── README.md                   # Project overview
├── ARCHITECTURE.md             # System design (456 lines)
├── PLANNING.md                 # Development roadmap (903 lines)
├── QUICK_REFERENCE.md          # Quick API reference
└── PHASE_*_COMPLETE.md         # Phase completion reports
```

## Architecture & Key Patterns

### State Management
- **GridContext** (GridContext.tsx): React Context with useReducer
- **GridAction union**: 17 action types (SET_SORT, ADD_SORT, REMOVE_SORT, SET_FILTER, TOGGLE_SELECT, SET_PAGE, etc.)
- **GridState**: sort[], filters[], expanded Set, selected Set, editing, modal, pagination, loading, error

### Component Patterns
- **Controlled vs Uncontrolled**: GridContainer supports both patterns
  - Controlled: Parent provides `data` and `totalRows` props
  - Uncontrolled: GridContainer fetches via `dataProvider` prop
- **Generic constraints**: All components use `<T extends RowData>` where `RowData = Record<string, CellValue>`
- **CSS Modules**: Every component has `.module.css` file with scoped styles
- **Custom renderers**: Columns accept `renderer` prop (React component) or `formatter` prop (function)

### Type System
- **RowData constraint**: `Record<string, CellValue>` where `CellValue = string | number | boolean | Date | null | undefined`
- **Important**: Mock data interfaces need type casting to RowData (see DemoPage.tsx line 73)
- **DataProvider<T>**: Generic interface with fetch(), create(), update(), delete() methods

### Data Flow
```
User interaction → GridHeader/GridCell → dispatch(action) → GridReducer → GridContext
    ↓
GridDataFetcher watches context → Calls dataProvider.fetch(queryParams) → Updates GridContainer state
    ↓
GridBody/GridRow/GridCell render with new data
```

## Adding New Features - Common Tasks

### Adding a new grid component:
1. Create `ComponentName.tsx` in `src/components/DataGrid/`
2. Create `ComponentName.module.css` for styles
3. Add tests in `ComponentName.test.tsx` or update `GridContext.test.tsx`
4. Export from `src/components/DataGrid/index.ts`
5. Import and use in GridContainer or parent component
6. Run: `npx tsc -b && npx vitest run`

### Adding a new action type:
1. Add to `GridAction` union in `src/types/grid.types.ts`
2. Update `gridReducer` switch statement in `src/hooks/useGridReducer.ts`
3. Add test case in `src/hooks/useGridReducer.test.ts`
4. Dispatch from component: `dispatch({ type: 'ACTION_NAME', payload: value })`
5. Run tests: `npx vitest run`

### Adding a new column formatter:
1. Define formatter function: `(value: CellValue) => string`
2. Add to column config: `{ key: 'field', header: 'Label', formatter: myFormatter }`
3. GridCell.tsx automatically applies formatters (lines 40-60)

### Type casting for mock data:
When using specific interfaces (SpreadsheetRow, WorkflowRow) with GridContainer:
```typescript
// Mock data interfaces don't have index signature, need casting
const dataProvider = createSpreadsheetDataProvider(0) as unknown as DataProvider<RowData>;
const config: GridConfig<RowData> = { /* config */ };
```

## Testing Strategy

**Test files** (must all pass):
1. `src/test/setup.test.ts` (2 tests) - Environment validation
2. `src/types/types.test.ts` (15 tests) - Type system contracts
3. `src/hooks/useGridReducer.test.ts` (24 tests) - State management
4. `src/utils/dataTransforms.test.ts` (27 tests) - Data operations
5. `src/services/InMemoryDataProvider.test.ts` (22 tests) - Data provider CRUD
6. `src/components/DataGrid/GridContext.test.tsx` (7 tests) - Context provider

**Running tests**:
- All tests: `npx vitest run` (1.5s)
- Watch mode: `npm run test` (interactive)
- With UI: `npm run test:ui` (browser-based)
- Coverage: `npm run test:coverage`

**Writing new tests**:
- Use `describe()` and `test()` from Vitest
- React components: use `@testing-library/react`
- Setup file: `src/test/setup.ts` imports `@testing-library/jest-dom`
- Mock data available in `src/data/` directory

## Dependencies & Versions

**Runtime**: React 19.1.1, React DOM 19.1.1  
**Build**: Vite 7.1.7, TypeScript 5.9.3, ESLint 9.36.0  
**Testing**: Vitest 4.0.3, Testing Library (React 16.3.0, Jest DOM 6.9.1), jsdom 27.0.1  
**Linting**: typescript-eslint 8.45.0, react-hooks plugin, react-refresh plugin

**No runtime dependencies** beyond React - pure TypeScript implementation.

## Development Workflow

1. **Before starting work**: Run `npm run dev` to start dev server
2. **Make changes**: Edit files, HMR updates browser automatically
3. **Validate incrementally**: Run `npx tsc -b` after significant changes
4. **Before committing**:
   - Run `npx tsc -b` (must pass)
   - Run `npx vitest run` (must pass)
   - Run `npm run lint` (check no new errors beyond known 7 issues)
   - Run `npm run build` (optional but recommended)
5. **Commit** changes

## Important Notes

- **Trust these instructions first** - only search codebase if information is incomplete or incorrect
- **CSS Modules**: Use `styles.className` syntax, never global class names
- **Imports**: Use relative paths, not aliases (no `@/` configured in tsconfig)
- **React 19**: Uses new JSX transform, no need to import React in components
- **Strict Mode**: TypeScript strict mode enabled, all types must be explicit
- **No build cache issues**: Clean builds work reliably, no need to clear cache
- **Windows PowerShell**: Use `;` to chain commands if needed

## Phase Status (Current: Phase 5 Complete → Phase 6 Options)

✅ Phase 0: Project setup  
✅ Phase 1: Type system (75+ types)  
✅ Phase 2: Mock data & DataProvider  
✅ Phase 3: Core grid components with sorting, pagination  
✅ Phase 4: Virtual scrolling (10,000+ rows at 60fps)  
✅ Phase 5: Filtering + Export + Row Selection (text, select, number, date filters)  
⬜ Phase 6+: Cell editing, advanced features, multi-column sort

### Phase 5 Complete Features (November 2, 2025)
- ✅ **Column Filtering**: Type-aware filters (text, select, number, date) with debouncing
- ✅ **Filter Polish**: Active badges, Clear All button, state synchronization
- ✅ **Export**: CSV & Excel export (no external dependencies, 20 tests)
- ✅ **Row Selection**: Multi-select with checkboxes, shift-click ranges, ctrl-click
- ✅ **GridControls**: Unified control bar for filters and selection (scalable pattern)
- ✅ **Export Selected**: Filter export by selected rows
- ✅ **Alignment Tests**: 5 structural tests to prevent regressions
- ✅ **146 tests passing** (121 grid + 20 export + 5 alignment)

### Phase 5 Polish Features (October 31, 2025)
- ✅ **Filter Badges**: Visual ● indicator on filtered column headers
- ✅ **Active Styling**: Yellow background + border on filtered columns
- ✅ **Clear All Button**: Now integrated into GridControls unified control bar
- ✅ **State Sync**: useEffect ensures inputs sync with CLEAR_FILTERS
- ✅ **Calendar Icon**: Native date picker icon visible and functional
- ✅ **Alignment Fix**: 17px scrollbar compensation + consistent padding/box-sizing
- ✅ **Test Coverage**: 146/146 tests passing (24 ColumnFilter + 5 GridHeader alignment)
- ✅ **Hidden Select All**: Header checkbox visually hidden (non-functional, cleaner UI)

Refer to PLANNING.md for detailed phase requirements and ARCHITECTURE.md for system design decisions.

✅ Phase 0: Project setup  
✅ Phase 1: Type system (75+ types)  
✅ Phase 2: Mock data & DataProvider  
✅ Phase 3: Core grid components with sorting, pagination, 97 tests  
🔄 Phase 4: Virtual scrolling (NEXT - 10,000+ rows)  
⬜ Phase 5+: Display modes, features, export

Refer to PLANNING.md for detailed phase requirements and ARCHITECTURE.md for system design decisions.
