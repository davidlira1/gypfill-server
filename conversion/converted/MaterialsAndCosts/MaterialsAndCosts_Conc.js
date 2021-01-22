const lb = require('../library.js');

module.exports.materialsAndCostsConc = function(assem, dict, wageType, city, zipCode, saturdayConc, overrideConcBarrelMix) {
      var temp;
      //1. CALCULATE CONCRETE YARDS
      assem.concYds = lb.concYds(assem.SF, dict.concThick);
    
      //2. ROUND CONCRETE YARDS
      var roundConcYds = Math.ceil(assem.concYds); //this is rounded for when it//s for pump
    
      //3. CALCULATE CONCRETE MATERIALS
      if (assem.concYds <= 2.37 && overrideConcBarrelMix === "No" && assem.section !== "Stairs") { //2.37 is about 64 cuft, which is also 64 maximizer bags
          //USE BAGS
          assem.maximizerBags = lb.maximizerBags(assem.concYds);
          assem.costOfMaximizerBags = lb.costOfMaximizerBags(assem.maximizerBags);
      } else {
          //USE PUMP
          assem.concYds = roundConcYds;
          temp = lb.costOfConcYds(dict.concType, dict.psi, roundConcYds, zipCode, saturdayConc);
          assem.costOfConcYds = temp.cost;
          assem.costOfConcYdsOption = temp.costOption;
          assem.concShortLoad = lb.concShortLoad(roundConcYds);
          assem.costOfConcShortLoad = lb.costOfConcShortLoad(assem.concShortLoad);
          assem.concTrucks = lb.concTrucks(roundConcYds, dict.delivDiff, city);
          assem.costOfEnvironmental = lb.costOfEnvironmental(assem.concTrucks.trucks);
          assem.costOfEnergy = lb.costOfEnergy(assem.concTrucks.trucks);
          assem.costOfWashOut = lb.costOfWashOut(assem.concTrucks.trucks);
          assem.costOfDownTime = lb.costOfDownTime(wageType, assem.concYds, assem.section, assem.concTrucks.trucks);
          if (wageType === "Prevailing") {
            assem.costOfTracker = lb.costOfTracker();
          }
      }

      //DEPENDING ON FLOOR SURFACE
      if (dict.floor === "Plywood") {
            //CALCULATE BLACK PAPER
            lb.materialsAndCostsBlackPaper(assem, dict);
      } else {
            //CALCULATE PRIMER
            lb.materialsAndCostsPrimer("Conc", assem, dict);
      }
    
      if (dict.wireType !== "") {
            lb.materialsAndCostsWire(assem, dict, wageType);
      }
      
      //==========================================================================================
      //SOUND MAT
      //==========================================================================================
      if (dict.soundMatType !== "") {
            assem.soundMatRolls = lb.soundMatRolls(assem.SF, dict.soundMatType)
            assem.costOfSoundMat = lb.costOfSoundMat(assem.SF, dict.soundMatType)
      } else {
            //==========================================================================================
            //SPRAY GLUE (IF NO SOUND MAT)
            //==========================================================================================
            lb.materialsAndCostsSprayGlue(assem);
            //==========================================================================================
            //DUCT TAPE (IF NO SOUND MAT)
            //==========================================================================================
            lb.materialsAndCostsDuctTapeRollsWhenNoSM(assem);
      }
}
