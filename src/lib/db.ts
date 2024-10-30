import { MongoClient, MongoClientOptions } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options: MongoClientOptions = {
  maxPoolSize: 10, // Maximum number of connections in the pool
  minPoolSize: 5, // Minimum number of connections in the pool
  maxIdleTimeMS: 60000, // How long a connection can remain idle (1 minute)
  connectTimeoutMS: 10000, // How long to wait for a connection (10 seconds)
  retryWrites: true, // Automatically retry write operations
  retryReads: true, // Automatically retry read operations
};

// Cache the MongoDB connection to avoid multiple connections during development
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

/**
 * Utility function to get a database instance
 * @param dbName - Optional database name, defaults to the one from MONGODB_URI
 * @returns Promise resolving to database instance
 */
export async function getDatabase(dbName?: string) {
  const client = await clientPromise;
  return client.db(dbName);
}

/**
 * Utility function to get a collection instance
 * @param collectionName - Name of the collection
 * @param dbName - Optional database name
 * @returns Promise resolving to collection instance
 */
export async function getCollection(collectionName: string, dbName?: string) {
  const db = await getDatabase(dbName);
  return db.collection(collectionName);
}

/**
 * Error class for database connection issues
 */
export class DatabaseConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DatabaseConnectionError";
  }
}

/**
 * Helper function to check database connection
 * @returns Promise resolving to boolean indicating connection status
 */
export async function checkConnection(): Promise<boolean> {
  try {
    const client = await clientPromise;
    await client.db().admin().ping();
    return true;
  } catch (error) {
    console.error("Database connection error:", error);
    return false;
  }
}

/**
 * Helper function to get MongoDB connection URL parts
 * @returns Object containing database connection details
 */
export function getConnectionDetails() {
  const url = new URL(uri);
  return {
    host: url.hostname,
    port: url.port,
    database: url.pathname.slice(1),
    username: url.username,
  };
}

/**
 * Helper to safely close the database connection
 */
export async function closeConnection(): Promise<void> {
  try {
    const client = await clientPromise;
    await client.close();
  } catch (error) {
    console.error("Error closing database connection:", error);
    throw new DatabaseConnectionError("Failed to close database connection");
  }
}

// Types for database operations
export interface DatabaseOptions {
  dbName?: string;
  collectionName?: string;
}

export interface ConnectionStatus {
  isConnected: boolean;
  lastChecked: Date;
  error?: string;
}

// Connection status monitor
let connectionStatus: ConnectionStatus = {
  isConnected: false,
  lastChecked: new Date(),
};

/**
 * Update and get connection status
 * @returns Promise resolving to connection status
 */
export async function getConnectionStatus(): Promise<ConnectionStatus> {
  try {
    const isConnected = await checkConnection();
    connectionStatus = {
      isConnected,
      lastChecked: new Date(),
    };
    return connectionStatus;
  } catch (error) {
    connectionStatus = {
      isConnected: false,
      lastChecked: new Date(),
      error: error instanceof Error ? error.message : "Unknown error",
    };
    return connectionStatus;
  }
}
