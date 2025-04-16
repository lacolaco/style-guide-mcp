import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { TextContentSchema } from '@modelcontextprotocol/sdk/types.js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { AngularStyleGuide } from './guides/angular';
import { TypeScriptStyleGuide } from './guides/typescript';
import { StyleGuideServer } from './server';

const dummyTypeScriptStyleGuide = {
  getContent: async () => {
    return '# Google TypeScript Style Guide\n...';
  },
} as TypeScriptStyleGuide;

const dummyAngularStyleGuide = {
  getContent: async () => {
    return '# Angular Style Guide\n...';
  },
} as AngularStyleGuide;

describe('StyleGuideServer', () => {
  let client: Client;
  let server: StyleGuideServer;

  beforeEach(async () => {
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    client = new Client({
      name: 'test-client',
      version: '0.1.0',
    });
    server = new StyleGuideServer(
      dummyTypeScriptStyleGuide,
      dummyAngularStyleGuide,
    );
    await Promise.all([
      client.connect(clientTransport),
      server.run(serverTransport),
    ]);
  });

  afterEach(() => {
    server.cleanup();
    client.close();
  });

  it('should list tools', async () => {
    const { tools } = await client.listTools();
    expect(tools).toBeDefined();
    expect(tools.length).toBe(2);
    expect(tools.some((t) => t.name === 'typescript-style-guide')).toBe(true);
    expect(tools.some((t) => t.name === 'angular-style-guide')).toBe(true);
  });

  it('should fetch TypeScript Style Guide', async () => {
    const { content } = (await client.callTool({
      name: 'typescript-style-guide',
      args: {},
    })) as { content: unknown[] };
    expect(content).toBeDefined();
    const parsed = TextContentSchema.parse(content[0]);
    expect(parsed.text).toContain('# Google TypeScript Style Guide');
    expect(parsed.mimeType).toBe('text/markdown');
  });

  it('should fetch Angular Style Guide', async () => {
    const { content } = (await client.callTool({
      name: 'angular-style-guide',
      args: {},
    })) as { content: unknown[] };
    expect(content).toBeDefined();
    const parsed = TextContentSchema.parse(content[0]);
    expect(parsed.text).toContain('# Angular Style Guide');
    expect(parsed.mimeType).toBe('text/markdown');
  });
});
