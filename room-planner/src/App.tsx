import { TopBar } from '@/components/ui/TopBar';
import { ThreeDCanvas } from '@/components/ThreeDCanvas';
import { BottomBar } from '@/components/ui/BottomBar';
import { useFurnitureStore } from '@/store/furnitureStore';

// Add TypeScript declaration for window.setView
declare global {
  interface Window {
    setView: (preset: 'top' | 'front' | 'side' | 'corner') => void;
  }
}

function App() {
  // Get snap state from the furniture store
  const snapEnabled = useFurnitureStore((state) => state.snapEnabled);

  return (
    <div className='h-screen flex flex-col px-6 py-3 py-2 bg-background text-foreground'>
      <TopBar />
      <ThreeDCanvas snapEnabled={snapEnabled} />
      <div className='mt-3'>
        <BottomBar />
      </div>
    </div>
  );
}

export default App;
