import { createApp } from './app.js';

const port = Number(process.env.API_PORT ?? 3000);
const host = '127.0.0.1';

const server = createApp().listen(port, host);

server.on('listening', () => {
  console.log(`🎸 Rockstars IT Clicker API listening on http://${host}:${port}`);
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `Port ${port} is already in use. Start with other ports, e.g. API_PORT=3001 npm run dev`,
    );
    process.exit(1);
  }
  throw error;
});
