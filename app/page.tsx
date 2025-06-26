import { BoardData } from '@/lib/types';
import { Board } from '@/components/Board';

const initialData: BoardData = {
  students: {
    'student-1': { id: 'student-1', name: 'John Doe', email: 'john.doe@example.com', contact: '(555) 123-4567' },
    'student-2': { id: 'student-2', name: 'Jane Smith', email: 'jane.smith@example.com', contact: '(555) 234-5678' },
    'student-3': { id: 'student-3', name: 'Peter Jones', email: 'peter.jones@example.com', contact: '(555) 345-6789' },
    'student-4': { id: 'student-4', name: 'Mary Williams', email: 'mary.williams@example.com', contact: '(555) 456-7890' },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Inquiry',
      studentIds: ['student-1', 'student-2'],
    },
    'column-2': {
      id: 'column-2',
      title: 'Tour',
      studentIds: ['student-3'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Registration',
      studentIds: ['student-4'],
    },
    'column-4': {
      id: 'column-4',
      title: 'Paperwork',
      studentIds: [],
    },
    'column-5': {
      id: 'column-5',
      title: 'Orientation',
      studentIds: [],
    },
    'column-6': {
      id: 'column-6',
      title: 'First Day',
      studentIds: [],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3', 'column-4', 'column-5', 'column-6'],
};

export default function Home() {
  return <Board initialData={initialData} />;
}
