import { MongoClient } from "mongodb";
import dns from "node:dns";

let database;

const dnsServers = process.env.MONGODB_DNS_SERVERS;

if (dnsServers) {
  dns.setServers(dnsServers.split(","));
}

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined.");
}

const client = new MongoClient(uri, {
  serverSelectionTimeoutMS: 10000,
});

export const connectToDb = async () => {
  await client.connect();
  database = client.db(process.env.MONGODB_DB_NAME || "practice");
  return database;
};

export const getDb = () => {
  if (!database) {
    throw new Error("Database not initialized. Call connectToDb first.");
  }
  return database;
};

export const closeDatabaseConnection = async () => {
  await client.close();
};
