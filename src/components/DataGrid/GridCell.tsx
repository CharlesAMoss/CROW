/**
 * GridCell component
 * Renders a single cell with value and optional custom renderer
 */

import { useGridContext } from './GridContext';
import type { ColumnDefinition } from '../../types/config.types';
import type { RowData, CellValue } from '../../types/grid.types';
import styles from './GridCell.module.css';

export interface GridCellProps<T extends RowData = RowData> {
  /** Row data */
  row: T;
  /** Column definition */
  column: ColumnDefinition<T>;
  /** Row index */
  rowIndex: number;
  /** Column index */
  columnIndex: number;
}

/**
 * GridCell component
 */
export function GridCell<T extends RowData = RowData>({
  row,
  column,
  rowIndex,
  columnIndex,
}: GridCellProps<T>) {
  const { state } = useGridContext<T>();
  const value = row[column.key] as CellValue;
  const rowId = (row as { id?: string | number }).id ?? rowIndex;
  
  const isSelected = state.selected.has(rowId);
  const isExpanded = state.expanded.has(rowId);
  const isEditing =
    state.editing?.rowIndex === rowIndex &&
    state.editing?.columnKey === String(column.key);

  /**
   * Format cell value for display
   */
  const formatValue = (val: CellValue): string => {
    if (val === null || val === undefined) return '';
    if (val instanceof Date) return val.toLocaleDateString();
    if (typeof val === 'boolean') return val ? 'Yes' : 'No';
    return String(val);
  };

  /**
   * Render cell content
   */
  const renderContent = () => {
    // Use custom cell renderer if provided
    if (column.renderer) {
      const RendererComponent = column.renderer;
      return (
        <RendererComponent
          value={value}
          row={row}
          column={column}
          rowIndex={rowIndex}
          columnIndex={columnIndex}
          isEditing={isEditing}
          isSelected={isSelected}
          isExpanded={isExpanded}
        />
      );
    }

    // Use formatter if provided
    if (column.formatter) {
      return column.formatter(value, row, column);
    }

    // Default formatting
    return formatValue(value);
  };

  return (
    <div
      className={styles.gridCell}
      role="cell"
      style={{ width: column.width }}
      data-column={column.key.toString()}
    >
      {renderContent()}
    </div>
  );
}
