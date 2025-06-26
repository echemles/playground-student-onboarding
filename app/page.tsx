import { Board } from '@/components/Board';
import { initialData } from '@/lib/initial-data';

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-gray-950">
      <Board initialData={initialData} />
    </main>
  );
}
