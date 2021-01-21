const { getFormulaTables, calcGyp } = require('./library.js');

module.exports.calculate = function(projData, estimateVersion) {
    getFormulaTables()
    .then(() => {
        calcGyp(projData, estimateVersion);
    });
};