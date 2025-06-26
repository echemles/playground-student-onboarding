/**
 * Column Component
 * 
 * Represents a single column in the board that can contain multiple student cards.
 * Handles the droppable area for drag-and-drop functionality.
 * 
 * @component
 * @param {Object} props - Component props
 * @param {ColumnType} props.column - Column data including ID and title
 * @param {Student[]} props.students - Array of students in this column
 * @param {Function} props.onUpdateStudent - Callback for updating student data
 * @returns {JSX.Element} Rendered component
 */

'use client';

import { Droppable } from '@hello-pangea/dnd';
import { Column as ColumnType, Student } from '@/lib/types';
import { StudentCard } from './StudentCard';

/**
 * Props for the Column component
 * @interface ColumnProps
 * @property {ColumnType} column - Column data including ID and title
 * @property {Student[]} students - Array of students in this column
 * @property {Function} onUpdateStudent - Callback for updating student data
 */
interface ColumnProps {
  column: ColumnType;
  students: Student[];
  onUpdateStudent: (id: string, updatedStudent: Student) => void;
}

/**
 * Column component that renders a droppable area for student cards
 * and displays the column title and student count
 */
export function Column({ column, students, onUpdateStudent }: ColumnProps) {
  return (
    <div 
      className="flex-shrink-0 flex flex-col w-full md:w-80 h-auto md:h-[calc(100vh-120px)] bg-gray-900 text-gray-100 rounded-lg shadow-md border border-gray-700 mb-4 md:mb-0"
      aria-labelledby={`column-title-${column.id}`}
    >
      <h2 
        id={`column-title-${column.id}`} 
        className="p-4 text-lg font-semibold border-b border-gray-700 sticky top-0 bg-gray-900 z-10"
      >
        <div className="flex justify-between items-center">
          <span>{column.title}</span>
          <span className="text-sm bg-gray-700 px-2 py-1 rounded-full">{students.length}</span>
        </div>
      </h2>
      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-4 flex-1 overflow-y-auto max-h-[500px] md:max-h-none ${
              snapshot.isDraggingOver ? 'bg-gray-800' : 'bg-gray-900'
            }`}
          >
            {students.length === 0 && (
              <div className="text-center p-4 text-gray-500 italic border border-dashed border-gray-700 rounded-lg">
                No students yet
              </div>
            )}
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
