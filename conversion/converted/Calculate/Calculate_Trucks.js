var calculateTrucks = function(estimate, gypExists, concExists, overnight, sameDay) {
      if (gypExists) {
            //==========================================================================================
            //TRUCKS DRIVING - GYPCRETE, PREPOURS, AND SOUNDMAT
            //==========================================================================================
            //TRUCKS DRIVING FUEL COST
            estimate.trucks.gypDrivingFuelCost = drivingFuelsCost("Gyp", estimate.distance("Van Nuys"), estimate.gyp.labor.mobilizations);
            estimate.trucks.prePoursDrivingFuelCost = drivingFuelsCost("", estimate.distance("Van Nuys"), estimate.gyp.labor.mobilizationsPrePours);
            if (overnight !== true && sameDay !== "Yes") {
                  estimate.trucks.soundMatDrivingFuelCost = drivingFuelsCost("", estimate.distance("Van Nuys"), estimate.gyp.labor.mobilizationsSoundMat);
            }
            
            //TRUCKS MAINTENANCE COST
            estimate.trucks.gypMaintenanceCost = trucksMaintCost("Gyp", estimate.distance("Van Nuys"), estimate.gyp.labor.mobilizations, overnight);
            estimate.trucks.prePoursMaintenanceCost = trucksMaintCost("", estimate.distance("Van Nuys"), estimate.gyp.labor.mobilizationsPrePours, false);
            if (overnight !== true && sameDay !== "Yes") {
                  estimate.trucks.soundMatMaintenanceCost = trucksMaintCost("", estimate.distance("Van Nuys"), estimate.gyp.labor.mobilizationsSoundMat, overnight);
            }
            //==========================================================================================
            estimate.totals.gypCostTrucksFuelMaint = _
                                            estimate.trucks.gypDrivingFuelCost + _
                                            estimate.trucks.prePoursDrivingFuelCost + _
                                            estimate.trucks.soundMatDrivingFuelCost + _
                                            estimate.trucks.gypMaintenanceCost + _
                                            estimate.trucks.prePoursMaintenanceCost + _
                                            estimate.trucks.soundMatMaintenanceCost
      }
}
var calculateTrucksConc = function(assem, miles) {
      //ADD A TRUCKS OBJECT TO THE ASSEMBLY
      assem.trucks = {
            costFuel = drivingFuelsCost("Conc", miles, assem.labor.concMobilizations + assem.addMobils),
            costMaintenance = trucksMaintCost("Conc", miles, assem.labor.concMobilizations + assem.addMobils, false)
      }
      
      //we will not calculate the insurance, registration, or dot costs since those get paid regardless if there is work or not
      //tamir said these will be part of overhead
}
