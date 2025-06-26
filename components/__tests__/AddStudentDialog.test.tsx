import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AddStudentDialog } from '../AddStudentDialog';

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
  Input: ({ id, value, onChange, className, ...props }: any) => (
    <input
      id={id}
      value={value}
      onChange={onChange}
      className={className}
      data-testid={`input-${id}`}
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

describe('AddStudentDialog', () => {
  const mockOnAddStudent = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('renders the Add Student button', () => {
    render(<AddStudentDialog onAddStudent={mockOnAddStudent} />);
    
    const addButton = screen.getByTestId('button');
    expect(addButton).toBeInTheDocument();
    expect(addButton.textContent).toBe('Add Student');
  });
  
  it('opens the dialog when Add Student button is clicked', async () => {
    render(<AddStudentDialog onAddStudent={mockOnAddStudent} />);
    
    // Initially dialog content should not be visible
    expect(screen.queryByTestId('dialog-content')).not.toBeInTheDocument();
    
    // Click the add button
    fireEvent.click(screen.getByTestId('dialog-trigger'));
    
    // Dialog content should now be visible
    await waitFor(() => {
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
    });
    
    // Check dialog title
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('Add New Student');
  });
  
  it('has empty form fields when dialog is opened', async () => {
    render(<AddStudentDialog onAddStudent={mockOnAddStudent} />);
    
    // Open the dialog
    fireEvent.click(screen.getByTestId('dialog-trigger'));
    
    await waitFor(() => {
      // Check that input fields are empty
      expect(screen.getByTestId('input-name')).toHaveValue('');
      expect(screen.getByTestId('input-email')).toHaveValue('');
      expect(screen.getByTestId('input-contact')).toHaveValue('');
    });
  });
  
  it('updates form fields when user types', async () => {
    render(<AddStudentDialog onAddStudent={mockOnAddStudent} />);
    
    // Open the dialog
    fireEvent.click(screen.getByTestId('dialog-trigger'));
    
    await waitFor(() => {
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
    });
    
    // Get input fields
    const nameInput = screen.getByTestId('input-name');
    const emailInput = screen.getByTestId('input-email');
    const contactInput = screen.getByTestId('input-contact');
    
    // Change input values
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(contactInput, { target: { value: '123-456-7890' } });
    
    // Check that input values have been updated
    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
    expect(contactInput).toHaveValue('123-456-7890');
  });
  
  it('calls onAddStudent with form data when Add Student button is clicked', async () => {
    render(<AddStudentDialog onAddStudent={mockOnAddStudent} />);
    
    // Open the dialog
    fireEvent.click(screen.getByTestId('dialog-trigger'));
    
    await waitFor(() => {
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
    });
    
    // Fill in the form
    fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByTestId('input-contact'), { target: { value: '123-456-7890' } });
    
    // Click the Add Student button in the dialog footer
    const addButtons = screen.getAllByText('Add Student');
    const submitButton = addButtons.find(button => 
      button.closest('[data-testid="dialog-footer"]')
    );
    
    fireEvent.click(submitButton!);
    
    // Check that onAddStudent was called with the correct data
    expect(mockOnAddStudent).toHaveBeenCalledTimes(1);
    expect(mockOnAddStudent).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      contact: '123-456-7890',
    });
  });
  
  it('does not call onAddStudent if any field is empty', async () => {
    render(<AddStudentDialog onAddStudent={mockOnAddStudent} />);
    
    // Open the dialog
    fireEvent.click(screen.getByTestId('dialog-trigger'));
    
    await waitFor(() => {
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
    });
    
    // Fill in only some fields
    fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'John Doe' } });
    // Leave email empty
    fireEvent.change(screen.getByTestId('input-contact'), { target: { value: '123-456-7890' } });
    
    // Click the Add Student button in the dialog footer
    const addButtons = screen.getAllByText('Add Student');
    const submitButton = addButtons.find(button => 
      button.closest('[data-testid="dialog-footer"]')
    );
    
    fireEvent.click(submitButton!);
    
    // Check that onAddStudent was not called
    expect(mockOnAddStudent).not.toHaveBeenCalled();
  });
  
  it('resets form fields after successful submission', async () => {
    render(<AddStudentDialog onAddStudent={mockOnAddStudent} />);
    
    // Open the dialog
    fireEvent.click(screen.getByTestId('dialog-trigger'));
    
    await waitFor(() => {
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
    });
    
    // Fill in the form
    fireEvent.change(screen.getByTestId('input-name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByTestId('input-contact'), { target: { value: '123-456-7890' } });
    
    // Submit the form
    const addButtons = screen.getAllByText('Add Student');
    const submitButton = addButtons.find(button => 
      button.closest('[data-testid="dialog-footer"]')
    );
    
    fireEvent.click(submitButton!);
    
    // Dialog should close after submission
    await waitFor(() => {
      expect(screen.queryByTestId('dialog-content')).not.toBeInTheDocument();
    });
    
    // Reopen the dialog
    fireEvent.click(screen.getByTestId('dialog-trigger'));
    
    // Check that form fields are reset
    await waitFor(() => {
      expect(screen.getByTestId('input-name')).toHaveValue('');
      expect(screen.getByTestId('input-email')).toHaveValue('');
      expect(screen.getByTestId('input-contact')).toHaveValue('');
    });
  });
});
