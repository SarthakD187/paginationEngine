/**
 * Content Renderers for different content types
 */

import React from 'react';
import {
  Content,
  TextContent,
  ImageContent,
  TableContent,
  ListContent,
  ContainerContent,
  TextStyle,
} from '../types/content';

/**
 * Convert TextStyle to React CSS properties
 */
function textStyleToCSS(style: TextStyle = {}): React.CSSProperties {
  return {
    fontFamily: style.fontFamily,
    fontSize: style.fontSize,
    fontWeight: style.fontWeight,
    fontStyle: style.fontStyle,
    color: style.color,
    backgroundColor: style.backgroundColor,
    textDecoration: style.textDecoration,
    textAlign: style.textAlign,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
  };
}

/**
 * Text Content Renderer
 */
export const TextRenderer: React.FC<{ content: TextContent }> = ({ content }) => {
  return (
    <div
      style={{
        ...textStyleToCSS(content.style),
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
    >
      {content.text}
    </div>
  );
};

/**
 * Image Content Renderer
 */
export const ImageRenderer: React.FC<{ content: ImageContent }> = ({ content }) => {
  const style: React.CSSProperties = {
    width: content.width,
    height: content.height,
    maxWidth: '100%',
    display: 'block',
  };

  if (content.alignment === 'center') {
    style.marginLeft = 'auto';
    style.marginRight = 'auto';
  } else if (content.alignment === 'right') {
    style.marginLeft = 'auto';
  } else if (content.alignment === 'inline') {
    style.display = 'inline-block';
  }

  return <img src={content.src} alt={content.alt || ''} style={style} />;
};

/**
 * Table Content Renderer
 */
export const TableRenderer: React.FC<{ content: TableContent }> = ({ content }) => {
  return (
    <table
      style={{
        width: '100%',
        borderCollapse: 'collapse',
        border: '1px solid #ddd',
      }}
    >
      <tbody>
        {content.rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.cells.map((cell, cellIndex) => {
              const Cell = row.isHeader ? 'th' : 'td';
              const cellStyle: React.CSSProperties = {
                ...textStyleToCSS(cell.style),
                padding: cell.style?.padding || 8,
                border: `${cell.style?.borderWidth || 1}px solid ${
                  cell.style?.borderColor || '#ddd'
                }`,
                textAlign: 'left',
              };

              return (
                <Cell
                  key={cellIndex}
                  colSpan={cell.colSpan}
                  rowSpan={cell.rowSpan}
                  style={cellStyle}
                >
                  {cell.content.map((c, i) => (
                    <ContentRenderer key={`${c.id}-${i}`} content={c} />
                  ))}
                </Cell>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

/**
 * List Content Renderer
 */
export const ListRenderer: React.FC<{ content: ListContent }> = ({ content }) => {
  const ListTag = content.ordered ? 'ol' : 'ul';

  const renderListItem = (
    item: ListContent['items'][0],
    index: number
  ): React.ReactNode => {
    return (
      <li key={index} style={{ marginBottom: 8 }}>
        {item.content.map((c, i) => (
          <ContentRenderer key={`${c.id}-${i}`} content={c} />
        ))}
        {item.subItems && item.subItems.length > 0 && (
          <ListTag style={{ marginTop: 8 }}>
            {item.subItems.map((subItem, subIndex) =>
              renderListItem(subItem, subIndex)
            )}
          </ListTag>
        )}
      </li>
    );
  };

  return (
    <ListTag
      start={content.startNumber}
      style={{
        ...textStyleToCSS(content.style),
        paddingLeft: 24,
        margin: 0,
      }}
    >
      {content.items.map((item, index) => renderListItem(item, index))}
    </ListTag>
  );
};

/**
 * Container Content Renderer
 */
export const ContainerRenderer: React.FC<{ content: ContainerContent }> = ({
  content,
}) => {
  const style: React.CSSProperties = {
    padding: content.style?.padding,
    margin: content.style?.margin,
    backgroundColor: content.style?.backgroundColor,
    border: content.style?.borderWidth
      ? `${content.style.borderWidth}px solid ${content.style.borderColor || '#000'}`
      : undefined,
    borderRadius: content.style?.borderRadius,
  };

  return (
    <div style={style}>
      {content.children.map((child, index) => (
        <ContentRenderer key={`${child.id}-${index}`} content={child} />
      ))}
    </div>
  );
};

/**
 * Main Content Renderer (dispatcher)
 */
export const ContentRenderer: React.FC<{ content: Content }> = ({ content }) => {
  switch (content.type) {
    case 'text':
      return <TextRenderer content={content} />;
    case 'image':
      return <ImageRenderer content={content} />;
    case 'table':
      return <TableRenderer content={content} />;
    case 'list':
      return <ListRenderer content={content} />;
    case 'container':
      return <ContainerRenderer content={content} />;
    default:
      console.warn('Unknown content type:', (content as any).type);
      return null;
  }
};
