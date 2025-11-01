/**
 * GridHeader component
 * Renders column headers with sorting support
 */

import type { RefObject } from 'react';
import { useGridContext } from './GridContext';
import type { ColumnDefinition } from '../../types/config.types';
import type { RowData } from '../../types/grid.types';
import { ColumnFilter } from './ColumnFilter';
import styles from './GridHeader.module.css';

export interface GridHeaderProps<T extends RowData = RowData> {
  /** Column definitions */
  columns: ColumnDefinition<T>[];
  /** Enable sorting */
  sortable?: boolean;
  /** Ref to header element for scroll sync */
  headerRef?: RefObject<HTMLDivElement | null>;
  /** Enable filtering */
  filterable?: boolean;
}

/**
 * GridHeader component
 */
export function GridHeader<T extends RowData = RowData>({
  columns,
  sortable = true,
  headerRef,
  filterable = false,
}: GridHeaderProps<T>) {
  const { state, dispatch } = useGridContext<T>();

  /**
   * Handle column header click for sorting
   */
  const handleSort = (columnKey: string, isSortable: boolean) => {
    if (!sortable || !isSortable) return;

    const currentSort = state.sort.find((s) => s.columnKey === columnKey);
    
    if (!currentSort) {
      // Add ascending sort
      dispatch({
        type: 'ADD_SORT',
        payload: { columnKey, direction: 'asc' },
      });
    } else if (currentSort.direction === 'asc') {
      // Change to descending
      dispatch({
        type: 'SET_SORT',
        payload: state.sort.map((s) =>
          s.columnKey === columnKey ? { ...s, direction: 'desc' } : s
        ),
      });
    } else {
      // Remove sort
      dispatch({
        type: 'REMOVE_SORT',
        payload: columnKey,
      });
    }
  };

  /**
   * Get sort indicator for column
   */
  const getSortIndicator = (columnKey: string) => {
    const sort = state.sort.find((s) => s.columnKey === columnKey);
    if (!sort) return null;
    return sort.direction === 'asc' ? '↑' : '↓';
  };

  /**
   * Check if column has active filter
   */
  const hasActiveFilter = (columnKey: string) => {
    return state.filters.some((f) => f.columnKey === columnKey);
  };

  /**
   * Clear all filters
   */
  const handleClearAllFilters = () => {
    dispatch({ type: 'CLEAR_FILTERS' });
  };

  // Count active filters
  const activeFilterCount = state.filters.length;

  return (
    <div className={styles.gridHeaderWrapper}>
      <div className={styles.scrollableHeader} ref={headerRef}>
        <div className={styles.gridHeaderContent}>
          <div className={styles.gridHeader} role="row">
            {columns.map((column) => {
              const columnKey = String(column.key);
              const isSortable = sortable && (column.sortable ?? true);
              const sortIndicator = getSortIndicator(columnKey);
              const isFiltered = hasActiveFilter(columnKey);

              return (
                <div
                  key={columnKey}
                  className={`${styles.headerCell} ${isSortable ? styles.sortable : ''} ${isFiltered ? styles.filtered : ''}`}
                  role="columnheader"
                  onClick={() => handleSort(columnKey, isSortable)}
                  style={{ width: column.width }}
                  data-sorted={sortIndicator ? 'true' : 'false'}
                  data-filtered={isFiltered ? 'true' : 'false'}
                >
                  <span className={styles.headerText}>
                    {column.header}
                    {isFiltered && <span className={styles.filterBadge}>●</span>}
                  </span>
                  {sortIndicator && (
                    <span className={styles.sortIndicator}>{sortIndicator}</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Filter row */}
          {filterable && (
            <div className={styles.filterRow} role="row">
              {columns.map((column) => {
                const isFilterable = column.filterable ?? false;

                return isFilterable ? (
                  <ColumnFilter<T>
                    key={String(column.key)}
                    column={column}
                  />
                ) : (
                  <div key={String(column.key)} className={styles.emptyFilterCell} style={{ width: column.width }} />
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Clear All Filters button row - below filter row, outside scroll */}
      {filterable && activeFilterCount > 0 && (
        <div className={styles.clearAllRow}>
          <button
            className={styles.clearAllFilters}
            onClick={handleClearAllFilters}
            title={`Clear ${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''}`}
            type="button"
          >
            ✕ Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
