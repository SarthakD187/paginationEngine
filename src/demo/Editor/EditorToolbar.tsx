/**
 * Rich Text Editor Toolbar
 */

import React from 'react';

interface EditorToolbarProps {
  onFormat: (command: string, value?: string) => void;
  onInsert: (type: 'image' | 'table' | 'list') => void;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({ onFormat, onInsert }) => {
  const toolbarStyle: React.CSSProperties = {
    display: 'flex',
    gap: '8px',
    padding: '12px',
    backgroundColor: '#f9fafb',
    borderBottom: '1px solid #e5e7eb',
    flexWrap: 'wrap',
    alignItems: 'center',
  };

  const buttonStyle: React.CSSProperties = {
    padding: '6px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    backgroundColor: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
  };

  const selectStyle: React.CSSProperties = {
    ...buttonStyle,
    minWidth: '120px',
  };

  const dividerStyle: React.CSSProperties = {
    width: '1px',
    height: '24px',
    backgroundColor: '#d1d5db',
    margin: '0 4px',
  };

  return (
    <div style={toolbarStyle}>
      {/* Heading styles */}
      <select
        style={selectStyle}
        onChange={(e) => {
          const value = e.target.value;
          if (value === 'p') {
            onFormat('formatBlock', '<p>');
          } else {
            onFormat('formatBlock', `<${value}>`);
          }
        }}
        defaultValue="p"
      >
        <option value="p">Normal</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
        <option value="h4">Heading 4</option>
      </select>

      {/* Font size */}
      <select
        style={selectStyle}
        onChange={(e) => onFormat('fontSize', e.target.value)}
        defaultValue="3"
      >
        <option value="1">10px</option>
        <option value="2">13px</option>
        <option value="3">16px</option>
        <option value="4">18px</option>
        <option value="5">24px</option>
        <option value="6">32px</option>
        <option value="7">48px</option>
      </select>

      <div style={dividerStyle} />

      {/* Text formatting */}
      <button
        style={{ ...buttonStyle, fontWeight: 'bold' }}
        onClick={() => onFormat('bold')}
        title="Bold (Ctrl+B)"
      >
        B
      </button>
      <button
        style={{ ...buttonStyle, fontStyle: 'italic' }}
        onClick={() => onFormat('italic')}
        title="Italic (Ctrl+I)"
      >
        I
      </button>
      <button
        style={{ ...buttonStyle, textDecoration: 'underline' }}
        onClick={() => onFormat('underline')}
        title="Underline (Ctrl+U)"
      >
        U
      </button>

      <div style={dividerStyle} />

      {/* Alignment */}
      <button
        style={buttonStyle}
        onClick={() => onFormat('justifyLeft')}
        title="Align Left"
      >
        ≡
      </button>
      <button
        style={buttonStyle}
        onClick={() => onFormat('justifyCenter')}
        title="Align Center"
      >
        ≡
      </button>
      <button
        style={buttonStyle}
        onClick={() => onFormat('justifyRight')}
        title="Align Right"
      >
        ≡
      </button>
      <button
        style={buttonStyle}
        onClick={() => onFormat('justifyFull')}
        title="Justify"
      >
        ≡
      </button>

      <div style={dividerStyle} />

      {/* Lists */}
      <button
        style={buttonStyle}
        onClick={() => onFormat('insertUnorderedList')}
        title="Bullet List"
      >
        • List
      </button>
      <button
        style={buttonStyle}
        onClick={() => onFormat('insertOrderedList')}
        title="Numbered List"
      >
        1. List
      </button>

      <div style={dividerStyle} />

      {/* Insert */}
      <button
        style={{ ...buttonStyle, backgroundColor: '#3b82f6', color: 'white' }}
        onClick={() => onInsert('image')}
        title="Insert Image"
      >
        📷 Image
      </button>
      <button
        style={{ ...buttonStyle, backgroundColor: '#3b82f6', color: 'white' }}
        onClick={() => onInsert('table')}
        title="Insert Table"
      >
        ⊞ Table
      </button>

      <div style={dividerStyle} />

      {/* Text color */}
      <input
        type="color"
        onChange={(e) => onFormat('foreColor', e.target.value)}
        title="Text Color"
        style={{ width: 40, height: 32, border: '1px solid #d1d5db', borderRadius: 4 }}
      />
    </div>
  );
};
