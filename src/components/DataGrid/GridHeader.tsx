/**
 * GridHeader component
 * Renders column headers with sorting support
 */

import type { RefObject } from 'react';
import { useGridContext } from './GridContext';
import type { ColumnDefinition } from '../../types/config.types';
import type { RowData } from '../../types/grid.types';
import styles from './GridHeader.module.css';

export interface GridHeaderProps<T extends RowData = RowData> {
  /** Column definitions */
  columns: ColumnDefinition<T>[];
  /** Enable sorting */
  sortable?: boolean;
  /** Ref to header element for scroll sync */
  headerRef?: RefObject<HTMLDivElement | null>;
}

/**
 * GridHeader component
 */
export function GridHeader<T extends RowData = RowData>({
  columns,
  sortable = true,
  headerRef,
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

  return (
    <div className={styles.gridHeaderWrapper} ref={headerRef}>
      <div className={styles.gridHeader} role="row">
        {columns.map((column) => {
          const columnKey = String(column.key);
          const isSortable = sortable && (column.sortable ?? true);
          const sortIndicator = getSortIndicator(columnKey);

          return (
            <div
              key={columnKey}
              className={`${styles.headerCell} ${isSortable ? styles.sortable : ''}`}
              role="columnheader"
              onClick={() => handleSort(columnKey, isSortable)}
              style={{ width: column.width }}
              data-sorted={sortIndicator ? 'true' : 'false'}
            >
              <span className={styles.headerText}>{column.header}</span>
              {sortIndicator && (
                <span className={styles.sortIndicator}>{sortIndicator}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
