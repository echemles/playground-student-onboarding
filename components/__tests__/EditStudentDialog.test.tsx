import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EditStudentDialog } from '../EditStudentDialog';
import { Student } from '@/lib/types';

// Mock the UI components
jest.mock('@/components/ui/dialog', () => {
  const MockDialog = ({ children, open, onOpenChange }: any) => {
    // Store the onOpenChange callback to use in the mock
    (MockDialog as any).onOpenChange = onOpenChange;
    
    // Extract DialogTrigger and DialogContent from children
    let trigger = null;
    let content = null;
    
    React.Children.forEach(children, (child) => {
      if (child?.props?.asChild) {
        trigger = child.props.children;
      } else {
        content = child;
      }
    });
    
    return (
      <div>
        <div onClick={() => onOpenChange && onOpenChange(true)} data-testid="dialog-trigger">
          {trigger}
        </div>
        {open && <div data-testid="dialog-content">{content}</div>}
      </div>
    );
  };
  
  return {
    Dialog: MockDialog,
    DialogContent: ({ children, className }: any) => <div data-testid="dialog-content-inner">{children}</div>,
    DialogHeader: ({ children }: any) => <div data-testid="dialog-header">{children}</div>,
    DialogTitle: ({ children }: any) => <h2 data-testid="dialog-title">{children}</h2>,
    DialogTrigger: ({ children, asChild }: any) => <div data-testid="dialog-trigger-wrapper" asChild={asChild}>{children}</div>,
    DialogFooter: ({ children }: any) => <div data-testid="dialog-footer">{children}</div>,
  };
});

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, className, ...props }: any) => (
    <button onClick={onClick} className={className} {...props} data-testid="button">
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({ id, name, value, onChange, className, ...props }: any) => (
    <input
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={className}
      data-testid={`input-${name}`}
      {...props}
    />
  ),
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({ children, htmlFor, className }: any) => (
    <label htmlFor={htmlFor} className={className} data-testid={`label-${htmlFor}`}>
      {children}
    </label>
  ),
}));

describe('EditStudentDialog', () => {
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
  
  it('renders the Edit button', () => {
    render(<EditStudentDialog student={mockStudent} onUpdate={mockOnUpdate} />);
    
    const editButton = screen.getByTestId('button');
    expect(editButton).toBeInTheDocument();
    expect(editButton.textContent).toBe('Edit');
  });
  
  it('opens the dialog when Edit button is clicked', async () => {
    render(<EditStudentDialog student={mockStudent} onUpdate={mockOnUpdate} />);
    
    // Initially dialog content should not be visible
    expect(screen.queryByTestId('dialog-content')).not.toBeInTheDocument();
    
    // Click the edit button
    fireEvent.click(screen.getByTestId('dialog-trigger'));
    
    // Dialog content should now be visible
    await waitFor(() => {
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
    });
    
    // Check dialog title
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('Edit Student');
  });
  
  it('displays current student data in the form', async () => {
    render(<EditStudentDialog student={mockStudent} onUpdate={mockOnUpdate} />);
    
    // Open the dialog
    fireEvent.click(screen.getByTestId('dialog-trigger'));
    
    await waitFor(() => {
      // Check that input fields have the correct initial values
      expect(screen.getByTestId('input-name')).toHaveValue(mockStudent.name);
      expect(screen.getByTestId('input-email')).toHaveValue(mockStudent.email);
      expect(screen.getByTestId('input-contact')).toHaveValue(mockStudent.contact);
    });
  });
  
  it('updates form data when inputs change', async () => {
    render(<EditStudentDialog student={mockStudent} onUpdate={mockOnUpdate} />);
    
    // Open the dialog
    fireEvent.click(screen.getByTestId('dialog-trigger'));
    
    await waitFor(() => {
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
    });
    
    // Change input values
    const nameInput = screen.getByTestId('input-name');
    const emailInput = screen.getByTestId('input-email');
    const contactInput = screen.getByTestId('input-contact');
    
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
    fireEvent.change(contactInput, { target: { value: '987-654-3210' } });
    
    // Check that input values have been updated
    expect(nameInput).toHaveValue('Jane Doe');
    expect(emailInput).toHaveValue('jane@example.com');
    expect(contactInput).toHaveValue('987-654-3210');
  });
  
  it('calls onUpdate with updated student data when Save changes is clicked', async () => {
    render(<EditStudentDialog student={mockStudent} onUpdate={mockOnUpdate} />);
    
    // Open the dialog
    fireEvent.click(screen.getByTestId('dialog-trigger'));
    
    await waitFor(() => {
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
    });
    
    // Change name input
    const nameInput = screen.getByTestId('input-name');
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } });
    
    // Click save button
    const saveButton = screen.getByText('Save changes');
    fireEvent.click(saveButton);
    
    // Check that onUpdate was called with correct data
    expect(mockOnUpdate).toHaveBeenCalledTimes(1);
    expect(mockOnUpdate).toHaveBeenCalledWith(mockStudent.id, {
      ...mockStudent,
      name: 'Jane Doe',
    });
  });
  
  it('closes the dialog after form submission', async () => {
    // Get access to the Dialog component's onOpenChange mock
    const Dialog = require('@/components/ui/dialog').Dialog;
    
    render(<EditStudentDialog student={mockStudent} onUpdate={mockOnUpdate} />);
    
    // Open the dialog
    fireEvent.click(screen.getByTestId('dialog-trigger'));
    
    await waitFor(() => {
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
    });
    
    // Click save button
    const saveButton = screen.getByText('Save changes');
    fireEvent.click(saveButton);
    
    // Check that setIsOpen was called with false (via the onOpenChange mock)
    expect(mockOnUpdate).toHaveBeenCalled();
    
    // The dialog should be closed (content not in document)
    await waitFor(() => {
      expect(screen.queryByTestId('dialog-content')).not.toBeInTheDocument();
    });
  });
});
