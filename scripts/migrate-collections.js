// Script Node.js pour copier toutes les collections de 'asmyn-groupe' vers 'asmyne'
const { MongoClient } = require('mongodb');

const uri = 'mongodb://asmyne:Jokerson18@ac-y4n1jhv-shard-00-00.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-01.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-02.iajah7f.mongodb.net:27017/?ssl=true&replicaSet=atlas-141ut5-shard-0&authSource=admin&appName=Cluster0';
const sourceDbName = 'asmyn-groupe';
const targetDbName = 'asmyne';
const collectionName = 'collections';

async function migrateCollections() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const sourceDb = client.db(sourceDbName);
    const targetDb = client.db(targetDbName);

    const docs = await sourceDb.collection(collectionName).find({}).toArray();
    if (docs.length === 0) {
      console.log('Aucune collection à migrer.');
      return;
    }
    await targetDb.collection(collectionName).insertMany(docs);
    console.log(`${docs.length} collections copiées de '${sourceDbName}' vers '${targetDbName}'.`);
  } finally {
    await client.close();
  }
}

migrateCollections().catch(console.error);