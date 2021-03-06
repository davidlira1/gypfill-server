const lb = require('../library.js');

module.exports.laborAndCostsGyp = function(inputs, assem, wageType, sameDay, overnight, miles, gypMobilizations, soundMatMobilizations, projectType) {
      //1. CALCULATE COST OF GYP LABOR
      assem.costOfGypLabor = Math.ceil(inputs.gyp.labor.costOfGypLabor * (assem.SF / (inputs.totals.gypSF)));
      
      //2. CALCULATE COST OF SOUND MAT
      if (sameDay === "No" && assem.soundMatType !== "") {
            assem.soundMatLaborers = lb.soundMatLaborers(assem.SF, overnight, soundMatMobilizations, assem.soundMatType);
            assem.costOfSoundMatLabor = lb.costOfSoundMatLabor(assem.soundMatLaborers, wageType);
            
            var dict;
            //PER DIEM COST
            if (overnight === true) {
                  dict = lb.getValues("Prices_PerDiem", {"Per Diem": "Default"}, ["Price/Day"]);
                  assem.costOfPerDiem = assem.soundMatLaborers * dict["Price/Day"];
            }

            //IF MILES IS MORE THAN 90, GIVE GUYS, EXCEPT FOR DRIVER, 50 BUCKS
            //WE DETERMINE THIS BY ALLOCATING ONE DRIVER FOR EACH MOBILIZATION. THE REST WILL NOT BE DRIVERS
            if (overnight !== true) {
                  dict = lb.getValues("Prices_AfterMileThreshold", {"Description": "Threshold"}, ["Miles", "Price/Day"]);
                  if (miles > dict.Miles) {
                        //subtract the num of mobilizations, since that//s the number of drivers
                        assem.costAfterMilesThresholdSoundMat = (assem.soundMatLaborers - soundMatMobilizations) * dict["Price/Day"];
                  }
            }
      }
            
      //3. IF WIRE, CALCULATE LABOR
      if (assem.wireType !== "") {
            assem.wireLaborers = lb.wireLaborers(assem.wireType, assem.SF);
            assem.costOfWireLaborers = lb.costOfWireLaborers(wageType, assem.wireLaborers);
      }
      
      //4. IF BLACK PAPER, CALCULATE LABOR
      if (assem.blackPaperType !== "") {
            assem.blackPaperLaborers = lb.blackPaperLaborers(assem.blackPaperType, assem.SF);
            assem.costOfBlackPaperLaborers = lb.costOfBlackPaperLaborers(wageType, assem.blackPaperLaborers);
      }
}
