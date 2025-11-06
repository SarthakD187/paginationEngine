/**
 * Live Document Editor with Real-time Pagination
 * Like Google Docs - type content and see it paginate as you write
 */

import React, { useState } from 'react';
import {
  usePaginationConfig,
  useLivePagination,
  PaginatedDocument,
  PageSize,
  PageOrientation,
} from '../index';
import { RichTextEditor } from './Editor/RichTextEditor';
import { htmlToContentBlocks } from './Editor/htmlToContentBlocks';

const initialContent = `<h1>Start Writing Your Document</h1>
<p>This is a live document editor. Type your content here and watch it paginate in real-time on the right side!</p>
<p>Try these features:</p>
<ul>
  <li>Use the toolbar to format your text</li>
  <li>Add headings, bold, italic, and more</li>
  <li>Insert images and tables</li>
  <li>Change page settings in the control panel</li>
</ul>
<p>Start typing below to see the magic happen...</p>`;

export const EditorApp: React.FC = () => {
  const [htmlContent, setHtmlContent] = useState(initialContent);
  const [scale, setScale] = useState(0.5);
  const [renderMode, setRenderMode] = useState<'all' | 'single' | 'spread'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditor, setShowEditor] = useState(true);

  // Initialize pagination config
  const {
    config,
    updatePageSize,
    updateOrientation,
    updateBreakRules,
  } = usePaginationConfig({
    pageConfig: {
      size: 'A4',
      orientation: 'portrait',
      margins: { top: 72, right: 72, bottom: 72, left: 72 },
      header: {
        height: 40,
        content: () => [
          {
            type: 'text',
            id: 'header-title',
            text: 'My Document',
            style: { fontSize: 10, color: '#666' },
          },
        ],
      },
      footer: {
        height: 40,
        showPageNumber: true,
        pageNumberPosition: 'center',
      },
    },
    breakRules: {
      orphanControl: 2,
      widowControl: 2,
    },
    liveUpdate: true,
  });

  // Convert HTML to content blocks
  const contentBlocks = htmlToContentBlocks(htmlContent);

  // Use live pagination with debouncing
  const { pages, totalPages, isProcessing } = useLivePagination(
    contentBlocks,
    config,
    300 // 300ms debounce
  );

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'hidden',
  };

  const controlsStyle: React.CSSProperties = {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    padding: '12px 16px',
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
    alignItems: 'center',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    marginRight: '6px',
  };

  const selectStyle: React.CSSProperties = {
    padding: '4px 8px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
  };

  const mainStyle: React.CSSProperties = {
    display: 'flex',
    flex: 1,
    overflow: 'hidden',
  };

  const editorPaneStyle: React.CSSProperties = {
    flex: showEditor ? '0 0 50%' : '0 0 0',
    borderRight: showEditor ? '1px solid #e5e7eb' : 'none',
    overflow: 'hidden',
    display: showEditor ? 'flex' : 'none',
    flexDirection: 'column',
  };

  const previewPaneStyle: React.CSSProperties = {
    flex: 1,
    overflow: 'auto',
    backgroundColor: '#f3f4f6',
    padding: '20px',
  };

  return (
    <div style={containerStyle}>
      {/* Control Panel */}
      <div style={controlsStyle}>
        <div>
          <span style={labelStyle}>Page:</span>
          <select
            style={selectStyle}
            value={config.pageConfig.size}
            onChange={(e) => updatePageSize(e.target.value as PageSize)}
          >
            <option value="A4">A4</option>
            <option value="Letter">Letter</option>
            <option value="Legal">Legal</option>
            <option value="A3">A3</option>
          </select>
        </div>

        <div>
          <select
            style={selectStyle}
            value={config.pageConfig.orientation}
            onChange={(e) => updateOrientation(e.target.value as PageOrientation)}
          >
            <option value="portrait">Portrait</option>
            <option value="landscape">Landscape</option>
          </select>
        </div>

        <div>
          <span style={labelStyle}>Scale:</span>
          <input
            type="range"
            min="0.25"
            max="1"
            step="0.05"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
            style={{ width: '100px' }}
          />
          <span style={{ marginLeft: '8px', fontSize: '13px' }}>
            {(scale * 100).toFixed(0)}%
          </span>
        </div>

        <div>
          <span style={labelStyle}>View:</span>
          <select
            style={selectStyle}
            value={renderMode}
            onChange={(e) =>
              setRenderMode(e.target.value as 'all' | 'single' | 'spread')
            }
          >
            <option value="all">All Pages</option>
            <option value="single">Single</option>
            <option value="spread">Spread</option>
          </select>
        </div>

        <div>
          <span style={labelStyle}>Orphan:</span>
          <input
            type="number"
            min="0"
            max="5"
            value={config.breakRules?.orphanControl || 2}
            onChange={(e) =>
              updateBreakRules({ orphanControl: parseInt(e.target.value) })
            }
            style={{ ...selectStyle, width: '50px' }}
          />
        </div>

        <div>
          <span style={labelStyle}>Widow:</span>
          <input
            type="number"
            min="0"
            max="5"
            value={config.breakRules?.widowControl || 2}
            onChange={(e) =>
              updateBreakRules({ widowControl: parseInt(e.target.value) })
            }
            style={{ ...selectStyle, width: '50px' }}
          />
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button
            onClick={() => setShowEditor(!showEditor)}
            style={{
              ...selectStyle,
              backgroundColor: showEditor ? '#3b82f6' : '#6b7280',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 12px',
            }}
          >
            {showEditor ? 'Hide Editor' : 'Show Editor'}
          </button>
          <span style={{ fontSize: '14px', color: isProcessing ? '#f59e0b' : '#059669' }}>
            {isProcessing ? 'Processing...' : `${totalPages} pages`}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div style={mainStyle}>
        {/* Editor Pane */}
        <div style={editorPaneStyle}>
          <RichTextEditor content={htmlContent} onChange={setHtmlContent} />
        </div>

        {/* Preview Pane */}
        <div style={previewPaneStyle}>
          <PaginatedDocument
            pages={pages}
            config={config.pageConfig}
            scale={scale}
            showPageBorders={true}
            renderMode={renderMode}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
};
