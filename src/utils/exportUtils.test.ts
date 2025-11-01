import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { exportToCSV, exportToExcel } from './exportUtils';
import type { RowData } from '../types';

// Helper function to read blob content as text (jsdom doesn't have Blob.text())
async function readBlobAsText(blob: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.readAsText(blob);
  });
}

describe('exportUtils', () => {
  // Mock data for testing
  const testData: RowData[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      age: 30,
      salary: 75000,
      isActive: true,
      hireDate: new Date('2020-01-15'),
      department: 'Engineering',
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      age: 28,
      salary: 68000,
      isActive: false,
      hireDate: new Date('2021-03-20'),
      department: 'Sales',
    },
    {
      id: 3,
      name: 'Bob "The Builder" Johnson',
      email: 'bob@example.com',
      age: 35,
      salary: 82000,
      isActive: true,
      hireDate: new Date('2019-07-10'),
      department: 'Operations, Planning',
    },
  ];

  // Mock URL and DOM APIs
  let createObjectURLSpy: ReturnType<typeof vi.fn>;
  let revokeObjectURLSpy: ReturnType<typeof vi.fn>;
  let appendChildSpy: ReturnType<typeof vi.fn>;
  let removeChildSpy: ReturnType<typeof vi.fn>;
  let clickSpy: ReturnType<typeof vi.fn>;
  let mockLink: HTMLAnchorElement;

  beforeEach(() => {
    // Mock URL.createObjectURL and URL.revokeObjectURL
    createObjectURLSpy = vi.fn(() => 'blob:mock-url');
    revokeObjectURLSpy = vi.fn();
    window.URL.createObjectURL = createObjectURLSpy;
    window.URL.revokeObjectURL = revokeObjectURLSpy;

    // Mock document.createElement for anchor element
    clickSpy = vi.fn();
    mockLink = {
      href: '',
      download: '',
      click: clickSpy,
    } as unknown as HTMLAnchorElement;

    appendChildSpy = vi.fn();
    removeChildSpy = vi.fn();
    vi.spyOn(document, 'createElement').mockReturnValue(mockLink);
    vi.spyOn(document.body, 'appendChild').mockImplementation(appendChildSpy);
    vi.spyOn(document.body, 'removeChild').mockImplementation(removeChildSpy);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('exportToCSV', () => {
    test('exports basic data to CSV format', () => {
      const columns: (keyof RowData)[] = ['id', 'name', 'email'];
      const headers = ['ID', 'Name', 'Email'];

      exportToCSV(testData, columns, headers, 'test-export');

      // Check that a Blob was created
      expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
      const blob = createObjectURLSpy.mock.calls[0][0] as Blob;
      expect(blob.type).toBe('text/csv;charset=utf-8;');

      // Check download attributes
      expect(mockLink.download).toBe('test-export.csv');
      expect(mockLink.href).toBe('blob:mock-url');

      // Check that link was clicked and cleaned up
      expect(clickSpy).toHaveBeenCalledTimes(1);
      expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
      expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
    });

    test('properly escapes CSV special characters', async () => {
      const columns: (keyof RowData)[] = ['name', 'department'];
      const headers = ['Name', 'Department'];

      exportToCSV(testData, columns, headers, 'escape-test');

      const blob = createObjectURLSpy.mock.calls[0][0] as Blob;
      const csvContent = await readBlobAsText(blob);
      const lines = csvContent.split('\n');

      // Check header
      expect(lines[0]).toBe('Name,Department');

      // Check that commas in values are escaped with quotes
      expect(lines[3]).toContain('"Operations, Planning"');

      // Check that quotes in values are escaped with double quotes
      expect(lines[3]).toContain('"Bob ""The Builder"" Johnson"');
    });

    test('converts data types correctly for CSV', async () => {
      const columns: (keyof RowData)[] = ['id', 'salary', 'isActive', 'hireDate'];
      const headers = ['ID', 'Salary', 'Active', 'Hire Date'];

      exportToCSV(testData, columns, headers, 'types-test');

      const blob = createObjectURLSpy.mock.calls[0][0] as Blob;
      const csvContent = await readBlobAsText(blob);
      const lines = csvContent.split('\n');

      // Check first data row
      expect(lines[1]).toBe('1,75000,true,2020-01-15');

      // Check boolean conversion
      expect(lines[2]).toContain('false');

      // Check date formatting (YYYY-MM-DD)
      expect(lines[1]).toContain('2020-01-15');
      expect(lines[2]).toContain('2021-03-20');
    });

    test('uses column keys as headers when headers not provided', async () => {
      const columns: (keyof RowData)[] = ['id', 'name'];

      exportToCSV(testData, columns, undefined, 'no-headers');

      const blob = createObjectURLSpy.mock.calls[0][0] as Blob;
      const csvContent = await readBlobAsText(blob);
      const lines = csvContent.split('\n');

      // Should use column keys as headers
      expect(lines[0]).toBe('id,name');
    });

    test('handles null and undefined values', async () => {
      const dataWithNulls: RowData[] = [
        { id: 1, name: 'Test', value: null, other: undefined },
      ];
      const columns: (keyof RowData)[] = ['id', 'name', 'value', 'other'];

      exportToCSV(dataWithNulls, columns, undefined, 'nulls-test');

      const blob = createObjectURLSpy.mock.calls[0][0] as Blob;
      const csvContent = await readBlobAsText(blob);
      const lines = csvContent.split('\n');

      // Null and undefined should become empty strings
      expect(lines[1]).toBe('1,Test,,');
    });

    test('uses default filename when not provided', () => {
      const columns: (keyof RowData)[] = ['id'];

      exportToCSV(testData, columns);

      expect(mockLink.download).toBe('export.csv');
    });

    test('handles empty data array', async () => {
      const columns: (keyof RowData)[] = ['id', 'name'];
      const headers = ['ID', 'Name'];

      exportToCSV([], columns, headers, 'empty-test');

      const blob = createObjectURLSpy.mock.calls[0][0] as Blob;
      const csvContent = await readBlobAsText(blob);

      // Should only have header row
      expect(csvContent).toBe('ID,Name');
    });

    test('handles newlines in cell values', async () => {
      const dataWithNewlines: RowData[] = [
        { id: 1, description: 'Line 1\nLine 2\nLine 3' },
      ];
      const columns: (keyof RowData)[] = ['id', 'description'];

      exportToCSV(dataWithNewlines, columns, undefined, 'newlines-test');

      const blob = createObjectURLSpy.mock.calls[0][0] as Blob;
      const csvContent = await readBlobAsText(blob);

      // Newlines in values should be wrapped in quotes
      expect(csvContent).toContain('"Line 1\nLine 2\nLine 3"');
    });
  });

  describe('exportToExcel', () => {
    test('exports basic data to Excel format', () => {
      const columns: (keyof RowData)[] = ['id', 'name', 'email'];
      const headers = ['ID', 'Name', 'Email'];

      exportToExcel(testData, columns, headers, 'test-export');

      // Check that a Blob was created with Excel MIME type
      expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
      const blob = createObjectURLSpy.mock.calls[0][0] as Blob;
      expect(blob.type).toBe('application/vnd.ms-excel');

      // Check download attributes
      expect(mockLink.download).toBe('test-export.xls');
      expect(mockLink.href).toBe('blob:mock-url');

      // Check that link was clicked and cleaned up
      expect(clickSpy).toHaveBeenCalledTimes(1);
      expect(appendChildSpy).toHaveBeenCalledWith(mockLink);
      expect(removeChildSpy).toHaveBeenCalledWith(mockLink);
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
    });

    test('generates valid Excel XML structure', async () => {
      const columns: (keyof RowData)[] = ['id', 'name'];
      const headers = ['ID', 'Name'];

      exportToExcel(testData, columns, headers, 'xml-test');

      const blob = createObjectURLSpy.mock.calls[0][0] as Blob;
      const xmlContent = await readBlobAsText(blob);

      // Check XML declaration
      expect(xmlContent).toContain('<?xml version="1.0"?>');
      expect(xmlContent).toContain('<?mso-application progid="Excel.Sheet"?>');

      // Check XML structure
      expect(xmlContent).toContain('<Workbook');
      expect(xmlContent).toContain('<Worksheet ss:Name="Sheet1">');
      expect(xmlContent).toContain('<Table>');
      expect(xmlContent).toContain('</Table>');
      expect(xmlContent).toContain('</Worksheet>');
      expect(xmlContent).toContain('</Workbook>');
    });

    test('sets correct cell types for different data types', async () => {
      const columns: (keyof RowData)[] = ['id', 'name', 'salary', 'isActive', 'hireDate'];
      const headers = ['ID', 'Name', 'Salary', 'Active', 'Hire Date'];

      exportToExcel(testData, columns, headers, 'types-test');

      const blob = createObjectURLSpy.mock.calls[0][0] as Blob;
      const xmlContent = await readBlobAsText(blob);

      // Check that different types are correctly marked
      expect(xmlContent).toContain('ss:Type="Number"'); // For id and salary
      expect(xmlContent).toContain('ss:Type="String"'); // For name
      expect(xmlContent).toContain('ss:Type="Boolean"'); // For isActive
      expect(xmlContent).toContain('ss:Type="DateTime"'); // For hireDate
    });

    test('properly escapes XML special characters', async () => {
      const dataWithSpecialChars: RowData[] = [
        { 
          id: 1, 
          text: '<tag>Text & "quotes" & \'apostrophes\'</tag>' 
        },
      ];
      const columns: (keyof RowData)[] = ['id', 'text'];

      exportToExcel(dataWithSpecialChars, columns, undefined, 'escape-test');

      const blob = createObjectURLSpy.mock.calls[0][0] as Blob;
      const xmlContent = await readBlobAsText(blob);

      // XML special characters should be escaped
      expect(xmlContent).toContain('&lt;tag&gt;');
      expect(xmlContent).toContain('&amp;');
      expect(xmlContent).toContain('&quot;');
      expect(xmlContent).toContain('&apos;');
    });

    test('converts boolean values to Excel format', async () => {
      const columns: (keyof RowData)[] = ['name', 'isActive'];
      const headers = ['Name', 'Active'];

      exportToExcel(testData, columns, headers, 'boolean-test');

      const blob = createObjectURLSpy.mock.calls[0][0] as Blob;
      const xmlContent = await readBlobAsText(blob);

      // Booleans should be 1 or 0 in Excel
      expect(xmlContent).toMatch(/<Data ss:Type="Boolean">1<\/Data>/); // true
      expect(xmlContent).toMatch(/<Data ss:Type="Boolean">0<\/Data>/); // false
    });

    test('formats dates as ISO strings', async () => {
      const columns: (keyof RowData)[] = ['name', 'hireDate'];
      const headers = ['Name', 'Hire Date'];

      exportToExcel(testData, columns, headers, 'date-test');

      const blob = createObjectURLSpy.mock.calls[0][0] as Blob;
      const xmlContent = await readBlobAsText(blob);

      // Dates should be ISO format
      expect(xmlContent).toContain('2020-01-15');
      expect(xmlContent).toContain('2021-03-20');
      expect(xmlContent).toContain('2019-07-10');
    });

    test('uses column keys as headers when headers not provided', async () => {
      const columns: (keyof RowData)[] = ['id', 'name'];

      exportToExcel(testData, columns, undefined, 'no-headers');

      const blob = createObjectURLSpy.mock.calls[0][0] as Blob;
      const xmlContent = await readBlobAsText(blob);

      // Should use column keys as headers
      expect(xmlContent).toContain('>id<');
      expect(xmlContent).toContain('>name<');
    });

    test('handles null and undefined values', async () => {
      const dataWithNulls: RowData[] = [
        { id: 1, name: 'Test', value: null, other: undefined },
      ];
      const columns: (keyof RowData)[] = ['id', 'name', 'value', 'other'];

      exportToExcel(dataWithNulls, columns, undefined, 'nulls-test');

      const blob = createObjectURLSpy.mock.calls[0][0] as Blob;
      const xmlContent = await readBlobAsText(blob);

      // Null and undefined should become empty strings
      expect(xmlContent).toMatch(/<Data ss:Type="String"><\/Data>/);
    });

    test('uses default filename when not provided', () => {
      const columns: (keyof RowData)[] = ['id'];

      exportToExcel(testData, columns);

      expect(mockLink.download).toBe('export.xls');
    });

    test('handles empty data array', async () => {
      const columns: (keyof RowData)[] = ['id', 'name'];
      const headers = ['ID', 'Name'];

      exportToExcel([], columns, headers, 'empty-test');

      const blob = createObjectURLSpy.mock.calls[0][0] as Blob;
      const xmlContent = await readBlobAsText(blob);

      // Should have header row in XML structure
      expect(xmlContent).toContain('<Row>');
      expect(xmlContent).toContain('>ID<');
      expect(xmlContent).toContain('>Name<');
    });

    test('handles large numbers without scientific notation', async () => {
      const dataWithLargeNumbers: RowData[] = [
        { id: 1, bigNumber: 999999999999 },
      ];
      const columns: (keyof RowData)[] = ['id', 'bigNumber'];

      exportToExcel(dataWithLargeNumbers, columns, undefined, 'large-number-test');

      const blob = createObjectURLSpy.mock.calls[0][0] as Blob;
      const xmlContent = await readBlobAsText(blob);

      // Should preserve full number
      expect(xmlContent).toContain('999999999999');
    });
  });

  describe('integration tests', () => {
    test('CSV and Excel exports handle same data consistently', async () => {
      const columns: (keyof RowData)[] = ['id', 'name', 'email'];
      const headers = ['ID', 'Name', 'Email'];

      // Export to CSV
      exportToCSV(testData, columns, headers, 'csv-test');
      const csvBlob = createObjectURLSpy.mock.calls[0][0] as Blob;
      const csvContent = await readBlobAsText(csvBlob);
      const csvLines = csvContent.split('\n');

      // Reset mocks
      createObjectURLSpy.mockClear();

      // Export to Excel
      exportToExcel(testData, columns, headers, 'excel-test');
      const excelBlob = createObjectURLSpy.mock.calls[0][0] as Blob;
      const excelContent = await readBlobAsText(excelBlob);

      // Both should have same number of rows (header + 3 data rows)
      expect(csvLines.length).toBe(4); // Header + 3 data rows
      
      // Excel should contain all the same data values
      expect(excelContent).toContain('John Doe');
      expect(excelContent).toContain('Jane Smith');
      expect(excelContent).toContain('Bob &quot;The Builder&quot; Johnson');
    });
  });
});

