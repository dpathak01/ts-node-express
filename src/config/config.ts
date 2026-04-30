// src/config/config.ts
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

interface Config {
  port: number;
  nodeEnv: string;
  mongoUrl: string;
}

function getEnv(name: string, required = true): string {
  const value = process.env[name];
  if (!value && required) {
    throw new Error(`Missing required env variable: ${name}`);
  }
  return value || '';
}

const config: Config = {
  port: Number(getEnv('PORT')) || 3000,
  nodeEnv: getEnv('NODE_ENV', false) || 'development',
  mongoUrl: getEnv('MONGO_URL', false) || getEnv('MONGO_URI'),
};

export default config;
