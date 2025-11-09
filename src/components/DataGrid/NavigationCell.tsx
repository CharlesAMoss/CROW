/**
 * NavigationCell component
 * Custom cell that displays navigation links instead of an image
 * Maintains grid aspect ratio
 */

import styles from './NavigationCell.module.css';

export interface NavigationCellProps {
  onNavigate: (mode: 'nested' | 'virtual') => void;
}

export function NavigationCell({ onNavigate }: NavigationCellProps) {
  return (
    <div className={styles.navigationCell} style={{ aspectRatio: '1 / 1' }}>
      <div className={styles.content}>
        <h2 className={styles.title}>CROW</h2>
        
        <div className={styles.buttons}>
          <button 
            className={styles.navButton}
            onClick={() => onNavigate('nested')}
          >
            🌲 Nested List
          </button>
          <button 
            className={styles.navButton}
            onClick={() => onNavigate('virtual')}
          >
            ⚡ Virtual Scroll
          </button>
        </div>
      </div>
    </div>
  );
}
