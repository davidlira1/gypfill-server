var calculateGypAssembly = function(inputs, assem, mixDesign, wageType, sameDay, overnight, miles, projectType, saturday) {
      //1. GET PSI DEPENDING ON GYP TYPE
      var dict = getValues("Prices_GypBag", Array("Gyp Type"), Array(assem.gypType), Array.PSI)
      assem.PSI = dict.PSI
      
      //2. CALCULATE MATERIALS AND COSTS FOR ASSEMBLY
      materialsAndCostsGyp assem, assem, mixDesign, wageType, projectType, saturday
      
      //3. CALCULATE LABOR COSTS FOR ASSEMBLY
      laborAndCostsGyp inputs, assem, wageType, sameDay, overnight, miles, (inputs.gyp.labor.mobilizations), (inputs.gyp.labor.mobilizationsSoundMat), projectType
      
      //4. CALCULATE TOTAL COST
      assem.gypAssemCost = assem.costOfPrimerGallons + assem.costOfCMDPrimerGallons + _
                                                 assem.costOfPerFoamRolls + _
                                                 assem.costOfStapleBoxes + _
                                                 assem.costOfCansOfSprayGlue + _
                                                 assem.costOfDuctTapeRollsWhenNoSM + _
                                                 assem.costOfGypBags + assem.costOfTons + assem.costOfGypLabor + _
                                                 assem.costOfSoundMat + assem.costOfSoundMatLabor + assem.costOfDuctTapeRolls + _
                                                 assem.costOfWireUnits + assem.costOfPinBoxes + assem.costOfWasherBoxes + assem.costOfWireLaborers + _
                                                 assem.costOfBlackPaperRolls + assem.costOfBlackPaperLaborers + assem.costOfDuctTapeRollsForBlackPaper
}
