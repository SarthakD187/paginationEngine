/**
 * Central export for all types
 */

export * from './content';
export * from './page';
export * from './layout';

export interface PaginationEngineConfig {
  pageConfig: import('./page').PageConfig;
  breakRules?: import('./page').PageBreakRule;
  liveUpdate?: boolean;
  renderDelay?: number; // Debounce delay for live updates
}

export interface PaginationState {
  pages: import('./page').Page[];
  totalPages: number;
  currentPage: number;
  isProcessing: boolean;
}
