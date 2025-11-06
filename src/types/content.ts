/**
 * Core content types for the pagination engine
 */

export type ContentType = 'text' | 'image' | 'table' | 'list' | 'container';

export interface TextStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number | 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  color?: string;
  backgroundColor?: string;
  textDecoration?: 'none' | 'underline' | 'line-through';
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  lineHeight?: number;
  letterSpacing?: number;
}

export interface TextContent {
  type: 'text';
  id: string;
  text: string;
  style?: TextStyle;
}

export interface ImageContent {
  type: 'image';
  id: string;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  alignment?: 'left' | 'center' | 'right' | 'inline';
}

export interface TableCell {
  content: Content[];
  colSpan?: number;
  rowSpan?: number;
  style?: TextStyle & {
    padding?: number;
    borderWidth?: number;
    borderColor?: string;
  };
}

export interface TableRow {
  cells: TableCell[];
  isHeader?: boolean;
}

export interface TableContent {
  type: 'table';
  id: string;
  rows: TableRow[];
  columnWidths?: number[];
  repeatHeaderOnPages?: boolean;
}

export interface ListItem {
  content: Content[];
  level?: number;
  subItems?: ListItem[];
}

export interface ListContent {
  type: 'list';
  id: string;
  items: ListItem[];
  ordered?: boolean;
  startNumber?: number;
  style?: TextStyle;
}

export interface ContainerContent {
  type: 'container';
  id: string;
  children: Content[];
  style?: {
    padding?: number;
    margin?: number;
    backgroundColor?: string;
    borderWidth?: number;
    borderColor?: string;
    borderRadius?: number;
  };
}

export type Content =
  | TextContent
  | ImageContent
  | TableContent
  | ListContent
  | ContainerContent;

export interface ContentBlock {
  content: Content;
  breakBefore?: boolean;
  breakAfter?: boolean;
  keepWithNext?: boolean;
  keepTogether?: boolean;
}
