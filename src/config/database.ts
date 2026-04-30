import mongoose from 'mongoose';
import config from './config';

export async function connectDatabase(): Promise<void> {
  if (config.mongoUrl.includes('<db_password>')) {
    throw new Error('Replace <db_password> in MONGO_URL with your real MongoDB password.');
  }

  await mongoose.connect(config.mongoUrl, {
    serverSelectionTimeoutMS: 10000,
  });
  console.log('MongoDB connected');
}
