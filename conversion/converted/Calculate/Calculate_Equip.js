const lb = require('../library.js');

module.exports.calculateEquip = function(estimate, gypExists, concExists) {
      if (gypExists) {
            //==========================================================================================
            //GYPCRETE EQUIP
            //==========================================================================================
            //GET PUMP TIMES FOR ALL PUMP MACHINES
            if (estimate.gyp.labor.method === "Pump") {
                  var pumpTime_ = lb.pumpTime(estimate.totals.gypBags); //so it is good to have the the total pumpTime for everything
                  estimate.gyp.equip.pumpTime = pumpTime_;
            }
                  
            //MACHINE FUEL
            //1. DECLARE PUMP VARIABLE
            var pump = estimate.gyp.equip.pump;
                    
            //2. DECLARE BOBCAT VARIABLE
            var bobcat = "326E"; //for the future, if there are more bobcats...estimate.gyp.equip.bobcat
            estimate.gyp.equip.bobcat = bobcat;
            
            if (estimate.gyp.equip.pumpTime[pump] !== 0) {
                  //3. CALCULATE MACHINES FUELS COST AND ADD IT TO EQUIPMENT DICTIONARY
                  estimate.gyp.equip.machineFuelsCost = lb.machinesFuelCost("Gyp", estimate.gyp.equip.pumpTime[pump], [pump, bobcat]);
                          
                  //4. CALCULATE MACHINE MAINTENANCE COST AND ADD IT TO THE EQUIPMENT DICTIONARY
                  estimate.gyp.equip.maintenanceCost = lb.machinesMaintCost("Gyp", estimate.gyp.equip.pumpTime[pump], [pump, bobcat], estimate.gyp.labor.mobilizations);
      
                  //5. CALCULATE ROTO STATER COST
                  estimate.gyp.equip.rotoStaterCost = lb.rotoStaterCost(estimate.totals.gypSF, estimate.totals.gypBags);
      
                  //6. TOTAL GYPCRETE EQUIPMENT COST
                  estimate.totals.gypCostEquip = estimate.gyp.equip.machineFuelsCost.pump +
                                                 estimate.gyp.equip.machineFuelsCost.bobcat +
                                                 estimate.gyp.equip.maintenanceCost.pump +
                                                 estimate.gyp.equip.maintenanceCost.bobcat +
                                                 estimate.gyp.equip.rotoStaterCost                            
            }
            //==========================================================================================
      }
}
module.exports.equipCostsConc = function(assem, concPumpCostOption, mobilizations, overrideConcBarrelMix) {
      if (assem.concYds > 2.37 || overrideConcBarrelMix === "Yes" || assem.section === "Stairs") {
          assem.equip = {
            pumpTimeHrs: lb.concPumpTime(assem.concYds, assem.section),
            costFuel: lb.machinesFuelCost("Conc", assem.equip.pumpTimeHrs, ["757"]),
            costMaintenance: lb.machinesMaintCost("Conc", assem.equip.concPumpTimeHrs, ["757"], mobilizations),
            costConcPump: lb.concPumpCost(concPumpCostOption, mobilizations)
          }
      } else {
          assem.equip = {
              pumpTimeHrs: 0,
              costFuel: {pump: 0},
              costMaintenance: {pump: 0},
              costConcPump: 0
            }
      }
}
module.exports.concPumpCost = function(concPumpCostOption, mobilizations) {
      if (concPumpCostOption === "Yes") {
            var dict = lb.getValues("Equip_Conc_Pumps", ["Model-Num"], ["757"], ["Pump Cost/Day"]);
            return dict["Pump Cost/Day"] * mobilizations;
      } else {
            return 0;
      }
}

