/**
 * Live Pagination Editor - Actually paginates content across pages as you type
 * This is the hard part - real-time pagination with contentEditable
 */

import React, { useRef, useCallback, useState, useEffect } from 'react';
import { EditorToolbar } from '../Editor/EditorToolbar';
import { htmlToContentBlocks } from '../Editor/htmlToContentBlocks';
import { useLivePagination } from '../../hooks/usePagination';

export const LivePaginationEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [htmlContent, setHtmlContent] = useState('<p>Start typing your document here...</p>');

  // Page dimensions (8.5" x 11" at 96 DPI)
  const PAGE_WIDTH = 816;
  const PAGE_HEIGHT = 1056;
  const MARGIN = 96;

  const handleFormat = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();

    // Capture content after formatting
    if (editorRef.current) {
      setHtmlContent(editorRef.current.innerHTML);
    }
  }, []);

  const handleInsert = useCallback((type: 'image' | 'table' | 'list') => {
    if (!editorRef.current) return;

    switch (type) {
      case 'image': {
        const url = prompt('Enter image URL:', 'https://picsum.photos/400/300');
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
      setHtmlContent(editorRef.current.innerHTML);
    }
    editorRef.current?.focus();
  }, []);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      setHtmlContent(editorRef.current.innerHTML);
    }
  }, []);

  // Convert HTML to content blocks
  const contentBlocks = htmlToContentBlocks(htmlContent);

  // Use live pagination
  const { pages, totalPages, isProcessing } = useLivePagination(
    contentBlocks,
    {
      pageConfig: {
        size: 'Letter',
        orientation: 'portrait',
        margins: { top: MARGIN, right: MARGIN, bottom: MARGIN, left: MARGIN },
        footer: {
          height: 30,
          showPageNumber: true,
          pageNumberPosition: 'center',
        },
      },
      breakRules: {
        orphanControl: 2,
        widowControl: 2,
      },
    },
    200 // Faster debounce for more responsive feel
  );

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

  const mainContainerStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
    display: 'flex',
    gap: 20,
    padding: '40px 20px',
  };

  const editorPaneStyle: React.CSSProperties = {
    flex: '0 0 50%',
    display: 'flex',
    justifyContent: 'flex-end',
  };

  const previewPaneStyle: React.CSSProperties = {
    flex: '0 0 50%',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  };

  const editorPageStyle: React.CSSProperties = {
    width: PAGE_WIDTH,
    minHeight: PAGE_HEIGHT,
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
  };

  const editorContentStyle: React.CSSProperties = {
    padding: MARGIN,
    minHeight: PAGE_HEIGHT - MARGIN * 2,
    outline: 'none',
    fontSize: 16,
    lineHeight: 1.6,
    fontFamily: 'Arial, sans-serif',
    color: '#374151',
  };

  const previewPageStyle: React.CSSProperties = {
    width: PAGE_WIDTH,
    minHeight: PAGE_HEIGHT,
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative',
    padding: MARGIN,
  };

  return (
    <div style={containerStyle}>
      <div style={toolbarContainerStyle}>
        <EditorToolbar onFormat={handleFormat} onInsert={handleInsert} />
        <div style={statusBarStyle}>
          <span>📝 Type in left pane → See pagination in right pane</span>
          <span style={{ color: isProcessing ? '#f59e0b' : '#059669' }}>
            {isProcessing ? 'Paginating...' : `${totalPages} ${totalPages === 1 ? 'page' : 'pages'}`}
          </span>
        </div>
      </div>

      <div style={mainContainerStyle}>
        {/* Editor Pane */}
        <div style={editorPaneStyle}>
          <div style={editorPageStyle}>
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={handleInput}
              style={editorContentStyle}
              spellCheck
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
            <div style={{
              position: 'absolute',
              bottom: 20,
              left: 0,
              right: 0,
              textAlign: 'center',
              fontSize: 10,
              color: '#999',
            }}>
              Editor
            </div>
          </div>
        </div>

        {/* Preview Pane - Shows actual paginated pages */}
        <div style={previewPaneStyle}>
          {pages.map((page) => (
            <div key={page.pageNumber} style={previewPageStyle}>
              <div style={{ fontSize: 10, color: '#999', marginBottom: 10 }}>
                Page {page.pageNumber} of {totalPages}
              </div>
              {page.content.map((content, idx) => {
                // Render content (simplified)
                if (content.type === 'text') {
                  const Tag = content.style?.fontSize && content.style.fontSize > 20 ? 'h2' : 'p';
                  return (
                    <Tag key={idx} style={{
                      fontSize: content.style?.fontSize,
                      fontWeight: content.style?.fontWeight,
                      fontStyle: content.style?.fontStyle,
                      color: content.style?.color,
                      textAlign: content.style?.textAlign,
                      margin: '8px 0',
                    }}>
                      {content.text}
                    </Tag>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
