/**
 * GridBody component
 * Renders the data rows
 */

import { GridRow } from './GridRow';
import type { ColumnDefinition } from '../../types/config.types';
import type { RowData } from '../../types/grid.types';
import styles from './GridBody.module.css';

export interface GridBodyProps<T extends RowData = RowData> {
  /** Data rows */
  data: T[];
  /** Column definitions */
  columns: ColumnDefinition<T>[];
  /** Function to get row ID */
  getRowId: (row: T, index: number) => string | number;
}

/**
 * GridBody component
 */
export function GridBody<T extends RowData = RowData>({
  data,
  columns,
  getRowId,
}: GridBodyProps<T>) {
  if (data.length === 0) {
    return (
      <div className={styles.gridBody}>
        <div className={styles.emptyState}>No data available</div>
      </div>
    );
  }

  return (
    <div className={styles.gridBody} role="rowgroup">
      {data.map((row, index) => (
        <GridRow
          key={getRowId(row, index)}
          row={row}
          rowIndex={index}
          columns={columns}
        />
      ))}
    </div>
  );
}
