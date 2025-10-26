/**
 * Demo page for the DataGrid component
 * Shows spreadsheet mode with mock data
 */

import { GridContainer } from '../DataGrid';
import { createSpreadsheetDataProvider } from '../../services/mockDataProviders';
import type { GridConfig } from '../../types/config.types';
import type { RowData } from '../../types/grid.types';
import type { DataProvider } from '../../types/data.types';
import styles from './DemoPage.module.css';

/**
 * Grid configuration
 */
const gridConfig: GridConfig<RowData> = {
  columns: [
    { key: 'employeeId', header: 'ID', width: '80px', sortable: true },
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
    { 
      key: 'isActive', 
      header: 'Active', 
      width: '100px',
      formatter: (value) => value ? '✓ Yes' : '✗ No',
    },
  ],
  displayMode: 'spreadsheet',
  features: {
    sorting: {
      enabled: true,
    },
    pagination: {
      enabled: true,
      pageSize: 20,
    },
  },
};

/**
 * Demo page component
 */
export function DemoPage() {
  /**
 * Data provider with no delay for instant loading
 */
const dataProvider = createSpreadsheetDataProvider(0) as unknown as DataProvider<RowData>;

  return (
    <div className={styles.demoPage}>
      <header className={styles.header}>
        <h1>CROW Data Grid Demo</h1>
        <p>Spreadsheet Mode - Employee Data</p>
      </header>
      
      <main className={styles.main}>
        <div className={styles.gridWrapper}>
          <GridContainer
            config={gridConfig}
            dataProvider={dataProvider}
          />
        </div>
      </main>

      <footer className={styles.footer}>
        <p>Click column headers to sort • Shift+click for multi-column sort</p>
      </footer>
    </div>
  );
}
