console.log('inside db');
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';

const dbName = 'gypFillEnterprise'

const client = new MongoClient(url);

var db;

client.connect((err) => {
    if(err) console.error(err);

    console.log('Connected to mongoDB :)');

    db = client.db(dbName);
})

const get = () => {
    return db;
}


module.exports = {
    get
}