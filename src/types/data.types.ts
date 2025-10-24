/**
 * Data provider type definitions for the CROW data grid
 * @module data.types
 */

import type { RowData } from './grid.types';
import type { SortState, FilterState } from './grid.types';

/**
 * Query parameters for data fetching
 */
export interface QueryParams {
  /** Page number (1-indexed) */
  page?: number;
  
  /** Items per page */
  pageSize?: number;
  
  /** Sort state */
  sort?: SortState[];
  
  /** Filter state */
  filters?: FilterState[];
  
  /** Global search term */
  search?: string;
  
  /** Additional custom parameters */
  [key: string]: unknown;
}

/**
 * Data response from provider
 * @template T - Row data type extending RowData
 */
export interface DataResponse<T extends RowData = RowData> {
  /** Array of data rows */
  data: T[];
  
  /** Total number of rows (for pagination) */
  total: number;
  
  /** Current page number */
  page: number;
  
  /** Page size */
  pageSize: number;
  
  /** Optional metadata */
  meta?: DataMeta;
}

/**
 * Optional metadata in data response
 */
export interface DataMeta {
  /** Total pages */
  totalPages?: number;
  
  /** Has next page */
  hasNext?: boolean;
  
  /** Has previous page */
  hasPrevious?: boolean;
  
  /** Server timestamp */
  timestamp?: string;
  
  /** Request ID for debugging */
  requestId?: string;
  
  /** Additional custom metadata */
  [key: string]: unknown;
}

/**
 * Data provider interface
 * @template T - Row data type extending RowData
 */
export interface DataProvider<T extends RowData = RowData> {
  /**
   * Fetch data with query parameters
   * @param params - Query parameters
   * @returns Promise resolving to data response
   */
  fetch: (params?: QueryParams) => Promise<DataResponse<T>>;
  
  /**
   * Update a row by ID
   * @param id - Row identifier
   * @param changes - Partial row data with changes
   * @returns Promise resolving to updated row
   */
  update?: (id: string | number, changes: Partial<T>) => Promise<T>;
  
  /**
   * Create a new row
   * @param data - New row data
   * @returns Promise resolving to created row
   */
  create?: (data: Omit<T, 'id'> | T) => Promise<T>;
  
  /**
   * Delete a row by ID
   * @param id - Row identifier
   * @returns Promise resolving when deletion is complete
   */
  delete?: (id: string | number) => Promise<void>;
  
  /**
   * Batch update multiple rows
   * @param updates - Array of row updates
   * @returns Promise resolving to updated rows
   */
  batchUpdate?: (updates: Array<{ id: string | number; changes: Partial<T> }>) => Promise<T[]>;
  
  /**
   * Batch delete multiple rows
   * @param ids - Array of row identifiers
   * @returns Promise resolving when deletions are complete
   */
  batchDelete?: (ids: Array<string | number>) => Promise<void>;
}

/**
 * Mock data provider options
 */
export interface MockDataProviderOptions {
  /** Simulated network delay in milliseconds */
  delay?: number;
  
  /** Error rate (0-1) for testing error handling */
  errorRate?: number;
  
  /** Whether to persist changes in memory */
  persist?: boolean;
}

/**
 * Data provider factory function type
 * @template T - Row data type
 */
export type DataProviderFactory<T extends RowData = RowData> = (
  options?: MockDataProviderOptions
) => DataProvider<T>;

/**
 * REST API data provider configuration
 */
export interface RestApiConfig {
  /** Base URL for API */
  baseUrl: string;
  
  /** Endpoints */
  endpoints: {
    /** Fetch endpoint (GET) */
    fetch: string;
    /** Update endpoint (PUT/PATCH) */
    update?: string;
    /** Create endpoint (POST) */
    create?: string;
    /** Delete endpoint (DELETE) */
    delete?: string;
  };
  
  /** Headers to include in requests */
  headers?: Record<string, string>;
  
  /** Authentication token */
  token?: string;
  
  /** Request timeout in milliseconds */
  timeout?: number;
  
  /** Transform response data */
  transformResponse?: <T extends RowData>(response: unknown) => DataResponse<T>;
  
  /** Transform request params */
  transformRequest?: (params: QueryParams) => Record<string, unknown>;
}

/**
 * GraphQL data provider configuration
 */
export interface GraphQLConfig {
  /** GraphQL endpoint URL */
  endpoint: string;
  
  /** Query for fetching data */
  query: string;
  
  /** Mutation for updating data */
  updateMutation?: string;
  
  /** Mutation for creating data */
  createMutation?: string;
  
  /** Mutation for deleting data */
  deleteMutation?: string;
  
  /** Headers to include in requests */
  headers?: Record<string, string>;
  
  /** Authentication token */
  token?: string;
}

/**
 * Local storage data provider configuration
 */
export interface LocalStorageConfig {
  /** Storage key */
  key: string;
  
  /** Whether to use session storage instead of local storage */
  useSessionStorage?: boolean;
  
  /** Enable compression */
  compress?: boolean;
}

/**
 * Data transform utilities
 */
export interface DataTransformUtils {
  /**
   * Sort data array
   */
  sort: <T extends RowData>(data: T[], sortState: SortState[]) => T[];
  
  /**
   * Filter data array
   */
  filter: <T extends RowData>(data: T[], filters: FilterState[]) => T[];
  
  /**
   * Search data array
   */
  search: <T extends RowData>(data: T[], searchTerm: string, fields: string[]) => T[];
  
  /**
   * Paginate data array
   */
  paginate: <T extends RowData>(data: T[], page: number, pageSize: number) => T[];
}
