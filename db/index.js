const { MongoClient } = require('mongodb');

const url = 'mongodb://192.168.2.250:27017';

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
