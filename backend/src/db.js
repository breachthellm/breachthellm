import { MongoClient } from 'mongodb';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/breachthellm';

let db;

export async function connectDB() {
  if (db) {
    return db;
  }
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db();
  return db;
}

export function getDb() {
  if (!db) {
    throw new Error('Database not connected. Call connectDB() before getDb().');
  }
  return db;
}
