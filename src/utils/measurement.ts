/**
 * Content measurement utilities
 * These functions measure the dimensions of different content types
 */

import {
  Content,
  TextContent,
  ImageContent,
  TableContent,
  ListContent,
  ContainerContent,
  TextStyle,
} from '../types/content';
import { MeasuredContent, LayoutContext } from '../types/layout';

/**
 * Canvas for text measurement
 */
let measurementCanvas: HTMLCanvasElement | null = null;
let measurementContext: CanvasRenderingContext2D | null = null;

function getMeasurementContext(): CanvasRenderingContext2D {
  if (!measurementCanvas) {
    measurementCanvas = document.createElement('canvas');
    measurementContext = measurementCanvas.getContext('2d');
  }
  if (!measurementContext) {
    throw new Error('Failed to get canvas context for measurement');
  }
  return measurementContext;
}

/**
 * Convert TextStyle to CSS font string
 */
function getFontString(style: TextStyle = {}): string {
  const weight = style.fontWeight || 'normal';
  const fontStyle = style.fontStyle || 'normal';
  const size = style.fontSize || 16;
  const family = style.fontFamily || 'Arial, sans-serif';
  return `${fontStyle} ${weight} ${size}px ${family}`;
}

/**
 * Measure text content height
 */
export function measureText(
  text: string,
  style: TextStyle = {},
  availableWidth: number
): { width: number; height: number; lines: string[] } {
  const ctx = getMeasurementContext();
  ctx.font = getFontString(style);

  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';
  const lineHeight = (style.fontSize || 16) * (style.lineHeight || 1.2);

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > availableWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  const width = Math.min(
    availableWidth,
    Math.max(...lines.map((line) => ctx.measureText(line).width))
  );
  const height = lines.length * lineHeight;

  return { width, height, lines };
}

/**
 * Measure text content with break points
 */
export function measureTextContent(
  content: TextContent,
  context: LayoutContext
): MeasuredContent {
  const measurement = measureText(
    content.text,
    content.style,
    context.availableWidth
  );

  const lineHeight = (content.style?.fontSize || 16) * (content.style?.lineHeight || 1.2);
  const breakPoints = measurement.lines.map((_, index) => (index + 1) * lineHeight);

  return {
    content,
    rect: {
      x: 0,
      y: context.currentY,
      width: measurement.width,
      height: measurement.height,
    },
    baseline: lineHeight * 0.8,
    canBreak: measurement.lines.length > 1,
    breakPoints,
  };
}

/**
 * Measure image content
 */
export function measureImageContent(
  content: ImageContent,
  context: LayoutContext
): MeasuredContent {
  let width = content.width || context.availableWidth;
  let height = content.height || 0;

  if (content.aspectRatio && !height) {
    height = width / content.aspectRatio;
  } else if (width && height && width > context.availableWidth) {
    // Scale down to fit
    const scale = context.availableWidth / width;
    width = context.availableWidth;
    height = height * scale;
  }

  return {
    content,
    rect: {
      x: 0,
      y: context.currentY,
      width,
      height,
    },
    canBreak: false, // Images cannot be broken across pages
  };
}

/**
 * Measure table content
 */
export function measureTableContent(
  content: TableContent,
  context: LayoutContext
): MeasuredContent {
  const columnWidths = content.columnWidths || [];
  const numColumns =
    content.rows[0]?.cells.length ||
    Math.max(...columnWidths.map((_, i) => i + 1));

  // Calculate column widths if not provided
  const actualColumnWidths =
    columnWidths.length === numColumns
      ? columnWidths
      : Array(numColumns).fill(context.availableWidth / numColumns);

  let totalHeight = 0;
  const breakPoints: number[] = [];
  const children: MeasuredContent[] = [];

  for (let rowIndex = 0; rowIndex < content.rows.length; rowIndex++) {
    const row = content.rows[rowIndex];
    let maxRowHeight = 0;

    // Measure each cell in the row
    for (let cellIndex = 0; cellIndex < row.cells.length; cellIndex++) {
      const cell = row.cells[cellIndex];
      const cellWidth =
        actualColumnWidths[cellIndex] * (cell.colSpan || 1) -
        (cell.style?.padding || 8) * 2;

      let cellHeight = 0;
      for (const cellContent of cell.content) {
        const measured = measureContent(cellContent, {
          ...context,
          availableWidth: cellWidth,
          currentY: 0,
        });
        cellHeight += measured.rect.height;
      }

      cellHeight += (cell.style?.padding || 8) * 2;
      maxRowHeight = Math.max(maxRowHeight, cellHeight);
    }

    totalHeight += maxRowHeight;
    // Don't break table header
    if (!row.isHeader) {
      breakPoints.push(totalHeight);
    }
  }

  return {
    content,
    rect: {
      x: 0,
      y: context.currentY,
      width: context.availableWidth,
      height: totalHeight,
    },
    canBreak: breakPoints.length > 0,
    breakPoints,
    children,
  };
}

/**
 * Measure list content
 */
export function measureListContent(
  content: ListContent,
  context: LayoutContext
): MeasuredContent {
  const indentSize = 30;
  const bulletWidth = 20;
  let totalHeight = 0;
  const breakPoints: number[] = [];

  for (let i = 0; i < content.items.length; i++) {
    const item = content.items[i];
    const level = item.level || 0;
    const indent = level * indentSize;
    const availableWidth = context.availableWidth - indent - bulletWidth;

    let itemHeight = 0;
    for (const itemContent of item.content) {
      const measured = measureContent(itemContent, {
        ...context,
        availableWidth,
        currentY: 0,
      });
      itemHeight += measured.rect.height;
    }

    totalHeight += itemHeight;
    breakPoints.push(totalHeight);

    // Measure sub-items recursively
    if (item.subItems && item.subItems.length > 0) {
      const subList: ListContent = {
        ...content,
        items: item.subItems,
      };
      const measured = measureListContent(subList, {
        ...context,
        availableWidth: availableWidth - indentSize,
        currentY: 0,
      });
      totalHeight += measured.rect.height;
    }
  }

  return {
    content,
    rect: {
      x: 0,
      y: context.currentY,
      width: context.availableWidth,
      height: totalHeight,
    },
    canBreak: breakPoints.length > 1,
    breakPoints,
  };
}

/**
 * Measure container content
 */
export function measureContainerContent(
  content: ContainerContent,
  context: LayoutContext
): MeasuredContent {
  const padding = content.style?.padding || 0;
  const margin = content.style?.margin || 0;
  const availableWidth = context.availableWidth - padding * 2 - margin * 2;

  let totalHeight = padding;
  const children: MeasuredContent[] = [];
  const breakPoints: number[] = [];

  for (const child of content.children) {
    const measured = measureContent(child, {
      ...context,
      availableWidth,
      currentY: 0,
    });
    children.push(measured);
    totalHeight += measured.rect.height;
    if (measured.canBreak && measured.breakPoints) {
      breakPoints.push(...measured.breakPoints.map((bp) => totalHeight + bp));
    } else {
      breakPoints.push(totalHeight);
    }
  }

  totalHeight += padding;

  return {
    content,
    rect: {
      x: margin,
      y: context.currentY,
      width: context.availableWidth - margin * 2,
      height: totalHeight,
    },
    canBreak: breakPoints.length > 0,
    breakPoints,
    children,
  };
}

/**
 * Generic content measurement dispatcher
 */
export function measureContent(
  content: Content,
  context: LayoutContext
): MeasuredContent {
  switch (content.type) {
    case 'text':
      return measureTextContent(content, context);
    case 'image':
      return measureImageContent(content, context);
    case 'table':
      return measureTableContent(content, context);
    case 'list':
      return measureListContent(content, context);
    case 'container':
      return measureContainerContent(content, context);
    default:
      throw new Error(`Unknown content type: ${(content as any).type}`);
  }
}
