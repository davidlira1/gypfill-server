const { getFormulaTables } = require('./formulaTables.js');
const { calcGyp } = require('./Calculate/Calculate.js');

module.exports.calculate = function(projData, estimateVersion) {
    getFormulaTables()
    .then(() => {
        calcGyp(projData, estimateVersion);
    });
};