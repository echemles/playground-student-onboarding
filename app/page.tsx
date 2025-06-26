/**
 * Home Page Component
 * 
 * The main page component that renders the student onboarding board.
 * It serves as the entry point for the application's UI.
 * 
 * @component
 * @returns {JSX.Element} The main application page with the Board component
 */

import { Board } from '@/components/Board';
import { initialData } from '@/lib/initial-data';

/**
 * Home page component that renders the main application interface
 * Wraps the Board component with proper layout and styling
 */
export default function Home() {
  return (
    // Main container with full viewport dimensions and dark background
    <main className="h-screen w-screen overflow-hidden bg-gray-950">
      {/* Render the Board component with initial data */}
      <Board initialData={initialData} />
    </main>
  );
  
}
