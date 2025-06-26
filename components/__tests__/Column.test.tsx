import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Column } from '../Column';
import { Column as ColumnType, Student } from '@/lib/types';

// Mock the Droppable component from @hello-pangea/dnd
jest.mock('@hello-pangea/dnd', () => ({
  Droppable: ({
    children,
    droppableId,
  }: {
    children: (
      provided: {
        innerRef: React.Ref<HTMLElement>;
        droppableProps: { [key: string]: unknown };
        placeholder: React.ReactNode;
      },
      snapshot: { isDraggingOver: boolean }
    ) => React.ReactNode;
    droppableId: string;
  }) => {
    const provided = {
      innerRef: jest.fn(),
      droppableProps: {
        'data-rfd-droppable-id': droppableId,
      },
      placeholder: <div data-testid="droppable-placeholder"></div>,
    };
    
    const snapshot = {
      isDraggingOver: false,
    };
    
    return children(provided, snapshot);
  },
}));

// Mock the StudentCard component
jest.mock('../StudentCard', () => ({
  StudentCard: ({ student, index, onUpdate }: { student: Student; index: number; onUpdate?: (id: string, data: Student) => void; }) => (
    <div data-testid={`student-card-${student.id}`} data-index={index}>
      <span>{student.name}</span>
      <button 
        onClick={() => onUpdate && onUpdate(student.id, { ...student, name: 'Updated Name' })}
        data-testid={`update-student-${student.id}`}
      >
        Update
      </button>
    </div>
  ),
}));

describe('Column', () => {
  const mockColumn: ColumnType = {
    id: 'column-1',
    title: 'To Do',
    studentIds: [],
  };
  
  const mockStudents: Student[] = [
    {
      id: 'student-1',
      name: 'John Doe',
      email: 'john@example.com',
      contact: '123-456-7890',
    },
    {
      id: 'student-2',
      name: 'Jane Smith',
      email: 'jane@example.com',
      contact: '987-654-3210',
    },
  ];
  
  const mockOnUpdateStudent = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders column title correctly', () => {
    render(
      <Column 
        column={mockColumn} 
        students={mockStudents} 
        onUpdateStudent={mockOnUpdateStudent} 
      />
    );
    
    expect(screen.getByText('To Do')).toBeInTheDocument();
  });
  
  it('renders student count correctly', () => {
    render(
      <Column 
        column={mockColumn} 
        students={mockStudents} 
        onUpdateStudent={mockOnUpdateStudent} 
      />
    );
    
    expect(screen.getByText('2')).toBeInTheDocument();
  });
  
  it('renders all students', () => {
    render(
      <Column 
        column={mockColumn} 
        students={mockStudents} 
        onUpdateStudent={mockOnUpdateStudent} 
      />
    );
    
    expect(screen.getByTestId('student-card-student-1')).toBeInTheDocument();
    expect(screen.getByTestId('student-card-student-2')).toBeInTheDocument();
  });
  
  it('renders "No students yet" message when there are no students', () => {
    render(
      <Column 
        column={mockColumn} 
        students={[]} 
        onUpdateStudent={mockOnUpdateStudent} 
      />
    );
    
    expect(screen.getByText('No students yet')).toBeInTheDocument();
  });
  
  it('passes correct props to StudentCard', () => {
    render(
      <Column 
        column={mockColumn} 
        students={mockStudents} 
        onUpdateStudent={mockOnUpdateStudent} 
      />
    );
    
    const studentCard1 = screen.getByTestId('student-card-student-1');
    const studentCard2 = screen.getByTestId('student-card-student-2');
    
    expect(studentCard1).toHaveAttribute('data-index', '0');
    expect(studentCard2).toHaveAttribute('data-index', '1');
  });
  
  it('renders with droppable props', () => {
    const { container } = render(
      <Column 
        column={mockColumn} 
        students={mockStudents} 
        onUpdateStudent={mockOnUpdateStudent} 
      />
    );
    
    const droppableElement = container.querySelector('[data-rfd-droppable-id]');
    expect(droppableElement).toBeInTheDocument();
    expect(droppableElement).toHaveAttribute('data-rfd-droppable-id', 'column-1');
  });
  
  it('renders placeholder from droppable', () => {
    render(
      <Column 
        column={mockColumn} 
        students={mockStudents} 
        onUpdateStudent={mockOnUpdateStudent} 
      />
    );
    
    expect(screen.getByTestId('droppable-placeholder')).toBeInTheDocument();
  });
});
