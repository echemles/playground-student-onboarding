'use client';

import { Draggable } from '@hello-pangea/dnd';
import { Student } from '@/lib/types';
import { EditStudentDialog } from './EditStudentDialog';

interface StudentCardProps {
  student: Student;
  index: number;
  onUpdate?: (id: string, updatedStudent: Student) => void;
}

export function StudentCard({ student, index, onUpdate }: StudentCardProps) {
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
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
            <h3 className="font-bold text-lg mb-2 sm:mb-0">{student.name}</h3>
            {onUpdate && <EditStudentDialog student={student} onUpdate={onUpdate} />}
          </div>
          <div className="text-sm text-gray-300 mt-2">
            <p className="mb-1 break-words">
              <span className="text-gray-400">Email:</span> {student.email}
            </p>
            <p className="break-words">
              <span className="text-gray-400">Contact:</span> {student.contact}
            </p>
          </div>
        </div>
      )}
    </Draggable>
  );
}
