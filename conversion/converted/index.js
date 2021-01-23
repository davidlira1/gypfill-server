const { getFormulaTables, calcGyp } = require('./library.js');
const fs = require('fs');
module.exports.calculate = function(projData, estimateVersion) {
    getFormulaTables()
    .then(() => {
        calcGyp(projData, estimateVersion);
        fs.writeFileSync('conversion/sampleData/projData.json', JSON.stringify(projData, null, 4));
        console.log('done');
    });
};

