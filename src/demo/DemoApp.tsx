/**
 * Demo Application
 * Showcases the pagination engine with live controls
 */

import React, { useState } from 'react';
import {
  usePaginationConfig,
  useContentBlocks,
  useLivePagination,
  PaginatedDocument,
  PageSize,
  PageOrientation,
} from '../index';
import { sampleContent } from './sampleContent';

export const DemoApp: React.FC = () => {
  const [scale, setScale] = useState(0.75);
  const [renderMode, setRenderMode] = useState<'all' | 'single' | 'spread'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Initialize content blocks
  const { blocks } = useContentBlocks(sampleContent);

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
        showPageNumber: true,
        pageNumberPosition: 'right',
        content: () => [
          {
            type: 'text',
            id: 'header-title',
            text: 'Pagination Engine Demo',
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

  // Use live pagination
  const { pages, totalPages, isProcessing } = useLivePagination(blocks, config);

  const controlsStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    padding: '16px',
    zIndex: 1000,
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const controlGroupStyle: React.CSSProperties = {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
    alignItems: 'center',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '14px',
    fontWeight: 500,
    marginRight: '8px',
  };

  const selectStyle: React.CSSProperties = {
    padding: '6px 12px',
    borderRadius: '4px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
  };

  const contentStyle: React.CSSProperties = {
    marginTop: '100px',
    paddingBottom: '100px',
    backgroundColor: '#f3f4f6',
    minHeight: '100vh',
  };

  return (
    <div>
      {/* Controls */}
      <div style={controlsStyle}>
        <div style={controlGroupStyle}>
          <div>
            <span style={labelStyle}>Page Size:</span>
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
            <span style={labelStyle}>Orientation:</span>
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
              max="1.5"
              step="0.05"
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              style={{ width: '120px' }}
            />
            <span style={{ marginLeft: '8px', fontSize: '14px' }}>
              {(scale * 100).toFixed(0)}%
            </span>
          </div>

          <div>
            <span style={labelStyle}>View Mode:</span>
            <select
              style={selectStyle}
              value={renderMode}
              onChange={(e) =>
                setRenderMode(e.target.value as 'all' | 'single' | 'spread')
              }
            >
              <option value="all">All Pages</option>
              <option value="single">Single Page</option>
              <option value="spread">Two-Page Spread</option>
            </select>
          </div>

          <div>
            <span style={labelStyle}>Orphan Control:</span>
            <input
              type="number"
              min="0"
              max="5"
              value={config.breakRules?.orphanControl || 2}
              onChange={(e) =>
                updateBreakRules({ orphanControl: parseInt(e.target.value) })
              }
              style={{ ...selectStyle, width: '60px' }}
            />
          </div>

          <div>
            <span style={labelStyle}>Widow Control:</span>
            <input
              type="number"
              min="0"
              max="5"
              value={config.breakRules?.widowControl || 2}
              onChange={(e) =>
                updateBreakRules({ widowControl: parseInt(e.target.value) })
              }
              style={{ ...selectStyle, width: '60px' }}
            />
          </div>

          <div style={{ marginLeft: 'auto', fontSize: '14px', color: '#666' }}>
            {isProcessing ? (
              <span>Processing...</span>
            ) : (
              <span>
                Total Pages: <strong>{totalPages}</strong>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Document */}
      <div style={contentStyle}>
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
  );
};
