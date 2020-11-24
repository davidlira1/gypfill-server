const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const port = 3000;
const mongoQuery = require('../db/mongoQueries.js');

app.use(express.json());

app.post('/insertProjectDocument', (req, res) => {
    var projectObj = req.body;
    console.log('projectObj', projectObj)
    
    mongoQuery.insertProjectDoc(projectObj)
    .then(result => {
        console.log('result', result);
        res.status(200).send('good job');
    })
    .catch(err => {
        if(err) console.error(err);
    });
})

app.listen(port, (err) => {
    if(err) console.error(err);
    console.log(`Listening on port: ${port}`);
})
