/**
 * ExpandToggle Component
 * Chevron button for expanding/collapsing tree nodes
 */

import { useCallback } from 'react';
import styles from './ExpandToggle.module.css';

export interface ExpandToggleProps {
  /** Whether the node is expanded */
  isExpanded: boolean;
  /** Click handler for toggle */
  onToggle: () => void;
  /** Whether the node has children */
  hasChildren: boolean;
  /** Nesting level for indentation (0 for root) */
  level?: number;
  /** Aria label for accessibility */
  ariaLabel?: string;
}

export function ExpandToggle({
  isExpanded,
  onToggle,
  hasChildren,
  level = 0,
  ariaLabel,
}: ExpandToggleProps) {
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onToggle();
      }
    },
    [onToggle]
  );

  if (!hasChildren) {
    // Render empty placeholder to maintain layout alignment
    return <span className={styles.placeholder} style={{ width: `${level * 20}px` }} />;
  }

  return (
    <button
      type="button"
      className={styles.toggleButton}
      onClick={onToggle}
      onKeyDown={handleKeyDown}
      aria-expanded={isExpanded}
      aria-label={ariaLabel || (isExpanded ? 'Collapse' : 'Expand')}
      tabIndex={0}
    >
      <span className={styles.icon} aria-hidden="true">
        {isExpanded ? '▼' : '▶'}
      </span>
    </button>
  );
}
