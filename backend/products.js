require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
app.use(express.json());

const mongoUrl = process.env.MONGO_URL || 'mongodb://asmyne:Jokerson18@ac-y4n1jhv-shard-00-00.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-01.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-02.iajah7f.mongodb.net:27017/?ssl=true&replicaSet=atlas-141ut5-shard-0&authSource=admin&appName=Cluster0';
const dbName = process.env.DB_NAME || 'asmyne';
let db;

// Connexion MongoDB
MongoClient.connect(mongoUrl).then(client => {
	db = client.db(dbName);
	console.log('Connecté à MongoDB');
});

// Mount collections router if available (adds /api/marketplace/collections)
try {
	const collectionsRouter = require('./collections');
	// collections.js exports an express.Router
	app.use(collectionsRouter);
	console.log('Collections router mounted');
} catch (err) {
	console.warn('No collections router mounted:', err.message);
}

// Liste tous les produits
app.get('/api/products', async (req, res) => {
	const query = {};
	// si ?published=true on filtre
	if (req.query.published === 'true') query.published = true;
	let products = await db.collection('products').find(query).toArray();
	products = products.map(p => ({ ...p, _id: p._id?.toString?.() ?? p._id }));
	res.json({ products });
});

// Récupère un produit par son _id
app.get('/api/products/:id', async (req, res) => {
	let { id } = req.params;
	try {
		let product = await db.collection('products').findOne({ _id: new ObjectId(id) });
		if (!product) return res.status(404).json({ error: 'Produit introuvable' });
		// Forcer _id en string
		product._id = product._id?.toString?.() ?? product._id;
		res.json({ product });
	} catch {
		res.status(400).json({ error: 'ID invalide' });
	}
});

// Ajoute un produit
app.post('/api/products', async (req, res) => {
	const product = req.body || {};
	if (!product.name || product.price == null) return res.status(400).json({ error: 'Produit invalide' });
	// par défaut non publié
	product.published = false;
	product.createdAt = new Date();
	const result = await db.collection('products').insertOne(product);
	res.json({ success: true, product: { ...product, _id: result.insertedId.toString() } });
});

// Modifie un produit
app.put('/api/products/:id', async (req, res) => {
	let { id } = req.params;
	const update = req.body;
	try {
		const result = await db.collection('products').updateOne(
			{ _id: new ObjectId(id) },
			{ $set: update }
		);
		if (result.matchedCount === 0) return res.status(404).json({ error: 'Produit introuvable' });
		res.json({ success: true });
	} catch {
		res.status(400).json({ error: 'ID invalide' });
	}
});

// Publier un produit (le rendre visible sur le marketplace)
app.post('/api/products/:id/publish', async (req, res) => {
	const { id } = req.params;
	try {
		const result = await db.collection('products').updateOne(
			{ _id: new ObjectId(id) },
			{ $set: { published: true, publishedAt: new Date(), updatedAt: new Date() } }
		);
		if (result.matchedCount === 0) return res.status(404).json({ error: 'Produit introuvable' });
		res.json({ success: true });
	} catch (err) {
		res.status(400).json({ error: 'ID invalide' });
	}
});

// Endpoint marketplace: seuls les produits publiés
app.get('/api/marketplace/products', async (req, res) => {
	try {
		const products = await db.collection('products').find({ published: true }).toArray();
		const serialized = products.map(p => ({ ...p, _id: p._id?.toString?.() ?? p._id }));
		res.json({ products: serialized });
	} catch (err) {
		res.status(500).json({ error: 'Erreur récupération marketplace' });
	}
});

// Supprime un produit
app.delete('/api/products/:id', async (req, res) => {
	let { id } = req.params;
	try {
		const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });
		if (result.deletedCount === 0) return res.status(404).json({ error: 'Produit introuvable' });
		res.json({ success: true });
	} catch {
		res.status(400).json({ error: 'ID invalide' });
	}
});

const PORT = process.env.API_PORT || 4002;
app.listen(PORT, () => {
	console.log('API produits sur le port', PORT);
});
