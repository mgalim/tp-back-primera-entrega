import mongoose from 'mongoose';

let cachedConnection = null;

export const connectDB = async (url) => {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    const connection = await mongoose.connect(url, {
      maxPoolSize: 10,
    });
    cachedConnection = connection;
    console.log('Connected to MongoDB');
    return connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};
