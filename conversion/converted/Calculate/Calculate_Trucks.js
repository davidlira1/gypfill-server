const lb = require('../library.js');

module.exports.calculateTrucks = function(estimate, gypExists, concExists, overnight, sameDay) {
      if (gypExists) {
            //==========================================================================================
            //TRUCKS DRIVING - GYPCRETE, PREPOURS, AND SOUNDMAT
            //==========================================================================================
            //TRUCKS DRIVING FUEL COST
            estimate.trucks.gypDrivingFuelCost = lb.drivingFuelsCost("Gyp", estimate.distance["Van Nuys"], estimate.gyp.labor.mobilizations);
            estimate.trucks.prePoursDrivingFuelCost = lb.drivingFuelsCost("", estimate.distance["Van Nuys"], estimate.gyp.labor.mobilizationsPrePours);
            if (overnight !== true && sameDay !== "Yes") {
                  estimate.trucks.soundMatDrivingFuelCost = lb.drivingFuelsCost("", estimate.distance["Van Nuys"], estimate.gyp.labor.mobilizationsSoundMat);
            }
            
            //TRUCKS MAINTENANCE COST
            estimate.trucks.gypMaintenanceCost = lb.trucksMaintCost("Gyp", estimate.distance["Van Nuys"], estimate.gyp.labor.mobilizations, overnight);
            estimate.trucks.prePoursMaintenanceCost = lb.trucksMaintCost("", estimate.distance["Van Nuys"], estimate.gyp.labor.mobilizationsPrePours, false);
            if (overnight !== true && sameDay !== "Yes") {
                  estimate.trucks.soundMatMaintenanceCost = lb.trucksMaintCost("", estimate.distance["Van Nuys"], estimate.gyp.labor.mobilizationsSoundMat, overnight);
            }
            //==========================================================================================
            estimate.totals.gypCostTrucksFuelMaint = lb.sum([estimate.trucks.gypDrivingFuelCost,
                                                             estimate.trucks.prePoursDrivingFuelCost,
                                                             estimate.trucks.soundMatDrivingFuelCost,
                                                             estimate.trucks.gypMaintenanceCost,
                                                             estimate.trucks.prePoursMaintenanceCost,
                                                             estimate.trucks.soundMatMaintenanceCost]);
      }
}
module.exports.calculateTrucksConc = function(assem, miles) {
      //ADD A TRUCKS OBJECT TO THE ASSEMBLY
      assem.trucks = {
            costFuel: lb.drivingFuelsCost("Conc", miles, assem.labor.concMobilizations + assem.addMobils),
            costMaintenance: lb.trucksMaintCost("Conc", miles, assem.labor.concMobilizations + assem.addMobils, false)
      }
      //we will not calculate the insurance, registration, or dot costs since those get paid regardless if there is work or not
      //tamir said these will be part of overhead
}
