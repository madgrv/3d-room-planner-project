import { TopBar } from '@/components/ui/TopBar';
import { ThreeDCanvas } from '@/components/ThreeDCanvas';
import { BottomBar } from '@/components/ui/BottomBar';
import { TestContextMenu } from '@/components/ui/TestContextMenu';
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
    <div className='h-screen flex flex-col p-6 bg-background text-foreground'>
      <TopBar />
      <ThreeDCanvas snapEnabled={snapEnabled} />
      <div className="mt-3">
        <BottomBar />
      </div>
      
      {/* Test component to verify context menu functionality */}
      <div className="mt-4">
        <h2 className="text-xl font-bold mb-2">Context Menu Test Area</h2>
        <TestContextMenu />
      </div>
    </div>
  );
}

export default App;
