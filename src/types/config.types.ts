/**
 * Configuration type definitions for the CROW data grid
 * @module config.types
 */

import type { ReactNode } from 'react';
import type { 
  RowData, 
  CellValue, 
  DisplayMode, 
  GridTheme,
  SortState,
  FilterState 
} from './grid.types';
import type { CellRendererComponent } from './renderer.types';
import type { GridFeatures } from './feature.types';

/**
 * Main grid configuration interface
 * @template T - Row data type extending RowData
 */
export interface GridConfig<T extends RowData = RowData> {
  /** Column definitions */
  columns: ColumnDefinition<T>[];
  
  /** Display mode */
  displayMode: DisplayMode;
  
  /** Optional features configuration */
  features?: GridFeatures;
  /** Optional theme customization */
  theme?: GridTheme;
  
  /** Optional row key field (defaults to 'id') */
  rowKey?: keyof T;
  
  /** Optional default sort */
  defaultSort?: SortState[];
  
  /** Optional default filters */
  defaultFilters?: FilterState[];
  
  /** Optional empty state message */
  emptyStateMessage?: string;
  
  /** Optional loading message */
  loadingMessage?: string;
  
  /** Optional error handler */
  onError?: (error: Error) => void;
  
  /** Optional row click handler */
  onRowClick?: (row: T, index: number) => void;
  
  /** Optional row double click handler */
  onRowDoubleClick?: (row: T, index: number) => void;
  
  /** Optional cell click handler */
  onCellClick?: (value: CellValue, row: T, column: ColumnDefinition<T>, rowIndex: number) => void;
}

/**
 * Column definition interface
 * @template T - Row data type extending RowData
 */
export interface ColumnDefinition<T extends RowData = RowData> {
  /** Unique key matching row data property */
  key: keyof T;
  
  /** Display header text */
  header: string;
  
  /** Optional column width (CSS value: px, %, fr, auto) */
  width?: string | number;
  
  /** Optional minimum width */
  minWidth?: string | number;
  
  /** Optional maximum width */
  maxWidth?: string | number;
  
  /** Whether column is sortable (default: false) */
  sortable?: boolean;
  
  /** Whether column is filterable (default: false) */
  filterable?: boolean;
  
  /** Whether column is editable (default: false) */
  editable?: boolean;
  
  /** Whether column is resizable (default: false) */
  resizable?: boolean;
  
  /** Whether column is visible (default: true) */
  visible?: boolean;
  
  /** Whether column is pinned (default: undefined) */
  pinned?: 'left' | 'right';
  
  /** Custom cell renderer component */
  renderer?: CellRendererComponent<T>;
  
  /** Cell value formatter function */
  formatter?: CellFormatter<T>;
  
  /** Custom cell class name */
  cellClassName?: string | ((value: CellValue, row: T) => string);
  
  /** Custom header class name */
  headerClassName?: string;
  
  /** Cell alignment */
  align?: 'left' | 'center' | 'right';
  
  /** Header tooltip */
  tooltip?: string;
  
  /** Custom sort comparator */
  sortComparator?: (a: T, b: T, direction: 'asc' | 'desc') => number;
  
  /** Custom filter function */
  filterFunction?: (value: CellValue, filterValue: CellValue) => boolean;
  
  /** Validation function for editable cells */
  validate?: (value: CellValue, row: T) => string | true;
  
  /** Transform function for saving edited values */
  transformValue?: (value: CellValue) => CellValue;
  
  /** For nested data - child accessor function */
  children?: (row: T) => T[] | undefined;
}

/**
 * Cell value formatter function type
 * @template T - Row data type
 */
export type CellFormatter<T extends RowData = RowData> = (
  value: CellValue,
  row: T,
  column: ColumnDefinition<T>
) => string | ReactNode;

/**
 * Controlled grid props (when grid is controlled by parent)
 */
export interface ControlledGridProps<T extends RowData = RowData> {
  /** Controlled data */
  data: T[];
  
  /** Controlled sort state */
  sortState?: SortState[];
  
  /** Controlled filter state */
  filterState?: FilterState[];
  
  /** Controlled selected rows */
  selectedRows?: Set<string | number>;
  
  /** Controlled expanded rows */
  expandedRows?: Set<string | number>;
  
  /** Controlled current page */
  currentPage?: number;
  
  /** Controlled page size */
  pageSize?: number;
  
  /** Sort change handler */
  onSortChange?: (sortState: SortState[]) => void;
  
  /** Filter change handler */
  onFilterChange?: (filterState: FilterState[]) => void;
  
  /** Selection change handler */
  onSelectionChange?: (selectedRows: Set<string | number>) => void;
  
  /** Expansion change handler */
  onExpansionChange?: (expandedRows: Set<string | number>) => void;
  
  /** Page change handler */
  onPageChange?: (page: number) => void;
  
  /** Page size change handler */
  onPageSizeChange?: (pageSize: number) => void;
  
  /** Edit handler */
  onEdit?: (rowIndex: number, changes: Partial<T>) => void | Promise<void>;
}

/**
 * Uncontrolled grid props (when grid manages its own state)
 */
export interface UncontrolledGridProps<T extends RowData = RowData> {
  /** Initial data (can be updated) */
  initialData?: T[];
  
  /** Data provider for fetching data */
  dataProvider?: DataProviderFunction<T>;
  
  /** Initial sort state */
  initialSort?: SortState[];
  
  /** Initial filter state */
  initialFilters?: FilterState[];
  
  /** Initial selected rows */
  initialSelectedRows?: Set<string | number>;
  
  /** Initial expanded rows */
  initialExpandedRows?: Set<string | number>;
  
  /** Initial page */
  initialPage?: number;
  
  /** Initial page size */
  initialPageSize?: number;
  
  /** Callback when data changes internally */
  onDataChange?: (data: T[]) => void;
}

/**
 * Data provider function type
 * @template T - Row data type
 */
export type DataProviderFunction<T extends RowData = RowData> = (params: {
  sort?: SortState[];
  filters?: FilterState[];
  page?: number;
  pageSize?: number;
  search?: string;
}) => Promise<DataResponse<T>>;

/**
 * Data response from provider
 * @template T - Row data type
 */
export interface DataResponse<T extends RowData = RowData> {
  /** Array of data rows */
  data: T[];
  
  /** Total number of rows (for pagination) */
  total: number;
  
  /** Current page */
  page: number;
  
  /** Page size */
  pageSize: number;
  
  /** Optional metadata */
  meta?: Record<string, unknown>;
}
