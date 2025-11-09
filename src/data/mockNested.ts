/**
 * Mock nested/hierarchical data for tree/nested-list display mode
 * Organization structure with multiple levels
 */

import type { TreeNode } from '../types/grid.types';

export interface NestedItem {
  id: number;
  name: string;
  type: 'company' | 'department' | 'team' | 'employee';
  description: string;
  headCount?: number;
  budget?: number;
  location?: string;
  email?: string;
  position?: string;
  children?: NestedItem[];
}

/**
 * Mock nested organizational data
 * 4 levels deep with departments, teams, and employees
 * Compatible with TreeNode interface
 */
export const mockNestedData: NestedItem[] = [
  {
    id: 1,
    name: 'TechCorp Inc.',
    type: 'company',
    description: 'Leading technology company',
    headCount: 250,
    budget: 50000000,
    location: 'San Francisco, CA',
    children: [
      {
        id: 2,
        name: 'Engineering Department',
        type: 'department',
        description: 'Product development and engineering',
        headCount: 120,
        budget: 15000000,
        location: 'San Francisco, CA',
        children: [
          {
            id: 3,
            name: 'Frontend Team',
            type: 'team',
            description: 'UI/UX and client-side development',
            headCount: 15,
            budget: 2000000,
            children: [
              {
                id: 4,
                name: 'Sarah Johnson',
                type: 'employee',
                description: 'Senior Frontend Engineer',
                position: 'Senior Engineer',
                email: 'sarah.johnson@techcorp.com',
                location: 'San Francisco, CA',
              },
              {
                id: 5,
                name: 'Mike Chen',
                type: 'employee',
                description: 'Frontend Developer',
                position: 'Mid-Level Engineer',
                email: 'mike.chen@techcorp.com',
                location: 'San Francisco, CA',
              },
              {
                id: 6,
                name: 'Emily Rodriguez',
                type: 'employee',
                description: 'UI/UX Engineer',
                position: 'Senior Engineer',
                email: 'emily.rodriguez@techcorp.com',
                location: 'San Francisco, CA',
              },
            ],
          },
          {
            id: 7,
            name: 'Backend Team',
            type: 'team',
            description: 'Server-side and API development',
            headCount: 20,
            budget: 2500000,
            children: [
              {
                id: 8,
                name: 'David Kim',
                type: 'employee',
                description: 'Lead Backend Engineer',
                position: 'Tech Lead',
                email: 'david.kim@techcorp.com',
                location: 'San Francisco, CA',
              },
              {
                id: 9,
                name: 'Lisa Wang',
                type: 'employee',
                description: 'Backend Developer',
                position: 'Senior Engineer',
                email: 'lisa.wang@techcorp.com',
                location: 'Austin, TX',
              },
              {
                id: 10,
                name: 'Tom Anderson',
                type: 'employee',
                description: 'API Specialist',
                position: 'Mid-Level Engineer',
                email: 'tom.anderson@techcorp.com',
                location: 'Seattle, WA',
              },
            ],
          },
          {
            id: 11,
            name: 'DevOps Team',
            type: 'team',
            description: 'Infrastructure and deployment',
            headCount: 10,
            budget: 1500000,
            children: [
              {
                id: 12,
                name: 'Alex Martinez',
                type: 'employee',
                description: 'DevOps Engineer',
                position: 'Senior Engineer',
                email: 'alex.martinez@techcorp.com',
                location: 'Remote',
              },
              {
                id: 13,
                name: 'Rachel Green',
                type: 'employee',
                description: 'Cloud Infrastructure',
                position: 'Mid-Level Engineer',
                email: 'rachel.green@techcorp.com',
                location: 'Boston, MA',
              },
            ],
          },
        ],
      },
      {
        id: 14,
        name: 'Sales Department',
        type: 'department',
        description: 'Revenue and customer acquisition',
        headCount: 45,
        budget: 8000000,
        location: 'New York, NY',
        children: [
          {
            id: 15,
            name: 'Enterprise Sales',
            type: 'team',
            description: 'Large account management',
            headCount: 20,
            budget: 4000000,
            children: [
              {
                id: 16,
                name: 'John Smith',
                type: 'employee',
                description: 'Enterprise Account Executive',
                position: 'Senior AE',
                email: 'john.smith@techcorp.com',
                location: 'New York, NY',
              },
              {
                id: 17,
                name: 'Jennifer Brown',
                type: 'employee',
                description: 'Strategic Accounts',
                position: 'Account Executive',
                email: 'jennifer.brown@techcorp.com',
                location: 'New York, NY',
              },
            ],
          },
          {
            id: 18,
            name: 'SMB Sales',
            type: 'team',
            description: 'Small and medium business',
            headCount: 25,
            budget: 4000000,
            children: [
              {
                id: 19,
                name: 'Chris Taylor',
                type: 'employee',
                description: 'SMB Account Executive',
                position: 'Account Executive',
                email: 'chris.taylor@techcorp.com',
                location: 'Chicago, IL',
              },
            ],
          },
        ],
      },
      {
        id: 20,
        name: 'Marketing Department',
        type: 'department',
        description: 'Brand and growth marketing',
        headCount: 30,
        budget: 5000000,
        location: 'Austin, TX',
        children: [
          {
            id: 21,
            name: 'Content Marketing',
            type: 'team',
            description: 'Content strategy and creation',
            headCount: 12,
            budget: 2000000,
            children: [
              {
                id: 22,
                name: 'Amanda Wilson',
                type: 'employee',
                description: 'Content Strategist',
                position: 'Senior Strategist',
                email: 'amanda.wilson@techcorp.com',
                location: 'Austin, TX',
              },
            ],
          },
          {
            id: 23,
            name: 'Digital Marketing',
            type: 'team',
            description: 'Paid acquisition and SEO',
            headCount: 18,
            budget: 3000000,
            children: [
              {
                id: 24,
                name: 'Brian Lee',
                type: 'employee',
                description: 'Performance Marketing Manager',
                position: 'Manager',
                email: 'brian.lee@techcorp.com',
                location: 'Austin, TX',
              },
            ],
          },
        ],
      },
      {
        id: 25,
        name: 'HR Department',
        type: 'department',
        description: 'Human resources and recruitment',
        headCount: 15,
        budget: 3000000,
        location: 'San Francisco, CA',
        children: [
          {
            id: 26,
            name: 'Recruitment',
            type: 'team',
            description: 'Talent acquisition',
            headCount: 8,
            budget: 1500000,
            children: [
              {
                id: 27,
                name: 'Michelle Davis',
                type: 'employee',
                description: 'Senior Recruiter',
                position: 'Senior Recruiter',
                email: 'michelle.davis@techcorp.com',
                location: 'San Francisco, CA',
              },
            ],
          },
          {
            id: 28,
            name: 'People Operations',
            type: 'team',
            description: 'Employee experience and benefits',
            headCount: 7,
            budget: 1500000,
            children: [
              {
                id: 29,
                name: 'Robert Garcia',
                type: 'employee',
                description: 'HR Business Partner',
                position: 'HRBP',
                email: 'robert.garcia@techcorp.com',
                location: 'San Francisco, CA',
              },
            ],
          },
        ],
      },
      {
        id: 30,
        name: 'Finance Department',
        type: 'department',
        description: 'Financial planning and analysis',
        headCount: 20,
        budget: 4000000,
        location: 'New York, NY',
        children: [
          {
            id: 31,
            name: 'Accounting',
            type: 'team',
            description: 'Financial reporting and compliance',
            headCount: 12,
            budget: 2000000,
            children: [
              {
                id: 32,
                name: 'Susan Miller',
                type: 'employee',
                description: 'Senior Accountant',
                position: 'Senior Accountant',
                email: 'susan.miller@techcorp.com',
                location: 'New York, NY',
              },
            ],
          },
          {
            id: 33,
            name: 'FP&A',
            type: 'team',
            description: 'Financial planning and analysis',
            headCount: 8,
            budget: 2000000,
            children: [
              {
                id: 34,
                name: 'Patricia Moore',
                type: 'employee',
                description: 'Financial Analyst',
                position: 'Senior Analyst',
                email: 'patricia.moore@techcorp.com',
                location: 'New York, NY',
              },
            ],
          },
        ],
      },
    ],
  },
];

/**
 * Export as TreeNode array for type compatibility
 * NestedItem is structurally compatible with TreeNode
 */
export const mockTreeData: TreeNode[] = mockNestedData as unknown as TreeNode[];
