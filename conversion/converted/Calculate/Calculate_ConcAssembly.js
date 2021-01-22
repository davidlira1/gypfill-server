const lb = require('../library.js');

module.exports.calculateConcAssembly = function(assem, drivingTimeHrs, wageType, city, miles, zipCode, saturdayConc, concPumpCostOption, numOfFloors, overrideConcBarrelMix) {
      //1. CALCULATE MATERIALS AND COST FOR ASSEMBLY
      lb.materialsAndCostsConc(assem, assem, wageType, city, zipCode, saturdayConc, overrideConcBarrelMix);
      
      //2. CALCULATE LABOR COSTS FOR ASSEMBLY
      lb.laborAndCostsConc(assem, drivingTimeHrs, wageType, miles, saturdayConc, numOfFloors, overrideConcBarrelMix);
      
      //3. CALCULATE EQUIPMENT COST FOR ASSEMBLY
      lb.equipCostsConc(assem, concPumpCostOption, assem.labor.concMobilizations + assem.addMobils, overrideConcBarrelMix);
      
      //4. CALCULATE TRUCKS// COSTS (FUEL, MAINTENANCE).
      lb.calculateTrucksConc(assem, miles);

      //5. CALCULATE TRAVEL COST
      assem.costTravel = assem.trucks.costFuel +
                         assem.trucks.costMaintenance +
                         assem.labor.costOfOverTimeConcLabor +
                         assem.labor.costOfOverTimeSoundMatLabor +
                         assem.costAfterMilesThreshold
                         //what about per diem
      
      //6. CALCULATE PRODUCTION COST
      assem.costProduction = assem.costOfMaximizerBags +
                             assem.costOfConcYds + assem.costOfConcShortLoad +
                             assem.costOfEnvironmental + assem.costOfEnergy + assem.costOfWashOut + assem.costOfDownTime + assem.costOfTracker +
                             assem.labor.costOfConcLaborers +
                             assem.costOfBlackPaperRolls + assem.labor.costOfBlackPaperLaborers +
                             assem.costOfPrimerGallons +
                             assem.costOfWireUnits + assem.labor.costOfWireLaborers +
                             assem.costOfSoundMat + assem.labor.costOfSoundMatLabor +
                             assem.costOfCansOfSprayGlue +
                             assem.costOfDuctTapeRollsWhenNoSM +
                             assem.equip.costFuel.pump + assem.equip.costMaintenance.pump + assem.equip.costConcPump +
                             assem.trucks.costFuel + assem.trucks.costMaintenance +
                             assem.labor.costOfOverTimeConcLabor + assem.labor.costOfOverTimeSoundMatLabor + assem.costAfterMilesThreshold //what about per diem
      
                                                   
      //6. CALCULATE TOTAL COST
      assem.costTotal = lb.costAfterMargin(assem.costProduction, assem.margin)
      assem.margin = ((assem.costTotal - assem.costProduction) / assem.costTotal) * 100
}

