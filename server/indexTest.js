const express = require('express');
const app = express();
const port = 4000;

app.use(express.json({limit: '50mb'}));

app.post('/updateFormulaTables', (req, res) => {
    console.log(req.body);

    res.end();
})

app.listen(port, (err) => {
    if(err) console.error(err);
    console.log(`Listening on port: ${port}`);
})