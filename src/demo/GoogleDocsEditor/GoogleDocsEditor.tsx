/**
 * Google Docs Style Editor
 * Type directly with visible page boundaries
 */

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { EditorToolbar } from '../Editor/EditorToolbar';

interface PageBreakMarkerProps {
  pageNumber: number;
}

const PageBreakMarker: React.FC<PageBreakMarkerProps> = ({ pageNumber }) => (
  <div
    style={{
      position: 'relative',
      height: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      margin: '0 -96px',
      borderTop: '2px dashed #d1d5db',
      borderBottom: '2px dashed #d1d5db',
      color: '#9ca3af',
      fontSize: 12,
      fontWeight: 500,
      userSelect: 'none',
    }}
    contentEditable={false}
  >
    Page Break • Page {pageNumber}
  </div>
);

export const GoogleDocsEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [pageCount, setPageCount] = useState(1);

  // Page dimensions (8.5" x 11" at 96 DPI)
  const PAGE_WIDTH = 816;
  const PAGE_HEIGHT = 1056;
  const MARGIN = 96;
  const CONTENT_HEIGHT = PAGE_HEIGHT - MARGIN * 2;

  const handleFormat = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const handleInsert = useCallback((type: 'image' | 'table' | 'list') => {
    if (!editorRef.current) return;

    switch (type) {
      case 'image': {
        const url = prompt('Enter image URL:', 'https://picsum.photos/400/300');
        if (url) {
          const img = document.createElement('img');
          img.src = url;
          img.style.maxWidth = '100%';
          img.style.height = 'auto';
          img.style.display = 'block';
          img.style.margin = '10px 0';

          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(img);
            range.collapse(false);
          }
        }
        break;
      }
      case 'table': {
        const rows = prompt('Number of rows:', '3');
        const cols = prompt('Number of columns:', '3');
        if (rows && cols) {
          let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0; table-layout: fixed;">';
          for (let i = 0; i < parseInt(rows); i++) {
            tableHTML += '<tr>';
            for (let j = 0; j < parseInt(cols); j++) {
              tableHTML += `<td style="border: 1px solid #ddd; padding: 8px; min-height: 24px;">${i === 0 ? `Header ${j + 1}` : 'Cell'}</td>`;
            }
            tableHTML += '</tr>';
          }
          tableHTML += '</table><p><br></p>';
          document.execCommand('insertHTML', false, tableHTML);
        }
        break;
      }
    }

    editorRef.current?.focus();
  }, []);

  // Update page count based on content height
  const updatePageCount = useCallback(() => {
    if (!editorRef.current) return;

    const contentHeight = editorRef.current.scrollHeight;
    const calculatedPages = Math.max(1, Math.ceil(contentHeight / CONTENT_HEIGHT));

    if (calculatedPages !== pageCount) {
      setPageCount(calculatedPages);
    }
  }, [pageCount, CONTENT_HEIGHT]);

  useEffect(() => {
    const handleInput = () => {
      updatePageCount();
    };

    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener('input', handleInput);
      // Initial check
      updatePageCount();
    }

    return () => {
      if (editor) {
        editor.removeEventListener('input', handleInput);
      }
    };
  }, [updatePageCount]);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#f3f4f6',
    overflow: 'hidden',
  };

  const toolbarContainerStyle: React.CSSProperties = {
    backgroundColor: 'white',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    flexShrink: 0,
  };

  const statusBarStyle: React.CSSProperties = {
    padding: '8px 16px',
    fontSize: 13,
    color: '#666',
    borderTop: '1px solid #f0f0f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const scrollContainerStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 20px',
  };

  const pageContainerStyle: React.CSSProperties = {
    width: PAGE_WIDTH,
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    minHeight: '100%',
    position: 'relative',
  };

  const editorStyle: React.CSSProperties = {
    padding: `${MARGIN}px`,
    minHeight: CONTENT_HEIGHT,
    outline: 'none',
    fontSize: 16,
    lineHeight: 1.6,
    fontFamily: 'Arial, sans-serif',
    color: '#374151',
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  };

  // Calculate page break positions
  const pageBreakPositions: number[] = [];
  for (let i = 1; i < pageCount; i++) {
    pageBreakPositions.push(i * CONTENT_HEIGHT);
  }

  return (
    <div style={containerStyle}>
      <div style={toolbarContainerStyle}>
        <EditorToolbar onFormat={handleFormat} onInsert={handleInsert} />
        <div style={statusBarStyle}>
          <span>My Document</span>
          <span>
            {pageCount} {pageCount === 1 ? 'page' : 'pages'}
          </span>
        </div>
      </div>

      <div style={scrollContainerStyle}>
        <div style={pageContainerStyle}>
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            style={editorStyle}
            spellCheck
            data-placeholder="Start typing your document here..."
          >
            <h1>My Document</h1>
            <p>Start typing here. As you fill the page, content will automatically continue, and page breaks will be shown.</p>
            <p>Try:</p>
            <ul>
              <li>Using the formatting toolbar above</li>
              <li>Typing multiple paragraphs</li>
              <li>Inserting images and tables</li>
              <li>Watching page count update as you type</li>
            </ul>
          </div>

          {/* Visual page markers */}
          {pageBreakPositions.map((position, index) => (
            <div
              key={index}
              style={{
                position: 'absolute',
                top: MARGIN + position,
                left: 0,
                right: 0,
                height: 0,
                borderTop: '2px dashed #3b82f6',
                opacity: 0.5,
                pointerEvents: 'none',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: -10,
                  right: MARGIN,
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  fontSize: 10,
                  padding: '2px 8px',
                  borderRadius: 3,
                  fontWeight: 500,
                }}
              >
                Page {index + 2}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
