var { getFormulaTables, getValues, getValuesBasedOnNum } = require('./formulaTables.js');

getFormulaTables()
.then(result => {
    console.log(getValuesBasedOnNum("Labor_Houses_NoSM", 16000, ['Super 80 Hrs']));
});



