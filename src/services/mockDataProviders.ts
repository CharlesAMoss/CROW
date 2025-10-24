/**
 * Mock data provider factories
 * Pre-configured data providers for each display mode
 */

import { InMemoryDataProvider } from './InMemoryDataProvider';
import { 
  mockImages,
  mockSpreadsheetData, 
  mockWorkflowData, 
  mockNestedData 
} from '../data';
import type { ImageData } from '../data/mockImages';
import type { SpreadsheetRow } from '../data/mockSpreadsheet';
import type { WorkflowTask } from '../data/mockWorkflow';
import type { NestedItem } from '../data/mockNested';

/**
 * Create image gallery data provider
 */
export function createImageDataProvider(delay: number = 300) {
  return new InMemoryDataProvider<ImageData>({
    data: mockImages,
    getItemId: (item) => item.id,
    searchFields: ['title', 'photographer', 'description'],
    delay,
  });
}

/**
 * Create spreadsheet data provider
 */
export function createSpreadsheetDataProvider(delay: number = 300) {
  return new InMemoryDataProvider<SpreadsheetRow>({
    data: mockSpreadsheetData,
    getItemId: (item) => item.employeeId,
    searchFields: ['firstName', 'lastName', 'email', 'department', 'position', 'manager'],
    delay,
  });
}

/**
 * Create workflow data provider
 */
export function createWorkflowDataProvider(delay: number = 300) {
  return new InMemoryDataProvider<WorkflowTask>({
    data: mockWorkflowData,
    getItemId: (item) => item.taskId,
    searchFields: ['title', 'description', 'assignee', 'reporter'],
    delay,
  });
}

/**
 * Create nested list data provider
 */
export function createNestedDataProvider(delay: number = 300) {
  return new InMemoryDataProvider<NestedItem>({
    data: mockNestedData,
    getItemId: (item) => item.id,
    searchFields: ['name', 'description'],
    delay,
  });
}
