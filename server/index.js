const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');


const port = 3000;


app.listen(port, (err) => {
    if(end) console.error(err);
    console.log(`Listening on port: ${port}`);
})
