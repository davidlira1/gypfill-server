const fs = require('fs');
const convertToJS = require('./convertToJS');

var excelVBApath = './conversion/Excel VBA';
var convertedPath = './conversion/converted';

//loop thru the directories in conversion/Excel VBA directory
fs.readdirSync(excelVBApath).forEach(dir => {

    //loop thru each file in specific directory
    fs.readdirSync(`${excelVBApath}/${dir}`).forEach(file => {

        //1. read file, 
        var fileData = fs.readFileSync(`${excelVBApath}/${dir}/${file}`, 'utf8');
        //2. call convertToJs() with the data as parameter
        var convertedFileData = convertToJS(fileData);
        //3. write the returned value to the file in conversion/converted
        fs.writeFileSync(`${convertedPath}/${dir}/${file}`, convertedFileData);
        console.log('converted:', file);

    });
});


