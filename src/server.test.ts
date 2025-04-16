import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { GoogleStyleGuideServer } from './server';
import { TypeScriptStyleGuide } from './typescript-style-guide';

const dummyTypeScriptStyleGuide = {
  getContent: async () => {
    return '# Google TypeScript Style Guide\n...';
  },
} as TypeScriptStyleGuide;

describe('GoogleStyleGuideServer', () => {
  let client: Client;
  let server: GoogleStyleGuideServer;

  beforeEach(async () => {
    const [clientTransport, serverTransport] =
      InMemoryTransport.createLinkedPair();
    client = new Client({
      name: 'test-client',
      version: '0.1.0',
    });
    server = new GoogleStyleGuideServer(dummyTypeScriptStyleGuide);
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
    expect(tools.length).toBe(1);
    expect(tools.some((t) => t.name === 'typescript-style-guide')).toBe(true);
  });
});
