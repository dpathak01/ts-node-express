import app from './app';
import { getConfig } from './config/config';
import { connectDatabase } from './config/database';
import { loadProductionSecrets } from './config/secrets';

function getStartupErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes('AWS_SECRET_NAME') || message.includes('AWS_REGION')) {
    return [
      'Failed to start server because production secrets are not configured.',
      'For production, set NODE_ENV=production, AWS_REGION, and AWS_SECRET_NAME on the server.',
      `Original error: ${message}`,
    ].join('\n');
  }

  if (
    message.includes('Could not connect to any servers') ||
    message.includes('ECONNREFUSED') ||
    message.includes('ENOTFOUND')
  ) {
    return [
      'Failed to connect to MongoDB.',
      'Check these Atlas settings:',
      '1. Replace <db_password> in .env with the real database user password.',
      '2. Add your current IP address in Atlas: Security > Network Access.',
      '3. Confirm the cluster URL and database user are correct.',
      `Original error: ${message}`,
    ].join('\n');
  }

  return `Failed to connect to MongoDB.\nOriginal error: ${message}`;
}

async function startServer(): Promise<void> {
  await loadProductionSecrets();
  await connectDatabase();

  const config = getConfig();

  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

startServer().catch((error) => {
  console.error(getStartupErrorMessage(error));
  process.exit(1);
});
