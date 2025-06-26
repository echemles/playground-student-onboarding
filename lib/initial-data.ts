import { BoardData } from './types';

export const initialData: BoardData = {
  students: {
    'student-1': { id: 'student-1', name: 'John Doe', email: 'john.doe@example.com', contact: '(555) 123-4567' },
    'student-2': { id: 'student-2', name: 'Jane Smith', email: 'jane.smith@example.com', contact: '(555) 234-5678' },
    'student-3': { id: 'student-3', name: 'Peter Jones', email: 'peter.jones@example.com', contact: '(555) 345-6789' },
    'student-4': { id: 'student-4', name: 'Mary Williams', email: 'mary.williams@example.com', contact: '(555) 456-7890' },
    'student-5': { id: 'student-5', name: 'Robert Johnson', email: 'robert.johnson@example.com', contact: '(555) 567-8901' },
    'student-6': { id: 'student-6', name: 'Sarah Brown', email: 'sarah.brown@example.com', contact: '(555) 678-9012' },
    'student-7': { id: 'student-7', name: 'Michael Davis', email: 'michael.davis@example.com', contact: '(555) 789-0123' },
    'student-8': { id: 'student-8', name: 'Emily Wilson', email: 'emily.wilson@example.com', contact: '(555) 890-1234' },
    'student-9': { id: 'student-9', name: 'David Miller', email: 'david.miller@example.com', contact: '(555) 901-2345' },
    'student-10': { id: 'student-10', name: 'Jessica Taylor', email: 'jessica.taylor@example.com', contact: '(555) 012-3456' },
    'student-11': { id: 'student-11', name: 'Thomas Anderson', email: 'thomas.anderson@example.com', contact: '(555) 123-7890' },
    'student-12': { id: 'student-12', name: 'Lisa Martinez', email: 'lisa.martinez@example.com', contact: '(555) 234-8901' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Inquiry',
      studentIds: ['student-1', 'student-2', 'student-9'],
    },
    'column-2': {
      id: 'column-2',
      title: 'Tour',
      studentIds: ['student-3', 'student-10'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Registration',
      studentIds: ['student-4', 'student-11'],
    },
    'column-4': {
      id: 'column-4',
      title: 'Paperwork',
      studentIds: ['student-5', 'student-12'],
    },
    'column-5': {
      id: 'column-5',
      title: 'Orientation',
      studentIds: ['student-6'],
    },
    'column-6': {
      id: 'column-6',
      title: 'First Day',
      studentIds: ['student-7', 'student-8'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3', 'column-4', 'column-5', 'column-6'],
};
