// Insert a comprehensive set of marketplace collections into MongoDB
// Usage: node scripts/insert-all-collections.js

const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI || "mongodb://asmyne:Jokerson18@ac-y4n1jhv-shard-00-00.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-01.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-02.iajah7f.mongodb.net:27017/?ssl=true&replicaSet=atlas-141ut5-shard-0&authSource=admin&appName=Cluster0";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const db = client.db("asmnye");
    const collections = db.collection("collections");

    const allCollections = [
      { title: "Électronique", description: "Smartphones, tablettes, ordinateurs, audio et accessoires.", type: "manual" },
      { title: "Informatique & Bureau", description: "PC portables, composants, imprimantes, fournitures de bureau.", type: "manual" },
      { title: "TV & Home Cinema", description: "Téléviseurs, projecteurs, systèmes audio.", type: "manual" },
      { title: "Photo & Caméras", description: "Appareils photo, objectifs, drones, accessoires.", type: "manual" },
      { title: "Jeux Vidéo & Consoles", description: "Consoles, jeux, accessoires gaming.", type: "manual" },
      { title: "Smart Home", description: "Domotique, assistants vocaux, sécurité connectée.", type: "manual" },
      { title: "Electroménager", description: "Gros et petit électroménager pour la maison.", type: "manual" },
      { title: "Mode & Accessoires", description: "Vêtements, chaussures, sacs et accessoires.", type: "manual" },
      { title: "Beauté & Santé", description: "Cosmétiques, soins, bien-être.", type: "manual" },
      { title: "Montres & Bijoux", description: "Bijoux, montres, accessoires précieux.", type: "manual" },
      { title: "Maison & Décoration", description: "Meubles, décoration, luminaires.", type: "manual" },
      { title: "Jardin & Extérieur", description: "Mobilier de jardin, plantes, outils de jardinage.", type: "manual" },
      { title: "Bricolage & Outils", description: "Outils, outillage électroportatif, quincaillerie.", type: "manual" },
      { title: "Meubles", description: "Canapés, tables, rangements, literie.", type: "manual" },
      { title: "Alimentation & Épicerie", description: "Produits alimentaires, boissons et épicerie fine.", type: "manual" },
      { title: "Vins & Spiritueux", description: "Vins, bières artisanales, spiritueux.", type: "manual" },
      { title: "Sports & Loisirs", description: "Équipements sportifs, outdoor, fitness.", type: "manual" },
      { title: "Auto & Moto", description: "Pièces, accessoires, entretien automobile.", type: "manual" },
      { title: "Bébés & Puériculture", description: "Articles pour bébés, poussettes, sièges auto.", type: "manual" },
      { title: "Jouets & Jeux", description: "Jouets pour enfants, puzzles, jeux de société.", type: "manual" },
      { title: "Livres & Culture", description: "Livres, BD, musique, instruments.", type: "manual" },
      { title: "Films & Séries", description: "DVD, Blu-ray et éditions collector.", type: "manual" },
      { title: "Instruments de Musique", description: "Guitares, claviers, accessoires musicaux.", type: "manual" },
      { title: "Films & Photo Pro", description: "Équipements professionnels pour photo et vidéo.", type: "manual" },
      { title: "Sacs & Bagagerie", description: "Valises, sacs à dos, sacs de voyage.", type: "manual" },
      { title: "Chaussures", description: "Chaussures homme, femme, sportives et habillées.", type: "manual" },
      { title: "Alimentation Bio", description: "Produits bio, aliments sains et naturels.", type: "manual" },
      { title: "Animaux", description: "Alimentation et accessoires pour animaux de compagnie.", type: "manual" },
      { title: "Santé & Pharmacie", description: "Équipement médical non prescrit et soins.", type: "manual" },
      { title: "Services & Voyages", description: "Billets, hébergements, expériences et services.", type: "manual" },
      { title: "Automatisation & Industrie", description: "Fournitures industrielles et solutions B2B.", type: "manual" },
      { title: "Art & Artisanat", description: "Fournitures d'artistes, œuvres et artisanat.", type: "manual" },
      { title: "Collection & Antiquités", description: "Objets de collection, antiquités et curiosités.", type: "manual" },
      { title: "Éducation & Cours", description: "Matériel pédagogique, cours en ligne.", type: "manual" },
      { title: "Logiciels & Applications", description: "Licences, SaaS, logiciels professionnels.", type: "manual" },
      { title: "Téléphonie & Accessoires", description: "Téléphones, coques, chargeurs et accessoires.", type: "manual" },
      { title: "PC Gaming & Periphériques", description: "Claviers, souris, écrans et composants gaming.", type: "manual" },
      { title: "Restauration & Hôtellerie", description: "Fournitures pro pour restauration et hôtellerie.", type: "manual" },
      { title: "Santé Mentale & Bien-être", description: "Produits et services pour le bien-être mental.", type: "manual" },
      { title: "Mode Enfant", description: "Vêtements et accessoires pour enfants.", type: "manual" },
      { title: "Accessoires Auto", description: "Gadgets et accessoires pour voitures.", type: "manual" },
      { title: "Crypto & Finance", description: "Services et produits liés à la finance moderne.", type: "manual" },
      { title: "Offres Locales", description: "Produits et services locaux par région.", type: "manual" },
      { title: "Cadeaux & Occasions", description: "Idées cadeaux pour toutes les occasions.", type: "manual" },
      { title: "Éco & Recyclage", description: "Produits durables et recyclés.", type: "manual" },
      { title: "Matériel médical professionnel", description: "Équipement et fournitures médicales pro.", type: "manual" },
      { title: "Solutions Cloud", description: "Services cloud et infrastructure.", type: "manual" },
      { title: "Télétravail & Home Office", description: "Mobilier et outils pour travailler depuis chez soi.", type: "manual" },
      { title: "Produits locaux & Artisanaux", description: "Produits fabriqués localement et artisanaux.", type: "manual" },
      { title: "Mode éthique", description: "Marques responsables et éthiques.", type: "manual" },
      { title: "Auto-entretien & Nettoyage", description: "Produits d'entretien et nettoyage.", type: "manual" }
    ];

    // Add timestamps and avoid duplicating titles: upsert by title
    const ops = allCollections.map((c) => ({
      updateOne: {
        filter: { title: c.title },
        update: { $set: { ...c, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
        upsert: true,
      }
    }));

    const result = await collections.bulkWrite(ops, { ordered: false });
    console.log('Bulk write result:', result.result || result);
    console.log(`${allCollections.length} collections processed (inserted or updated).`);
  } catch (err) {
    console.error('Erreur lors de l\'insertion des collections :', err);
  } finally {
    await client.close();
  }
}

run().catch(console.error);
