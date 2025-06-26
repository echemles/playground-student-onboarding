/**
 * AddStudentDialog Component
 * 
 * A dialog component that allows users to add a new student to the system.
 * Includes form fields for student details and a signature pad.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Function} props.onAddStudent - Callback function to handle adding a new student
 * @returns {JSX.Element} Rendered component
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SignaturePad } from '@/components/ui/signature-pad';
import { Student } from '@/lib/types';

/**
 * Props for the AddStudentDialog component
 * @interface AddStudentDialogProps
 * @property {Function} onAddStudent - Callback function that receives the new student data
 */
interface AddStudentDialogProps {
  onAddStudent: (student: Omit<Student, 'id'>) => void;
}

/**
 * Main component for adding a new student
 * Manages form state and handles form submission
 */
export function AddStudentDialog({ onAddStudent }: AddStudentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [signature, setSignature] = useState('');

  const handleSubmit = () => {
    if (name && email && contact) {
      onAddStudent({ name, email, contact, signature });
      setIsOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setContact('');
    setSignature('');
  };

  // Reset form when dialog closes
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-gray-800 hover:bg-gray-700 text-gray-200 border-gray-700">
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 text-gray-100 border-gray-700 w-[95vw] max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input 
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="input-name"
              aria-label="Student Name"
              className="col-span-3 bg-gray-700 border-gray-600" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input 
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="input-email"
              aria-label="Student Email"
              className="col-span-3 bg-gray-700 border-gray-600" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact" className="text-right">
              Contact
            </Label>
            <Input 
              id="contact"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              data-testid="input-contact"
              aria-label="Student Contact"
              className="col-span-3 bg-gray-700 border-gray-600" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="signature" className="text-right">
              Signature
            </Label>
            <div className="col-span-3">
              <SignaturePad onSave={setSignature} initialSignature={signature} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
            Add Student
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
