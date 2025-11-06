/**
 * ImageCell component
 * Renders images with loading states and error handling for gallery mode
 */

import { useState, useEffect } from 'react';
import type { RowData } from '../../types/grid.types';
import styles from './ImageCell.module.css';

export interface ImageCellProps<T extends RowData = RowData> {
  /** Image URL */
  imageUrl: string;
  /** Alt text for image */
  alt?: string;
  /** Row data for click handler */
  row: T;
  /** Row index */
  rowIndex: number;
  /** Click handler */
  onClick?: (row: T, rowIndex: number) => void;
  /** Aspect ratio (default: '1/1' for square) */
  aspectRatio?: string;
}

/**
 * ImageCell component
 * Handles loading states, errors, and click interactions
 */
export function ImageCell<T extends RowData = RowData>({
  imageUrl,
  alt = 'Image',
  row,
  rowIndex,
  onClick,
  aspectRatio = '1/1',
}: ImageCellProps<T>) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset state when imageUrl changes
    setLoading(true);
    setError(false);

    // Preload image
    const img = new Image();
    img.src = imageUrl;
    
    img.onload = () => {
      setLoading(false);
    };
    
    img.onerror = () => {
      setLoading(false);
      setError(true);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [imageUrl]);

  const handleClick = () => {
    if (onClick && !loading && !error) {
      onClick(row, rowIndex);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick && !loading && !error) {
      e.preventDefault();
      onClick(row, rowIndex);
    }
  };

  return (
    <div 
      className={`${styles.imageCell} ${onClick ? styles.clickable : ''}`}
      style={{ aspectRatio }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={onClick ? `View ${alt}` : undefined}
    >
      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
        </div>
      )}
      
      {error && (
        <div className={styles.error}>
          <span className={styles.errorIcon}>🖼️</span>
          <span className={styles.errorText}>Failed to load</span>
        </div>
      )}
      
      {!loading && !error && (
        <img
          src={imageUrl}
          alt={alt}
          className={styles.image}
          loading="lazy"
        />
      )}
    </div>
  );
}
