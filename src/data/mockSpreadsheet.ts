/**
 * Mock spreadsheet data for Excel-like display mode
 * Diverse data types for comprehensive testing
 */

export interface SpreadsheetRow {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  position: string;
  salary: number;
  hireDate: Date;
  isActive: boolean;
  performanceRating: number;
  location: string;
  manager: string;
  projectsCompleted: number;
}

/**
 * Generate mock spreadsheet data
 * 120 rows of employee data
 */
export const mockSpreadsheetData: SpreadsheetRow[] = [
  // Generate programmatically for larger dataset
  ...Array.from({ length: 120 }, (_, i) => {
    const id = i + 1;
    const departments = ['Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Support'];
    const positions = ['Junior', 'Mid-Level', 'Senior', 'Lead', 'Manager', 'Director'];
    const locations = ['New York', 'San Francisco', 'Austin', 'Seattle', 'Boston', 'Chicago', 'Remote'];
    const firstNames = [
      'John', 'Jane', 'Mike', 'Sarah', 'David', 'Emily', 'Chris', 'Lisa',
      'Tom', 'Anna', 'James', 'Maria', 'Robert', 'Jennifer', 'Michael', 'Linda',
      'William', 'Patricia', 'Richard', 'Barbara', 'Joseph', 'Susan', 'Thomas', 'Jessica',
    ];
    const lastNames = [
      'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
      'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas',
    ];
    
    const dept = departments[id % departments.length];
    const position = positions[id % positions.length];
    const firstName = firstNames[id % firstNames.length];
    const lastName = lastNames[id % lastNames.length];
    const location = locations[id % locations.length];
    
    // Generate hire date (random date in past 5 years)
    const daysAgo = Math.floor(Math.random() * 1825); // 5 years
    const hireDate = new Date();
    hireDate.setDate(hireDate.getDate() - daysAgo);
    
    // Salary based on position
    const baseSalary = {
      'Junior': 60000,
      'Mid-Level': 85000,
      'Senior': 120000,
      'Lead': 150000,
      'Manager': 180000,
      'Director': 220000,
    }[position] || 75000;
    
    const salary = baseSalary + Math.floor(Math.random() * 20000);
    
    return {
      id,
      employeeId: `EMP${String(id).padStart(4, '0')}`,
      firstName,
      lastName,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
      department: dept,
      position,
      salary,
      hireDate,
      isActive: Math.random() > 0.05, // 95% active
      performanceRating: Math.floor(Math.random() * 5) + 1, // 1-5
      location,
      manager: id % 10 !== 0 ? `${firstNames[Math.floor(id / 10) % firstNames.length]} ${lastNames[Math.floor(id / 10) % lastNames.length]}` : 'CEO',
      projectsCompleted: Math.floor(Math.random() * 50),
    };
  }),
];
