/**
 * Paginated Document Component
 * Main component that renders all pages of a paginated document
 */

import React from 'react';
import { Page, PageConfig } from '../types';
import { PageRenderer } from './PageRenderer';

interface PaginatedDocumentProps {
  pages: Page[];
  config: PageConfig;
  scale?: number;
  showPageBorders?: boolean;
  currentPage?: number;
  onPageChange?: (pageNumber: number) => void;
  renderMode?: 'all' | 'single' | 'spread';
}

export const PaginatedDocument: React.FC<PaginatedDocumentProps> = ({
  pages,
  config,
  scale = 1,
  showPageBorders = true,
  currentPage = 1,
  onPageChange,
  renderMode = 'all',
}) => {
  const containerStyle: React.CSSProperties = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  };

  const navigationStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: 20,
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: 'white',
    padding: '10px 20px',
    borderRadius: 8,
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    gap: 15,
    zIndex: 1000,
  };

  const renderPages = () => {
    switch (renderMode) {
      case 'single':
        const singlePage = pages.find((p) => p.pageNumber === currentPage);
        return singlePage ? (
          <PageRenderer
            page={singlePage}
            config={config}
            scale={scale}
            showPageBorders={showPageBorders}
          />
        ) : null;

      case 'spread':
        const leftPage = pages.find((p) => p.pageNumber === currentPage);
        const rightPage = pages.find((p) => p.pageNumber === currentPage + 1);
        return (
          <div style={{ display: 'flex', gap: 20 }}>
            {leftPage && (
              <PageRenderer
                page={leftPage}
                config={config}
                scale={scale}
                showPageBorders={showPageBorders}
              />
            )}
            {rightPage && (
              <PageRenderer
                page={rightPage}
                config={config}
                scale={scale}
                showPageBorders={showPageBorders}
              />
            )}
          </div>
        );

      case 'all':
      default:
        return pages.map((page) => (
          <PageRenderer
            key={page.pageNumber}
            page={page}
            config={config}
            scale={scale}
            showPageBorders={showPageBorders}
          />
        ));
    }
  };

  return (
    <div>
      <div style={containerStyle}>{renderPages()}</div>

      {renderMode !== 'all' && pages.length > 1 && (
        <div style={navigationStyle}>
          <button
            onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              padding: '8px 16px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              opacity: currentPage === 1 ? 0.5 : 1,
            }}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {pages.length}
          </span>
          <button
            onClick={() => onPageChange?.(Math.min(pages.length, currentPage + 1))}
            disabled={currentPage === pages.length}
            style={{
              padding: '8px 16px',
              cursor: currentPage === pages.length ? 'not-allowed' : 'pointer',
              opacity: currentPage === pages.length ? 0.5 : 1,
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
