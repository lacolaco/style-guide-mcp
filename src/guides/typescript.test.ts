import { afterEach, describe, expect, it, vi } from 'vitest';
import { TypeScriptStyleGuide } from './typescript';

describe('TypeScriptStyleGuide', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  describe('fetchStyleGuideMarkdown', () => {
    it('should fetch and convert HTML to markdown', async () => {
      const styleGuide = new TypeScriptStyleGuide();
      const mockHtml =
        '<html><body><h1>Title</h1><h2>Section1</h2></body></html>';
      const mockResponse = {
        text: vi.fn().mockResolvedValue(mockHtml),
      };

      (global.fetch as any) = vi.fn().mockResolvedValue(mockResponse);

      const result = await styleGuide.fetchStyleGuideMarkdown();

      expect(global.fetch).toHaveBeenCalledWith(
        'https://raw.githubusercontent.com/google/styleguide/refs/heads/gh-pages/tsguide.html',
      );
      expect(mockResponse.text).toHaveBeenCalled();
      expect(result).toContain('Title');
      expect(result).toContain('Section1');
    });

    it('should throw error when fetch fails', async () => {
      const styleGuide = new TypeScriptStyleGuide();
      (global.fetch as any) = vi
        .fn()
        .mockRejectedValue(new Error('Network error'));

      await expect(styleGuide.fetchStyleGuideMarkdown()).rejects.toThrow(
        'Failed to fetch the style guide.',
      );
    });

    it('should return cached markdown if available', async () => {
      const styleGuide = new TypeScriptStyleGuide();
      const mockMarkdown = '# Cached Markdown\n...';
      styleGuide['markdownCache'] = mockMarkdown;

      const result = await styleGuide.fetchStyleGuideMarkdown();
      expect(result).toBe(mockMarkdown);
    });

    it('should bypass cache if force is true', async () => {
      const styleGuide = new TypeScriptStyleGuide();
      const mockHtml =
        '<html><body><h1>Title</h1><h2>Section1</h2></body></html>';
      const mockResponse = {
        text: vi.fn().mockResolvedValue(mockHtml),
      };

      (global.fetch as any) = vi.fn().mockResolvedValue(mockResponse);

      await styleGuide.fetchStyleGuideMarkdown(true);

      expect(global.fetch).toHaveBeenCalledWith(
        'https://raw.githubusercontent.com/google/styleguide/refs/heads/gh-pages/tsguide.html',
      );
      expect(mockResponse.text).toHaveBeenCalled();
    });
  });

  describe('getContent', () => {
    it('should return the style guide markdown for typescript', async () => {
      const styleGuide = new TypeScriptStyleGuide();
      const mockMarkdown =
        '<!-- source: https://raw.githubusercontent.com/google/styleguide/refs/heads/gh-pages/tsguide.html -->\n\n# Google TypeScript Style Guide\n...';
      vi.spyOn(styleGuide, 'fetchStyleGuideMarkdown').mockResolvedValue(
        mockMarkdown,
      );
      const result = await styleGuide.getContent();
      expect(result).toBe(mockMarkdown);
    });

    it('should return error message when fetch fails', async () => {
      const styleGuide = new TypeScriptStyleGuide();
      vi.spyOn(styleGuide, 'fetchStyleGuideMarkdown').mockRejectedValue(
        new Error('Failed to fetch'),
      );

      await expect(styleGuide.getContent()).rejects.toThrowError(
        'Failed to fetch the style guide.',
      );
    });
  });
});
