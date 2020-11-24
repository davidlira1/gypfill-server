const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';

const dbName = 'gypFillEnterprise'

const client = new MongoClient(url);

client.connect((err) => {
    if(err) console.error(err);

    console.log('Connected to mongoDB :D');

    const db = client.db(dbName);
})

