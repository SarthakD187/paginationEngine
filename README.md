# Pagination Engine

A comprehensive and robust pagination engine for React applications, similar to Google Docs/Apple Pages. This library provides sophisticated document layout capabilities with features like dynamic page breaks, orphan/widow control, headers and footers, and support for various content types.

## 🎯 Live Document Editor

**NEW!** This project now includes a **live WYSIWYG editor** where you can type content and see it paginate in real-time - just like Google Docs!

### Try the Live Editor

```bash
npm install
npm run dev
```

Then open http://localhost:5173/ and start typing!

**Features:**
- ✍️ Type and edit content in real-time
- 📄 Watch pagination happen as you write
- 🎨 Rich formatting toolbar (bold, italic, headings, etc.)
- 🖼️ Insert images and tables
- 📊 Live page count and controls
- 👁️ Side-by-side editor and preview

**[Read the Live Editor Guide →](LIVE_EDITOR.md)**

## Features

- **Dynamic Page Breaks**: Automatically flows content across pages with intelligent break decisions
- **Orphan and Widow Control**: Prevents single lines from appearing alone at the top or bottom of pages
- **Headers and Footers**: Customizable page headers and footers with page numbering
- **Rich Content Support**: Text, images, tables, lists, and nested containers
- **Live Updates**: Real-time pagination as content changes with debouncing
- **Configurable Page Sizes**: Support for A4, Letter, Legal, A3, and custom sizes
- **Multiple View Modes**: Single page, two-page spread, or all pages view
- **TypeScript**: Full TypeScript support with comprehensive type definitions
- **React Integration**: Easy-to-use React components and hooks

## Installation

```bash
npm install pagination-engine
```

## Quick Start

```tsx
import React from 'react';
import {
  usePagination,
  PaginatedDocument,
  ContentBlock,
} from 'pagination-engine';

const MyDocument = () => {
  const contentBlocks: ContentBlock[] = [
    {
      content: {
        type: 'text',
        id: '1',
        text: 'Hello, World!',
        style: {
          fontSize: 24,
          fontWeight: 'bold',
        },
      },
    },
    {
      content: {
        type: 'text',
        id: '2',
        text: 'This is a paginated document.',
        style: {
          fontSize: 14,
        },
      },
    },
  ];

  const { pages } = usePagination(contentBlocks, {
    pageConfig: {
      size: 'A4',
      orientation: 'portrait',
      margins: { top: 72, right: 72, bottom: 72, left: 72 },
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
  });

  return (
    <PaginatedDocument
      pages={pages}
      config={{
        size: 'A4',
        orientation: 'portrait',
        margins: { top: 72, right: 72, bottom: 72, left: 72 },
      }}
    />
  );
};
```

## Content Types

### Text Content

```tsx
{
  type: 'text',
  id: 'unique-id',
  text: 'Your text content here',
  style: {
    fontSize: 16,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#333',
    textAlign: 'justify',
    lineHeight: 1.5,
  }
}
```

### Image Content

```tsx
{
  type: 'image',
  id: 'unique-id',
  src: 'https://example.com/image.jpg',
  alt: 'Description',
  width: 400,
  height: 300,
  alignment: 'center', // 'left' | 'center' | 'right' | 'inline'
}
```

### Table Content

```tsx
{
  type: 'table',
  id: 'unique-id',
  rows: [
    {
      isHeader: true,
      cells: [
        {
          content: [{ type: 'text', id: 'cell-1', text: 'Header 1' }],
        },
        {
          content: [{ type: 'text', id: 'cell-2', text: 'Header 2' }],
        },
      ],
    },
    {
      cells: [
        {
          content: [{ type: 'text', id: 'cell-3', text: 'Data 1' }],
        },
        {
          content: [{ type: 'text', id: 'cell-4', text: 'Data 2' }],
        },
      ],
    },
  ],
  repeatHeaderOnPages: true,
}
```

### List Content

```tsx
{
  type: 'list',
  id: 'unique-id',
  ordered: false, // true for ordered lists
  items: [
    {
      content: [{ type: 'text', id: 'item-1', text: 'First item' }],
    },
    {
      content: [{ type: 'text', id: 'item-2', text: 'Second item' }],
      subItems: [
        {
          content: [{ type: 'text', id: 'subitem-1', text: 'Sub-item' }],
        },
      ],
    },
  ],
}
```

### Container Content

```tsx
{
  type: 'container',
  id: 'unique-id',
  children: [
    // Any content types
  ],
  style: {
    padding: 20,
    margin: 10,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  }
}
```

## Hooks

### `usePagination`

Main hook for pagination:

```tsx
const {
  pages,
  totalPages,
  currentPage,
  isProcessing,
  paginate,
  goToPage,
  nextPage,
  previousPage,
} = usePagination(contentBlocks, config);
```

### `useLivePagination`

Pagination with live updates and debouncing:

```tsx
const result = useLivePagination(
  contentBlocks,
  config,
  300 // debounce delay in ms
);
```

### `usePaginationConfig`

Manage pagination configuration:

```tsx
const {
  config,
  updatePageSize,
  updateOrientation,
  updateMargins,
  updateBreakRules,
} = usePaginationConfig(initialConfig);
```

### `useContentBlocks`

Manage content blocks:

```tsx
const {
  blocks,
  addBlock,
  removeBlock,
  updateBlock,
  insertBlock,
  moveBlock,
  clear,
} = useContentBlocks(initialBlocks);
```

## Configuration Options

### Page Configuration

```tsx
{
  pageConfig: {
    size: 'A4' | 'Letter' | 'Legal' | 'A3' | 'Custom',
    orientation: 'portrait' | 'landscape',
    dimensions: { width: 595, height: 842 }, // For custom sizes (in points)
    margins: {
      top: 72,
      right: 72,
      bottom: 72,
      left: 72,
    },
    header: {
      height: 40,
      showPageNumber: true,
      pageNumberPosition: 'left' | 'center' | 'right',
      pageNumberFormat: (pageNumber, totalPages) => `Page ${pageNumber}`,
      content: (pageNumber, totalPages) => [/* Content array */],
    },
    footer: {
      // Same as header
    },
    backgroundColor: '#ffffff',
  }
}
```

### Break Rules

```tsx
{
  breakRules: {
    orphanControl: 2, // Minimum lines at bottom of page
    widowControl: 2,  // Minimum lines at top of page
    avoidBreakInside: true,
  }
}
```

### Content Block Options

```tsx
{
  content: /* Content object */,
  breakBefore: true,  // Force page break before this content
  breakAfter: true,   // Force page break after this content
  keepWithNext: true, // Keep with next block
  keepTogether: true, // Don't split across pages
}
```

## Components

### `PaginatedDocument`

Main document renderer:

```tsx
<PaginatedDocument
  pages={pages}
  config={pageConfig}
  scale={0.75}
  showPageBorders={true}
  renderMode="all" // 'all' | 'single' | 'spread'
  currentPage={1}
  onPageChange={(page) => console.log(page)}
/>
```

### `PageRenderer`

Renders a single page:

```tsx
<PageRenderer
  page={page}
  config={pageConfig}
  scale={1}
  showPageBorders={true}
/>
```

### `ContentRenderer`

Renders content blocks:

```tsx
<ContentRenderer content={contentBlock} />
```

## Running the Demo

```bash
npm install
npm run dev
```

Open your browser to see the interactive demo with live controls for:
- Page size and orientation
- Scale and zoom
- View modes
- Orphan/widow control
- Margins and spacing

## Architecture

The pagination engine consists of several key components:

1. **Measurement System** (`src/utils/measurement.ts`): Measures content dimensions using canvas API
2. **Pagination Engine** (`src/core/PaginationEngine.ts`): Core algorithm for distributing content across pages
3. **Content Renderers** (`src/components/ContentRenderer.tsx`): React components for rendering different content types
4. **Page Renderers** (`src/components/PageRenderer.tsx`): Renders individual pages with headers/footers
5. **React Hooks** (`src/hooks/usePagination.ts`): Easy-to-use hooks for integration

## Use Cases

- Document editors (like Google Docs)
- Report generators
- PDF preview and generation
- Print-friendly views
- E-book readers
- Invoice and receipt systems
- Certificate and diploma generators

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## Credits

Built with React, TypeScript, and Vite.
