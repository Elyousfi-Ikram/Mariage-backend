const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Listeners for connection events
    mongoose.connection.on('connected', () => console.log('Mongoose connected to DB Cluster'));
    mongoose.connection.on('error', (err) => console.error('Mongoose connection error:', err));
    mongoose.connection.on('disconnected', () => console.log('Mongoose disconnected'));

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'mariage',
      serverSelectionTimeoutMS: 5000,
      family: 4
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
