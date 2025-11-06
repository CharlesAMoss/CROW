/**
 * ImageModal component
 * Full-screen modal for viewing images with row details
 */

import { useEffect, useCallback } from 'react';
import type { RowData, CellValue } from '../../types/grid.types';
import type { ColumnDefinition } from '../../types/config.types';
import styles from './ImageModal.module.css';

export interface ImageModalProps<T extends RowData = RowData> {
  /** Whether modal is open */
  isOpen: boolean;
  /** Image URL to display */
  imageUrl: string;
  /** Row data to display */
  row: T;
  /** Column definitions for metadata display */
  columns: ColumnDefinition<T>[];
  /** Close handler */
  onClose: () => void;
}

/**
 * ImageModal component
 * Displays full-size image with metadata overlay
 */
export function ImageModal<T extends RowData = RowData>({
  isOpen,
  imageUrl,
  row,
  columns,
  onClose,
}: ImageModalProps<T>) {
  // Close on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const formatValue = (value: CellValue): string => {
    if (value === null || value === undefined) return '—';
    if (value instanceof Date) return value.toLocaleDateString();
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return String(value);
  };

  return (
    <div 
      className={styles.modalOverlay}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Image details"
    >
      <button
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close modal"
        type="button"
      >
        ✕
      </button>

      <div className={styles.modalContent}>
        <div className={styles.imageContainer}>
          <img
            src={imageUrl}
            alt="Full size"
            className={styles.fullImage}
          />
        </div>

        <div className={styles.detailsPanel}>
          <h2 className={styles.detailsTitle}>Details</h2>
          <dl className={styles.detailsList}>
            {columns.map((column) => {
              // Skip the image URL column in details
              const value = row[column.key];
              if (typeof value === 'string' && value.startsWith('http') && value.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                return null;
              }

              return (
                <div key={String(column.key)} className={styles.detailsItem}>
                  <dt className={styles.detailsLabel}>{column.header}</dt>
                  <dd className={styles.detailsValue}>
                    {column.formatter 
                      ? column.formatter(value, row, column)
                      : formatValue(value)}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </div>
  );
}
