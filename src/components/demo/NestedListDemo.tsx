/**
 * Nested List Demo Page
 * Demonstrates hierarchical/tree data with expand/collapse functionality
 */

import { useState } from 'react';
import { GridContainer } from '../DataGrid';
import { InMemoryDataProvider } from '../../services/InMemoryDataProvider';
import { mockTreeData } from '../../data/mockNested';
import { getParentNodeIds } from '../../utils/treeUtils';
import type { GridConfig } from '../../types/config.types';
import type { RowData } from '../../types/grid.types';
import type { DataProvider } from '../../types/data.types';
import styles from './NestedListDemo.module.css';

// Create data provider
const createNestedDataProvider = (): DataProvider<RowData> => {
  return new InMemoryDataProvider({
    data: mockTreeData as unknown as RowData[],
    getItemId: (item) => item.id as string | number,
    delay: 0
  });
};

export function NestedListDemo() {
  const [dataProvider] = useState(() => createNestedDataProvider());

  // Grid configuration for tree/nested-list mode
  const config: GridConfig<RowData> = {
    displayMode: 'nested-list',
    columns: [
      {
        key: 'name',
        header: 'Name',
        width: '400px',
      },
      {
        key: 'type',
        header: 'Type',
        width: '140px',
        formatter: (value) => {
          const badges: Record<string, string> = {
            company: '🏢 Company',
            department: '📁 Department',
            team: '👥 Team',
            employee: '👤 Employee',
          };
          return badges[String(value)] || String(value);
        },
      },
      {
        key: 'description',
        header: 'Description',
        width: '300px',
      },
      {
        key: 'location',
        header: 'Location',
        width: '180px',
      },
      {
        key: 'headCount',
        header: 'Head Count',
        width: '100px',
        formatter: (value) => (value != null ? String(value) : '—'),
      },
    ],
    features: {
      sorting: {
        enabled: false, // Disabled for tree view
      },
      pagination: {
        enabled: false, // Disabled for tree view
      },
    },
  };

  // Calculate stats
  const allParentIds = getParentNodeIds(mockTreeData);

  return (
    <div className={styles.demoPage}>
      <div className={styles.header}>
        <h1>Organization Structure</h1>
        <p className={styles.description}>
          Interactive tree view showing the company hierarchy. Click the chevron icons to expand or collapse branches.
        </p>
      </div>

      <div className={styles.gridWrapper}>
        <GridContainer
          config={config}
          dataProvider={dataProvider}
          initialData={mockTreeData as unknown as RowData[]}
          initialState={{ expanded: new Set(allParentIds) }}
        />
      </div>

      <div className={styles.features}>
        <h2>Key Features</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureItem}>
            <strong>📊 Hierarchical Data</strong>
            <span>Display complex nested structures with unlimited depth. Perfect for org charts, file systems, and category trees.</span>
          </div>
          <div className={styles.featureItem}>
            <strong>🔽 Expand/Collapse</strong>
            <span>Interactive branch navigation with visual chevron indicators. Click to reveal or hide child nodes dynamically.</span>
          </div>
          <div className={styles.featureItem}>
            <strong>🎯 Visual Indentation</strong>
            <span>Clear hierarchical depth representation with 20px indentation per level. Instantly understand structure at a glance.</span>
          </div>
          <div className={styles.featureItem}>
            <strong>⌨️ Keyboard Support</strong>
            <span>Full keyboard accessibility with Space and Enter keys to expand/collapse. Navigate trees without a mouse.</span>
          </div>
          <div className={styles.featureItem}>
            <strong>♿ ARIA Compliant</strong>
            <span>Screen reader friendly with proper ARIA labels and tree grid semantics. Fully accessible for all users.</span>
          </div>
          <div className={styles.featureItem}>
            <strong>⚡ Optimized Performance</strong>
            <span>Only renders visible nodes in the DOM. Handles thousands of nodes efficiently with lazy rendering.</span>
          </div>
          <div className={styles.featureItem}>
            <strong>🎨 Customizable Styling</strong>
            <span>CSS module-based styling with full theme support. Easily adapt to match your design system.</span>
          </div>
          <div className={styles.featureItem}>
            <strong>📱 Responsive Design</strong>
            <span>Works seamlessly on mobile, tablet, and desktop. Touch-friendly interactions and adaptive layouts.</span>
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        <h3>Demo Dataset Overview</h3>
        <ul>
          <li>
            <strong>Total Nodes</strong>
            <span>{mockTreeData.length} total entries spanning the entire organization</span>
          </li>
          <li>
            <strong>Hierarchy Depth</strong>
            <span>4 levels deep (Company → Department → Team → Employee)</span>
          </li>
          <li>
            <strong>Parent Nodes</strong>
            <span>{allParentIds.length} expandable branches with child nodes</span>
          </li>
          <li>
            <strong>Leaf Nodes</strong>
            <span>{mockTreeData.length - allParentIds.length} individual employees at the bottom level</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
