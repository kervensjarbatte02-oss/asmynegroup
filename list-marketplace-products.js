// Script pour lister tous les produits de la collection products marketplace-global
// Place ce fichier à la racine et lance-le avec: node list-marketplace-products.js

const { MongoClient } = require('mongodb');

const uri = 'mongodb://asmyne:Jokerson18@ac-y4n1jhv-shard-00-00.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-01.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-02.iajah7f.mongodb.net:27017/?ssl=true&replicaSet=atlas-141ut5-shard-0&authSource=admin&appName=Cluster0';

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('test');
    const collection = db.collection('products marketplace-global');
    const products = await collection.find({}).toArray();
    console.log('Nombre de produits trouvés :', products.length);
    products.forEach((p, i) => {
      console.log(`--- Produit #${i+1} ---`);
      console.log(p);
    });
  } catch (err) {
    console.error('❌ Erreur MongoDB:', err);
  } finally {
    await client.close();
  }
}

main();
