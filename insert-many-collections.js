// Script pour insérer 30 collections de test variées dans la base asmyne (collections)
// Place ce fichier à la racine et lance-le avec: node insert-many-collections.js

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
  { title: 'Services', description: 'Offres de services variés.' },
  { title: 'Informatique', description: 'Ordinateurs, accessoires et logiciels.' },
  { title: 'Téléphonie', description: 'Smartphones et accessoires mobiles.' },
  { title: 'Auto & Moto', description: 'Véhicules, pièces et accessoires.' },
  { title: 'Bricolage', description: 'Outils et matériaux de bricolage.' },
  { title: 'Jardinage', description: 'Articles pour le jardin et l’extérieur.' },
  { title: 'Animaux', description: 'Produits pour animaux de compagnie.' },
  { title: 'Musique', description: 'Instruments et accessoires de musique.' },
  { title: 'Photo & Vidéo', description: 'Appareils photo, caméras et accessoires.' },
  { title: 'Montres & Bijoux', description: 'Montres, bijoux et accessoires.' },
  { title: 'Enfants & Bébés', description: 'Produits pour enfants et bébés.' },
  { title: 'Vêtements Homme', description: 'Mode masculine.' },
  { title: 'Vêtements Femme', description: 'Mode féminine.' },
  { title: 'Chaussures', description: 'Toutes les chaussures.' },
  { title: 'Sacs & Bagages', description: 'Sacs à main, valises, bagages.' },
  { title: 'Parfums', description: 'Parfums et eaux de toilette.' },
  { title: 'Maquillage', description: 'Produits de maquillage.' },
  { title: 'Soins du corps', description: 'Soins, hygiène et bien-être.' },
  { title: 'Décoration', description: 'Objets déco, cadres, luminaires.' },
  { title: 'Meubles', description: 'Canapés, tables, chaises, etc.' },
  { title: 'Cuisine', description: 'Ustensiles, vaisselle, électroménager.' },
  { title: 'Épicerie', description: 'Épicerie fine, produits du terroir.' }
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
