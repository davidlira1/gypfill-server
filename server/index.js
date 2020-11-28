const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const port = 3000;
const mongoQuery = require('../db/mongoQueries.js');

app.use(express.json());

app.get('/getProjectDoc/:dealName', (req, res) => {
    console.log('ABOUT TO GET========')
    const { dealName } = req.params;
    
    console.log('dealName', dealName);
    
    mongoQuery.getProjectDoc(dealName)
    .then(result => {
        
        console.log('result', result[0].projectInfo);
        res.status(200).send(JSON.stringify(result));
        console.log('DONE GETTING========')
    })
    .catch(err => {
        if(err) console.error(err);
    })
})

app.post('/replaceOneUpsertProjectDoc', (req, res) => {
    console.log('ABOUT TO UPSERT=========')
    var projectData = req.body;
    var { dealName } =projectData.projectInfo;
    
    console.log('projectDealName:', dealName)
    
    mongoQuery.replaceOneUpsertProjectDoc(projectData, dealName)
    .then(result => {
        
        console.log('result', result);
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
