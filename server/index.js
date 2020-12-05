const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const port = 3000;
const mongoQuery = require('../db/mongoQueries.js');

app.use(express.json());

app.get('/testConnection', (req, res) => {
    res.status(200).send('able to connect to server');
})

app.get('/getProjectDoc/:street/:companyName', (req, res) => {
    console.log('ABOUT TO GET========')
    const { street, companyName } = req.params;
    console.log('street - companyName:', `${street} - ${companyName}`)
    
    mongoQuery.getProjectDoc(street, companyName)
    .then(result => { //result RETURNS AN ARRAY
        //IF ARRAY IS EMPTY(MEANING NOTHING WAS FOUND IN DB, SEND 404)
        if(result.length === 0) {
            res.status(404).send();
        } else {
            console.log('result', result[0].projectInfo);
            res.status(200).send(JSON.stringify(result));
            console.log('DONE GETTING========')
        }

    })
    .catch(err => {
        if(err) console.error(err);
    })
})

app.post('/replaceOneUpsertProjectDoc', (req, res) => {
    console.log('ABOUT TO UPSERT=========')
    var projectData = req.body;
    var { street } =projectData.projectInfo;
    var { companyName } = projectData.companyInfo;
    console.log('street - companyName:', `${street} - ${companyName}`)
    
    mongoQuery.replaceOneUpsertProjectDoc(projectData, street, companyName)
    .then(result => {
        console.log('result', result.result, result.upsertedId);
        res.status(200).send('good job');
        console.log('DONE UPSERTING=========')
    })
    .catch(err => {
        if(err) console.error(err);
    });
})

app.listen(port, (err) => {
    if(err) console.error(err);
    console.log(`Listening on port: ${port}`);
})
