import mongoose from 'mongoose';

const DB_URI = 'mongodb://localhost:27017';

const connectURI = async () => {
  try {
    await mongoose.connect(DB_URI);
    console.log('Connection with DB successful');
  } catch (e) {
    console.log('Connection Failed! ', e.message);
    process.exit(1);
  }
};

export default {
  connectURI,
};
