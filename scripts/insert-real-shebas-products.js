// Script d'insertion de vrais produits Shebas dans MongoDB Atlas
const { MongoClient } = require("mongodb");

const uri = "mongodb://asmyne:Jokerson18@ac-y4n1jhv-shard-00-00.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-01.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-02.iajah7f.mongodb.net:27017/?ssl=true&replicaSet=atlas-141ut5-shard-0&authSource=admin&appName=Cluster0";
const client = new MongoClient(uri);

const products = [
  {
    id: "shebas-hair-solutions-pomada",
    name: "Shebas Hair Solutions ✨ (Pomada)",
    price: 500,
    image: "/uploads/cover/pomada.png",
    description: "Ayuda al crecimiento del cabello, Regenera y fortalece el pelo, Ayuda a frenar la caída, Nutre profundamente desde la raíz, Protege y da brillo natural.",
    stock: 100,
    category: "hair-solutions"
  },
  {
    id: "shebas-hair-solutions",
    name: "Shebas Hair Solutions ✨",
    price: 750,
    image: "/uploads/cover/shebas-hair-solutions.png",
    description: "Ayuda al crecimiento del cabello, Regenera y fortalece el pelo, Ayuda a frenar la caída, Nutre profundamente desde la raíz, Protege y da brillo natural.",
    stock: 100,
    category: "hair-solutions"
  },
  {
    id: "shebas-hair-solutions-aceite",
    name: "Shebas Hair Solutions ✨ (Aceite)",
    price: 850,
    image: "/uploads/cover/aceite.png",
    description: "Ayuda al crecimiento del cabello, Regenera y fortalece el pelo, Ayuda a frenar la caída, Nutre profundamente desde la raíz, Protege y da brillo natural.",
    stock: 100,
    category: "hair-solutions"
  }
];

async function main() {
  await client.connect();
  const db = client.db();
  const collection = db.collection("products");

  for (const prod of products) {
    await collection.updateOne(
      { id: prod.id },
      { $set: prod },
      { upsert: true }
    );
    console.log(`Produit inséré/mis à jour : ${prod.name}`);
  }
  await client.close();
  console.log("Tous les produits sont insérés !");
}

main().catch(console.error);
