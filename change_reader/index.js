const { MongoClient } = require('mongodb');

async function monitorChangeStream(url, databaseName, collectionName) {
  const client = await MongoClient.connect(url, { useUnifiedTopology: true });
  const db = client.db(databaseName);
  const collection = db.collection(collectionName);
  
  const changeStream = collection.watch();
  changeStream.on('change', (change) => {
    console.log(change);
  });
}

// Example usage:
monitorChangeStream( "mongodb+srv://aurora69:%21123CBd%23@cluster0.h96rp.mongodb.net/?retryWrites=true&w=majority", 
    'testDB', 'testCollection');