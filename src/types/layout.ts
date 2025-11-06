/**
 * Layout and measurement types
 */

import { Content } from './content';

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MeasuredContent {
  content: Content;
  rect: Rect;
  baseline?: number; // For text alignment
  canBreak: boolean;
  breakPoints?: number[]; // Y positions where content can break
  children?: MeasuredContent[];
}

export interface LayoutContext {
  availableWidth: number;
  availableHeight: number;
  currentY: number;
  pageNumber: number;
}

export interface BreakDecision {
  shouldBreak: boolean;
  breakAt?: number; // Y position to break at
  reason?: 'orphan' | 'widow' | 'keepTogether' | 'keepWithNext' | 'pageEnd';
}

export interface LayoutResult {
  measuredContent: MeasuredContent[];
  totalHeight: number;
  pageBreaks: number[]; // Y positions of page breaks
}
