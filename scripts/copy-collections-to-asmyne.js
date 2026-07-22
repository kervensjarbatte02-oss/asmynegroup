const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI || "mongodb://asmyne:Jokerson18@ac-y4n1jhv-shard-00-00.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-01.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-02.iajah7f.mongodb.net:27017/?ssl=true&replicaSet=atlas-141ut5-shard-0&authSource=admin&appName=Cluster0";

(async function(){
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const src = client.db('asmnye');
    const dst = client.db('asmyne');
    const docs = await src.collection('collections').find().toArray();
    console.log('Found', docs.length, 'collections in asmnye');
    for (const d of docs) {
      const filter = { title: d.title };
      // avoid overwriting createdAt when upserting
      const { createdAt, _id, ...rest } = d;
      const update = { $set: { ...rest, updatedAt: new Date() }, $setOnInsert: { createdAt: createdAt || new Date() } };
      await dst.collection('collections').updateOne(filter, update, { upsert: true });
    }
    console.log('Copied collections to asmyne DB');
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
})();
