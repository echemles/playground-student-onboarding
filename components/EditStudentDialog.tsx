/**
 * EditStudentDialog Component
 * 
 * A dialog component that allows users to edit an existing student's information.
 * Includes form fields for student details and a signature pad for digital signatures.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Student} props.student - The student data to edit
 * @param {Function} props.onUpdate - Callback function to handle student updates
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
 * Props for the EditStudentDialog component
 * @interface EditStudentDialogProps
 * @property {Student} student - The student data to edit
 * @property {Function} onUpdate - Callback function that receives the updated student data
 */
interface EditStudentDialogProps {
  student: Student;
  onUpdate: (id: string, updatedStudent: Student) => void;
}

/**
 * Main component for editing an existing student
 * Manages form state and handles form submission with updated student data
 */
export function EditStudentDialog({ student, onUpdate }: EditStudentDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editedStudent, setEditedStudent] = useState<Student>(student);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedStudent((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSignatureChange = (signatureData: string) => {
    setEditedStudent((prev) => ({
      ...prev,
      signature: signatureData,
    }));
  };

  const handleSubmit = () => {
    onUpdate(student.id, editedStudent);
    setIsOpen(false);
  };

  // Reset form when dialog closes and ensure signature state is properly handled
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      // When opening, reset to the current student data
      setEditedStudent(student);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600 w-full sm:w-auto"
        >
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-800 text-gray-100 border-gray-700 w-[95vw] max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              value={editedStudent.name}
              onChange={handleInputChange}
              className="col-span-3 bg-gray-700 border-gray-600 text-gray-100"
              aria-label="Student Name"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              value={editedStudent.email}
              onChange={handleInputChange}
              className="col-span-3 bg-gray-700 border-gray-600 text-gray-100"
              aria-label="Student Email"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="contact" className="text-right">
              Contact
            </Label>
            <Input
              id="contact"
              name="contact"
              value={editedStudent.contact}
              onChange={handleInputChange}
              className="col-span-3 bg-gray-700 border-gray-600 text-gray-100"
              aria-label="Student Contact"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="signature" className="text-right">
              Signature
            </Label>
            <div className="col-span-3">
              <SignaturePad 
                onSave={handleSignatureChange} 
                initialSignature={editedStudent.signature} 
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
