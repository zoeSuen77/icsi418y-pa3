const path = require('node:path');
const { inspect } = require('node:util');
require('dotenv').config({ path: path.resolve(__dirname, '../server/.env'), quiet: true });
const { MongoClient } = require('mongodb');
async function main() {
  const local = process.argv.includes('--local');
  const uri = local ? `mongodb://127.0.0.1:${process.env.PA3_MONGO_PORT || 27018}/?replicaSet=pa3rs` : process.env.MONGO_URI;
  if (!uri) throw new Error('Configure server/.env or pass --local while npm run demo runs.');
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  try {
    await client.connect();
    const db = client.db(local ? process.env.PA3_DB_NAME || 'pa3' : process.env.DB_NAME || 'pa3');
    const userCollection = local ? 'Users' : process.env.USERS_COLLECTION || 'Users';
    const names = process.argv.includes('--users-only') ? [userCollection] : [userCollection, 'Projects', 'ProjectMemberships'];
    for (const name of names) {
      const records = await db.collection(name).find({}, { projection: name === userCollection ? { password: 0 } : {} }).limit(50).toArray();
      console.log(`${db.databaseName}.${name}`);
      console.log(inspect(records, { depth: null, colors: false }));
    }
  } finally { await client.close(); }
}
main().catch(error => { console.error('Could not inspect database:', error.name); process.exitCode = 1; });
