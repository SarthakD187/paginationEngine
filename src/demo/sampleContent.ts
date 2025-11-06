/**
 * Sample content for demo application
 */

import { ContentBlock } from '../types';

export const sampleContent: ContentBlock[] = [
  {
    content: {
      type: 'text',
      id: 'title',
      text: 'Comprehensive Pagination Engine Demo',
      style: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#1a1a1a',
      },
    },
  },
  {
    content: {
      type: 'text',
      id: 'subtitle',
      text: 'A robust pagination system for React applications',
      style: {
        fontSize: 18,
        textAlign: 'center',
        color: '#666',
        fontStyle: 'italic',
      },
    },
  },
  {
    content: {
      type: 'container',
      id: 'intro-section',
      children: [
        {
          type: 'text',
          id: 'intro-heading',
          text: 'Introduction',
          style: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#2563eb',
          },
        },
        {
          type: 'text',
          id: 'intro-text',
          text: 'This pagination engine is designed to handle complex document layouts with features similar to Google Docs and Apple Pages. It supports dynamic content flow, intelligent page breaks, headers and footers, and various content types including text, images, tables, and lists.',
          style: {
            fontSize: 14,
            lineHeight: 1.6,
            textAlign: 'justify',
          },
        },
      ],
      style: {
        padding: 20,
        margin: 10,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
      },
    },
  },
  {
    content: {
      type: 'text',
      id: 'features-heading',
      text: 'Key Features',
      style: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2563eb',
      },
    },
  },
  {
    content: {
      type: 'list',
      id: 'features-list',
      ordered: false,
      items: [
        {
          content: [
            {
              type: 'text',
              id: 'feature-1',
              text: 'Dynamic Page Breaks: Automatically flows content across pages with intelligent break decisions',
              style: { fontSize: 14 },
            },
          ],
        },
        {
          content: [
            {
              type: 'text',
              id: 'feature-2',
              text: 'Orphan and Widow Control: Prevents single lines from appearing alone at the top or bottom of pages',
              style: { fontSize: 14 },
            },
          ],
        },
        {
          content: [
            {
              type: 'text',
              id: 'feature-3',
              text: 'Headers and Footers: Customizable page headers and footers with page numbering',
              style: { fontSize: 14 },
            },
          ],
        },
        {
          content: [
            {
              type: 'text',
              id: 'feature-4',
              text: 'Rich Content Support: Text, images, tables, lists, and nested containers',
              style: { fontSize: 14 },
            },
          ],
          subItems: [
            {
              content: [
                {
                  type: 'text',
                  id: 'feature-4-1',
                  text: 'Styled text with various fonts, sizes, and formatting',
                  style: { fontSize: 12 },
                },
              ],
            },
            {
              content: [
                {
                  type: 'text',
                  id: 'feature-4-2',
                  text: 'Images with alignment options',
                  style: { fontSize: 12 },
                },
              ],
            },
            {
              content: [
                {
                  type: 'text',
                  id: 'feature-4-3',
                  text: 'Tables with spanning cells and custom styling',
                  style: { fontSize: 12 },
                },
              ],
            },
          ],
        },
        {
          content: [
            {
              type: 'text',
              id: 'feature-5',
              text: 'Live Updates: Real-time pagination as content changes',
              style: { fontSize: 14 },
            },
          ],
        },
        {
          content: [
            {
              type: 'text',
              id: 'feature-6',
              text: 'Configurable Page Sizes: Support for A4, Letter, Legal, and custom sizes',
              style: { fontSize: 14 },
            },
          ],
        },
      ],
      style: {
        fontSize: 14,
        lineHeight: 1.6,
      },
    },
  },
  {
    content: {
      type: 'text',
      id: 'table-heading',
      text: 'Sample Table: Feature Comparison',
      style: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2563eb',
      },
    },
    breakBefore: false,
  },
  {
    content: {
      type: 'table',
      id: 'comparison-table',
      rows: [
        {
          isHeader: true,
          cells: [
            {
              content: [
                {
                  type: 'text',
                  id: 'th-1',
                  text: 'Feature',
                  style: { fontWeight: 'bold' },
                },
              ],
            },
            {
              content: [
                {
                  type: 'text',
                  id: 'th-2',
                  text: 'Google Docs',
                  style: { fontWeight: 'bold' },
                },
              ],
            },
            {
              content: [
                {
                  type: 'text',
                  id: 'th-3',
                  text: 'Apple Pages',
                  style: { fontWeight: 'bold' },
                },
              ],
            },
            {
              content: [
                {
                  type: 'text',
                  id: 'th-4',
                  text: 'This Engine',
                  style: { fontWeight: 'bold' },
                },
              ],
            },
          ],
        },
        {
          cells: [
            {
              content: [
                { type: 'text', id: 'td-1-1', text: 'Dynamic Pagination', style: { fontSize: 12 } },
              ],
            },
            {
              content: [{ type: 'text', id: 'td-1-2', text: '✓', style: { fontSize: 12 } }],
            },
            {
              content: [{ type: 'text', id: 'td-1-3', text: '✓', style: { fontSize: 12 } }],
            },
            {
              content: [{ type: 'text', id: 'td-1-4', text: '✓', style: { fontSize: 12 } }],
            },
          ],
        },
        {
          cells: [
            {
              content: [
                { type: 'text', id: 'td-2-1', text: 'Orphan/Widow Control', style: { fontSize: 12 } },
              ],
            },
            {
              content: [{ type: 'text', id: 'td-2-2', text: '✓', style: { fontSize: 12 } }],
            },
            {
              content: [{ type: 'text', id: 'td-2-3', text: '✓', style: { fontSize: 12 } }],
            },
            {
              content: [{ type: 'text', id: 'td-2-4', text: '✓', style: { fontSize: 12 } }],
            },
          ],
        },
        {
          cells: [
            {
              content: [
                { type: 'text', id: 'td-3-1', text: 'React Integration', style: { fontSize: 12 } },
              ],
            },
            {
              content: [{ type: 'text', id: 'td-3-2', text: '✗', style: { fontSize: 12 } }],
            },
            {
              content: [{ type: 'text', id: 'td-3-3', text: '✗', style: { fontSize: 12 } }],
            },
            {
              content: [{ type: 'text', id: 'td-3-4', text: '✓', style: { fontSize: 12 } }],
            },
          ],
        },
        {
          cells: [
            {
              content: [
                { type: 'text', id: 'td-4-1', text: 'Open Source', style: { fontSize: 12 } },
              ],
            },
            {
              content: [{ type: 'text', id: 'td-4-2', text: '✗', style: { fontSize: 12 } }],
            },
            {
              content: [{ type: 'text', id: 'td-4-3', text: '✗', style: { fontSize: 12 } }],
            },
            {
              content: [{ type: 'text', id: 'td-4-4', text: '✓', style: { fontSize: 12 } }],
            },
          ],
        },
      ],
      repeatHeaderOnPages: true,
    },
  },
  {
    content: {
      type: 'text',
      id: 'usage-heading',
      text: 'Usage Example',
      style: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2563eb',
      },
    },
    breakBefore: false,
  },
  {
    content: {
      type: 'container',
      id: 'code-example',
      children: [
        {
          type: 'text',
          id: 'code',
          text: `import { usePagination, PaginatedDocument } from 'pagination-engine';

const MyDocument = () => {
  const { pages, config } = usePagination(contentBlocks, {
    pageConfig: {
      size: 'A4',
      orientation: 'portrait',
      margins: { top: 72, right: 72, bottom: 72, left: 72 },
    },
    breakRules: {
      orphanControl: 2,
      widowControl: 2,
    },
  });

  return <PaginatedDocument pages={pages} config={config} />;
};`,
          style: {
            fontSize: 12,
            fontFamily: 'monospace',
            lineHeight: 1.4,
          },
        },
      ],
      style: {
        padding: 16,
        backgroundColor: '#1e1e1e',
        borderRadius: 6,
      },
    },
  },
  {
    content: {
      type: 'text',
      id: 'long-text-heading',
      text: 'Extended Content for Pagination Demo',
      style: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2563eb',
      },
    },
    breakBefore: false,
  },
  {
    content: {
      type: 'text',
      id: 'long-text-1',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      style: {
        fontSize: 14,
        lineHeight: 1.6,
        textAlign: 'justify',
      },
    },
  },
  {
    content: {
      type: 'text',
      id: 'long-text-2',
      text: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.',
      style: {
        fontSize: 14,
        lineHeight: 1.6,
        textAlign: 'justify',
      },
    },
  },
  {
    content: {
      type: 'text',
      id: 'long-text-3',
      text: 'Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?',
      style: {
        fontSize: 14,
        lineHeight: 1.6,
        textAlign: 'justify',
      },
    },
  },
  {
    content: {
      type: 'text',
      id: 'conclusion',
      text: 'Conclusion',
      style: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2563eb',
      },
    },
  },
  {
    content: {
      type: 'text',
      id: 'conclusion-text',
      text: 'This pagination engine provides a powerful and flexible solution for creating document-style layouts in React applications. With its comprehensive feature set and intuitive API, it enables developers to build sophisticated document rendering systems with ease.',
      style: {
        fontSize: 14,
        lineHeight: 1.6,
        textAlign: 'justify',
      },
    },
  },
];
