// Ce script ajoute le champ collectionId à tous les produits qui ne l'ont pas.
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://asmyne:Jokerson18@ac-y4n1jhv-shard-00-00.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-01.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-02.iajah7f.mongodb.net:27017/?ssl=true&replicaSet=atlas-141ut5-shard-0&authSource=admin&appName=Cluster0';
const dbName = process.env.MONGODB_DB || 'asmyn';

async function main() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const products = db.collection('products');

  const res = await products.updateMany(
    { collectionId: { $exists: false } },
    { $set: { collectionId: '' } }
  );
  console.log(`Produits modifiés : ${res.modifiedCount}`);
  await client.close();
}

main().catch(e => { console.error(e); process.exit(1); });
