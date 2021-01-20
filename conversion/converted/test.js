var { getFormulaTables, getValues } = require('./formulaTables.js');

getFormulaTables()
.then(result => {
    console.log(getValues("Miles_ZipCodes_VanNuys", {'Zip Code' : 91405}, ['City']));
});



