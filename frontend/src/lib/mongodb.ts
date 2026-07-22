import { Db, MongoClient } from "mongodb";

declare global {
  var __asmyneMongoClient: MongoClient | undefined;
}

export async function getMongoDb() {
  const uri = process.env.MONGODB_URI || 'mongodb://asmyne:Jokerson18@ac-y4n1jhv-shard-00-00.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-01.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-02.iajah7f.mongodb.net:27017/?ssl=true&replicaSet=atlas-141ut5-shard-0&authSource=admin&appName=Cluster0';

  if (!uri) {
    throw new Error(
      "MONGODB_URI is missing. Ajoutez-le à votre environnement serveur ou utilisez l'URI par défaut mongodb://asmyne:Jokerson18@ac-y4n1jhv-shard-00-00.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-01.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-02.iajah7f.mongodb.net:27017/?ssl=true&replicaSet=atlas-141ut5-shard-0&authSource=admin&appName=Cluster0"
    );
  }

  const client = global.__asmyneMongoClient ?? new MongoClient(uri);

  if (!global.__asmyneMongoClient) {
    await client.connect();
    global.__asmyneMongoClient = client;
  }

  const dbName = process.env.MONGODB_DB || "asmyne";
  return client.db(dbName) as Db;
}
