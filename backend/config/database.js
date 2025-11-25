const mongoose = require('mongoose');

const buildAtlasURI = () => {
  if (process.env.MONGODB_URI) return process.env.MONGODB_URI; // direct override
  const user = encodeURIComponent(process.env.MONGODB_USERNAME || '');
  const pass = encodeURIComponent(process.env.MONGODB_PASSWORD || '');
  const host = process.env.MONGODB_HOST; // e.g. cluster0.xxxxx.mongodb.net
  const db   = process.env.MONGODB_DBNAME || 'saintpaul';
  if (!user || !pass || !host) {
    return null;
  }
  return `mongodb+srv://${user}:${pass}@${host}/${db}?retryWrites=true&w=majority`;
};

const connectDB = async () => {
  const uri = buildAtlasURI();
  if (!uri) {
    console.warn('⚠️  MongoDB Atlas URI incomplete. Set MONGODB_URI or the individual components (MONGODB_USERNAME, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_DBNAME).');
    return; // allow app startup without fatal exit
  }
  try {
    const conn = await mongoose.connect(uri, {
      maxPoolSize: parseInt(process.env.MONGODB_POOL_SIZE || '10', 10),
      serverSelectionTimeoutMS: 10000
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.log('ℹ️  Continuing without DB (development fallback).');
  }
};

module.exports = connectDB;
