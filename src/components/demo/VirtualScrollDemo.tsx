import { useMemo } from 'react';
import { GridContainer } from '../DataGrid';
import { InMemoryDataProvider } from '../../services/InMemoryDataProvider';
import { generateLargeDataset } from '../../data/mockLargeDataset';
import type { GridConfig } from '../../types/config.types';
import type { RowData, DataProvider } from '../../types';
import crowLogo from '../../assets/crow.png';
import styles from './VirtualScrollDemo.module.css';

export function VirtualScrollDemo() {
  // Generate large dataset (10,000 rows)
  const largeData = useMemo(() => generateLargeDataset(10000), []);

  // Create data provider
  const dataProvider = useMemo(
    () =>
      new InMemoryDataProvider({
        data: largeData,
        getItemId: (item) => item.id,
        delay: 0,
      }) as unknown as DataProvider<RowData>,
    [largeData]
  );

  const config: GridConfig<RowData> = {
    columns: [
      { key: 'id', header: 'ID', width: '80px', sortable: true },
      { key: 'employeeId', header: 'Employee ID', width: '120px', sortable: true },
      { key: 'firstName', header: 'First Name', width: '150px', sortable: true },
      { key: 'lastName', header: 'Last Name', width: '150px', sortable: true },
      { key: 'email', header: 'Email', width: '250px', sortable: true },
      { key: 'department', header: 'Department', width: '150px', sortable: true },
      { key: 'position', header: 'Position', width: '180px', sortable: true },
      {
        key: 'salary',
        header: 'Salary',
        width: '120px',
        sortable: true,
        formatter: (value) => {
          if (typeof value === 'number') {
            return `$${value.toLocaleString()}`;
          }
          return String(value);
        },
      },
      {
        key: 'hireDate',
        header: 'Hire Date',
        width: '130px',
        sortable: true,
        formatter: (value) => {
          if (value instanceof Date) {
            return value.toLocaleDateString();
          }
          return String(value);
        },
      },
      { key: 'location', header: 'Location', width: '150px', sortable: true },
      { key: 'manager', header: 'Manager', width: '150px', sortable: true },
      {
        key: 'performanceRating',
        header: 'Rating',
        width: '80px',
        sortable: true,
        formatter: (value) => `${value}/5`,
      },
      {
        key: 'projectsCompleted',
        header: 'Projects',
        width: '100px',
        sortable: true,
      },
      {
        key: 'isActive',
        header: 'Active',
        width: '100px',
        formatter: (value) => (value ? '✓ Yes' : '✗ No'),
      },
    ],
    displayMode: 'spreadsheet',
    features: {
      sorting: {
        enabled: true,
      },
      virtualization: {
        enabled: true,
        containerHeight: 600,
        rowHeight: 40,
        overscanCount: 10,
      },
      pagination: {
        enabled: false, // Disable pagination with virtual scrolling
        pageSize: 100000, // Fetch all rows at once
      },
    },
  };

  return (
    <div className={styles.demoPage}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <div className={styles.titleRow}>
            <img src={crowLogo} alt="CROW" className={styles.crowLogo} />
            <h1 className={styles.title}>Virtual Scrolling</h1>
          </div>
          <p className={styles.subtitle}>10,000 employees</p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>{largeData.length.toLocaleString()}</span>
            <span className={styles.statLabel}>total</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <span className={styles.statValue}>~20</span>
            <span className={styles.statLabel}>rendered</span>
          </div>
          <div className={styles.statDivider}></div>
          <div className={styles.stat}>
            <span className={styles.statValue}>400k px</span>
            <span className={styles.statLabel}>height</span>
          </div>
        </div>
      </div>

      <div className={styles.gridWrapper}>
        <GridContainer 
          config={config} 
          dataProvider={dataProvider}
          initialData={largeData as unknown as RowData[]}
        />
      </div>
    </div>
  );
}
