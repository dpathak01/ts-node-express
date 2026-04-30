import mongoose from 'mongoose';
import { getConfig } from './config';

export async function connectDatabase(): Promise<void> {
  const { mongoUrl } = getConfig();

  if (!mongoUrl) {
    throw new Error(
      'Missing MONGO_URL. Local uses .env; production should load it from AWS Secrets Manager.',
    );
  }

  if (mongoUrl.includes('<db_password>')) {
    throw new Error(
      'Replace <db_password> in MONGO_URL with your real MongoDB password.',
    );
  }

  await mongoose.connect(mongoUrl, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log('MongoDB connected');
}
