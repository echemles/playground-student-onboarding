import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { Board } from '../Board';
import { Column as OriginalColumn } from '../Column';
import { BoardData } from '@/lib/types';

// Mock dependencies
jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children, onDragEnd }: any) => {
    (global as any).onDragEnd = onDragEnd;
    return <div>{children}</div>;
  },
  Droppable: ({ children }: any) =>
    children(
      {
        droppableProps: { 'data-testid': 'droppable' },
        innerRef: jest.fn(),
        placeholder: null,
      },
      {}
    ),
  Draggable: ({ children }: any) =>
    children(
      {
        draggableProps: { 'data-testid': 'draggable' },
        innerRef: jest.fn(),
        dragHandleProps: null,
      },
      {}
    ),
}));

jest.mock('sonner', () => ({
  Toaster: () => <div data-testid="toaster"></div>,
  toast: {
    success: jest.fn(),
  },
}));

jest.mock('../Column', () => ({
  Column: jest.fn(({ column, students, onUpdateStudent }) => (
    <div data-testid={`column-${column.id}`}>
      <h2>{column.title}</h2>
      {students.map((student: any) => (
        <div key={student.id}>{student.name}</div>
      ))}
    </div>
  )),
}));

jest.mock('../AddStudentDialog', () => ({
  AddStudentDialog: ({ onAddStudent }: { onAddStudent: (student: any) => void }) => (
    <button onClick={() => onAddStudent({ name: 'New Student', email: 'new@test.com', contact: '123' })}>
      Add Student
    </button>
  ),
}));

const mockInitialData: BoardData = {
  students: {
    'student-1': { id: 'student-1', name: 'Alice', email: 'alice@test.com', contact: '111' },
    'student-2': { id: 'student-2', name: 'Bob', email: 'bob@test.com', contact: '222' },
  },
  columns: {
    'column-1': { id: 'column-1', title: 'To Do', studentIds: ['student-1', 'student-2'] },
    'column-2': { id: 'column-2', title: 'In Progress', studentIds: [] },
  },
  columnOrder: ['column-1', 'column-2'],
};

describe('Board', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  it('should render the board with initial data', () => {
    render(<Board initialData={mockInitialData} />);

    expect(screen.getByText('Student Onboarding')).toBeInTheDocument();
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('should add a new student when Add Student button is clicked', async () => {
    const { toast } = require('sonner');
    render(<Board initialData={mockInitialData} />);

    const addStudentButton = screen.getByText('Add Student');
    act(() => {
      fireEvent.click(addStudentButton);
    });

    await waitFor(() => {
      expect(screen.getByText('New Student')).toBeInTheDocument();
    });

    expect(toast.success).toHaveBeenCalledWith(
      'New student New Student added to To Do',
      expect.any(Object)
    );
  });

  it('should move a student to a different column', async () => {
    const { toast } = require('sonner');
    render(<Board initialData={mockInitialData} />);

    const dragResult = {
      draggableId: 'student-1',
      source: { droppableId: 'column-1', index: 0 },
      destination: { droppableId: 'column-2', index: 0 },
    };

    act(() => {
      // Call the onDragEnd function provided by the mocked DragDropContext
      (global as any).onDragEnd(dragResult);
    });

    // Wait for the DOM to update
    await waitFor(() => {
      // Check if the student 'Alice' is now in the 'In Progress' column
      const inProgressColumn = screen.getByText('In Progress').closest('div');
      expect(inProgressColumn).toHaveTextContent('Alice');
    });

    // Check if toast was called
    expect(toast.success).toHaveBeenCalledWith(
      'Alice moved from To Do to In Progress',
      expect.any(Object)
    );
  });

  it('should move a student within the same column', () => {
    const { toast } = require('sonner');
    render(<Board initialData={mockInitialData} />);

    const dragResult = {
      draggableId: 'student-1',
      source: { droppableId: 'column-1', index: 0 },
      destination: { droppableId: 'column-1', index: 1 },
    };

    act(() => {
      (global as any).onDragEnd(dragResult);
    });

    // The order in the DOM might not change visually in this test setup,
    // but we can check that no toast notification was sent, as per the component logic.
    expect(toast.success).not.toHaveBeenCalled();
  });
});
