const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const { faker } = require('@faker-js/faker');
const { program } = require('commander');

program
  .option('-u, --url <url>', 'MongoDB connection URL', 'mongodb://localhost:27017')
  .requiredOption('-d, --database <database>', 'Database name')
  .requiredOption('-c, --collection <collection>', 'Collection name')
  .option('--insert', 'Insert a document into the collection')
  .option('--update', 'Update a document in the collection')
  .option('--delete', 'Delete a document from the collection')
  .option('--find', 'Find documents in the collection')
  .option('--find10', 'Find at most 10 documents in the collection')
  .option('--query <query>', 'Query for finding or deleting documents in the collection')
  .option('--data <data>', 'Data to be inserted or updated in the collection');


//--user:pass = aurora69:%21123CBd%23

program.parse(process.argv);

const options = program.opts();

console.log(options.url);

MongoClient.connect(options.url, function(err, client) {
  assert.equal(null, err);
  console.log('Connected successfully to server');

  const db = client.db(options.database);
  const collection = db.collection(options.collection);

  if (options.insert) {
    const data = {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      telephoneNumber: faker.phone.number(),
      address: faker.address.streetAddress(),
      city: faker.address.cityName(),
      state: faker.address.state(),
      zipCode: faker.address.zipCode(),
      creditCard: faker.finance.creditCardNumber(),
      cvv: faker.finance.creditCardCVV()
    };
    collection.insertOne(data, function(err, result) {
      assert.equal(null, err);
      console.log('Inserted document:', result);
      client.close();
    });
  } else if (options.update) {
    assert.ok(options.query, 'Query must be provided with --update');
    assert.ok(options.data, 'Data must be provided with --update');
    const query = JSON.parse(options.query);
    const data = JSON.parse(options.data);
    collection.updateOne(query, { $set: data }, function(err, result) {
      assert.equal(null, err);
      console.log('Updated document:', result);
      client.close();
    });
  } else if (options.delete) {
    //on the command line: '{"lastName": "Schiller"}'
    console.log("Deleting...", options.query);
    assert.ok(options.query, 'Query must be provided with --delete');
    const query = JSON.parse(options.query);
    console.log(query);
    collection.deleteOne(query, function(err, result) {
      assert.equal(null, err);
      console.log('Deleted document:', result);
      client.close();
    });
  } else if (options.find) {
    assert.ok(options.query, 'Query must be provided with --find');
    const query = JSON.parse(options.query);
    collection.find(query).toArray(function(err, docs) {
      assert.equal(null, err);
      console.log('Found documents:', docs);
      client.close();
    });
  }
  else if (options.find10) {
    // const query = JSON.parse(options.query);
    collection.find().limit(10).toArray(function(err, docs) {
        assert.equal(null, err);
        console.log('Found at most 10 documents:', docs);
        client.close();
    });
  } else {
    console.log('No operation specified');
    client.close();
  }
});
