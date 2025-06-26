/**
 * @file Test suite for StudentCard component
 * 
 * This test suite verifies the functionality of the StudentCard component,
 * which displays individual student information and handles drag-and-drop operations.
 * It tests rendering, drag-and-drop behavior, and integration with the edit dialog.
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { StudentCard } from '../StudentCard';
import { Student } from '@/lib/types';

// Mock the Draggable component from @hello-pangea/dnd
// This mock simulates the draggable behavior for testing without the actual drag-and-drop library
jest.mock('@hello-pangea/dnd', () => ({
  Draggable: ({
    children,
    draggableId,
    index,
  }: {
    children: (
      provided: {
        draggableProps: { [key: string]: unknown };
        dragHandleProps: { [key: string]: unknown } | null;
        innerRef: React.Ref<HTMLElement>;
      },
      snapshot: { isDragging: boolean }
    ) => React.ReactNode;
    draggableId: string;
    index: number;
  }) => {
    const provided = {
      draggableProps: {
        'data-rfd-draggable-id': draggableId,
        'data-rfd-draggable-index': index,
      },
      dragHandleProps: {
        'data-rfd-drag-handle-draggable-id': draggableId,
      },
      innerRef: jest.fn(),
    };
    
    const snapshot = {
      isDragging: false,
    };
    
    return children(provided, snapshot);
  },
}));

// Mock the EditStudentDialog component
jest.mock('../EditStudentDialog', () => ({
  EditStudentDialog: ({ student, onUpdate }: { student: Student; onUpdate?: (id: string, updatedData: Student) => void; }) => (
    <button 
      onClick={() => onUpdate && onUpdate(student.id, { ...student, name: 'Updated Name' })}
      data-testid="edit-student-button"
    >
      Edit
    </button>
  ),
}));

describe('StudentCard', () => {
  const mockStudent: Student = {
    id: 'student-1',
    name: 'John Doe',
    email: 'john@example.com',
    contact: '123-456-7890',
  };
  
  const mockOnUpdate = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders student information correctly', () => {
    render(
      <StudentCard 
        student={mockStudent} 
        index={0} 
        onUpdate={mockOnUpdate} 
      />
    );
    
    // Check if student name is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    // Check if student email is rendered
    expect(screen.getByText('Email:')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    
    // Check if student contact is rendered
    expect(screen.getByText('Contact:')).toBeInTheDocument();
    expect(screen.getByText('123-456-7890')).toBeInTheDocument();
  });
  
  it('renders with draggable props', () => {
    const { container } = render(
      <StudentCard 
        student={mockStudent} 
        index={0} 
        onUpdate={mockOnUpdate} 
      />
    );
    
    // Check if draggable props are applied
    const draggableElement = container.querySelector('[data-rfd-draggable-id]');
    expect(draggableElement).toBeInTheDocument();
    expect(draggableElement).toHaveAttribute('data-rfd-draggable-id', 'student-1');
    expect(draggableElement).toHaveAttribute('data-rfd-draggable-index', '0');
  });
  
  it('renders EditStudentDialog when onUpdate is provided', () => {
    render(
      <StudentCard 
        student={mockStudent} 
        index={0} 
        onUpdate={mockOnUpdate} 
      />
    );
    
    // Check if EditStudentDialog is rendered
    expect(screen.getByTestId('edit-student-button')).toBeInTheDocument();
  });
  
  it('does not render EditStudentDialog when onUpdate is not provided', () => {
    render(
      <StudentCard 
        student={mockStudent} 
        index={0} 
      />
    );
    
    // Check that EditStudentDialog is not rendered
    expect(screen.queryByTestId('edit-student-button')).not.toBeInTheDocument();
  });
});
