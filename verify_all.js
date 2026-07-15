const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env' });

async function verify() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('soulswed');
    const result = await db.collection('servicelistings').updateMany(
      {},
      { $set: { verified: true, active: true } }
    );
    console.log("Verified services:", result.modifiedCount);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
verify();
