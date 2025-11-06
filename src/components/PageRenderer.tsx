/**
 * Page Renderer Component
 * Renders a single page with its content, headers, and footers
 */

import React from 'react';
import { Page, PageConfig } from '../types';
import { ContentRenderer } from './ContentRenderer';
import { PAGE_SIZES } from '../types/page';

interface PageRendererProps {
  page: Page;
  config: PageConfig;
  scale?: number;
  showPageBorders?: boolean;
}

export const PageRenderer: React.FC<PageRendererProps> = ({
  page,
  config,
  scale = 1,
  showPageBorders = true,
}) => {
  const { size, orientation, dimensions, margins } = config;

  // Calculate page dimensions
  let pageWidth: number;
  let pageHeight: number;

  if (size === 'Custom' && dimensions) {
    pageWidth = orientation === 'landscape' ? dimensions.height : dimensions.width;
    pageHeight = orientation === 'landscape' ? dimensions.width : dimensions.height;
  } else {
    const pageDimensions = PAGE_SIZES[size as Exclude<typeof size, 'Custom'>];
    pageWidth = orientation === 'landscape' ? pageDimensions.height : pageDimensions.width;
    pageHeight = orientation === 'landscape' ? pageDimensions.width : pageDimensions.height;
  }

  const pageStyle: React.CSSProperties = {
    width: pageWidth * scale,
    height: pageHeight * scale,
    backgroundColor: config.backgroundColor || '#ffffff',
    boxShadow: showPageBorders ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
    border: showPageBorders ? '1px solid #ddd' : 'none',
    margin: '20px auto',
    position: 'relative',
    overflow: 'hidden',
    transform: `scale(${scale})`,
    transformOrigin: 'top center',
  };

  const contentAreaStyle: React.CSSProperties = {
    position: 'absolute',
    top: margins.top + (config.header?.height || 0),
    left: margins.left,
    right: margins.right,
    bottom: margins.bottom + (config.footer?.height || 0),
    overflow: 'hidden',
  };

  const headerStyle: React.CSSProperties = {
    position: 'absolute',
    top: margins.top,
    left: margins.left,
    right: margins.right,
    height: config.header?.height || 0,
    borderBottom: config.header ? '1px solid #ddd' : 'none',
    display: 'flex',
    alignItems: 'center',
    fontSize: 10,
  };

  const footerStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: margins.bottom,
    left: margins.left,
    right: margins.right,
    height: config.footer?.height || 0,
    borderTop: config.footer ? '1px solid #ddd' : 'none',
    display: 'flex',
    alignItems: 'center',
    fontSize: 10,
  };

  return (
    <div style={pageStyle} className="pagination-engine-page">
      {/* Header */}
      {config.header && page.header && page.header.length > 0 && (
        <div style={headerStyle} className="pagination-engine-header">
          {page.header.map((content, index) => (
            <ContentRenderer key={`header-${index}`} content={content} />
          ))}
        </div>
      )}

      {/* Content Area */}
      <div style={contentAreaStyle} className="pagination-engine-content">
        {page.content.map((content, index) => (
          <div key={`content-${index}`} style={{ marginBottom: 8 }}>
            <ContentRenderer content={content} />
          </div>
        ))}
      </div>

      {/* Footer */}
      {config.footer && page.footer && page.footer.length > 0 && (
        <div style={footerStyle} className="pagination-engine-footer">
          {page.footer.map((content, index) => (
            <ContentRenderer key={`footer-${index}`} content={content} />
          ))}
        </div>
      )}
    </div>
  );
};
