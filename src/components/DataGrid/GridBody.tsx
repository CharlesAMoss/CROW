/**
 * GridBody component
 * Renders the data rows with optional virtual scrolling
 */

import { useRef, useEffect } from 'react';
import { GridRow } from './GridRow';
import { VirtualScroller } from './VirtualScroller';
import { ImageCell } from './ImageCell';
import { ImageModal } from './ImageModal';
import { useGridContext } from './GridContext';
import type { ColumnDefinition } from '../../types/config.types';
import type { RowData, DisplayMode } from '../../types/grid.types';
import styles from './GridBody.module.css';

export interface GridBodyProps<T extends RowData = RowData> {
  /** Data rows */
  data: T[];
  /** Column definitions */
  columns: ColumnDefinition<T>[];
  /** Display mode */
  displayMode?: DisplayMode;
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
  /** Enable row selection */
  selectable?: boolean;
  /** Row key field */
  rowKey?: keyof T;
}

/**
 * GridBody component
 */
export function GridBody<T extends RowData = RowData>({
  data,
  columns,
  displayMode = 'spreadsheet',
  getRowId,
  enableVirtualScroll = false,
  containerHeight = 600,
  rowHeight = 40,
  onScroll,
  selectable = false,
  rowKey = 'id' as keyof T,
}: GridBodyProps<T>) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const { state, dispatch } = useGridContext<T>();

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

  // Gallery mode (fullbleed) - renders images in CSS Grid
  if (displayMode === 'fullbleed') {
    // Find the image URL column - look for column with key containing 'image' or 'photo'
    // or check if values are image URLs
    const imageColumn = columns.find(col => {
      // First check if column key suggests it's an image column
      if (col.key.toString().toLowerCase().includes('image') || 
          col.key.toString().toLowerCase().includes('photo')) {
        return true;
      }
      
      // Otherwise check if the value looks like an image URL
      const sampleValue = data[0]?.[col.key];
      if (typeof sampleValue === 'string') {
        // Check for http/https URLs (Unsplash, etc) or local paths
        if (sampleValue.startsWith('http') || sampleValue.startsWith('/')) {
          // Check for file extension or common image hosting patterns
          return sampleValue.match(/\.(jpg|jpeg|png|gif|webp|svg|avif)($|\?)/i) ||
                 sampleValue.includes('unsplash.com') ||
                 sampleValue.includes('pexels.com') ||
                 sampleValue.includes('images.');
        }
      }
      return false;
    });

    if (!imageColumn) {
      return (
        <div className={styles.gridBody} ref={bodyRef}>
          <div className={styles.emptyState}>No image column found. Add a column with key containing 'image' or valid image URLs.</div>
        </div>
      );
    }

    const handleImageClick = (row: T, rowIndex: number) => {
      dispatch({
        type: 'OPEN_MODAL',
        payload: {
          type: 'detail',
          rowData: row,
          rowIndex,
        }
      });
    };

    return (
      <>
        <div 
          className={`${styles.gridBody} ${styles.galleryGrid}`} 
          ref={bodyRef}
          data-display-mode="fullbleed"
        >
          {data.map((row, index) => {
            const imageUrl = String(row[imageColumn.key]);
            const altText = columns.find(col => col.key === 'title' || col.key === 'name')
              ? String(row[columns.find(col => col.key === 'title' || col.key === 'name')!.key] || 'Image')
              : 'Image';

            return (
              <ImageCell
                key={getRowId(row, index)}
                imageUrl={imageUrl}
                alt={altText}
                row={row}
                rowIndex={index}
                onClick={handleImageClick}
              />
            );
          })}
        </div>

        {/* Image Modal */}
        {state.modal && (
          <ImageModal
            isOpen={true}
            imageUrl={String(state.modal.rowData[imageColumn.key])}
            row={state.modal.rowData as T}
            columns={columns}
            onClose={() => dispatch({ type: 'CLOSE_MODAL' })}
          />
        )}
      </>
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
          selectable={selectable}
          rowKey={rowKey}
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
          selectable={selectable}
          rowKey={rowKey}
        />
      ))}
    </div>
  );
}
