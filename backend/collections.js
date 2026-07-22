const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const router = express.Router();

const mongoUrl = process.env.MONGO_URL || 'mongodb://asmyne:Jokerson18@ac-y4n1jhv-shard-00-00.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-01.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-02.iajah7f.mongodb.net:27017/?ssl=true&replicaSet=atlas-141ut5-shard-0&authSource=admin&appName=Cluster0';
const dbName = 'asmyne';
let db;

// Connexion MongoDB
MongoClient.connect(mongoUrl).then(client => {
  db = client.db(dbName);
  console.log('Connecté à MongoDB (collections)');
}).catch(err => console.error('Mongo connect error (collections):', err.message));

// Récupérer toutes les collections (marketplace)
router.get('/api/marketplace/collections', async (req, res) => {
  try {
    const collections = await db.collection('collections').find().toArray();
    res.json({ collections });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des collections' });
  }
});

// CRUD générique pour collections (optionnel)
router.get('/api/collections', async (req, res) => {
  try {
    const collections = await db.collection('collections').find().toArray();
    res.json({ collections });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de la récupération des collections' });
  }
});

router.get('/api/collections/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const collection = await db.collection('collections').findOne({ _id: new ObjectId(id) });
    if (!collection) return res.status(404).json({ error: 'Collection introuvable' });
    res.json({ collection });
  } catch (err) {
    res.status(400).json({ error: 'ID invalide' });
  }
});

router.post('/api/marketplace/collections', async (req, res) => {
  const collection = req.body;
  if (!collection || !collection.title) return res.status(400).json({ error: 'Collection invalide' });
  try {
    const result = await db.collection('collections').insertOne(collection);
    res.json({ success: true, collection: { ...collection, _id: result.insertedId } });
  } catch (err) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout de la collection' });
  }
});

module.exports = router;
