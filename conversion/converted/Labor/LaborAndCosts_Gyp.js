var laborAndCostsGyp = function(inputs, assem, wageType, sameDay, overnight, miles, gypMobilizations, soundMatMobilizations, projectType) {
      //1. CALCULATE COST OF GYP LABOR
      assem.costOfGypLabor = Round(inputs.gyp.labor.costOfGypLabor * (assem.SF / (inputs.totals.gypSF)) + 0.49)
      
      //2. CALCULATE COST OF SOUND MAT
      if (sameDay === "No" && assem.soundMatType !== "") {
            assem.soundMatLaborers = soundMatLaborers(assem.SF, overnight, soundMatMobilizations, assem.soundMatType)
            assem.costOfSoundMatLabor = costOfSoundMatLabor(assem.soundMatLaborers, wageType)
            
            var dict
            //PER DIEM COST
            if (overnight === true) {
                  dict = getValues("Prices_PerDiem", Array("Per Diem"), Array.Default, Array("Price/Day"))
                  assem.costOfPerDiem = assem.soundMatLaborers * dict("Price/Day")
            }

            //IF MILES IS MORE THAN 90, GIVE GUYS, EXCEPT FOR DRIVER, 50 BUCKS
            //WE DETERMINE THIS BY ALLOCATING ONE DRIVER FOR EACH MOBILIZATION. THE REST WILL NOT BE DRIVERS
            if (overnight !== true) {
                  dict = getValues("Prices_AfterMileThreshold", Array.Description, Array.Threshold, Array("Miles", "Price/Day"))
                  if (miles > dict.Miles) {
                        //subtract the num of mobilizations, since that//s the number of drivers
                        assem.costAfterMilesThresholdSoundMat = ((assem.soundMatLaborers - soundMatMobilizations) * dict("Price/Day"))
                  }
            }
      }
            
      //3. IF WIRE, CALCULATE LABOR
      if (assem.wireType !== "") {
            assem.wireLaborers = wireLaborers(assem.wireType, assem.SF)
            assem.costOfWireLaborers = costOfWireLaborers(wageType, (assem.wireLaborers))
      }
      
      //4. IF BLACK PAPER, CALCULATE LABOR
      if (assem.blackPaperType !== "") {
            assem.blackPaperLaborers = blackPaperLaborers(assem.blackPaperType, assem.SF)
            assem.costOfBlackPaperLaborers = costOfBlackPaperLaborers(wageType, (assem.blackPaperLaborers))
      }
      
}
