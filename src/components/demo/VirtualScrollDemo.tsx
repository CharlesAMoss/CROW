import { useMemo } from 'react';
import { GridContainer } from '../DataGrid';
import { InMemoryDataProvider } from '../../services/InMemoryDataProvider';
import { generateLargeDataset } from '../../data/mockLargeDataset';
import { exportToCSV, exportToExcel } from '../../utils/exportUtils';
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

  // Export handlers
  const handleExportCSV = () => {
    const columns = ['id', 'employeeId', 'firstName', 'lastName', 'email', 'department', 
                     'position', 'location', 'salary', 'hireDate', 'performanceRating', 
                     'projectsCompleted', 'manager', 'isActive'] as (keyof RowData)[];
    const headers = ['ID', 'Employee ID', 'First Name', 'Last Name', 'Email', 'Department',
                     'Position', 'Location', 'Salary', 'Hire Date', 'Performance Rating',
                     'Projects Completed', 'Manager', 'Active'];
    exportToCSV(largeData as unknown as RowData[], columns, headers, 'employee-data');
  };

  const handleExportExcel = () => {
    const columns = ['id', 'employeeId', 'firstName', 'lastName', 'email', 'department', 
                     'position', 'location', 'salary', 'hireDate', 'performanceRating', 
                     'projectsCompleted', 'manager', 'isActive'] as (keyof RowData)[];
    const headers = ['ID', 'Employee ID', 'First Name', 'Last Name', 'Email', 'Department',
                     'Position', 'Location', 'Salary', 'Hire Date', 'Performance Rating',
                     'Projects Completed', 'Manager', 'Active'];
    exportToExcel(largeData as unknown as RowData[], columns, headers, 'employee-data');
  };

  const config: GridConfig<RowData> = {
    columns: [
      { key: 'id', header: 'ID', width: '80px', sortable: true, filterable: true, filterType: 'number' },
      { key: 'employeeId', header: 'Employee ID', width: '120px', sortable: true, filterable: true, filterType: 'text' },
      { key: 'firstName', header: 'First Name', width: '150px', sortable: true, filterable: true, filterType: 'text' },
      { key: 'lastName', header: 'Last Name', width: '150px', sortable: true, filterable: true, filterType: 'text' },
      { key: 'email', header: 'Email', width: '250px', sortable: true, filterable: true, filterType: 'text' },
      { 
        key: 'department', 
        header: 'Department', 
        width: '150px', 
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterOptions: [
          { label: 'Engineering', value: 'Engineering' },
          { label: 'Sales', value: 'Sales' },
          { label: 'Marketing', value: 'Marketing' },
          { label: 'Human Resources', value: 'Human Resources' },
          { label: 'Finance', value: 'Finance' },
          { label: 'Operations', value: 'Operations' },
        ]
      },
      { 
        key: 'position', 
        header: 'Position', 
        width: '180px', 
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterOptions: [
          { label: 'Software Engineer', value: 'Software Engineer' },
          { label: 'Senior Software Engineer', value: 'Senior Software Engineer' },
          { label: 'Sales Representative', value: 'Sales Representative' },
          { label: 'Sales Manager', value: 'Sales Manager' },
          { label: 'Marketing Specialist', value: 'Marketing Specialist' },
          { label: 'Marketing Manager', value: 'Marketing Manager' },
          { label: 'HR Specialist', value: 'HR Specialist' },
          { label: 'Financial Analyst', value: 'Financial Analyst' },
          { label: 'Operations Manager', value: 'Operations Manager' },
        ]
      },
      {
        key: 'salary',
        header: 'Salary',
        width: '120px',
        sortable: true,
        filterable: true,
        filterType: 'number',
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
        width: '180px', // Increased width for date input with calendar picker
        sortable: true,
        filterable: true,
        filterType: 'date',
        formatter: (value) => {
          if (value instanceof Date) {
            return value.toLocaleDateString();
          }
          return String(value);
        },
      },
      { 
        key: 'location', 
        header: 'Location', 
        width: '150px', 
        sortable: true,
        filterable: true,
        filterType: 'select',
        filterOptions: [
          { label: 'New York', value: 'New York' },
          { label: 'San Francisco', value: 'San Francisco' },
          { label: 'Los Angeles', value: 'Los Angeles' },
          { label: 'Chicago', value: 'Chicago' },
          { label: 'Austin', value: 'Austin' },
          { label: 'Seattle', value: 'Seattle' },
          { label: 'Boston', value: 'Boston' },
          { label: 'Denver', value: 'Denver' },
        ]
      },
      { 
        key: 'manager', 
        header: 'Manager', 
        width: '150px', 
        sortable: true,
        filterable: true,
        filterType: 'text',
      },
      {
        key: 'performanceRating',
        header: 'Rating',
        width: '80px',
        sortable: true,
        filterable: true,
        filterType: 'number',
        formatter: (value) => `${value}/5`,
      },
      {
        key: 'projectsCompleted',
        header: 'Projects',
        width: '100px',
        sortable: true,
        filterable: true,
        filterType: 'number',
      },
      {
        key: 'isActive',
        header: 'Active',
        width: '100px',
        filterable: true,
        filterType: 'select',
        filterOptions: [
          { label: 'Active', value: true },
          { label: 'Inactive', value: false },
        ],
        formatter: (value) => (value ? '✓ Yes' : '✗ No'),
      },
    ],
    displayMode: 'spreadsheet',
    features: {
      sorting: {
        enabled: true,
      },
      filtering: {
        enabled: true,
        debounceMs: 300,
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

      <div className={styles.exportBar}>
        <span className={styles.exportLabel}>Export Data:</span>
        <button 
          className={styles.exportButton}
          onClick={handleExportCSV}
          title="Export to CSV format"
        >
          📊 CSV
        </button>
        <button 
          className={styles.exportButton}
          onClick={handleExportExcel}
          title="Export to Excel format"
        >
          📈 Excel
        </button>
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
