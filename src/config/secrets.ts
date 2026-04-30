import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import { getConfig, isProduction } from './config';

type SecretValues = Record<string, unknown>;

function parseSecretValue(secretString: string): SecretValues {
  try {
    const parsed = JSON.parse(secretString);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      throw new Error('Secret value must be a JSON object.');
    }
    return parsed as SecretValues;
  } catch (error) {
    throw new Error(
      `AWS secret must be valid JSON, for example {"MONGO_URL":"mongodb+srv://..."}. ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
}

function applySecretsToEnv(secrets: SecretValues): void {
  for (const [key, value] of Object.entries(secrets)) {
    if (typeof value === 'string') {
      process.env[key] = value;
    }
  }
}

export async function loadProductionSecrets(): Promise<void> {
  if (!isProduction()) {
    return;
  }

  const config = getConfig();

  if (!config.awsSecretName) {
    throw new Error('Missing AWS_SECRET_NAME for production secret loading.');
  }

  if (!config.awsRegion) {
    throw new Error(
      'Missing AWS_REGION or AWS_DEFAULT_REGION for production secret loading.',
    );
  }

  const client = new SecretsManagerClient({ region: config.awsRegion });
  const response = await client.send(
    new GetSecretValueCommand({
      SecretId: config.awsSecretName,
    }),
  );

  if (!response.SecretString) {
    throw new Error(
      `AWS secret ${config.awsSecretName} does not contain SecretString JSON.`,
    );
  }

  applySecretsToEnv(parseSecretValue(response.SecretString));
}
