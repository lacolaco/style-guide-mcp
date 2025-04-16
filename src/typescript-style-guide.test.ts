import { afterEach, describe, expect, it, vi } from 'vitest';
import { TypeScriptStyleGuide } from './typescript-style-guide';

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
        'https://google.github.io/styleguide/tsguide.html',
      );
      expect(mockResponse.text).toHaveBeenCalled();
      expect(result).toContain('Title');
      expect(result).toContain('Section1');
    });

    it('should throw error when fetch fails', async () => {
      const styleGuide = new TypeScriptStyleGuide();
      const consoleErrorSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});
      (global.fetch as any) = vi
        .fn()
        .mockRejectedValue(new Error('Network error'));

      await expect(styleGuide.fetchStyleGuideMarkdown()).rejects.toThrow(
        'Failed to fetch the style guide.',
      );
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getStyleGuide', () => {
    it('should return the style guide markdown for typescript', async () => {
      const styleGuide = new TypeScriptStyleGuide();
      const mockMarkdown = '# Google TypeScript Style Guide\n...';
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
      const result = await styleGuide.getContent();
      expect(result).toBe(
        'Failed to fetch the style guide. Please select from the category list.',
      );
    });
  });
});
