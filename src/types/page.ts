/**
 * Page configuration and layout types
 */

import { Content } from './content';

export type PageSize = 'A4' | 'Letter' | 'Legal' | 'A3' | 'Custom';

export type PageOrientation = 'portrait' | 'landscape';

export interface PageDimensions {
  width: number;
  height: number;
}

export const PAGE_SIZES: Record<Exclude<PageSize, 'Custom'>, PageDimensions> = {
  A4: { width: 595, height: 842 }, // in points (72 points = 1 inch)
  Letter: { width: 612, height: 792 },
  Legal: { width: 612, height: 1008 },
  A3: { width: 842, height: 1191 },
};

export interface PageMargins {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface HeaderFooterConfig {
  height: number;
  content?: (pageNumber: number, totalPages: number) => Content[];
  showPageNumber?: boolean;
  pageNumberPosition?: 'left' | 'center' | 'right';
  pageNumberFormat?: (pageNumber: number, totalPages: number) => string;
}

export interface PageConfig {
  size: PageSize;
  orientation: PageOrientation;
  dimensions?: PageDimensions; // For custom sizes
  margins: PageMargins;
  header?: HeaderFooterConfig;
  footer?: HeaderFooterConfig;
  backgroundColor?: string;
}

export interface PageBreakRule {
  // Orphan control: minimum lines at bottom of page
  orphanControl?: number;
  // Widow control: minimum lines at top of page
  widowControl?: number;
  // Avoid breaking inside elements
  avoidBreakInside?: boolean;
}

export interface Page {
  pageNumber: number;
  content: Content[];
  header?: Content[];
  footer?: Content[];
  height: number;
  contentHeight: number;
}
