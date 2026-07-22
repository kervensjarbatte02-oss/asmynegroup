// Script de test de connexion et insertion MongoDB Atlas
// Place ce fichier à la racine et lance-le avec: node test-mongo-connection.js

const { MongoClient } = require('mongodb');

const uri = 'mongodb://asmyne:Jokerson18@ac-y4n1jhv-shard-00-00.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-01.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-02.iajah7f.mongodb.net:27017/?ssl=true&replicaSet=atlas-141ut5-shard-0&authSource=admin&appName=Cluster0';

async function main() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('✅ Connexion réussie à MongoDB Atlas');
    const db = client.db('test');
    const collection = db.collection('test-connexion');
    const result = await collection.insertOne({ test: 'insertion', date: new Date() });
    console.log('✅ Insertion réussie:', result.insertedId);
    const doc = await collection.findOne({ _id: result.insertedId });
    console.log('📄 Document inséré:', doc);
  } catch (err) {
    console.error('❌ Erreur MongoDB:', err);
  } finally {
    await client.close();
  }
}

main();
