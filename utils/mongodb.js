import { MongoClient } from "mongodb";

/**
 * utils/mongodb.js
 * - Caching client for serverless environments
 * - Better logging of masked URI and connection errors
 * - Optional require of saslprep to silence SASL warning if installed
 */

try {
  // optional: if saslprep is installed it will be loaded by driver internals,
  // requiring it here ensures it's present and usually silences the warning.
  // If not installed, we ignore.
  require("saslprep");
} catch (e) {
  // ignore
}

const rawUri = process.env.MONGODB_URI || "";
if (!rawUri) {
  console.warn("MONGODB_URI not set; app will use in-memory fallback.");
}

// mask password for safe logging
function maskUri(uri) {
  try {
    return uri.replace(/:\/\/([^:]+):([^@]+)@/, "://$1:***@");
  } catch (e) {
    return uri;
  }
}

let cachedClient = global._mongoClient?.client ?? null;
let cachedPromise = global._mongoClient?.promise ?? null;

export async function connectToDatabase() {
  if (!rawUri) return { client: null, db: null };

  console.log("Attempting MongoDB connect to:", maskUri(rawUri));

  if (cachedClient) {
    return { client: cachedClient, db: cachedClient.db() };
  }
  if (cachedPromise) {
    return cachedPromise;
  }

  const client = new MongoClient(rawUri, {
    // tuning options
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000
    // rely on Atlas TLS defaults
  });

  const promise = client.connect()
    .then(() => {
      cachedClient = client;
      global._mongoClient = { client: cachedClient, promise: null };
      console.log("MongoDB connected");
      return { client: cachedClient, db: cachedClient.db() };
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
      // reset cache so subsequent attempts can retry
      global._mongoClient = { client: null, promise: null };
      cachedPromise = null;
      throw err;
    });

  global._mongoClient = { client: null, promise };
  cachedPromise = promise;
  return promise;
}

export async function getDb() {
  try {
    const c = await connectToDatabase();
    return c?.db ?? null;
  } catch (e) {
    return null;
  }
}

export default { connectToDatabase, getDb };
