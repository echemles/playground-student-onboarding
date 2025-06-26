import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EditStudentDialog } from '../EditStudentDialog';
import { Student } from '@/lib/types';

// Mock the UI components
jest.mock('@/components/ui/dialog', () => {
  interface MockDialogProps {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }

  interface DialogChildProps {
    children?: React.ReactNode;
    asChild?: boolean;
  }

  const MockDialog = ({ children, open, onOpenChange }: MockDialogProps) => {
    
    // Extract DialogTrigger and DialogContent from children
    let trigger = null;
    let content = null;
    
    React.Children.forEach(children, (child) => {
      const typedChild = child as React.ReactElement<DialogChildProps>;
      if (typedChild && typedChild.props && typedChild.props.asChild) {
        trigger = typedChild.props.children;
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
    DialogContent: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-content-inner">{children}</div>,
    DialogHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-header">{children}</div>,
    DialogTitle: ({ children }: { children: React.ReactNode }) => <h2 data-testid="dialog-title">{children}</h2>,
    DialogTrigger: ({ children, asChild }: { children: React.ReactNode; asChild?: boolean }) => <div data-testid="dialog-trigger-wrapper" data-as-child={asChild ? 'true' : 'false'}>{children}</div>,
    DialogFooter: ({ children }: { children: React.ReactNode }) => <div data-testid="dialog-footer">{children}</div>,
  };
});

jest.mock('@/components/ui/button', () => ({
  Button: ({ 
    children, 
    onClick, 
    className, 
    ...props 
  }: { 
    children: React.ReactNode; 
    onClick?: () => void; 
    className?: string; 
    [key: string]: unknown;
  }) => (
    <button onClick={onClick} className={className} {...props} data-testid="button">
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({ 
    id, 
    name, 
    value, 
    onChange, 
    className, 
    ...props 
  }: { 
    id?: string; 
    name?: string; 
    value?: string; 
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; 
    className?: string; 
    [key: string]: unknown;
  }) => (
    <input
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={className}
      data-testid={`input-${id || name}`}
      {...props}
    />
  ),
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({ 
    children, 
    htmlFor, 
    className 
  }: { 
    children: React.ReactNode; 
    htmlFor?: string; 
    className?: string;
  }) => (
    <label htmlFor={htmlFor} className={className} data-testid={`label-${htmlFor}`}>
      {children}
    </label>
  ),
}));

// Mock the SignaturePad component
jest.mock('@/components/ui/signature-pad', () => ({
  SignaturePad: ({ onSave, initialSignature }: { 
    onSave: (signature: string) => void; 
    initialSignature?: string;
  }) => {
    // Mock implementation that uses data-testid for reliable test selection
    return (
      <div data-testid="signature-pad">
        {initialSignature && (
          <img 
            src={initialSignature} 
            alt="Saved signature" 
            data-testid="saved-signature" 
          />
        )}
        <button 
          onClick={() => onSave('data:image/png;base64,mock-signature')} 
          data-testid="save-signature-button"
        >
          Save Signature
        </button>
        <button 
          onClick={() => onSave('')} 
          data-testid="clear-signature-button"
        >
          Clear
        </button>
      </div>
    );
  }
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

  it('allows adding a signature to a student', async () => {
    render(<EditStudentDialog student={mockStudent} onUpdate={mockOnUpdate} />);
    
    // Open the dialog
    fireEvent.click(screen.getByTestId('dialog-trigger'));
    
    await waitFor(() => {
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
    });
    
    // Save a signature
    fireEvent.click(screen.getByTestId('save-signature-button'));
    
    // Submit the form
    const saveButton = screen.getByText('Save changes');
    fireEvent.click(saveButton);
    
    // Check that onUpdate was called with the signature
    expect(mockOnUpdate).toHaveBeenCalledWith(mockStudent.id, {
      ...mockStudent,
      signature: 'data:image/png;base64,mock-signature'
    });
  });
  
  it('allows clearing a signature', async () => {
    // Create a student with a signature
    const studentWithSignature = {
      ...mockStudent,
      signature: 'data:image/png;base64,existing-signature'
    };
    
    render(<EditStudentDialog student={studentWithSignature} onUpdate={mockOnUpdate} />);
    
    // Open the dialog
    fireEvent.click(screen.getByTestId('dialog-trigger'));
    
    await waitFor(() => {
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
    });
    
    // Clear the signature
    fireEvent.click(screen.getByTestId('clear-signature-button'));
    
    // Submit the form
    const saveButton = screen.getByText('Save changes');
    fireEvent.click(saveButton);
    
    // Check that onUpdate was called with an empty signature
    expect(mockOnUpdate).toHaveBeenCalledWith(mockStudent.id, {
      ...mockStudent,
      signature: ''
    });
  });
  
  it('shows existing signature when editing', async () => {
    // Create a student with a signature
    const studentWithSignature = {
      ...mockStudent,
      signature: 'data:image/png;base64,existing-signature'
    };
    
    render(<EditStudentDialog student={studentWithSignature} onUpdate={mockOnUpdate} />);
    
    // Open the dialog
    fireEvent.click(screen.getByTestId('dialog-trigger'));
    
    await waitFor(() => {
      expect(screen.getByTestId('dialog-content')).toBeInTheDocument();
    });
    
    // Check that the saved signature is displayed
    const signatureImg = screen.getByTestId('saved-signature');
    expect(signatureImg).toBeInTheDocument();
    expect(signatureImg).toHaveAttribute('src', 'data:image/png;base64,existing-signature');
  });
});
