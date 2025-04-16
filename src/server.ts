import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import { TypeScriptStyleGuide } from './typescript-style-guide.js';

const SERVER_NAME = 'google-style-guide';
const SERVER_VERSION = '0.1.0';

/**
 * Provides an MCP server for the Google Style Guide.
 */
export class GoogleStyleGuideServer {
  private readonly server: McpServer;
  private readonly tsStyleGuide: TypeScriptStyleGuide;

  /**
   * Constructs a new StyleGuideServer.
   * @param styleGuide Optional custom TypeScriptStyleGuide instance for dependency injection.
   */
  public constructor(styleGuide?: TypeScriptStyleGuide) {
    this.tsStyleGuide = styleGuide ?? new TypeScriptStyleGuide();
    this.server = new McpServer({ name: SERVER_NAME, version: SERVER_VERSION });
    this.server.tool(
      'typescript-style-guide',
      'Provide Google TypeScript Style Guide in Markdown format',
      async () => {
        const content = await this.tsStyleGuide.getContent();
        return {
          content: [
            {
              type: 'text',
              mimeType: 'text/markdown',
              text: content,
            },
          ],
        };
      },
    );
  }

  /**
   * Cleans up the server resources.
   * This method should be called when the server is no longer needed.
   */
  public cleanup(): void {
    this.server.close();
  }

  /**
   * Starts the MCP server. If a transport is provided, use it; otherwise use stdio.
   */
  public async run(
    transport: Transport = new StdioServerTransport(),
  ): Promise<void> {
    return await this.server.connect(transport);
  }
}
