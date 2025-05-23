/**
 * @fileoverview Utilities to fetch and parse the Google TypeScript Style Guide as Markdown.
 */

import Turndown from 'turndown';

const STYLE_GUIDE_URL =
  'https://raw.githubusercontent.com/google/styleguide/refs/heads/gh-pages/tsguide.html';

/**
 * Utility for fetching and parsing the Google TypeScript Style Guide.
 */
export class TypeScriptStyleGuide {
  /** In-memory cache for the fetched Markdown. */
  private markdownCache: string | null = null;

  /**
   * Fetches the Google TypeScript Style Guide as Markdown.
   * Uses a simple in-memory cache for performance.
   *
   * @param force If true, bypasses the cache and fetches fresh content.
   * @return The raw style guide in Markdown format.
   * @throws Error if fetching or conversion fails.
   */
  async fetchStyleGuideMarkdown(force = false): Promise<string> {
    if (!force && this.markdownCache) {
      return this.markdownCache;
    }
    try {
      const response = await fetch(STYLE_GUIDE_URL);
      const html = await response.text();
      const turndownService = new Turndown({
        headingStyle: 'atx',
        hr: '---',
      });
      const markdown = turndownService.turndown(html);
      this.markdownCache = markdown;
      return markdown;
    } catch (error) {
      throw new Error('Failed to fetch the style guide.', {
        cause: error,
      });
    }
  }

  /**
   * Returns the content of the style guide in Markdown format, trimmed to start from the first heading.
   *
   * @return The trimmed content of the style guide, or an error message if fetch fails.
   */
  async getContent(): Promise<string> {
    try {
      const markdown = await this.fetchStyleGuideMarkdown();
      const firstHeadingIndex = markdown.indexOf('#');
      const header = `<!-- source: ${STYLE_GUIDE_URL} -->\n\n`;
      const content =
        firstHeadingIndex !== -1
          ? markdown.substring(firstHeadingIndex)
          : markdown;
      return header + content;
    } catch (error) {
      throw new Error('Failed to fetch the style guide.', {
        cause: error,
      });
    }
  }
}
