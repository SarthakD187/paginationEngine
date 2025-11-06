/**
 * Demo entry point
 */

import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { DemoApp } from './DemoApp';
import { LivePaginationEditor } from './GoogleDocsEditor/LivePaginationEditor';

function DemoSelector() {
  const [mode, setMode] = useState<'editor' | 'static'>('editor');

  if (mode === 'editor') {
    return (
      <div>
        <div style={{
          position: 'fixed',
          top: 10,
          right: 10,
          zIndex: 9999,
          backgroundColor: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        }}>
          <button
            onClick={() => setMode('static')}
            style={{
              padding: '6px 12px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            View Static Demo
          </button>
        </div>
        <LivePaginationEditor />
      </div>
    );
  }

  return (
    <div>
      <div style={{
        position: 'fixed',
        top: 10,
        right: 10,
        zIndex: 9999,
        backgroundColor: 'white',
        padding: '8px 12px',
        borderRadius: '4px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      }}>
        <button
          onClick={() => setMode('editor')}
          style={{
            padding: '6px 12px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '13px',
          }}
        >
          Open Live Editor
        </button>
      </div>
      <DemoApp />
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <DemoSelector />
    </React.StrictMode>
  );
}
