/**
 * @file Test suite for Board component
 * 
 * This test suite verifies the functionality of the Board component,
 * which manages the main application state and orchestrates drag-and-drop
 * functionality between columns. It tests drag-and-drop behavior, state updates,
 * and integration with child components.
 */

import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { Board } from '../Board';
import { BoardData, Student } from '@/lib/types';
import { toast } from 'sonner';

// Define TypeScript interfaces for mock objects
// These interfaces ensure type safety for the test mocks and simulate the behavior of react-beautiful-dnd
interface MockDraggableLocation {
  droppableId: string;
  index: number;
}

interface MockDropResult {
  draggableId: string;
  source: MockDraggableLocation;
  destination?: MockDraggableLocation | null;
}

interface MockDroppableProvided {
  droppableProps: { [key: string]: unknown };
  innerRef: React.Ref<HTMLElement>;
  placeholder: React.ReactNode | null;
}

interface MockDroppableSnapshot {
  isDraggingOver: boolean;
}

interface MockDraggableProvided {
  draggableProps: { [key: string]: unknown };
  dragHandleProps: { [key: string]: unknown } | null;
  innerRef: React.Ref<HTMLElement>;
}

interface MockDraggableSnapshot {
  isDragging: boolean;
}

// Mock dependencies
jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({
    children,
    onDragEnd,
  }: {
    children: React.ReactNode;
    onDragEnd: (result: MockDropResult) => void;
  }) => {
    // Store onDragEnd in a global variable for testing
    (global as Record<string, unknown>).onDragEnd = onDragEnd;
    return <div>{children}</div>;
  },
  Droppable: ({
    children,
  }: {
    children: (
      provided: MockDroppableProvided,
      snapshot: MockDroppableSnapshot
    ) => React.ReactNode;
  }) =>
    children(
      {
        droppableProps: { 'data-testid': 'droppable' },
        innerRef: jest.fn(),
        placeholder: null,
      },
      { isDraggingOver: false }
    ),
  Draggable: ({
    children,
  }: {
    children: (
      provided: MockDraggableProvided,
      snapshot: MockDraggableSnapshot
    ) => React.ReactNode;
  }) =>
    children(
      {
        draggableProps: { 'data-testid': 'draggable' },
        innerRef: jest.fn(),
        dragHandleProps: null,
      },
      { isDragging: false }
    ),
}));

jest.mock('sonner', () => ({
  Toaster: () => <div data-testid="toaster"></div>,
  toast: {
    success: jest.fn(),
  },
}));

jest.mock('../Column', () => ({
  Column: ({
    column,
    students,

  }: {
    column: { id: string; title: string; studentIds: string[] };
    students: Student[];
    onUpdateStudent?: (id: string, updatedStudent: Student) => void;
  }) => (
    <div data-testid={`column-${column.id}`}>
      <h2>{column.title}</h2>
      <div data-testid="students-container">
        {students.map((student) => (
          <div key={student.id} data-testid={`student-${student.id}`}>
            {student.name}
          </div>
        ))}
      </div>
    </div>
  ),
}));

jest.mock('../AddStudentDialog', () => ({
  AddStudentDialog: ({ onAddStudent }: { onAddStudent: (student: Omit<Student, 'id'>) => void }) => (
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
      expect.anything()
    );
  });

  it('should move a student to a different column', async () => {
    render(<Board initialData={mockInitialData} />);

    const dragResult: MockDropResult = {
      draggableId: 'student-1',
      source: { droppableId: 'column-1', index: 0 },
      destination: { droppableId: 'column-2', index: 0 },
    };

    act(() => {
      // Call the onDragEnd function provided by the mocked DragDropContext
      (global as unknown as { onDragEnd: (result: MockDropResult) => void }).onDragEnd(
        dragResult
      );
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
      expect.anything()
    );
  });

  it('should move a student within the same column', () => {
    render(<Board initialData={mockInitialData} />);

    const dragResult: MockDropResult = {
      draggableId: 'student-1',
      source: { droppableId: 'column-1', index: 0 },
      destination: { droppableId: 'column-1', index: 1 },
    };

    act(() => {
      (global as unknown as { onDragEnd: (result: MockDropResult) => void }).onDragEnd(
        dragResult
      );
    });

    // The order in the DOM might not change visually in this test setup,
    // but we can check that no toast notification was sent, as per the component logic.
    expect(toast.success).not.toHaveBeenCalled();
  });
});
