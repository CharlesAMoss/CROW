/**
 * Mock workflow/planning data for editable task management
 * Task/project data with statuses, priorities, dates
 */

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done' | 'blocked';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface WorkflowTask {
  id: number;
  taskId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  reporter: string;
  dueDate: Date;
  startDate: Date;
  estimatedHours: number;
  actualHours: number;
  tags: string[];
  completionPercentage: number;
}

const taskTitles = [
  'Implement user authentication',
  'Design dashboard UI',
  'Fix login bug',
  'Update documentation',
  'Optimize database queries',
  'Create API endpoint',
  'Write unit tests',
  'Review pull request',
  'Deploy to staging',
  'Update dependencies',
  'Refactor legacy code',
  'Add error handling',
  'Improve performance',
  'Setup CI/CD pipeline',
  'Create data migration',
  'Fix responsive layout',
  'Add form validation',
  'Implement caching',
  'Update API documentation',
  'Review security audit',
];

const assignees = [
  'Alice Cooper', 'Bob Smith', 'Charlie Brown', 'Diana Prince',
  'Eve Adams', 'Frank Miller', 'Grace Kelly', 'Henry Ford',
  'Iris West', 'Jack Ryan', 'Kate Bishop', 'Liam Nelson',
];

const reporters = [
  'Project Manager', 'Tech Lead', 'Product Owner', 'Scrum Master',
];

const tagOptions = [
  ['frontend', 'react', 'ui'],
  ['backend', 'api', 'nodejs'],
  ['database', 'sql', 'migration'],
  ['bug', 'critical', 'hotfix'],
  ['feature', 'enhancement'],
  ['documentation', 'readme'],
  ['testing', 'qa', 'automation'],
  ['devops', 'ci-cd', 'deployment'],
  ['security', 'audit', 'compliance'],
  ['performance', 'optimization'],
];

/**
 * Generate mock workflow data
 * 60 tasks with various statuses and priorities
 */
export const mockWorkflowData: WorkflowTask[] = Array.from({ length: 60 }, (_, i) => {
  const id = i + 1;
  const statuses: TaskStatus[] = ['todo', 'in-progress', 'review', 'done', 'blocked'];
  const priorities: TaskPriority[] = ['low', 'medium', 'high', 'urgent'];
  
  const status = statuses[i % statuses.length];
  const priority = priorities[i % priorities.length];
  
  // Start date (random in past 30 days)
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - Math.floor(Math.random() * 30));
  
  // Due date (random in next 30 days)
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + Math.floor(Math.random() * 30));
  
  const estimatedHours = Math.floor(Math.random() * 40) + 1;
  
  // Completion percentage based on status
  let completionPercentage = 0;
  switch (status) {
    case 'todo':
      completionPercentage = 0;
      break;
    case 'in-progress':
      completionPercentage = Math.floor(Math.random() * 70) + 10;
      break;
    case 'review':
      completionPercentage = Math.floor(Math.random() * 20) + 80;
      break;
    case 'done':
      completionPercentage = 100;
      break;
    case 'blocked':
      completionPercentage = Math.floor(Math.random() * 50);
      break;
  }
  
  const actualHours = completionPercentage === 100 
    ? estimatedHours + Math.floor(Math.random() * 10) - 5
    : Math.floor((estimatedHours * completionPercentage) / 100);
  
  return {
    id,
    taskId: `TASK-${String(id).padStart(4, '0')}`,
    title: taskTitles[i % taskTitles.length],
    description: `Detailed description for ${taskTitles[i % taskTitles.length].toLowerCase()}`,
    status,
    priority,
    assignee: assignees[i % assignees.length],
    reporter: reporters[i % reporters.length],
    dueDate,
    startDate,
    estimatedHours,
    actualHours,
    tags: tagOptions[i % tagOptions.length],
    completionPercentage,
  };
});
