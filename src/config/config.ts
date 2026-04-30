// src/config/config.ts
import dotenv from 'dotenv';

export interface Config {
  port: number;
  nodeEnv: string;
  mongoUrl: string;
  awsRegion: string;
  awsSecretName: string;
}

export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

if (!isProduction()) {
  dotenv.config();
}

export function getEnv(name: string, required = true): string {
  const value = process.env[name];
  if (!value && required) {
    throw new Error(`Missing required env variable: ${name}`);
  }
  return value || '';
}

export function getConfig(): Config {
  return {
    port: Number(getEnv('PORT', false)) || 3000,
    nodeEnv: getEnv('NODE_ENV', false) || 'development',
    mongoUrl: getEnv('MONGO_URL', false) || getEnv('MONGO_URI', false),
    awsRegion:
      getEnv('AWS_REGION', false) || getEnv('AWS_DEFAULT_REGION', false),
    awsSecretName: getEnv('AWS_SECRET_NAME', false),
  };
}
