/**
 * @fileoverview MCP server implementation for style guide tools.
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import { TypeScriptStyleGuide } from './guides/typescript';
import { AngularStyleGuide } from './guides/angular';
import { GoStyleGuide } from './guides/go';

/**
 * Server name for MCP registration.
 */
const serverName = 'google-style-guide';

/**
 * Server version for MCP registration.
 */
const serverVersion = '0.1.0';

/**
 * MCP server providing style guide tools.
 */
export class StyleGuideServer {
  private readonly server: McpServer;
  private readonly typeScriptStyleGuide: TypeScriptStyleGuide;
  private readonly angularStyleGuide: AngularStyleGuide;
  private readonly goStyleGuide: GoStyleGuide;

  /**
   * Initializes the MCP server and registers style guide tools.
   *
   * @param typeScriptStyleGuide Optional TypeScriptStyleGuide instance for DI.
   * @param angularStyleGuide Optional AngularStyleGuide instance for DI.
   * @param goStyleGuide Optional GoStyleGuide instance for DI.
   */
  constructor(
    typeScriptStyleGuide?: TypeScriptStyleGuide,
    angularStyleGuide?: AngularStyleGuide,
    goStyleGuide?: GoStyleGuide,
  ) {
    this.typeScriptStyleGuide =
      typeScriptStyleGuide ?? new TypeScriptStyleGuide();
    this.angularStyleGuide = angularStyleGuide ?? new AngularStyleGuide();
    this.goStyleGuide = goStyleGuide ?? new GoStyleGuide();
    this.server = new McpServer({ name: serverName, version: serverVersion });

    this.server.tool(
      'typescript-style-guide',
      'Provide TypeScript Style Guide in Markdown format',
      async () => {
        const content = await this.typeScriptStyleGuide.getContent();
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

    this.server.tool(
      'angular-style-guide',
      'Provide Angular Style Guide in Markdown format',
      async () => {
        const content = await this.angularStyleGuide.getContent();
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

    this.server.tool(
      'go-style-guide',
      'Provide Go Style Guide in Markdown format',
      async () => {
        const content = await this.goStyleGuide.getContent();
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
   * Releases server resources.
   */
  cleanup(): void {
    this.server.close();
  }

  /**
   * Starts the MCP server with the given transport (defaults to stdio).
   *
   * @param transport Optional transport implementation.
   */
  async run(transport: Transport = new StdioServerTransport()): Promise<void> {
    await this.server.connect(transport);
  }
}
