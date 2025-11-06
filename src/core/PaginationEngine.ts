/**
 * Core Pagination Engine
 * Handles content layout, page breaks, and pagination logic
 */

import {
  Content,
  ContentBlock,
  Page,
  PaginationEngineConfig,
  MeasuredContent,
  LayoutContext,
  BreakDecision,
} from '../types';
import { measureContent } from '../utils/measurement';
import { PAGE_SIZES } from '../types/page';

export class PaginationEngine {
  private config: PaginationEngineConfig;
  private pages: Page[] = [];
  private contentHeight: number = 0;

  constructor(config: PaginationEngineConfig) {
    this.config = config;
  }

  /**
   * Paginate content blocks into pages
   */
  public paginate(contentBlocks: ContentBlock[]): Page[] {
    this.pages = [];
    this.contentHeight = this.calculateContentHeight();

    let currentPage = this.createNewPage(1);
    let currentY = 0;

    for (let i = 0; i < contentBlocks.length; i++) {
      const block = contentBlocks[i];

      // Handle explicit page breaks
      if (block.breakBefore && currentY > 0) {
        this.pages.push(currentPage);
        currentPage = this.createNewPage(this.pages.length + 1);
        currentY = 0;
      }

      // Measure the content
      const context: LayoutContext = {
        availableWidth: this.getContentWidth(),
        availableHeight: this.contentHeight - currentY,
        currentY,
        pageNumber: this.pages.length + 1,
      };

      const measured = measureContent(block.content, context);

      // Check if content fits on current page
      if (currentY + measured.rect.height > this.contentHeight) {
        // Need to handle page break
        const breakDecision = this.decideBreak(
          measured,
          currentY,
          block,
          contentBlocks[i + 1]
        );

        if (breakDecision.shouldBreak) {
          if (breakDecision.breakAt !== undefined) {
            // Split content at break point
            const { beforeBreak, afterBreak } = this.splitContent(
              measured,
              breakDecision.breakAt
            );

            if (beforeBreak) {
              currentPage.content.push(beforeBreak);
            }

            this.pages.push(currentPage);
            currentPage = this.createNewPage(this.pages.length + 1);
            currentY = 0;

            if (afterBreak) {
              const afterMeasured = measureContent(afterBreak, {
                ...context,
                currentY: 0,
              });
              currentPage.content.push(afterBreak);
              currentY += afterMeasured.rect.height;
            }
          } else {
            // Move entire content to next page
            this.pages.push(currentPage);
            currentPage = this.createNewPage(this.pages.length + 1);
            currentY = 0;

            currentPage.content.push(measured.content);
            currentY += measured.rect.height;
          }
        } else {
          // Force content on current page (may overflow)
          currentPage.content.push(measured.content);
          currentY += measured.rect.height;
        }
      } else {
        // Content fits on current page
        currentPage.content.push(measured.content);
        currentY += measured.rect.height;
      }

      // Handle explicit page breaks after content
      if (block.breakAfter) {
        this.pages.push(currentPage);
        currentPage = this.createNewPage(this.pages.length + 1);
        currentY = 0;
      }
    }

    // Add final page if it has content
    if (currentPage.content.length > 0) {
      this.pages.push(currentPage);
    }

    // Generate headers and footers
    this.generateHeadersFooters();

    return this.pages;
  }

  /**
   * Decide whether to break and where
   */
  private decideBreak(
    measured: MeasuredContent,
    currentY: number,
    currentBlock: ContentBlock,
    nextBlock?: ContentBlock
  ): BreakDecision {
    const availableHeight = this.contentHeight - currentY;
    const breakRules = this.config.breakRules || {};

    // If content must be kept together
    if (currentBlock.keepTogether) {
      return {
        shouldBreak: true,
        reason: 'keepTogether',
      };
    }

    // If content must be kept with next
    if (currentBlock.keepWithNext && nextBlock) {
      return {
        shouldBreak: true,
        reason: 'keepWithNext',
      };
    }

    // If content cannot be broken
    if (!measured.canBreak) {
      return {
        shouldBreak: true,
        reason: 'pageEnd',
      };
    }

    // Find best break point with orphan/widow control
    if (measured.breakPoints && measured.breakPoints.length > 0) {
      const orphanControl = breakRules.orphanControl || 2;
      const widowControl = breakRules.widowControl || 2;

      // Find break points that respect orphan/widow rules
      const validBreakPoints = measured.breakPoints.filter((_bp, index) => {
        const linesAbove = index + 1;
        const linesBelow = measured.breakPoints!.length - index;
        return linesAbove >= orphanControl && linesBelow >= widowControl;
      });

      // Find the break point closest to available height
      if (validBreakPoints.length > 0) {
        const bestBreakPoint = validBreakPoints.reduce((prev, curr) => {
          return Math.abs(curr - availableHeight) < Math.abs(prev - availableHeight)
            ? curr
            : prev;
        });

        if (bestBreakPoint < measured.rect.height) {
          return {
            shouldBreak: true,
            breakAt: bestBreakPoint,
            reason: 'pageEnd',
          };
        }
      } else if (orphanControl > 0 || widowControl > 0) {
        // Cannot find valid break point, keep content together
        return {
          shouldBreak: true,
          reason: currentY < measured.rect.height / 2 ? 'orphan' : 'widow',
        };
      }
    }

    // Default: move to next page
    return {
      shouldBreak: true,
      reason: 'pageEnd',
    };
  }

  /**
   * Split content at a break point
   */
  private splitContent(
    measured: MeasuredContent,
    breakAt: number
  ): { beforeBreak: Content | null; afterBreak: Content | null } {
    const content = measured.content;

    // For text content, split by lines
    if (content.type === 'text' && measured.breakPoints) {
      const breakIndex = measured.breakPoints.findIndex((bp) => bp >= breakAt);
      if (breakIndex > 0) {
        // This is a simplified implementation
        // In a real implementation, you would split the actual text
        return {
          beforeBreak: content,
          afterBreak: null,
        };
      }
    }

    // For other content types, splitting may not be supported
    return {
      beforeBreak: null,
      afterBreak: content,
    };
  }

  /**
   * Create a new page
   */
  private createNewPage(pageNumber: number): Page {
    return {
      pageNumber,
      content: [],
      header: [],
      footer: [],
      height: this.getPageHeight(),
      contentHeight: this.contentHeight,
    };
  }

  /**
   * Generate headers and footers for all pages
   */
  private generateHeadersFooters(): void {
    const totalPages = this.pages.length;

    this.pages.forEach((page) => {
      // Generate header
      if (this.config.pageConfig.header) {
        const headerConfig = this.config.pageConfig.header;
        let headerContent: Content[] = [];

        if (headerConfig.content) {
          headerContent = headerConfig.content(page.pageNumber, totalPages);
        }

        if (headerConfig.showPageNumber) {
          const pageNumberText =
            headerConfig.pageNumberFormat?.(page.pageNumber, totalPages) ||
            `Page ${page.pageNumber} of ${totalPages}`;

          const pageNumberContent: Content = {
            type: 'text',
            id: `header-page-${page.pageNumber}`,
            text: pageNumberText,
            style: {
              textAlign: headerConfig.pageNumberPosition || 'center',
              fontSize: 10,
            },
          };

          headerContent.push(pageNumberContent);
        }

        page.header = headerContent;
      }

      // Generate footer
      if (this.config.pageConfig.footer) {
        const footerConfig = this.config.pageConfig.footer;
        let footerContent: Content[] = [];

        if (footerConfig.content) {
          footerContent = footerConfig.content(page.pageNumber, totalPages);
        }

        if (footerConfig.showPageNumber) {
          const pageNumberText =
            footerConfig.pageNumberFormat?.(page.pageNumber, totalPages) ||
            `${page.pageNumber}`;

          const pageNumberContent: Content = {
            type: 'text',
            id: `footer-page-${page.pageNumber}`,
            text: pageNumberText,
            style: {
              textAlign: footerConfig.pageNumberPosition || 'center',
              fontSize: 10,
            },
          };

          footerContent.push(pageNumberContent);
        }

        page.footer = footerContent;
      }
    });
  }

  /**
   * Calculate available content height (page height minus margins and headers/footers)
   */
  private calculateContentHeight(): number {
    const pageHeight = this.getPageHeight();
    const margins = this.config.pageConfig.margins;
    const headerHeight = this.config.pageConfig.header?.height || 0;
    const footerHeight = this.config.pageConfig.footer?.height || 0;

    return (
      pageHeight - margins.top - margins.bottom - headerHeight - footerHeight
    );
  }

  /**
   * Get content width (page width minus margins)
   */
  private getContentWidth(): number {
    const pageWidth = this.getPageWidth();
    const margins = this.config.pageConfig.margins;
    return pageWidth - margins.left - margins.right;
  }

  /**
   * Get page width
   */
  private getPageWidth(): number {
    const { size, orientation, dimensions } = this.config.pageConfig;

    if (size === 'Custom' && dimensions) {
      return orientation === 'landscape' ? dimensions.height : dimensions.width;
    }

    const pageDimensions = PAGE_SIZES[size as Exclude<typeof size, 'Custom'>];
    return orientation === 'landscape'
      ? pageDimensions.height
      : pageDimensions.width;
  }

  /**
   * Get page height
   */
  private getPageHeight(): number {
    const { size, orientation, dimensions } = this.config.pageConfig;

    if (size === 'Custom' && dimensions) {
      return orientation === 'landscape' ? dimensions.width : dimensions.height;
    }

    const pageDimensions = PAGE_SIZES[size as Exclude<typeof size, 'Custom'>];
    return orientation === 'landscape'
      ? pageDimensions.width
      : pageDimensions.height;
  }

  /**
   * Get current pages
   */
  public getPages(): Page[] {
    return this.pages;
  }

  /**
   * Get total page count
   */
  public getTotalPages(): number {
    return this.pages.length;
  }

  /**
   * Update configuration
   */
  public updateConfig(config: Partial<PaginationEngineConfig>): void {
    this.config = { ...this.config, ...config };
  }
}
