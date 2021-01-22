const lb = require('../library.js');

module.exports.calculateGypAssembly = function(inputs, assem, mixDesign, wageType, sameDay, overnight, miles, projectType, saturday) {
      //1. GET PSI DEPENDING ON GYP TYPE
      var dict = lb.getValues("Prices_GypBag", {"Gyp Type": assem.gypType}, ["PSI"]);
      assem.PSI = dict.PSI;
      
      //2. CALCULATE MATERIALS AND COSTS FOR ASSEMBLY
      lb.materialsAndCostsGyp(assem, assem, mixDesign, wageType, projectType, saturday);
      
      //3. CALCULATE LABOR COSTS FOR ASSEMBLY
      lb.laborAndCostsGyp(inputs, assem, wageType, sameDay, overnight, miles, inputs.gyp.labor.mobilizations, inputs.gyp.labor.mobilizationsSoundMat, projectType);
      
      //4. CALCULATE TOTAL COST
      assem.gypAssemCost = assem.costOfPrimerGallons + assem.costOfCMDPrimerGallons +
                           assem.costOfPerFoamRolls +
                           assem.costOfStapleBoxes +
                           assem.costOfCansOfSprayGlue +
                           assem.costOfDuctTapeRollsWhenNoSM +
                           assem.costOfGypBags + assem.costOfTons + assem.costOfGypLabor +
                           assem.costOfSoundMat + assem.costOfSoundMatLabor + assem.costOfDuctTapeRolls +
                           assem.costOfWireUnits + assem.costOfPinBoxes + assem.costOfWasherBoxes + assem.costOfWireLaborers +
                           assem.costOfBlackPaperRolls + assem.costOfBlackPaperLaborers + assem.costOfDuctTapeRollsForBlackPaper
}
