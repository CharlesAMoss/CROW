/**
 * GridRow component
 * Renders a single data row
 */

import { GridCell } from './GridCell';
import { useGridContext } from './GridContext';
import type { ColumnDefinition } from '../../types/config.types';
import type { RowData } from '../../types/grid.types';
import styles from './GridRow.module.css';

export interface GridRowProps<T extends RowData = RowData> {
  /** Row data */
  row: T;
  /** Row index */
  rowIndex: number;
  /** Column definitions */
  columns: ColumnDefinition<T>[];
}

/**
 * GridRow component
 */
export function GridRow<T extends RowData = RowData>({
  row,
  rowIndex,
  columns,
}: GridRowProps<T>) {
  const { state } = useGridContext<T>();
  const rowId = (row as { id?: string | number }).id ?? rowIndex;
  const isSelected = state.selected.has(rowId);

  return (
    <div
      className={`${styles.gridRow} ${isSelected ? styles.selected : ''}`}
      role="row"
      data-row-index={rowIndex}
      data-selected={isSelected}
    >
      {columns.map((column, columnIndex) => (
        <GridCell
          key={String(column.key)}
          row={row}
          column={column}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
        />
      ))}
    </div>
  );
}
