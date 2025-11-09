import { useState, useEffect } from 'react';
import { VirtualScrollDemo } from './components/demo/VirtualScrollDemo';
import { GalleryDemo } from './components/demo/GalleryDemo';
import { NestedListDemo } from './components/demo/NestedListDemo';
import './App.css';

function App() {
  const [activeDemo, setActiveDemo] = useState<'virtual' | 'gallery' | 'nested'>('gallery');

  // Listen for navigation events from NavigationCell
  useEffect(() => {
    const handleNavigate = (event: Event) => {
      const mode = (event as CustomEvent).detail as 'virtual' | 'nested';
      setActiveDemo(mode);
    };

    window.addEventListener('crow-navigate', handleNavigate);
    return () => window.removeEventListener('crow-navigate', handleNavigate);
  }, []);

  const handleNavigate = (mode: 'nested' | 'virtual') => {
    setActiveDemo(mode);
  };

  return (
    <div>
      {/* Hide navigation in gallery mode for pure fullbleed experience */}
      {activeDemo !== 'gallery' && (
        <nav style={{ padding: '1rem', borderBottom: '2px solid #ddd', background: '#f5f5f5' }}>
          <button
            onClick={() => setActiveDemo('gallery')}
            style={{
              padding: '0.5rem 1rem',
              marginRight: '1rem',
              background: '#fff',
              color: '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Gallery Mode
          </button>
          <button
            onClick={() => setActiveDemo('nested')}
            style={{
              padding: '0.5rem 1rem',
              marginRight: '1rem',
              background: activeDemo === 'nested' ? '#a97751' : '#fff',
              color: activeDemo === 'nested' ? '#fff' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Nested List Mode
          </button>
          <button
            onClick={() => setActiveDemo('virtual')}
            style={{
              padding: '0.5rem 1rem',
              background: activeDemo === 'virtual' ? '#a97751' : '#fff',
              color: activeDemo === 'virtual' ? '#fff' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Virtual Scroll Demo
          </button>
        </nav>
      )}
      {activeDemo === 'gallery' ? <GalleryDemo onNavigate={handleNavigate} /> : 
       activeDemo === 'nested' ? <NestedListDemo /> :
       <VirtualScrollDemo />}
    </div>
  );
}

export default App;
