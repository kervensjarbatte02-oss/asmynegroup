const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const router = express.Router();

const mongoUrl = process.env.MONGO_URL || 'mongodb://asmyne:Jokerson18@ac-y4n1jhv-shard-00-00.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-01.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-02.iajah7f.mongodb.net:27017/?ssl=true&replicaSet=atlas-141ut5-shard-0&authSource=admin&appName=Cluster0';
const dbName = 'asmyne'; // On force la base asmyne
let db;

MongoClient.connect(mongoUrl).then(client => {
  db = client.db(dbName);
  console.log('Connecté à MongoDB (vendor collections)');
});

// Liste toutes les vendor collections
router.get('/api/vendor-collections', async (req, res) => {
  const collections = await db.collection('vendor_collections').find().toArray();
  res.json({ collections });
});

// Récupère une vendor collection par son _id
router.get('/api/vendor-collections/:id', async (req, res) => {
  let { id } = req.params;
  try {
    const collection = await db.collection('vendor_collections').findOne({ _id: new ObjectId(id) });
    if (!collection) return res.status(404).json({ error: 'Vendor collection introuvable' });
    res.json({ collection });
  } catch {
    res.status(400).json({ error: 'ID invalide' });
  }
});

// Ajoute une vendor collection
router.post('/api/vendor-collections', async (req, res) => {
  const collection = req.body;
  if (!collection.title) return res.status(400).json({ error: 'Vendor collection invalide' });
  const result = await db.collection('vendor_collections').insertOne(collection);
  res.json({ success: true, collection: { ...collection, _id: result.insertedId } });
});

// Modifie une vendor collection
router.put('/api/vendor-collections/:id', async (req, res) => {
  let { id } = req.params;
  const update = req.body;
  try {
    const result = await db.collection('vendor_collections').updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Vendor collection introuvable' });
    res.json({ success: true });
  } catch {
    res.status(400).json({ error: 'ID invalide' });
  }
});

// Supprime une vendor collection
router.delete('/api/vendor-collections/:id', async (req, res) => {
  let { id } = req.params;
  try {
    const result = await db.collection('vendor_collections').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'Vendor collection introuvable' });
    res.json({ success: true });
  } catch {
    res.status(400).json({ error: 'ID invalide' });
  }
});

module.exports = router;
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const router = express.Router();

const mongoUrl = process.env.MONGO_URL || 'mongodb://asmyne:Jokerson18@ac-y4n1jhv-shard-00-00.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-01.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-02.iajah7f.mongodb.net:27017/?ssl=true&replicaSet=atlas-141ut5-shard-0&authSource=admin&appName=Cluster0';
const dbName = 'asmyne'; // On force la base asmyne
let db;

MongoClient.connect(mongoUrl).then(client => {
  db = client.db(dbName);
  console.log('Connecté à MongoDB (asmyne) pour les vendor collections');
});

// Récupérer toutes les collections du vendeur

// Ajouter une collection pour le vendeur

// Supprimer une collection

module.exports = router;
// Fichier désactivé : routes marketplace/mongo supprimées
