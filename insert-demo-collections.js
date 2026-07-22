// Script pour insérer des collections de test dans la base asmyne (collections)
// Place ce fichier à la racine et lance-le avec: node insert-demo-collections.js

const { MongoClient } = require('mongodb');

const uri = 'mongodb://asmyne:Jokerson18@ac-y4n1jhv-shard-00-00.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-01.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-02.iajah7f.mongodb.net:27017/?ssl=true&replicaSet=atlas-141ut5-shard-0&authSource=admin&appName=Cluster0';

const collections = [
  { title: 'Mode & Accessoires', description: 'Tout pour la mode et les accessoires.' },
  { title: 'Beauté & Santé', description: 'Produits de beauté et de santé.' },
  { title: 'Maison & Déco', description: 'Articles pour la maison et la décoration.' },
  { title: 'Électronique', description: 'Gadgets et appareils électroniques.' },
  { title: 'Livres & Culture', description: 'Livres, BD, et produits culturels.' },
  { title: 'Jeux & Jouets', description: 'Jeux, jouets et loisirs.' },
  { title: 'Alimentation', description: 'Produits alimentaires et boissons.' },
  { title: 'Sport & Loisirs', description: 'Articles de sport et de loisirs.' },
  { title: 'Services', description: 'Offres de services variés.' }
];

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('asmyne');
    const result = await db.collection('collections').insertMany(collections);
    console.log('✅ Collections insérées :', result.insertedCount);
  } catch (err) {
    console.error('❌ Erreur MongoDB:', err);
  } finally {
    await client.close();
  }
}

main();
