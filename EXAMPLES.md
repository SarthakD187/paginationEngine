# Pagination Engine Examples

This document provides detailed examples of using the Pagination Engine in different scenarios.

## Table of Contents

1. [Basic Usage](#basic-usage)
2. [Custom Headers and Footers](#custom-headers-and-footers)
3. [Multiple Content Types](#multiple-content-types)
4. [Advanced Page Break Control](#advanced-page-break-control)
5. [Live Editing](#live-editing)
6. [Custom Page Sizes](#custom-page-sizes)

---

## Basic Usage

The simplest way to use the pagination engine:

```tsx
import React from 'react';
import { usePagination, PaginatedDocument, ContentBlock } from 'pagination-engine';

function SimpleDocument() {
  const contentBlocks: ContentBlock[] = [
    {
      content: {
        type: 'text',
        id: '1',
        text: 'Welcome to Pagination Engine',
        style: {
          fontSize: 32,
          fontWeight: 'bold',
          textAlign: 'center',
        },
      },
    },
    {
      content: {
        type: 'text',
        id: '2',
        text: 'This is a simple paginated document with minimal configuration.',
        style: {
          fontSize: 16,
          lineHeight: 1.5,
        },
      },
    },
  ];

  const { pages } = usePagination(contentBlocks, {
    pageConfig: {
      size: 'A4',
      orientation: 'portrait',
      margins: { top: 72, right: 72, bottom: 72, left: 72 },
    },
  });

  return <PaginatedDocument pages={pages} config={{ size: 'A4', orientation: 'portrait', margins: { top: 72, right: 72, bottom: 72, left: 72 } }} />;
}
```

---

## Custom Headers and Footers

Add custom headers and footers with page numbers:

```tsx
import React from 'react';
import { usePagination, PaginatedDocument, ContentBlock } from 'pagination-engine';

function DocumentWithHeaderFooter() {
  const contentBlocks: ContentBlock[] = [
    // ... your content
  ];

  const { pages } = usePagination(contentBlocks, {
    pageConfig: {
      size: 'Letter',
      orientation: 'portrait',
      margins: { top: 72, right: 72, bottom: 72, left: 72 },
      header: {
        height: 50,
        content: (pageNumber, totalPages) => [
          {
            type: 'container',
            id: `header-${pageNumber}`,
            children: [
              {
                type: 'text',
                id: `company-name-${pageNumber}`,
                text: 'My Company',
                style: { fontSize: 12, fontWeight: 'bold', color: '#2563eb' },
              },
            ],
            style: {
              padding: 10,
            },
          },
        ],
      },
      footer: {
        height: 40,
        showPageNumber: true,
        pageNumberPosition: 'center',
        pageNumberFormat: (page, total) => `Page ${page} of ${total}`,
      },
    },
  });

  return <PaginatedDocument pages={pages} config={{ size: 'Letter', orientation: 'portrait', margins: { top: 72, right: 72, bottom: 72, left: 72 } }} />;
}
```

---

## Multiple Content Types

Example using text, images, tables, and lists:

```tsx
import React from 'react';
import { usePagination, PaginatedDocument, ContentBlock } from 'pagination-engine';

function RichDocument() {
  const contentBlocks: ContentBlock[] = [
    // Title
    {
      content: {
        type: 'text',
        id: 'title',
        text: 'Quarterly Report',
        style: {
          fontSize: 36,
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#1a1a1a',
        },
      },
    },

    // Introduction paragraph
    {
      content: {
        type: 'text',
        id: 'intro',
        text: 'This report summarizes our achievements and metrics for Q4 2024.',
        style: {
          fontSize: 14,
          lineHeight: 1.6,
          textAlign: 'justify',
        },
      },
    },

    // Image
    {
      content: {
        type: 'image',
        id: 'chart',
        src: 'https://example.com/chart.png',
        alt: 'Q4 Performance Chart',
        width: 500,
        height: 300,
        alignment: 'center',
      },
    },

    // Table
    {
      content: {
        type: 'table',
        id: 'metrics-table',
        rows: [
          {
            isHeader: true,
            cells: [
              {
                content: [{ type: 'text', id: 'h1', text: 'Metric', style: { fontWeight: 'bold' } }],
              },
              {
                content: [{ type: 'text', id: 'h2', text: 'Q3', style: { fontWeight: 'bold' } }],
              },
              {
                content: [{ type: 'text', id: 'h3', text: 'Q4', style: { fontWeight: 'bold' } }],
              },
              {
                content: [{ type: 'text', id: 'h4', text: 'Growth', style: { fontWeight: 'bold' } }],
              },
            ],
          },
          {
            cells: [
              { content: [{ type: 'text', id: 'd1', text: 'Revenue', style: { fontSize: 12 } }] },
              { content: [{ type: 'text', id: 'd2', text: '$1.2M', style: { fontSize: 12 } }] },
              { content: [{ type: 'text', id: 'd3', text: '$1.5M', style: { fontSize: 12 } }] },
              { content: [{ type: 'text', id: 'd4', text: '+25%', style: { fontSize: 12, color: 'green' } }] },
            ],
          },
          {
            cells: [
              { content: [{ type: 'text', id: 'd5', text: 'Users', style: { fontSize: 12 } }] },
              { content: [{ type: 'text', id: 'd6', text: '50K', style: { fontSize: 12 } }] },
              { content: [{ type: 'text', id: 'd7', text: '75K', style: { fontSize: 12 } }] },
              { content: [{ type: 'text', id: 'd8', text: '+50%', style: { fontSize: 12, color: 'green' } }] },
            ],
          },
        ],
        repeatHeaderOnPages: true,
      },
    },

    // List
    {
      content: {
        type: 'list',
        id: 'achievements',
        ordered: false,
        items: [
          {
            content: [
              { type: 'text', id: 'a1', text: 'Launched new product line', style: { fontSize: 14 } },
            ],
          },
          {
            content: [
              { type: 'text', id: 'a2', text: 'Expanded to 3 new markets', style: { fontSize: 14 } },
            ],
            subItems: [
              {
                content: [
                  { type: 'text', id: 'a2-1', text: 'Europe', style: { fontSize: 12 } },
                ],
              },
              {
                content: [
                  { type: 'text', id: 'a2-2', text: 'Asia-Pacific', style: { fontSize: 12 } },
                ],
              },
              {
                content: [
                  { type: 'text', id: 'a2-3', text: 'South America', style: { fontSize: 12 } },
                ],
              },
            ],
          },
          {
            content: [
              { type: 'text', id: 'a3', text: 'Improved customer satisfaction by 40%', style: { fontSize: 14 } },
            ],
          },
        ],
      },
    },
  ];

  const { pages } = usePagination(contentBlocks, {
    pageConfig: {
      size: 'A4',
      orientation: 'portrait',
      margins: { top: 72, right: 72, bottom: 72, left: 72 },
    },
  });

  return <PaginatedDocument pages={pages} config={{ size: 'A4', orientation: 'portrait', margins: { top: 72, right: 72, bottom: 72, left: 72 } }} />;
}
```

---

## Advanced Page Break Control

Control how content breaks across pages:

```tsx
import React from 'react';
import { usePagination, PaginatedDocument, ContentBlock } from 'pagination-engine';

function DocumentWithBreakControl() {
  const contentBlocks: ContentBlock[] = [
    {
      content: {
        type: 'text',
        id: 'section1',
        text: 'Section 1: Introduction',
        style: { fontSize: 24, fontWeight: 'bold' },
      },
      keepWithNext: true, // Keep with next block
    },
    {
      content: {
        type: 'text',
        id: 'section1-content',
        text: 'This content stays with the heading above.',
        style: { fontSize: 14 },
      },
    },
    {
      content: {
        type: 'container',
        id: 'important-box',
        children: [
          {
            type: 'text',
            id: 'important',
            text: 'This entire box stays together on one page.',
            style: { fontSize: 14 },
          },
        ],
        style: {
          padding: 20,
          backgroundColor: '#fef3c7',
          borderWidth: 2,
          borderColor: '#f59e0b',
        },
      },
      keepTogether: true, // Don't split across pages
    },
    {
      content: {
        type: 'text',
        id: 'section2',
        text: 'Section 2: Analysis',
        style: { fontSize: 24, fontWeight: 'bold' },
      },
      breakBefore: true, // Start on new page
    },
  ];

  const { pages } = usePagination(contentBlocks, {
    pageConfig: {
      size: 'A4',
      orientation: 'portrait',
      margins: { top: 72, right: 72, bottom: 72, left: 72 },
    },
    breakRules: {
      orphanControl: 2, // Minimum 2 lines at bottom
      widowControl: 2,  // Minimum 2 lines at top
    },
  });

  return <PaginatedDocument pages={pages} config={{ size: 'A4', orientation: 'portrait', margins: { top: 72, right: 72, bottom: 72, left: 72 } }} />;
}
```

---

## Live Editing

Real-time pagination updates as content changes:

```tsx
import React, { useState } from 'react';
import { useLivePagination, PaginatedDocument, ContentBlock } from 'pagination-engine';

function LiveEditor() {
  const [text, setText] = useState('Start typing to see live pagination...');

  const contentBlocks: ContentBlock[] = [
    {
      content: {
        type: 'text',
        id: 'live-text',
        text,
        style: {
          fontSize: 16,
          lineHeight: 1.6,
        },
      },
    },
  ];

  const { pages, isProcessing } = useLivePagination(
    contentBlocks,
    {
      pageConfig: {
        size: 'A4',
        orientation: 'portrait',
        margins: { top: 72, right: 72, bottom: 72, left: 72 },
      },
    },
    300 // Debounce delay in ms
  );

  return (
    <div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: '100%', height: 200, marginBottom: 20 }}
      />
      {isProcessing && <div>Processing...</div>}
      <PaginatedDocument pages={pages} config={{ size: 'A4', orientation: 'portrait', margins: { top: 72, right: 72, bottom: 72, left: 72 } }} />
    </div>
  );
}
```

---

## Custom Page Sizes

Use custom page dimensions:

```tsx
import React from 'react';
import { usePagination, PaginatedDocument, ContentBlock } from 'pagination-engine';

function CustomSizeDocument() {
  const contentBlocks: ContentBlock[] = [
    {
      content: {
        type: 'text',
        id: 'text',
        text: 'This uses a custom page size!',
        style: { fontSize: 16 },
      },
    },
  ];

  const { pages } = usePagination(contentBlocks, {
    pageConfig: {
      size: 'Custom',
      orientation: 'portrait',
      dimensions: {
        width: 800,  // Custom width in points
        height: 1200, // Custom height in points
      },
      margins: { top: 50, right: 50, bottom: 50, left: 50 },
    },
  });

  return (
    <PaginatedDocument
      pages={pages}
      config={{
        size: 'Custom',
        orientation: 'portrait',
        dimensions: { width: 800, height: 1200 },
        margins: { top: 50, right: 50, bottom: 50, left: 50 },
      }}
    />
  );
}
```

---

## View Modes

Different ways to view your paginated content:

```tsx
import React, { useState } from 'react';
import { usePagination, PaginatedDocument } from 'pagination-engine';

function ViewModeExample() {
  const [renderMode, setRenderMode] = useState<'all' | 'single' | 'spread'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // ... your content blocks and pagination setup

  return (
    <div>
      <select value={renderMode} onChange={(e) => setRenderMode(e.target.value as any)}>
        <option value="all">All Pages</option>
        <option value="single">Single Page</option>
        <option value="spread">Two-Page Spread</option>
      </select>

      <PaginatedDocument
        pages={pages}
        config={pageConfig}
        renderMode={renderMode}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        scale={0.75}
      />
    </div>
  );
}
```

---

## Integration Tips

1. **Performance**: Use `useLivePagination` with appropriate debounce delays for real-time editing
2. **Memory**: For large documents, use single page or spread view modes
3. **Printing**: Set `scale={1}` and use CSS media queries for optimal print output
4. **Styling**: All content types support extensive styling options
5. **Accessibility**: Provide proper alt text for images and semantic HTML

## Next Steps

- Explore the [API Documentation](README.md)
- Check out the demo application in `src/demo`
- Customize page templates for your use case
