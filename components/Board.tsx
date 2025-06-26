'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { BoardData, Student } from '@/lib/types';
import { Column } from './Column';
import { Toaster, toast } from 'sonner';
import { AddStudentDialog } from './AddStudentDialog';

interface BoardProps {
  initialData: BoardData;
}

export function Board({ initialData }: BoardProps) {
  const [data, setData] = useState(initialData);

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
    const student = data.students[draggableId];

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
    
    // Show notification when a student is moved to a different column
    toast.success(`${student.name} moved from ${start.title} to ${finish.title}`, {
      position: 'top-center',
      duration: 3000,
    });
  };

  const handleAddStudent = (studentData: Omit<Student, 'id'>) => {
    const studentId = `student-${Date.now()}`;
    const newStudent: Student = {
      id: studentId,
      ...studentData,
    };

    const firstColumnId = data.columnOrder[0];
    const firstColumn = data.columns[firstColumnId];

    setData((prevData) => ({
      ...prevData,
      students: {
        ...prevData.students,
        [studentId]: newStudent,
      },
      columns: {
        ...prevData.columns,
        [firstColumnId]: {
          ...firstColumn,
          studentIds: [...firstColumn.studentIds, studentId],
        },
      },
    }));

    toast.success(`New student ${newStudent.name} added to ${firstColumn.title}`, {
      position: 'top-center',
      duration: 3000,
    });
  };

  const handleUpdateStudent = (id: string, updatedStudent: Student) => {
    setData((prevData) => ({
      ...prevData,
      students: {
        ...prevData.students,
        [id]: updatedStudent,
      },
    }));
    toast.success(`Student ${updatedStudent.name} information updated`, {
      position: 'top-center',
      duration: 3000,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100">
      <Toaster theme="dark" />
      <header className="sticky top-0 z-20 flex flex-col sm:flex-row justify-between items-center p-4 bg-gray-950/80 backdrop-blur-sm border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white mb-4 sm:mb-0">
          Student Onboarding
        </h1>
        <AddStudentDialog onAddStudent={handleAddStudent} />
      </header>
      <main className="flex-1 overflow-x-auto p-4 bg-gray-950">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-col md:flex-row gap-4 overflow-x-auto pb-4">
            {data.columnOrder.map((columnId) => {
              const column = data.columns[columnId];
              const students = column.studentIds.map(
                (studentId) => data.students[studentId]
              );
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
