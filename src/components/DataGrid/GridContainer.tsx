/**
 * GridContainer component
 * Main grid component that orchestrates all grid functionality
 */

import { useState, useCallback, useRef } from 'react';
import { GridProvider } from './GridContext';
import { GridHeader } from './GridHeader';
import { GridBody } from './GridBody';
import { GridDataFetcher } from './GridDataFetcher';
import { GridPagination } from './GridPagination';
import { GridControls } from './GridControls';
import type { GridConfig } from '../../types/config.types';
import type { DataProvider } from '../../types/data.types';
import type { RowData } from '../../types/grid.types';
import styles from './GridContainer.module.css';

/**
 * Base grid props
 */
interface BaseGridProps<T extends RowData = RowData> {
  /** Grid configuration */
  config: GridConfig<T>;
  /** Optional data provider */
  dataProvider?: DataProvider<T>;
}

/**
 * Controlled mode props
 */
interface ControlledProps<T extends RowData = RowData> extends BaseGridProps<T> {
  /** Controlled data */
  data: T[];
  /** Total number of rows */
  totalRows: number;
  /** Data change handler */
  onDataChange?: (data: T[]) => void;
}

/**
 * Uncontrolled mode props
 */
interface UncontrolledProps<T extends RowData = RowData> extends BaseGridProps<T> {
  /** Initial data (optional, will fetch from provider if not provided) */
  initialData?: T[];
  /** Initial grid state (optional, for setting expanded nodes, etc.) */
  initialState?: Partial<import('../../types/grid.types').GridState>;
}

/**
 * Discriminated union for controlled vs uncontrolled props
 */
type GridContainerProps<T extends RowData = RowData> =
  | ControlledProps<T>
  | UncontrolledProps<T>;

/**
 * GridContainer component
 * Handles data fetching, state management, and rendering
 */
export function GridContainer<T extends RowData = RowData>(props: GridContainerProps<T>) {
  const { config, dataProvider } = props;
  
  // Local state for uncontrolled mode
  const [localData, setLocalData] = useState<T[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Use ref for header to enable direct scroll sync without React state
  const headerRef = useRef<HTMLDivElement>(null);

  // Determine if controlled or uncontrolled
  const isControlled = 'data' in props && props.data !== undefined;
  const data = isControlled ? (props as ControlledProps<T>).data : localData;
  const total = isControlled ? (props as ControlledProps<T>).totalRows : totalRows;

  /**
   * Callbacks for GridDataFetcher
   */
  const handleDataFetched = useCallback((newData: T[], newTotal: number) => {
    setLocalData(newData);
    setTotalRows(newTotal);
  }, []);

  const handleLoadingChange = useCallback((isLoading: boolean) => {
    setLoading(isLoading);
  }, []);

  const handleError = useCallback((err: Error | null) => {
    setError(err);
  }, []);

  const handleScroll = useCallback((left: number) => {
    // Direct DOM manipulation for instant sync
    if (headerRef.current) {
      headerRef.current.scrollLeft = left;
    }
  }, []);

  return (
    <div className={styles.gridContainer} data-display-mode={config.displayMode}>
      <GridProvider
        data={data}
        totalRows={total}
        initialState={{
          isLoading: loading,
          error: error,
          pageSize: config.features?.pagination?.pageSize ?? 50,
          ...(('initialState' in props && props.initialState) || {}),
        }}
      >
        {/* Data fetcher for uncontrolled mode */}
        {!isControlled && dataProvider && (
          <GridDataFetcher
            dataProvider={dataProvider}
            onDataFetched={handleDataFetched}
            onLoadingChange={handleLoadingChange}
            onError={handleError}
          />
        )}

        {loading && <div className={styles.loading}>Loading...</div>}
        {error && <div className={styles.error}>Error: {error.message}</div>}
        {!loading && !error && data.length === 0 && (
          <div className={styles.empty}>No data available</div>
        )}
        {!loading && !error && data.length > 0 && (
          <>
            {/* Unified control bar for filters and selection - hide in fullbleed */}
            {config.displayMode !== 'fullbleed' && (
              <GridControls filterable={config.features?.filtering?.enabled === true} />
            )}
            
            <div className={styles.gridContent}>
              {/* Hide header in fullbleed mode */}
              {config.displayMode !== 'fullbleed' && (
                <GridHeader
                  columns={config.columns}
                  sortable={config.features?.sorting?.enabled !== false}
                  filterable={config.features?.filtering?.enabled === true}
                  headerRef={headerRef}
                  selectable={config.features?.selection?.enabled === true}
                  totalRows={data.length}
                  rowKey={config.rowKey}
                />
              )}
              <GridBody
                data={data}
                columns={config.columns}
                displayMode={config.displayMode}
                getRowId={(row, index) => (row[config.rowKey ?? ('id' as keyof T)] as string | number) ?? index}
                enableVirtualScroll={config.features?.virtualization?.enabled}
                containerHeight={config.features?.virtualization?.containerHeight}
                rowHeight={
                  typeof config.features?.virtualization?.rowHeight === 'number'
                    ? config.features.virtualization.rowHeight
                    : undefined
                }
                onScroll={handleScroll}
                selectable={config.features?.selection?.enabled === true}
                rowKey={config.rowKey}
              />
            </div>
            <GridPagination config={config} />
          </>
        )}
      </GridProvider>
    </div>
  );
}
