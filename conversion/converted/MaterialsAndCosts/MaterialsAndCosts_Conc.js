var materialsAndCostsConc = function(assem, dict, wageType, city, zipCode, saturdayConc, overrideConcBarrelMix) {
      var temp;
      //1. CALCULATE CONCRETE YARDS
      assem.concYds = concYds(assem.SF, dict.concThick);
    
      //2. ROUND CONCRETE YARDS
      var roundConcYds = Math.ceil(assem.concYds); //this is rounded for when it//s for pump
    
      //3. CALCULATE CONCRETE MATERIALS
      if (assem.concYds <= 2.37 && overrideConcBarrelMix === "No" && assem.section !== "Stairs") { //2.37 is about 64 cuft, which is also 64 maximizer bags
          //USE BAGS
          assem.maximizerBags = maximizerBags(assem.concYds);
          assem.costOfMaximizerBags = costOfMaximizerBags(assem.maximizerBags);
      } else {
          //USE PUMP
          assem.concYds = roundConcYds;
          temp = costOfConcYds(dict.concType, dict.psi, roundConcYds, zipCode, saturdayConc);
          assem.costOfConcYds = temp.cost;
          assem.costOfConcYdsOption = temp.costOption;
          assem.concShortLoad = concShortLoad(roundConcYds);
          assem.costOfConcShortLoad = costOfConcShortLoad(assem.concShortLoad);
          assem.concTrucks = concTrucks(roundConcYds, dict.delivDiff, city);
          assem.costOfEnvironmental = costOfEnvironmental(assem.concTrucks.trucks);
          assem.costOfEnergy = costOfEnergy(assem.concTrucks.trucks);
          assem.costOfWashOut = costOfWashOut(assem.concTrucks.trucks);
          assem.costOfDownTime = costOfDownTime(wageType, assem.concYds, assem.section, assem.concTrucks.trucks);
          if (wageType === "Prevailing") {
            assem.costOfTracker = costOfTracker();
          }
      }

      //DEPENDING ON FLOOR SURFACE
      if (dict.floor === "Plywood") {
            //CALCULATE BLACK PAPER
            materialsAndCostsBlackPaper(assem, dict);
      } else {
            //CALCULATE PRIMER
            materialsAndCostsPrimer("Conc", assem, dict);
      }
    
      if (dict.wireType !== "") {
            materialsAndCostsWire(assem, dict, wageType);
      }
      
      //==========================================================================================
      //SOUND MAT
      //==========================================================================================
      if (dict.soundMatType !== "") {
            assem.soundMatRolls = soundMatRolls(assem.SF, dict.soundMatType)
            assem.costOfSoundMat = costOfSoundMat(assem.SF, dict.soundMatType)
      } else {
            //==========================================================================================
            //SPRAY GLUE (IF NO SOUND MAT)
            //==========================================================================================
            materialsAndCostsSprayGlue(assem);
            //==========================================================================================
            //DUCT TAPE (IF NO SOUND MAT)
            //==========================================================================================
            materialsAndCostsDuctTapeRollsWhenNoSM(assem);
      }
}
