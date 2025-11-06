/**
 * Convert HTML from contentEditable to ContentBlocks
 */

import { ContentBlock, Content, TextStyle } from '../../types';

let blockIdCounter = 0;

function generateId(prefix: string = 'block'): string {
  return `${prefix}-${Date.now()}-${blockIdCounter++}`;
}

// Reserved for future use - computing styles from actual DOM elements
// function getComputedTextStyle(element: HTMLElement): TextStyle {
//   const style = window.getComputedStyle(element);
//   return {
//     fontFamily: style.fontFamily || undefined,
//     fontSize: parseInt(style.fontSize) || undefined,
//     fontWeight: style.fontWeight === 'bold' || parseInt(style.fontWeight) >= 600 ? 'bold' : 'normal',
//     fontStyle: style.fontStyle === 'italic' ? 'italic' : 'normal',
//     color: style.color || undefined,
//     textDecoration: style.textDecoration.includes('underline') ? 'underline' :
//                     style.textDecoration.includes('line-through') ? 'line-through' : 'none',
//     textAlign: (style.textAlign as any) || undefined,
//   };
// }

// Reserved for future use - parsing individual text nodes
// function parseTextNode(node: Node): string {
//   if (node.nodeType === Node.TEXT_NODE) {
//     return node.textContent || '';
//   }
//   return '';
// }

function parseElement(element: HTMLElement, parentStyle: TextStyle = {}): Content | null {
  const tagName = element.tagName.toLowerCase();

  // Handle headings and paragraphs
  if (tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || tagName === 'h4' || tagName === 'h5' || tagName === 'h6' || tagName === 'p' || tagName === 'div') {
    const text = element.textContent || '';
    if (!text.trim()) return null;

    const style: TextStyle = { ...parentStyle };

    // Heading sizes
    if (tagName === 'h1') style.fontSize = 32;
    else if (tagName === 'h2') style.fontSize = 24;
    else if (tagName === 'h3') style.fontSize = 20;
    else if (tagName === 'h4') style.fontSize = 18;
    else if (tagName === 'h5') style.fontSize = 16;
    else if (tagName === 'h6') style.fontSize = 14;

    // Inline styles
    if (element.style.fontSize) style.fontSize = parseInt(element.style.fontSize);
    if (element.style.fontWeight) {
      const fw = element.style.fontWeight;
      style.fontWeight = fw === 'bold' || parseInt(fw) >= 600 ? 'bold' : 'normal';
    }
    if (element.style.fontStyle) style.fontStyle = element.style.fontStyle as any;
    if (element.style.color) style.color = element.style.color;
    if (element.style.textAlign) style.textAlign = element.style.textAlign as any;
    if (element.style.textDecoration) {
      if (element.style.textDecoration.includes('underline')) style.textDecoration = 'underline';
      else if (element.style.textDecoration.includes('line-through')) style.textDecoration = 'line-through';
    }

    // Check for bold/italic from tags
    if (element.querySelector('b, strong')) style.fontWeight = 'bold';
    if (element.querySelector('i, em')) style.fontStyle = 'italic';
    if (element.querySelector('u')) style.textDecoration = 'underline';

    return {
      type: 'text',
      id: generateId('text'),
      text: text.trim(),
      style,
    };
  }

  // Handle images
  if (tagName === 'img') {
    const img = element as HTMLImageElement;
    return {
      type: 'image',
      id: generateId('image'),
      src: img.src,
      alt: img.alt,
      width: img.width || undefined,
      height: img.height || undefined,
      alignment: 'center',
    };
  }

  // Handle tables
  if (tagName === 'table') {
    const table = element as HTMLTableElement;
    const rows = Array.from(table.querySelectorAll('tr'));

    return {
      type: 'table',
      id: generateId('table'),
      rows: rows.map((row, rowIndex) => {
        const cells = Array.from(row.querySelectorAll('td, th'));
        return {
          isHeader: rowIndex === 0 && row.querySelector('th') !== null,
          cells: cells.map((cell) => ({
            content: [
              {
                type: 'text',
                id: generateId('cell'),
                text: cell.textContent || '',
                style: { fontSize: 12 },
              },
            ],
          })),
        };
      }),
    };
  }

  // Handle lists
  if (tagName === 'ul' || tagName === 'ol') {
    const listItems = Array.from(element.children).filter(
      (child) => child.tagName.toLowerCase() === 'li'
    );

    return {
      type: 'list',
      id: generateId('list'),
      ordered: tagName === 'ol',
      items: listItems.map((li) => ({
        content: [
          {
            type: 'text',
            id: generateId('list-item'),
            text: li.textContent || '',
            style: { fontSize: 14 },
          },
        ],
      })),
    };
  }

  return null;
}

export function htmlToContentBlocks(html: string): ContentBlock[] {
  // Create a temporary container
  const temp = document.createElement('div');
  temp.innerHTML = html;

  const blocks: ContentBlock[] = [];

  // Process each child element
  Array.from(temp.children).forEach((child) => {
    if (child instanceof HTMLElement) {
      const content = parseElement(child);
      if (content) {
        blocks.push({ content });
      }
    }
  });

  // If no blocks were created, create a default one with the text
  if (blocks.length === 0 && html.trim()) {
    blocks.push({
      content: {
        type: 'text',
        id: generateId('text'),
        text: html.trim(),
        style: { fontSize: 16 },
      },
    });
  }

  return blocks;
}
