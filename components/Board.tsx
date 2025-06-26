'use client';

import { useState } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { BoardData, Student } from '@/lib/types';
import { Column } from './Column';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface BoardProps {
  initialData: BoardData;
}

export function Board({ initialData }: BoardProps) {
  const [data, setData] = useState(initialData);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newStudent, setNewStudent] = useState<Omit<Student, 'id'>>({ 
    name: '', 
    email: '', 
    contact: '' 
  });

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    if (start === finish) {
      const newStudentIds = Array.from(start.studentIds);
      newStudentIds.splice(source.index, 1);
      newStudentIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        studentIds: newStudentIds,
      };

      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };

      setData(newState);
      return;
    }

    const startStudentIds = Array.from(start.studentIds);
    startStudentIds.splice(source.index, 1);
    const newStart = {
      ...start,
      studentIds: startStudentIds,
    };

    const finishStudentIds = Array.from(finish.studentIds);
    finishStudentIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      studentIds: finishStudentIds,
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };
    setData(newState);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewStudent(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddStudent = () => {
    // Generate a unique ID for the new student
    const studentId = `student-${Date.now()}`;
    
    // Create the new student
    const student = {
      id: studentId,
      ...newStudent
    };
    
    // Add the student to the first column
    const firstColumnId = data.columnOrder[0];
    const firstColumn = data.columns[firstColumnId];
    
    setData({
      ...data,
      students: {
        ...data.students,
        [studentId]: student
      },
      columns: {
        ...data.columns,
        [firstColumnId]: {
          ...firstColumn,
          studentIds: [...firstColumn.studentIds, studentId]
        }
      }
    });
    
    // Reset the form and close the dialog
    setNewStudent({ name: '', email: '', contact: '' });
    setIsAddDialogOpen(false);
  };

  const handleUpdateStudent = (id: string, updatedStudent: Student) => {
    setData({
      ...data,
      students: {
        ...data.students,
        [id]: updatedStudent
      }
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      <header className="sticky top-0 z-10 flex items-center justify-between p-4 bg-gray-900 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-white">Student Onboarding</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add Student</Button>
          </DialogTrigger>
          <DialogContent className="bg-gray-800 text-gray-100 border-gray-700">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-name" className="text-right">Name</Label>
                <Input 
                  id="new-name" 
                  name="name" 
                  value={newStudent.name} 
                  onChange={handleInputChange} 
                  className="col-span-3 bg-gray-700 border-gray-600 text-gray-100"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-email" className="text-right">Email</Label>
                <Input 
                  id="new-email" 
                  name="email" 
                  value={newStudent.email} 
                  onChange={handleInputChange} 
                  className="col-span-3 bg-gray-700 border-gray-600 text-gray-100"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="new-contact" className="text-right">Contact</Label>
                <Input 
                  id="new-contact" 
                  name="contact" 
                  value={newStudent.contact} 
                  onChange={handleInputChange} 
                  className="col-span-3 bg-gray-700 border-gray-600 text-gray-100"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleAddStudent} 
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!newStudent.name || !newStudent.email || !newStudent.contact}
              >
                Add Student
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </header>
      <main className="flex-1 overflow-x-auto p-4 bg-gray-950">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-nowrap gap-4 sm:flex-col">
            {data.columnOrder.map((columnId) => {
              const column = data.columns[columnId];
              const students = column.studentIds.map((studentId) => data.students[studentId]);

              return (
                <Column 
                  key={column.id} 
                  column={column} 
                  students={students} 
                  onUpdateStudent={handleUpdateStudent}
                />
              );
            })}
          </div>
        </DragDropContext>
      </main>
    </div>
  );
}
