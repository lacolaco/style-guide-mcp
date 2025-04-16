import { StyleGuideServer } from './server';

const server = new StyleGuideServer();
server.run().catch((error) => {
  console.error('Failed to start server:', error);
});
