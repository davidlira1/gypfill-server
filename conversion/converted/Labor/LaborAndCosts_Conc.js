const lb = require('../library.js');

module.exports.laborAndCostsConc = function(assem, drivingTimeHrs, wageType, miles, saturdayConc, numOfFloors, overrideConcBarrelMix) {
      var dict;
      assem.labor = {};
      if (assem.concYds <= 2.37 && overrideConcBarrelMix === "No" && assem.section !== "Stairs") {
            //MAXIMIZER LABOR
            assem.labor.concMobilizations = 1;
            assem.labor.concLaborers = lb.maximizerLaborers(assem.concYds, assem.addMobils);
            dict = lb.costOfMaximizerLaborers(wageType, assem.labor.concLaborers.totalCrew.Total, miles, saturdayConc);
            assem.labor.costOfConcLaborers = dict.cost;
            assem.labor.costOfConcLaborersOption = dict.costOption;
            assem.labor.costOfOverTimeConcLabor = lb.costOfOvertimeConcLaborers(wageType, drivingTimeHrs, assem.labor.concMobilizations);
      } else {
            //PUMP LABOR
            //1. DETERMINE COUNT (WHETHER IT//S BALCONY OR STAIR COUNT)
            var count = assem.section === "Stairs" || assem.section === "Stair Landings" ? assem.stairCount : 0;

            assem.labor.concMobilizations = lb.concMobilizations(assem.section, assem.SF, count);
            assem.labor.concLaborers = lb.concLaborers(assem.section, assem.concType, assem.SF, assem.stairNosing, numOfFloors, assem.labor.concMobilizations, assem.addMobils);
            dict = lb.costOfConcLaborers(assem.labor.concLaborers.totalCrew.Total, wageType, miles, saturdayConc);
            assem.labor.costOfConcLaborers = dict.cost;
            assem.labor.costOfConcLaborersOption = dict.costOption;
            assem.labor.costOfOverTimeConcLabor = lb.costOfOvertimeConcLaborers(wageType, drivingTimeHrs, assem.labor.concMobilizations + assem.addMobils);

            //WIRE LABORERS
            if (assem.wireType !== "") {
                  assem.labor.wireLaborers = lb.wireLaborers(assem.wireType, assem.SF);
                  assem.labor.costOfWireLaborers = lb.costOfWireLaborers(wageType, assem.labor.wireLaborers);
            }
                      
            //BLACK PAPER LABORERS
            if (assem.blackPaperType !== "") {
                  assem.labor.blackPaperLaborers = blackPaperLaborers(assem.blackPaperType, assem.SF)
                  assem.labor.costOfBlackPaperLaborers = costOfBlackPaperLaborers(wageType, assem.labor.blackPaperLaborers);
            }
                        
            //SOUND MAT LABORERS
            if (assem.soundMatType !== "") {
                  //1. LABORERS
                  assem.labor.soundMatLaborers = soundMatLaborers(assem.SF, false, 0, assem.soundMatType);
                  //2. LABOR COST
                  assem.labor.costOfSoundMatLabor = costOfSoundMatLabor(assem.labor.soundMatLaborers, wageType);
                  //3. OVERTIME LABOR COST
                  assem.labor.costOfOverTimeSoundMatLabor = costOfOverTimeSoundMatLabor(wageType, assem.labor.concMobilizations, drivingTimeHrs, false);
            }             
      }
      
      dict = lb.getValues("Prices_AfterMileThreshold", {"Description": "Threshold"}, ["Miles", "Price/Day"]);
      if (miles > dict.Miles) {
            assem.costAfterMilesThreshold = ((assem.labor.concLaborers.totalCrew.Total) - (assem.labor.concMobilizations)) * dict["Price/Day"]
      }
}
