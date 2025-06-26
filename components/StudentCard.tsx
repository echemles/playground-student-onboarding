'use client';

import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Student } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StudentCardProps {
  student: Student;
  index: number;
  onUpdate?: (id: string, updatedStudent: Student) => void;
}

export function StudentCard({ student, index, onUpdate }: StudentCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [editedStudent, setEditedStudent] = useState<Student>(student);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedStudent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    if (onUpdate) {
      onUpdate(student.id, editedStudent);
    }
    setIsOpen(false);
  };

  return (
    <Draggable draggableId={student.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-4 mb-4 bg-gray-800 text-gray-100 rounded-lg shadow ${
            snapshot.isDragging ? 'shadow-lg' : ''
          }`}
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg">{student.name}</h3>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="bg-gray-700 hover:bg-gray-600 text-gray-200 border-gray-600">
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-gray-100 border-gray-700">
                <DialogHeader>
                  <DialogTitle>Edit Student</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">Name</Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={editedStudent.name} 
                      onChange={handleInputChange} 
                      className="col-span-3 bg-gray-700 border-gray-600 text-gray-100"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      value={editedStudent.email} 
                      onChange={handleInputChange} 
                      className="col-span-3 bg-gray-700 border-gray-600 text-gray-100"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="contact" className="text-right">Contact</Label>
                    <Input 
                      id="contact" 
                      name="contact" 
                      value={editedStudent.contact} 
                      onChange={handleInputChange} 
                      className="col-span-3 bg-gray-700 border-gray-600 text-gray-100"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="text-sm text-gray-300">
            <p className="mb-1">Email: {student.email}</p>
            <p>Contact: {student.contact}</p>
          </div>
        </div>
      )}
    </Draggable>
  );
}
