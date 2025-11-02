/**
 * SelectionColumn component
 * Renders checkboxes for row selection
 * Works across all display modes (spreadsheet, gallery, workflow, nested)
 */

import { useCallback, useEffect, useRef } from 'react';
import { useGridContext } from './GridContext';
import type { RowData } from '../../types/grid.types';
import styles from './SelectionColumn.module.css';

export interface SelectionColumnProps<T extends RowData = RowData> {
  /** Row data (undefined for header) */
  row?: T;
  /** Row index (undefined for header) */
  rowIndex?: number;
  /** Total number of rows */
  totalRows?: number;
  /** Row key field */
  rowKey?: keyof T;
}

/**
 * SelectionColumn component
 * Can be used as header (Select All) or cell (individual row)
 */
export function SelectionColumn<T extends RowData = RowData>({
  row,
  rowIndex,
  totalRows = 0,
  rowKey = 'id' as keyof T,
}: SelectionColumnProps<T>) {
  const { state, dispatch } = useGridContext<T>();
  const checkboxRef = useRef<HTMLInputElement>(null);
  const lastSelectedRef = useRef<string | number | null>(null);

  const isHeader = row === undefined;
  
  // Get row ID
  const getRowId = (r: T, idx: number): string | number => {
    return (r[rowKey] as string | number) ?? idx;
  };

  const rowId = row && rowIndex !== undefined ? getRowId(row, rowIndex) : null;
  const isSelected = rowId !== null ? state.selected.has(rowId) : false;

  // For header: determine if all, none, or some are selected
  const selectedCount = state.selected.size;
  const allSelected = totalRows > 0 && selectedCount === totalRows;
  const someSelected = selectedCount > 0 && selectedCount < totalRows;

  // Set indeterminate state for header checkbox
  useEffect(() => {
    if (isHeader && checkboxRef.current) {
      checkboxRef.current.indeterminate = someSelected;
    }
  }, [isHeader, someSelected]);

  /**
   * Handle checkbox click
   */
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLInputElement>) => {
      if (isHeader) {
        // Select All / Deselect All
        if (allSelected || someSelected) {
          dispatch({ type: 'CLEAR_SELECTION' });
        } else {
          dispatch({ type: 'SELECT_ALL' });
        }
      } else if (rowId !== null) {
        // Individual row selection
        const isShiftClick = event.shiftKey;
        const isCtrlClick = event.ctrlKey || event.metaKey;

        if (isShiftClick && lastSelectedRef.current !== null) {
          // Shift-click: range selection
          dispatch({
            type: 'SELECT_RANGE',
            payload: {
              from: lastSelectedRef.current,
              to: rowId,
            },
          });
        } else if (isCtrlClick) {
          // Ctrl/Cmd-click: toggle individual
          dispatch({
            type: 'TOGGLE_SELECT',
            payload: rowId,
          });
        } else {
          // Normal click: single selection
          dispatch({
            type: 'TOGGLE_SELECT',
            payload: rowId,
          });
        }

        // Track last selected for shift-click
        if (!event.shiftKey) {
          lastSelectedRef.current = rowId;
        }
      }
    },
    [isHeader, allSelected, someSelected, rowId, dispatch]
  );

  return (
    <div 
      className={`${styles.selectionColumn} ${isHeader ? styles.header : ''}`}
      role={isHeader ? 'columnheader' : 'gridcell'}
      aria-label={isHeader ? 'Select all rows' : `Select row ${rowIndex !== undefined ? rowIndex + 1 : ''}`}
    >
      <input
        ref={checkboxRef}
        type="checkbox"
        className={styles.checkbox}
        checked={isHeader ? allSelected : isSelected}
        onChange={() => {}} // Handled by onClick to support shift/ctrl
        onClick={handleClick}
        aria-label={
          isHeader
            ? someSelected
              ? `${selectedCount} of ${totalRows} rows selected`
              : allSelected
              ? 'Deselect all rows'
              : 'Select all rows'
            : isSelected
            ? 'Deselect row'
            : 'Select row'
        }
      />
    </div>
  );
}
