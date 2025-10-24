/**
 * Core type definitions for the CROW data grid system
 * @module grid.types
 */

/**
 * Primitive cell value types supported by the grid
 */
export type CellValue = string | number | boolean | Date | null | undefined;

/**
 * Base row data type - a record of string keys to cell values
 * Generic type T can extend this for type-safe row definitions
 */
export type RowData = Record<string, CellValue>;

/**
 * Display modes available for the grid
 * - fullbleed: Borderless gallery view for images
 * - spreadsheet: Excel-like table with sorting and filtering
 * - workflow: Editable cells for task management
 * - nested-list: Hierarchical data with expand/collapse
 * - custom: User-defined custom display mode
 */
export type DisplayMode = 
  | 'fullbleed' 
  | 'spreadsheet' 
  | 'workflow' 
  | 'nested-list' 
  | 'custom';

/**
 * Grid state for internal state management
 */
export interface GridState {
  /** Currently sorted columns */
  sort: SortState[];
  /** Active filters */
  filters: FilterState[];
  /** Expanded row IDs (for nested lists) */
  expanded: Set<string | number>;
  /** Selected row IDs */
  selected: Set<string | number>;
  /** Currently editing cell location */
  editing: CellLocation | null;
  /** Active modal state */
  modal: ModalState | null;
  /** Current page (for pagination) */
  currentPage: number;
  /** Items per page (for pagination) */
  pageSize: number;
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: Error | null;
}

/**
 * Sort state for a column
 */
export interface SortState {
  /** Column key being sorted */
  columnKey: string;
  /** Sort direction */
  direction: 'asc' | 'desc';
  /** Sort priority (for multi-column sort) */
  priority?: number;
}

/**
 * Filter state for a column
 */
export interface FilterState {
  /** Column key being filtered */
  columnKey: string;
  /** Filter operator */
  operator: FilterOperator;
  /** Filter value */
  value: CellValue;
}

/**
 * Filter operators
 */
export type FilterOperator = 
  | 'equals'
  | 'notEquals'
  | 'contains'
  | 'startsWith'
  | 'endsWith'
  | 'greaterThan'
  | 'lessThan'
  | 'greaterThanOrEqual'
  | 'lessThanOrEqual'
  | 'isEmpty'
  | 'isNotEmpty';

/**
 * Cell location in the grid
 */
export interface CellLocation {
  /** Row index */
  rowIndex: number;
  /** Column key */
  columnKey: string;
}

/**
 * Modal state
 */
export interface ModalState {
  /** Modal type */
  type: 'detail' | 'edit' | 'confirm' | 'custom';
  /** Modal title */
  title?: string;
  /** Row data associated with modal */
  rowData: RowData;
  /** Row index */
  rowIndex: number;
  /** Custom modal content */
  content?: React.ReactNode;
}

/**
 * Grid actions for reducer
 */
export type GridAction =
  | { type: 'SET_SORT'; payload: SortState[] }
  | { type: 'ADD_SORT'; payload: SortState }
  | { type: 'REMOVE_SORT'; payload: string }
  | { type: 'SET_FILTER'; payload: FilterState[] }
  | { type: 'ADD_FILTER'; payload: FilterState }
  | { type: 'REMOVE_FILTER'; payload: string }
  | { type: 'CLEAR_FILTERS' }
  | { type: 'TOGGLE_EXPAND'; payload: string | number }
  | { type: 'EXPAND_ALL' }
  | { type: 'COLLAPSE_ALL' }
  | { type: 'TOGGLE_SELECT'; payload: string | number }
  | { type: 'SELECT_ALL' }
  | { type: 'DESELECT_ALL' }
  | { type: 'START_EDIT'; payload: CellLocation }
  | { type: 'CANCEL_EDIT' }
  | { type: 'SAVE_EDIT'; payload: { rowIndex: number; changes: Partial<RowData> } }
  | { type: 'OPEN_MODAL'; payload: ModalState }
  | { type: 'CLOSE_MODAL' }
  | { type: 'SET_PAGE'; payload: number }
  | { type: 'SET_PAGE_SIZE'; payload: number }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
  | { type: 'RESET_STATE' };

/**
 * Grid dimensions and viewport info
 */
export interface GridDimensions {
  /** Total width of the grid */
  width: number;
  /** Total height of the grid */
  height: number;
  /** Viewport width */
  viewportWidth: number;
  /** Viewport height */
  viewportHeight: number;
  /** Row height (can be dynamic) */
  rowHeight: number | ((index: number) => number);
  /** Header height */
  headerHeight: number;
}

/**
 * Virtual scroll info
 */
export interface VirtualScrollInfo {
  /** Index of first visible row */
  startIndex: number;
  /** Index of last visible row */
  endIndex: number;
  /** Total number of rows */
  totalRows: number;
  /** Offset from top */
  offsetY: number;
  /** Visible rows */
  visibleRows: number;
}

/**
 * Grid theme/styling customization
 */
export interface GridTheme {
  /** Primary background color */
  backgroundColor?: string;
  /** Border color */
  borderColor?: string;
  /** Header background color */
  headerBackgroundColor?: string;
  /** Header text color */
  headerTextColor?: string;
  /** Row hover background color */
  hoverBackgroundColor?: string;
  /** Selected row background color */
  selectedBackgroundColor?: string;
  /** Cell padding */
  cellPadding?: string;
  /** Font family */
  fontFamily?: string;
  /** Font size */
  fontSize?: string;
  /** Transition duration */
  transitionDuration?: string;
}
