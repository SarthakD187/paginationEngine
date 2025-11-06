# Pagination Engine Architecture

This document describes the internal architecture of the Pagination Engine.

## Overview

The Pagination Engine is built on a modular architecture with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     React Components                         │
│  (PaginatedDocument, PageRenderer, ContentRenderer)         │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                     React Hooks                              │
│  (usePagination, useLivePagination, usePaginationConfig)   │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                  Pagination Engine                           │
│         (Core algorithm and page break logic)               │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                 Measurement System                           │
│        (Content dimension calculation via Canvas)           │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Type System (`src/types/`)

Defines the data structures used throughout the library:

#### Content Types (`content.ts`)
- **TextContent**: Styled text with formatting options
- **ImageContent**: Images with sizing and alignment
- **TableContent**: Tables with cells, rows, and styling
- **ListContent**: Ordered/unordered lists with nesting
- **ContainerContent**: Generic containers for grouping content

#### Page Types (`page.ts`)
- **PageConfig**: Page size, orientation, margins, headers/footers
- **PageBreakRule**: Orphan/widow control settings
- **Page**: Complete page representation with content and metadata

#### Layout Types (`layout.ts`)
- **MeasuredContent**: Content with calculated dimensions
- **LayoutContext**: Available space and positioning info
- **BreakDecision**: Page break decision with reasoning

### 2. Measurement System (`src/utils/measurement.ts`)

The measurement system calculates content dimensions using the Canvas API:

```typescript
measureContent(content, context) → MeasuredContent
```

**Key Features:**
- Text measurement using canvas 2D context
- Word wrapping and line height calculation
- Break point identification for multi-line content
- Recursive measurement for nested content
- Support for all content types

**How It Works:**
1. Creates an off-screen canvas for text measurement
2. Applies font styles and measures text dimensions
3. Calculates word wrapping based on available width
4. Identifies valid break points between lines
5. Returns content with dimensions and break points

### 3. Pagination Engine (`src/core/PaginationEngine.ts`)

The core algorithm that distributes content across pages:

```typescript
class PaginationEngine {
  paginate(contentBlocks: ContentBlock[]): Page[]
}
```

**Algorithm Flow:**

```
1. Initialize first page
   ↓
2. For each content block:
   ├─ Handle explicit page breaks (breakBefore)
   ├─ Measure content dimensions
   ├─ Check if content fits on current page
   │  ├─ YES → Add to current page
   │  └─ NO → Decide page break
   │     ├─ Can split? → Find best break point
   │     │  ├─ Apply orphan/widow control
   │     │  └─ Split content
   │     └─ Can't split? → Move to next page
   └─ Handle explicit page breaks (breakAfter)
   ↓
3. Generate headers and footers
   ↓
4. Return paginated pages
```

**Break Decision Logic:**

1. **Keep Together**: If `keepTogether` is true, move entire block to next page
2. **Keep With Next**: If `keepWithNext` is true, keep with following block
3. **Orphan Control**: Ensure minimum lines at bottom of page
4. **Widow Control**: Ensure minimum lines at top of page
5. **Find Best Break**: Select break point closest to available space
6. **Fallback**: Move entire content to next page

### 4. React Components (`src/components/`)

#### ContentRenderer
Renders different content types using React:
- Maps content type to appropriate renderer
- Handles styles and formatting
- Supports nested content

#### PageRenderer
Renders a complete page with:
- Content area with margins
- Header section
- Footer section
- Page borders and styling

#### PaginatedDocument
Top-level component that:
- Manages multiple pages
- Provides view modes (all, single, spread)
- Handles navigation between pages
- Applies scaling

### 5. React Hooks (`src/hooks/usePagination.ts`)

#### usePagination
Core pagination hook:
```typescript
const { pages, totalPages, currentPage, paginate, goToPage } =
  usePagination(contentBlocks, config);
```

Features:
- Automatic pagination on content/config changes
- Page navigation helpers
- Processing state tracking
- Asynchronous pagination for UI responsiveness

#### useLivePagination
Real-time pagination with debouncing:
```typescript
const result = useLivePagination(contentBlocks, config, 300);
```

Features:
- Debounced updates to prevent excessive re-pagination
- Ideal for live editing scenarios
- Same API as usePagination

#### usePaginationConfig
Configuration management:
```typescript
const { config, updatePageSize, updateOrientation, updateMargins } =
  usePaginationConfig(initialConfig);
```

Features:
- Convenient config updates
- Type-safe setters
- Reactive updates

#### useContentBlocks
Content management:
```typescript
const { blocks, addBlock, removeBlock, updateBlock, moveBlock } =
  useContentBlocks(initialBlocks);
```

Features:
- CRUD operations on content blocks
- Block reordering
- Type-safe updates

## Data Flow

### Pagination Flow

```
ContentBlocks → Measurement → Layout → Pages
                    ↓
             Break Decisions
                    ↓
         Orphan/Widow Control
                    ↓
            Split Content
```

### Rendering Flow

```
Pages → PaginatedDocument → PageRenderer → ContentRenderer
                                   ↓              ↓
                            Page Layout    Content Types
                                   ↓              ↓
                              Headers/      Text/Image/
                              Footers       Table/List
```

## Performance Considerations

### 1. Measurement Caching
Currently, content is measured on each pagination. Future optimizations could include:
- Memoizing measurements for unchanged content
- Incremental pagination for large documents

### 2. Debouncing
Live pagination uses debouncing to prevent excessive calculations during rapid content changes.

### 3. Asynchronous Pagination
Pagination runs asynchronously (via setTimeout) to keep the UI responsive.

### 4. Rendering Optimization
- Virtual scrolling for large documents (not yet implemented)
- Single page/spread view reduces DOM nodes

## Extension Points

### Custom Content Types

Add new content types by:

1. Define type in `src/types/content.ts`:
```typescript
export interface CustomContent {
  type: 'custom';
  id: string;
  // ... custom properties
}

export type Content = ... | CustomContent;
```

2. Add measurement logic in `src/utils/measurement.ts`:
```typescript
function measureCustomContent(content: CustomContent, context: LayoutContext): MeasuredContent {
  // Measurement logic
}
```

3. Add renderer in `src/components/ContentRenderer.tsx`:
```typescript
const CustomRenderer: React.FC<{ content: CustomContent }> = ({ content }) => {
  // Rendering logic
};
```

### Custom Page Break Logic

Extend break decision logic in `PaginationEngine.decideBreak()`:

```typescript
private decideBreak(measured: MeasuredContent, ...): BreakDecision {
  // Custom break logic
  if (customCondition) {
    return { shouldBreak: true, reason: 'custom' };
  }
  // ... existing logic
}
```

### Custom Rendering

Create custom page templates:

```typescript
function CustomPageRenderer({ page, config }: PageRendererProps) {
  return (
    <div className="custom-page">
      {/* Custom layout */}
    </div>
  );
}
```

## Testing Strategy

1. **Unit Tests**: Test individual functions (measurement, break logic)
2. **Integration Tests**: Test complete pagination workflows
3. **Visual Regression Tests**: Ensure consistent rendering
4. **Performance Tests**: Benchmark pagination speed

## Future Enhancements

1. **Virtual Scrolling**: For very large documents
2. **PDF Export**: Direct PDF generation
3. **Column Layout**: Multi-column page layouts
4. **Floating Elements**: Sidebars and callouts
5. **Advanced Tables**: Cell splitting across pages
6. **Background Rendering**: Web Worker pagination
7. **Undo/Redo**: Content editing history
8. **Collaborative Editing**: Real-time multi-user support

## Dependencies

- **React**: UI framework
- **TypeScript**: Type safety
- **Canvas API**: Text measurement

No external runtime dependencies for core functionality.

## Browser Compatibility

- Modern browsers with Canvas API support
- ES2020+ JavaScript features
- CSS Flexbox for layout

## License

MIT
