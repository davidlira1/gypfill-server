var axios = require('axios');

var formulaTables;

var getFormulaTables = () => {
    return axios.get('http://localhost:3000/getFormulaTables')
    .then(result => {
        formulaTables = result.data;
    })
}

var getValues = (tableName, obj, resultHeaders) => {
    var headers = Object.keys(obj);
    var table = formulaTables[tableName];
    var match;
    var results = {};

    for(var row = 0; row < table[headers[0]].length; row++) {
        match = true;
        for(var j = 0; j < headers.length; j++) {
            if(table[headers[j]][row] !== obj[headers[j]]){
                match = false;
                break;
            }
        }

        if(match === true) {
            for(var i = 0; i < resultHeaders.length; i++) {
                results[resultHeaders[i]] = table[resultHeaders[i]][row];
            }
        }
    
    }

    return results;
}

module.exports = {
    getFormulaTables,
    getValues
}