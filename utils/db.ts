import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb://aliabbaszounr4:Aliabbas321@cluster0-shard-00-00.ze5uw.mongodb.net:27017,cluster0-shard-00-01.ze5uw.mongodb.net:27017,cluster0-shard-00-02.ze5uw.mongodb.net:27017/medi-com?replicaSet=atlas-bdpqnp-shard-0&ssl=true&authSource=admin';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Connection error';
    console.error(`Error: ${errorMessage}`);
    throw new Error(errorMessage);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB Disconnected');
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Disconnection error';
    console.error(`Error disconnecting from MongoDB: ${errorMessage}`);
    throw new Error(errorMessage);
  }
};