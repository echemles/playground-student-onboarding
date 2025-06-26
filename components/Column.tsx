'use client';

import { Droppable } from '@hello-pangea/dnd';
import { Column as ColumnType, Student } from '@/lib/types';
import { StudentCard } from './StudentCard';

interface ColumnProps {
  column: ColumnType;
  students: Student[];
  onUpdateStudent: (id: string, updatedStudent: Student) => void;
}

export function Column({ column, students, onUpdateStudent }: ColumnProps) {
  return (
    <div className="flex-shrink-0 flex flex-col w-80 bg-gray-900 text-gray-100 rounded-lg shadow-md border border-gray-700">
      <h2 className="p-4 text-lg font-semibold border-b border-gray-700">{column.title}</h2>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-4 flex-1 min-h-[200px] ${
              snapshot.isDraggingOver ? 'bg-gray-800' : 'bg-gray-900'
            }`}
          >
            {students.map((student, index) => (
              <StudentCard 
                key={student.id} 
                student={student} 
                index={index} 
                onUpdate={onUpdateStudent}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
