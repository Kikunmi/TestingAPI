import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// Ensure JWT secret for tests
process.env.JWT_SECRET = process.env.JWT_SECRET || 'testsecret';

let mongoServer;

before(async function() {
  this.timeout(20000);

  // Prefer explicit MONGO_URI (e.g., Atlas) to avoid spawning bundled mongod on Windows
  if (process.env.MONGO_URI) {
    await mongoose.connect(process.env.MONGO_URI);
    return;
  }

  // On Windows, the bundled mongod requires Visual C++ redistributable. Provide clear guidance instead of failing with a cryptic error.
  if (process.platform === 'win32') {
    throw new Error('No MONGO_URI provided and mongodb-memory-server cannot run on this Windows environment without the Visual C++ Redistributable.\n\nOption 1: Set MONGO_URI to your MongoDB Atlas or local MongoDB connection string (recommended for CI).\nExample (PowerShell): $env:MONGO_URI="your_mongo_uri"; npm test\n\nOption 2: Install the latest Microsoft Visual C++ Redistributable: https://learn.microsoft.com/en-us/cpp/windows/latest-supported-vc-redist');
  }

  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

after(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

export default mongoose;
