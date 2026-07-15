const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env' });

async function check() {
  const uri = process.env.MONGODB_URI;
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('soulswed');
    const services = await db.collection('servicelistings').find({ category: 'rooms' }).toArray();
    console.log("Rooms found:", services.length);
    console.log(services);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
check();
