/**
 * Feature configuration type definitions for the CROW data grid
 * @module feature.types
 */

import type { SortState, FilterState, FilterOperator } from './grid.types';

/**
 * All grid features configuration
 */
export interface GridFeatures {
  /** Sorting configuration */
  sorting?: SortingConfig;
  
  /** Filtering configuration */
  filtering?: FilteringConfig;
  
  /** Editing configuration */
  editing?: EditingConfig;
  
  /** Selection configuration */
  selection?: SelectionConfig;
  
  /** Export configuration */
  export?: ExportConfig;
  
  /** Virtualization configuration */
  virtualization?: VirtualizationConfig;
  
  /** Pagination configuration */
  pagination?: PaginationConfig;
  
  /** Modal configuration */
  modal?: ModalConfig;
  
  /** Search configuration */
  search?: SearchConfig;
}

/**
 * Sorting feature configuration
 */
export interface SortingConfig {
  /** Enable sorting */
  enabled: boolean;
  
  /** Allow multi-column sorting */
  multi?: boolean;
  
  /** Default sort state */
  defaultSort?: SortState[];
  
  /** Server-side sorting */
  serverSide?: boolean;
  
  /** Custom sort function (for client-side sorting) */
  customSort?: <T>(data: T[], sortState: SortState[]) => T[];
}

/**
 * Filtering feature configuration
 */
export interface FilteringConfig {
  /** Enable filtering */
  enabled: boolean;
  
  /** Default filter state */
  defaultFilters?: FilterState[];
  
  /** Server-side filtering */
  serverSide?: boolean;
  
  /** Available filter operators per column type */
  operators?: {
    string?: FilterOperator[];
    number?: FilterOperator[];
    boolean?: FilterOperator[];
    date?: FilterOperator[];
  };
  
  /** Debounce delay for filter input (ms) */
  debounceMs?: number;
  
  /** Custom filter function (for client-side filtering) */
  customFilter?: <T>(data: T[], filters: FilterState[]) => T[];
}

/**
 * Editing feature configuration
 */
export interface EditingConfig {
  /** Enable editing */
  enabled: boolean;
  
  /** Edit mode: inline cell edit, row edit, or modal edit */
  mode: 'inline' | 'row' | 'modal';
  
  /** Auto-save on blur (default: false) */
  autoSave?: boolean;
  
  /** Validation mode */
  validationMode?: 'onChange' | 'onBlur' | 'onSubmit';
  
  /** Edit handler function */
  onEdit?: <T>(rowIndex: number, changes: Partial<T>) => void | Promise<void>;
  
  /** Create handler function (for adding new rows) */
  onCreate?: <T>(newRow: T) => void | Promise<void>;
  
  /** Delete handler function */
  onDelete?: <T>(rowIndex: number, row: T) => void | Promise<void>;
}

/**
 * Selection feature configuration
 */
export interface SelectionConfig {
  /** Enable selection */
  enabled: boolean;
  
  /** Selection mode */
  mode: 'single' | 'multiple';
  
  /** Show checkbox column */
  showCheckbox?: boolean;
  
  /** Checkbox column width */
  checkboxWidth?: string | number;
  
  /** Selection change handler */
  onSelectionChange?: (selectedRows: Set<string | number>) => void;
}

/**
 * Export feature configuration
 */
export interface ExportConfig {
  /** Enabled export formats */
  formats: ExportFormat[];
  
  /** Default filename (without extension) */
  filename?: string;
  
  /** Export only visible columns */
  visibleColumnsOnly?: boolean;
  
  /** Export only selected rows */
  selectedRowsOnly?: boolean;
  
  /** Custom data transformers per format */
  transformers?: Partial<Record<ExportFormat, DataTransformer>>;
  
  /** PDF-specific options */
  pdfOptions?: PdfExportOptions;
  
  /** Excel-specific options */
  xlsxOptions?: XlsxExportOptions;
}

/**
 * Export format types
 */
export type ExportFormat = 'csv' | 'json' | 'xlsx' | 'pdf';

/**
 * Data transformer function for exports
 */
export type DataTransformer = <T>(data: T[], columns: string[]) => unknown;

/**
 * PDF export options
 */
export interface PdfExportOptions {
  /** Page orientation */
  orientation?: 'portrait' | 'landscape';
  
  /** Page size */
  pageSize?: 'a4' | 'letter' | 'legal';
  
  /** Document title */
  title?: string;
  
  /** Include header row */
  includeHeader?: boolean;
  
  /** Font size */
  fontSize?: number;
}

/**
 * Excel export options
 */
export interface XlsxExportOptions {
  /** Sheet name */
  sheetName?: string;
  
  /** Include header row */
  includeHeader?: boolean;
  
  /** Auto-fit column widths */
  autoFitColumns?: boolean;
  
  /** Freeze header row */
  freezeHeader?: boolean;
}

/**
 * Virtualization feature configuration
 */
export interface VirtualizationConfig {
  /** Enable virtualization */
  enabled: boolean;
  
  /** Container height in pixels */
  containerHeight?: number;
  
  /** Row height (fixed or function for dynamic) */
  rowHeight?: number | ((index: number) => number);
  
  /** Overscan count (rows to render above/below viewport) */
  overscanCount?: number;
  
  /** Estimated row height (for dynamic heights) */
  estimatedRowHeight?: number;
}

/**
 * Pagination feature configuration
 */
export interface PaginationConfig {
  /** Enable pagination */
  enabled: boolean;
  
  /** Page size (items per page) */
  pageSize?: number;
  
  /** Available page size options */
  pageSizeOptions?: number[];
  
  /** Show page size selector */
  showPageSizeSelector?: boolean;
  
  /** Show page numbers */
  showPageNumbers?: boolean;
  
  /** Show total count */
  showTotal?: boolean;
  
  /** Server-side pagination */
  serverSide?: boolean;
  
  /** Position of pagination controls */
  position?: 'top' | 'bottom' | 'both';
  
  /** Page change handler */
  onPageChange?: (page: number) => void;
  
  /** Page size change handler */
  onPageSizeChange?: (pageSize: number) => void;
}

/**
 * Modal feature configuration
 */
export interface ModalConfig {
  /** Enable modal */
  enabled: boolean;
  
  /** Modal animation type */
  animation?: 'fade' | 'slide' | 'zoom' | 'none';
  
  /** Close on backdrop click */
  closeOnBackdropClick?: boolean;
  
  /** Close on escape key */
  closeOnEscape?: boolean;
  
  /** Show close button */
  showCloseButton?: boolean;
  
  /** Modal width */
  width?: string | number;
  
  /** Modal max width */
  maxWidth?: string | number;
}

/**
 * Search feature configuration
 */
export interface SearchConfig {
  /** Enable search */
  enabled: boolean;
  
  /** Search placeholder text */
  placeholder?: string;
  
  /** Debounce delay (ms) */
  debounceMs?: number;
  
  /** Server-side search */
  serverSide?: boolean;
  
  /** Search fields (column keys to search in) */
  searchFields?: string[];
  
  /** Case sensitive search */
  caseSensitive?: boolean;
  
  /** Search handler */
  onSearch?: (searchTerm: string) => void;
}
