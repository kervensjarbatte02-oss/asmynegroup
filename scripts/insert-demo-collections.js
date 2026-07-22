// Script d'insertion de collections de test pour MongoDB
// À lancer avec : node scripts/insert-demo-collections.js

const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI || "mongodb://asmyne:Jokerson18@ac-y4n1jhv-shard-00-00.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-01.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-02.iajah7f.mongodb.net:27017/?ssl=true&replicaSet=atlas-141ut5-shard-0&authSource=admin&appName=Cluster0";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("asmnye");
    const collections = db.collection("collections");

    const demoCollections = [
      { title: "Mode & Accessoires", description: "Tout pour la mode et les accessoires.", type: "manual", createdAt: new Date() },
      { title: "Beauté & Santé", description: "Produits de beauté et de santé.", type: "manual", createdAt: new Date() },
      { title: "Maison & Déco", description: "Articles pour la maison et la décoration.", type: "manual", createdAt: new Date() },
      { title: "Électronique", description: "Gadgets et appareils électroniques.", type: "manual", createdAt: new Date() },
      { title: "Livres & Culture", description: "Livres, musique et culture.", type: "manual", createdAt: new Date() },
    ];

    await collections.insertMany(demoCollections);
    console.log("Collections de test insérées avec succès !");
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
