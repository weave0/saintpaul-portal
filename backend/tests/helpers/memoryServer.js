const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongo;

async function connect() {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri, { dbName: 'test' });
  return uri;
}

async function close() {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  } finally {
    if (mongo) await mongo.stop();
  }
}

module.exports = { connect, close };
