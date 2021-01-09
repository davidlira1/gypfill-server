const express = require('express');
const app = express();
const cors = require('cors');
const port = 3000;
const mongoQuery = require('../db/mongoQueries.js');

app.use(cors());
app.use(express.json());

app.get('/testConnection', (req, res) => {
    res.status(200).send('<h1>able to connect to Gyp Fill Server</h1><img src="https://gyp-fill.com/wp-content/uploads/2020/10/Jpg-file-01-01-5-scaled.jpg">');
})

app.get('/testDBConnection', (req, res) => {
    mongoQuery.getProjectDoc('Job Template', 'GypFill', 'empty')
    .then(data => {
        res.status(200).json(data);
    });
})

app.get('/getMaxJobNumber', (req, res) => {
    mongoQuery.getMaxJobNumber()
    .then(maxJobNumber => {
        res.status(200).json(maxJobNumber);
    })
})

app.get('/getAllProjects', (req, res) => {
    mongoQuery.getAllProjects()
    .then(projects => {
        res.status(200).json(projects);
    })
})

app.get('/getProjectDoc/:street/:companyName/:phaseOrBuilding', (req, res) => {
    console.log('ABOUT TO GET========')
    const { street, companyName, phaseOrBuilding } = req.params;
    console.log('street - companyName:', `${street} - ${companyName} - ${phaseOrBuilding}`)
    
    mongoQuery.getProjectDoc(street, companyName, phaseOrBuilding)
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
    var { street, phaseOrBuilding } =projectData.projectInfo;
    var { companyName } = projectData.companyInfo;
    
    console.log('street - companyName - phaseOrBuilding:', `${street} - ${companyName} - ${phaseOrBuilding}`)
    
    mongoQuery.replaceOneUpsertProjectDoc(projectData, street, companyName, phaseOrBuilding)
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
