import { TopBar } from '@/components/ui/TopBar';
import { ThreeDCanvas } from '@/components/ThreeDCanvas';

// Add TypeScript declaration for window.setView
declare global {
  interface Window {
    setView: (preset: 'top' | 'front' | 'side' | 'corner') => void;
  }
}

function App() {
  return (
    <div className='h-screen flex flex-col p-6 bg-background text-foreground'>
      <TopBar />
      <ThreeDCanvas />
    </div>
  );
}

export default App;
