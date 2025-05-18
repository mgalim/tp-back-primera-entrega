import mongoose from 'mongoose';

// Funcion basica para conectar a MongoDB utilizando Mongoose
export const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
