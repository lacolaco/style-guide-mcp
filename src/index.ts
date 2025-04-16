import { GoogleStyleGuideServer } from './server';

const server = new GoogleStyleGuideServer();
server.run().catch((error) => {
  console.error('Failed to start server:', error);
});
