import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer | null = null;

export async function connectDB() {
  const uri = process.env.MONGO_URI;
  try {
    if (uri) {
      await mongoose.connect(uri);
      console.log('Connected to MongoDB Atlas');
      return;
    }

    throw new Error('No MONGO_URI provided');
  } catch (err) {
    console.warn('MongoDB Atlas connection failed, falling back to in-memory MongoDB.');
    console.warn(err);

    if (!mongoServer) {
      mongoServer = await MongoMemoryServer.create();
    }
    const memoryUri = mongoServer.getUri();
    await mongoose.connect(memoryUri);
    console.log('Connected to in-memory MongoDB');
  }
}
