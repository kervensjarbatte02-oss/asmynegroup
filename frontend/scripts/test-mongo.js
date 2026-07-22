const fs = require('fs');
const { MongoClient } = require('mongodb');

function readEnv(file) {
  try {
    const txt = fs.readFileSync(file, 'utf8');
    const lines = txt.split(/\r?\n/);
    const env = {};
    for (const line of lines) {
      const m = line.match(/^\s*([A-Za-z0-9_]+)=(.*)$/);
      if (m) env[m[1]] = m[2];
    }
    return env;
  } catch (e) {
    return process.env;
  }
}

(async function(){
  const env = readEnv('.env.local');
  const uri = env.MONGODB_URI || process.env.MONGODB_URI || 'mongodb://asmyne:Jokerson18@ac-y4n1jhv-shard-00-00.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-01.iajah7f.mongodb.net:27017,ac-y4n1jhv-shard-00-02.iajah7f.mongodb.net:27017/?ssl=true&replicaSet=atlas-141ut5-shard-0&authSource=admin&appName=Cluster0';
  if (!uri) {
    console.error('MONGODB_URI not found in .env.local or process.env');
    process.exit(2);
  }

  console.log('Testing MongoDB connection to', uri);
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    // ping
    const admin = client.db().admin();
    const res = await admin.ping();
    console.log('Ping result:', res);
    const dbs = await client.db().admin().listDatabases();
    console.log('Databases:', dbs.databases.map(d=>d.name).join(', '));
    console.log('MongoDB connection successful');
    process.exit(0);
  } catch (err) {
    console.error('MongoDB connection failed:', err && err.message ? err.message : err);
    process.exit(1);
  } finally {
    try { await client.close(); } catch {};
  }
})();