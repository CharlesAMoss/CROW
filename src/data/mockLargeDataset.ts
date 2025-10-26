/**
 * Large dataset generator for virtual scrolling performance testing
 */

import type { SpreadsheetRow } from './mockSpreadsheet';

const firstNames = [
  'James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda',
  'William', 'Barbara', 'David', 'Elizabeth', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Christopher', 'Karen', 'Charles', 'Nancy', 'Daniel', 'Lisa',
  'Matthew', 'Betty', 'Anthony', 'Margaret', 'Mark', 'Sandra', 'Donald', 'Ashley',
  'Steven', 'Kimberly', 'Paul', 'Emily', 'Andrew', 'Donna', 'Joshua', 'Michelle',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
  'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White',
  'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young',
];

const departments = [
  'Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations',
  'Customer Support', 'Product', 'Legal', 'IT', 'Design', 'Research',
];

const positions = [
  'Manager', 'Director', 'Senior Engineer', 'Engineer', 'Junior Engineer',
  'Analyst', 'Senior Analyst', 'Specialist', 'Coordinator', 'Associate',
  'Vice President', 'Executive', 'Consultant', 'Lead', 'Principal',
];

const locations = [
  'New York', 'San Francisco', 'Austin', 'Seattle', 'Boston', 'Chicago',
  'Los Angeles', 'Denver', 'Atlanta', 'Miami', 'Portland', 'Remote',
];

const managers = [
  'Alice Johnson', 'Bob Smith', 'Carol Williams', 'David Brown', 'Eve Davis',
  'Frank Miller', 'Grace Wilson', 'Henry Moore', 'Iris Taylor', 'Jack Anderson',
];

/**
 * Generate a large dataset of employees for virtual scrolling testing
 * @param count - Number of rows to generate
 * @returns Array of SpreadsheetRow objects
 */
export function generateLargeDataset(count: number): SpreadsheetRow[] {
  const data: SpreadsheetRow[] = [];
  const startDate = new Date('2010-01-01');
  const endDate = new Date('2024-12-31');
  const dateRange = endDate.getTime() - startDate.getTime();

  for (let i = 0; i < count; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length];
    const department = departments[i % departments.length];
    const position = positions[i % positions.length];
    const location = locations[i % locations.length];
    const manager = managers[i % managers.length];
    
    // Generate hire date
    const randomDate = new Date(startDate.getTime() + Math.random() * dateRange);
    
    // Generate salary based on position
    let baseSalary = 50000;
    if (position.includes('Senior') || position.includes('Lead')) baseSalary = 90000;
    if (position.includes('Principal') || position.includes('Director')) baseSalary = 120000;
    if (position.includes('Vice President') || position.includes('Executive')) baseSalary = 180000;
    
    const salary = baseSalary + Math.floor(Math.random() * 30000);
    const performanceRating = Math.floor(Math.random() * 5) + 1; // 1-5
    const projectsCompleted = Math.floor(Math.random() * 50);
    
    data.push({
      id: i + 1,
      employeeId: `EMP${String(i + 1).padStart(6, '0')}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@company.com`,
      department,
      position,
      salary,
      hireDate: randomDate,
      isActive: Math.random() > 0.1, // 90% active
      performanceRating,
      location,
      manager,
      projectsCompleted,
    });
  }

  return data;
}

/**
 * Pre-generated datasets for common sizes
 */
export const LARGE_DATASETS = {
  /** 1,000 rows */
  small: () => generateLargeDataset(1000),
  /** 10,000 rows */
  medium: () => generateLargeDataset(10000),
  /** 50,000 rows */
  large: () => generateLargeDataset(50000),
  /** 100,000 rows */
  xlarge: () => generateLargeDataset(100000),
};
