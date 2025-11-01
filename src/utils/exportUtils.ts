/**
 * Export utilities for data grid
 * Supports CSV and Excel (XLSX) export formats
 */

import type { RowData, CellValue } from '../types';

/**
 * Convert CellValue to string for export
 */
function cellValueToString(value: CellValue): string {
  if (value === null || value === undefined) return '';
  if (value instanceof Date) return value.toISOString().split('T')[0]; // YYYY-MM-DD format
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return String(value);
}

/**
 * Escape CSV cell value (handle commas, quotes, newlines)
 */
function escapeCsvCell(value: string): string {
  // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/**
 * Export data to CSV format
 * @param data - Array of row data objects
 * @param columns - Column keys to include (in order)
 * @param headers - Optional custom header labels (defaults to column keys)
 * @param filename - Output filename (without extension)
 */
export function exportToCSV<T extends RowData>(
  data: T[],
  columns: (keyof T)[],
  headers?: string[],
  filename: string = 'export'
): void {
  // Use provided headers or default to column keys
  const headerLabels = headers || columns.map(col => String(col));
  
  // Build CSV content
  const csvRows: string[] = [];
  
  // Add header row
  csvRows.push(headerLabels.map(escapeCsvCell).join(','));
  
  // Add data rows
  data.forEach(row => {
    const rowValues = columns.map(col => {
      const value = row[col];
      const strValue = cellValueToString(value);
      return escapeCsvCell(strValue);
    });
    csvRows.push(rowValues.join(','));
  });
  
  // Create CSV content
  const csvContent = csvRows.join('\n');
  
  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${filename}.csv`);
}

/**
 * Export data to Excel (XLSX) format using simple XML structure
 * Note: This creates a basic XLSX file without external dependencies
 * For advanced features, consider using libraries like xlsx or exceljs
 * 
 * @param data - Array of row data objects
 * @param columns - Column keys to include (in order)
 * @param headers - Optional custom header labels (defaults to column keys)
 * @param filename - Output filename (without extension)
 */
export function exportToExcel<T extends RowData>(
  data: T[],
  columns: (keyof T)[],
  headers?: string[],
  filename: string = 'export'
): void {
  // Use provided headers or default to column keys
  const headerLabels = headers || columns.map(col => String(col));
  
  // Build XML for Excel
  const worksheetData: string[] = [];
  
  // Add header row
  worksheetData.push('<Row>');
  headerLabels.forEach(header => {
    worksheetData.push(`<Cell><Data ss:Type="String">${escapeXml(header)}</Data></Cell>`);
  });
  worksheetData.push('</Row>');
  
  // Add data rows
  data.forEach(row => {
    worksheetData.push('<Row>');
    columns.forEach(col => {
      const value = row[col];
      const { type, content } = getCellTypeAndContent(value);
      worksheetData.push(`<Cell><Data ss:Type="${type}">${escapeXml(content)}</Data></Cell>`);
    });
    worksheetData.push('</Row>');
  });
  
  // Create Excel XML structure
  const excelXml = `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Sheet1">
  <Table>
   ${worksheetData.join('\n   ')}
  </Table>
 </Worksheet>
</Workbook>`;
  
  // Create blob and download
  const blob = new Blob([excelXml], { type: 'application/vnd.ms-excel' });
  downloadBlob(blob, `${filename}.xls`);
}

/**
 * Determine Excel cell type and format content
 */
function getCellTypeAndContent(value: CellValue): { type: string; content: string } {
  if (value === null || value === undefined) {
    return { type: 'String', content: '' };
  }
  
  if (typeof value === 'number') {
    return { type: 'Number', content: String(value) };
  }
  
  if (typeof value === 'boolean') {
    return { type: 'Boolean', content: value ? '1' : '0' };
  }
  
  if (value instanceof Date) {
    return { type: 'DateTime', content: value.toISOString() };
  }
  
  return { type: 'String', content: String(value) };
}

/**
 * Escape XML special characters
 */
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Download blob as file
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
