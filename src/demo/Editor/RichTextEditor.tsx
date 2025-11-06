/**
 * Rich Text Editor Component
 */

import React, { useRef, useCallback } from 'react';
import { EditorToolbar } from './EditorToolbar';

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
  content,
  onChange,
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const handleFormat = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();

    // Trigger change after formatting
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInsert = useCallback((type: 'image' | 'table' | 'list') => {
    if (!editorRef.current) return;

    switch (type) {
      case 'image': {
        const url = prompt('Enter image URL:');
        if (url) {
          document.execCommand('insertImage', false, url);
        }
        break;
      }
      case 'table': {
        const rows = prompt('Number of rows:', '3');
        const cols = prompt('Number of columns:', '3');
        if (rows && cols) {
          let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;">';
          for (let i = 0; i < parseInt(rows); i++) {
            tableHTML += '<tr>';
            for (let j = 0; j < parseInt(cols); j++) {
              tableHTML += '<td style="border: 1px solid #ddd; padding: 8px;">Cell</td>';
            }
            tableHTML += '</tr>';
          }
          tableHTML += '</table>';
          document.execCommand('insertHTML', false, tableHTML);
        }
        break;
      }
    }

    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const editorStyle: React.CSSProperties = {
    minHeight: '500px',
    padding: '20px',
    border: 'none',
    outline: 'none',
    fontSize: '16px',
    lineHeight: '1.6',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: 'white',
    overflow: 'auto',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid #e5e7eb' }}>
      <EditorToolbar onFormat={handleFormat} onInsert={handleInsert} />
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        style={editorStyle}
        dangerouslySetInnerHTML={{ __html: content }}
        spellCheck
      />
    </div>
  );
};
