#!/usr/bin/env node

/**
 * TypeScript Style Guide MCP Server
 * Provides style suggestions based on Google TypeScript Style Guide.
 */

// インポート文をアルファベット順に並べ替え
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import TurndownService from 'turndown';

/**
 * Generates style suggestions based on Google TypeScript Style Guide.
 * @param query - The query string for style suggestions.
 * @returns A promise that resolves to a style suggestion string.
 */
async function getStyleGuideContent(): Promise<string> {
  try {
    const response = await fetch('https://google.github.io/styleguide/tsguide.html');
    const html = await response.text();

    // HTMLをMarkdownに変換
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      hr: `---`,
    })
    const markdown = turndownService.turndown(html);
    return markdown;
  } catch (error: any) {
    console.error('スタイルガイドの取得に失敗しました:', error);
    throw new Error('スタイルガイドの取得に失敗しました。');
  }
}

function extractHeadersFromMarkdown(markdown: string): string[] {
  const headers: string[] = [];
  const lines = markdown.split('\n').map(line => line.trim());
  for (const line of lines) {
    if (line.startsWith('## ')) {
      const headerText = line.replace(/#/g, '').trim();
      headers.push(headerText);
    }
  }
  return headers;
}

async function getStyleGuideCategories(): Promise<string[]> {
  try {
    const markdown = await getStyleGuideContent();
    return extractHeadersFromMarkdown(markdown);
  } catch (error: any) {
    return ['スタイルガイドの取得に失敗しました。カテゴリ一覧から選択してください。'];
  }
}

async function getStyleGuideContentByCategory(category: string): Promise<string> {
  try {
    const markdown = await getStyleGuideContent();
    const headers = extractHeadersFromMarkdown(markdown);
    const categoryExists = headers.map(header => header.toLowerCase()).some(header => header === category.toLowerCase());
    if (!categoryExists) {
      return `${category} はスタイルガイドに存在しないカテゴリです。`;
    }

    const lines = markdown.split('\n');
    let sectionContent = '';
    let foundSection = false;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('## ')) {
        const headerText = line.replace(/#/g, '').trim();
        if (headerText.toLowerCase() === category.toLowerCase()) {
          foundSection = true;
        } else if (foundSection) {
          break;
        }
      } else if (foundSection) {
        sectionContent += line + '\n';
      }
    }

    if (!foundSection) {
      return `${category} はスタイルガイドに存在しないカテゴリです。`;
    }

    return `Google TypeScript Style Guide - ${category}の内容:\n${sectionContent}`;
  } catch (error: any) {
    return 'スタイルガイドの取得に失敗しました。カテゴリ一覧から選択してください。';
  }
}

/**
 * StyleGuideServer class provides MCP server functionality for style suggestions.
 */
const SERVER_NAME = 'typescript-style-guide-server';
const SERVER_VERSION = '0.1.0';

class StyleGuideServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: SERVER_NAME,
        version: SERVER_VERSION,
      },
      {
        capabilities: {
          resources: {},
          tools: {},
        },
      }
    );

    this.setupToolHandlers();

    // エラーハンドリング
    this.server.onerror = (error) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    // 利用可能なツールのリストを返す
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'get_style_guide_categories',
          description: 'Google TypeScript Style Guideのカテゴリ一覧を返します。',
          inputSchema: {
            type: 'object',
            properties: {},
            required: [],
          },
        },
        {
          name: 'get_style_guide_content',
          description: '指定されたカテゴリの内容を返します。',
          inputSchema: {
            type: 'object',
            properties: {
              category: {
                type: 'string',
                description: 'カテゴリ名',
              },
            },
            required: ['category'],
          },
        },
      ],
    }));

    // ツール呼び出しリクエストを処理する
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      switch (request.params.name) {
        case 'get_style_guide_categories': {
          const categories = await getStyleGuideCategories();
          return {
            content: [
              {
                type: 'text',
                text: `Google TypeScript Style Guide - カテゴリ一覧:\n${categories.join('\n')}`,
              },
            ],
          };
        }
        case 'get_style_guide_content': {
          const args = request.params.arguments;
          if (
            typeof args !== 'object' ||
            args === null ||
            typeof args.category !== 'string'
          ) {
            throw new McpError(
              ErrorCode.InvalidParams,
              'Invalid arguments: "category" (string) is required.',
            );
          }
          const category = args.category;
          const section = await getStyleGuideContentByCategory(category);
          return {
            content: [
              {
                type: 'text',
                text: section,
              },
            ],
          };
        }
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${request.params.name}`
          );
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('TypeScript Style Guide MCP server running on stdio');
  }
}

const server = new StyleGuideServer();
server.run().catch(console.error);
