import { afterEach, describe, expect, it, vi } from 'vitest';
import { GoStyleGuide } from './go';

const mockMarkdown = '# Go Guide\n\nSome content.';
const GO_STYLE_GUIDE_URL =
  'https://raw.githubusercontent.com/google/styleguide/refs/heads/gh-pages/go/guide.md';

describe('GoStyleGuide', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
  });

  describe('fetchStyleGuideMarkdown', () => {
    it('should fetch and return markdown', async () => {
      const styleGuide = new GoStyleGuide();
      const mockResponse = {
        ok: true,
        text: vi.fn().mockResolvedValue(mockMarkdown),
      };
      (global.fetch as any) = vi.fn().mockResolvedValue(mockResponse);
      const result = await styleGuide.fetchStyleGuideMarkdown();
      expect(global.fetch).toHaveBeenCalledWith(GO_STYLE_GUIDE_URL);
      expect(mockResponse.text).toHaveBeenCalled();
      expect(result).toBe(mockMarkdown);
    });

    it('should throw error when fetch fails', async () => {
      const styleGuide = new GoStyleGuide();
      (global.fetch as any) = vi
        .fn()
        .mockRejectedValue(new Error('Network error'));
      await expect(styleGuide.fetchStyleGuideMarkdown()).rejects.toThrow(
        'Failed to fetch the style guide.',
      );
    });

    it('should throw error when response is not ok', async () => {
      const styleGuide = new GoStyleGuide();
      const mockResponse = { ok: false, status: 404, text: vi.fn() };
      (global.fetch as any) = vi.fn().mockResolvedValue(mockResponse);
      await expect(styleGuide.fetchStyleGuideMarkdown()).rejects.toThrow(
        'Failed to fetch the style guide.',
      );
    });

    it('should return cached markdown if available', async () => {
      const styleGuide = new GoStyleGuide();
      (styleGuide as any).markdownCache = mockMarkdown;
      const result = await styleGuide.fetchStyleGuideMarkdown();
      expect(result).toBe(mockMarkdown);
    });

    it('should bypass cache if force is true', async () => {
      const styleGuide = new GoStyleGuide();
      const mockResponse = {
        ok: true,
        text: vi.fn().mockResolvedValue(mockMarkdown),
      };
      (global.fetch as any) = vi.fn().mockResolvedValue(mockResponse);
      (styleGuide as any).markdownCache = 'old';
      const result = await styleGuide.fetchStyleGuideMarkdown(true);
      expect(result).toBe(mockMarkdown);
      expect(global.fetch).toHaveBeenCalledWith(GO_STYLE_GUIDE_URL);
    });
  });

  describe('getContent', () => {
    it('should return the markdown content from the first heading with source header', async () => {
      const styleGuide = new GoStyleGuide();
      vi.spyOn(styleGuide, 'fetchStyleGuideMarkdown').mockResolvedValue(
        'text before\n# Heading\ncontent',
      );
      const result = await styleGuide.getContent();
      expect(result.startsWith('<!-- source:')).toBe(true);
      expect(result).toContain('# Heading\ncontent');
    });

    it('should return all markdown with source header if no heading found', async () => {
      const styleGuide = new GoStyleGuide();
      vi.spyOn(styleGuide, 'fetchStyleGuideMarkdown').mockResolvedValue(
        'no heading here',
      );
      const result = await styleGuide.getContent();
      expect(result.startsWith('<!-- source:')).toBe(true);
      expect(result).toContain('no heading here');
    });

    it('should throw error when fetch fails', async () => {
      const styleGuide = new GoStyleGuide();
      vi.spyOn(styleGuide, 'fetchStyleGuideMarkdown').mockRejectedValue(
        new Error('Failed to fetch'),
      );
      await expect(styleGuide.getContent()).rejects.toThrow(
        'Failed to fetch the style guide.',
      );
    });
  });
});
