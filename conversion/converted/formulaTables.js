const axios = require('axios');

var formulaTables;

module.exports.getFormulaTables = () => {
    return axios.get('http://localhost:3000/getFormulaTables')
    .then(result => {
        formulaTables = result.data;
    })
}

module.exports.getValues = (tableName, obj, resultHeaders) => {
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

module.exports.getValuesBasedOnNum = (tableName, num, resultHeaders) => {
    var table = formulaTables[tableName];
    var firstCol = table[Object.keys(table)[0]];
    var results = {};

    //loop down the first key's values
    for(var row = 0; row < firstCol.length; row++) {
        //at each element, check if it's more than the num
        if(num > firstCol[row]) {
            continue;
        } else {
            break;
        } 
    }

    for(var i = 0; i < resultHeaders.length; i++) {
        results[resultHeaders[i]] = table[resultHeaders[i]][row];
    }

    return results;
}