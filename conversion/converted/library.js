//grabs all the functions from all the files, 
//and places them into an object...module.exports

const regex = /var (\w*) = function/g;

fs.readdirSync('./conversion/converted').forEach(dir => {
    try {
        //loop thru each file in specific directory
        fs.readdirSync(`./conversion/converted/${dir}`).forEach(file => {
    
            //1. read file, 
            var fileData = fs.readFileSync(`./conversion/converted/${dir}/${file}`, 'utf8');
            fileData = fileData.replace(/var (\w*) = function/g,"module.exports.$1 = function");
            
            fs.writeFileSync(`./conversion/converted/${dir}/${file}`, fileData);
        
            //for each filedata, we will apply a regex
            //var (\w*) = function    module.exports.$1 = function
        });
    } catch(error) {

    }
});


// Calculate.js
// Calculate_ConcAssembly.js
// Calculate_Equip.js
// Calculate_GypAssembly.js
// Calculate_Optionals.js
// Calculate_PerGypFloorTotals.js
// Calculate_SOV.js
// Calculate_Trucks.js
// Formulas_ADURegulation.js
// Formulas_BlackPaperAndMoistStop.js
// Formulas_Concrete.js
// Formulas_Distance.js
// Formulas_DuctTape.js
// Formulas_Fuel.js
// Formulas_GypAssembly.js
// Formulas_Labor.js
// Formulas_Maint.js
// Formulas_Maximizer.js
// Formulas_Prep.js
// Formulas_PrePours.js
// Formulas_PrimerAndSealer.js
// Formulas_Ramboard.js
// Formulas_RotoStater.js
// Formulas_StringLine.js
// Formulas_Time.js
// Formulas_Wire.js
// helpers.js
// LaborAndCosts_Conc.js
// LaborAndCosts_Gyp.js
// MaterialsAndCosts_Conc.js
// MaterialsAndCosts_Gyp.js
