import { useState } from 'react';
import { VirtualScrollDemo } from './components/demo/VirtualScrollDemo';
import { GalleryDemo } from './components/demo/GalleryDemo';
import { NestedListDemo } from './components/demo/NestedListDemo';
import './App.css';

function App() {
  const [activeDemo, setActiveDemo] = useState<'virtual' | 'gallery' | 'nested'>('gallery');

  return (
    <div>
      <nav style={{ padding: '1rem', borderBottom: '2px solid #ddd', background: '#f5f5f5' }}>
        <button
          onClick={() => setActiveDemo('gallery')}
          style={{
            padding: '0.5rem 1rem',
            marginRight: '1rem',
            background: activeDemo === 'gallery' ? '#a97751' : '#fff',
            color: activeDemo === 'gallery' ? '#fff' : '#333',
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
      {activeDemo === 'gallery' ? <GalleryDemo /> : 
       activeDemo === 'nested' ? <NestedListDemo /> :
       <VirtualScrollDemo />}
    </div>
  );
}

export default App;
