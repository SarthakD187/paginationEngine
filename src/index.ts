/**
 * Pagination Engine
 * A comprehensive and robust pagination engine for React applications
 * Similar to Google Docs/Apple Pages
 */

// Core Engine
export { PaginationEngine } from './core/PaginationEngine';

// Types
export * from './types';

// Components
export { ContentRenderer } from './components/ContentRenderer';
export { PageRenderer } from './components/PageRenderer';
export { PaginatedDocument } from './components/PaginatedDocument';

// Hooks
export {
  usePagination,
  useLivePagination,
  usePaginationConfig,
  useContentBlocks,
} from './hooks/usePagination';

// Utilities
export { measureContent, measureText } from './utils/measurement';

// Re-export common types for convenience
export type {
  Content,
  ContentBlock,
  TextContent,
  ImageContent,
  TableContent,
  ListContent,
  ContainerContent,
  TextStyle,
} from './types/content';

export type {
  Page,
  PageConfig,
  PageSize,
  PageOrientation,
  PageMargins,
  PageDimensions,
  HeaderFooterConfig,
  PageBreakRule,
} from './types/page';

export type {
  PaginationEngineConfig,
  PaginationState,
} from './types';
