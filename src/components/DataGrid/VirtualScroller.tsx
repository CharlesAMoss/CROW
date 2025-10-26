import { useRef, useEffect, useState } from 'react';
import { useVirtualScroll } from '../../hooks/useVirtualScroll';
import { GridRow } from './GridRow';
import type { RowData } from '../../types/grid.types';
import type { ColumnDefinition } from '../../types/config.types';
import styles from './VirtualScroller.module.css';

interface VirtualScrollerProps<T extends RowData> {
  /** All data items (full dataset) */
  data: T[];
  /** Column configuration */
  columns: ColumnDefinition<T>[];
  /** Function to get unique row ID */
  getRowId: (row: T, index: number) => string | number;
  /** Height of each row in pixels */
  rowHeight?: number;
  /** Height of the scrollable container */
  containerHeight?: number;
  /** Number of buffer rows to render */
  overscan?: number;
  /** Callback for horizontal scroll sync */
  onHorizontalScroll?: (scrollLeft: number) => void;
}

/**
 * VirtualScroller component
 * Renders only visible rows for performance with large datasets
 */
export function VirtualScroller<T extends RowData>({
  data,
  columns,
  getRowId,
  rowHeight = 40,
  containerHeight = 600,
  overscan = 10,
  onHorizontalScroll,
}: VirtualScrollerProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [measuredHeight, setMeasuredHeight] = useState(containerHeight);

  // Measure actual container height
  useEffect(() => {
    if (containerRef.current) {
      const observer = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (entry) {
          setMeasuredHeight(entry.contentRect.height);
        }
      });

      observer.observe(containerRef.current);
      
      // Set initial height
      setMeasuredHeight(containerRef.current.clientHeight || containerHeight);

      return () => observer.disconnect();
    }
  }, [containerHeight]);

  // Use virtual scroll hook
  const {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll,
  } = useVirtualScroll({
    totalItems: data.length,
    itemHeight: rowHeight,
    containerHeight: measuredHeight,
    overscan,
  });

  // Handle scroll events (both vertical and horizontal)
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    onScroll(e); // Handle vertical scroll for virtualization
    if (onHorizontalScroll) {
      onHorizontalScroll(e.currentTarget.scrollLeft);
    }
  };

  return (
    <div
      ref={containerRef}
      className={styles.virtualScroller}
      onScroll={handleScroll}
      style={{ height: containerHeight }}
    >
      {/* Spacer to create scrollbar with correct height */}
      <div
        className={styles.spacer}
        style={{ height: totalHeight }}
      />
      
      {/* Container for visible rows */}
      <div
        className={styles.content}
        style={{
          transform: `translateY(${offsetY}px)`,
        }}
      >
        {visibleItems.map((index) => {
          const row = data[index];
          if (!row) return null;
          
          return (
            <GridRow
              key={getRowId(row, index)}
              row={row}
              rowIndex={index}
              columns={columns}
            />
          );
        })}
      </div>
    </div>
  );
}
