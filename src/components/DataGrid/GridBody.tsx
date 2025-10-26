/**
 * GridBody component
 * Renders the data rows with optional virtual scrolling
 */

import { useRef, useEffect } from 'react';
import { GridRow } from './GridRow';
import { VirtualScroller } from './VirtualScroller';
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
  /** Enable virtual scrolling for large datasets */
  enableVirtualScroll?: boolean;
  /** Container height for virtual scrolling */
  containerHeight?: number;
  /** Row height for virtual scrolling */
  rowHeight?: number;
  /** Callback for horizontal scroll sync */
  onScroll?: (scrollLeft: number) => void;
}

/**
 * GridBody component
 */
export function GridBody<T extends RowData = RowData>({
  data,
  columns,
  getRowId,
  enableVirtualScroll = false,
  containerHeight = 600,
  rowHeight = 40,
  onScroll,
}: GridBodyProps<T>) {
  const bodyRef = useRef<HTMLDivElement>(null);

  // Handle scroll events for header sync (non-virtual scroll mode)
  useEffect(() => {
    if (enableVirtualScroll) return; // VirtualScroller handles its own scroll
    
    const element = bodyRef.current;
    if (!element || !onScroll) return;

    const handleScroll = () => {
      onScroll(element.scrollLeft);
    };

    element.addEventListener('scroll', handleScroll, { passive: true });
    return () => element.removeEventListener('scroll', handleScroll);
  }, [onScroll, enableVirtualScroll]);

  if (data.length === 0) {
    return (
      <div className={styles.gridBody} ref={bodyRef}>
        <div className={styles.emptyState}>No data available</div>
      </div>
    );
  }

  // Use virtual scrolling for large datasets
  if (enableVirtualScroll) {
    return (
      <div className={styles.gridBody} role="rowgroup" ref={bodyRef}>
        <VirtualScroller
          data={data}
          columns={columns}
          getRowId={getRowId}
          containerHeight={containerHeight}
          rowHeight={rowHeight}
          onHorizontalScroll={onScroll}
        />
      </div>
    );
  }

  // Regular rendering for small datasets
  return (
    <div className={styles.gridBody} role="rowgroup" ref={bodyRef}>
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
