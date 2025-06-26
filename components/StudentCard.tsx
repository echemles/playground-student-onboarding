/**
 * StudentCard Component
 * 
 * A draggable card component that displays a student's information.
 * Each card can be dragged and dropped between columns and includes
 * an edit button to modify student details.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Student} props.student - The student data to display
 * @param {number} props.index - The position index of the card in the column
 * @param {Function} [props.onUpdate] - Optional callback for handling student updates
 * @returns {JSX.Element} Rendered component
 */

'use client';

import { Draggable } from '@hello-pangea/dnd';
import { Student } from '@/lib/types';
import { EditStudentDialog } from './EditStudentDialog';

/**
 * Props for the StudentCard component
 * @interface StudentCardProps
 * @property {Student} student - The student data to display
 * @property {number} index - The position index of the card in the column
 * @property {Function} [onUpdate] - Optional callback for handling student updates
 */
interface StudentCardProps {
  student: Student;
  index: number;
  onUpdate?: (id: string, updatedStudent: Student) => void;
}

/**
 * Student card component that renders student information
 * and provides drag-and-drop functionality
 */
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
            <p className="mb-1 break-words">
              <span className="text-gray-400">Contact:</span> {student.contact}
            </p>
            {student.signature && (
              <div className="mt-2">
                <span className="text-gray-400 block mb-1">Signature:</span>
                <img 
                  src={student.signature}
                  alt={`Signature of ${student.name}`}
                  width={100}
                  height={50}
                  className="max-h-16 border border-gray-700 rounded bg-white p-1"
                />
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}
