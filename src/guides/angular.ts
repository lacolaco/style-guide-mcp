/**
 * @fileoverview Utilities to fetch and parse the Angular Style Guide as Markdown.
 */

const ANGULAR_STYLE_GUIDE_URL =
  'https://raw.githubusercontent.com/angular/angular/refs/heads/main/adev/src/content/best-practices/style-guide.md';

/**
 * Utility for fetching and parsing the Angular Style Guide.
 */
export class AngularStyleGuide {
  /** In-memory cache for the fetched Markdown. */
  private markdownCache: string | null = null;

  /**
   * Fetches the Angular Style Guide as Markdown.
   * Uses a simple in-memory cache for performance.
   *
   * @param force If true, bypasses the cache and fetches fresh content.
   * @return The raw style guide in Markdown format.
   * @throws Error if fetching fails.
   */
  async fetchStyleGuideMarkdown(force = false): Promise<string> {
    if (!force && this.markdownCache) {
      return this.markdownCache;
    }
    try {
      const response = await fetch(ANGULAR_STYLE_GUIDE_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const markdown = await response.text();
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
      const header = `<!-- source: ${ANGULAR_STYLE_GUIDE_URL} -->\n`;
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
