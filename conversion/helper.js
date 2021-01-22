totals.concYds = !totals.concYds ? assem.concYds : totals.concYds+= assem.concYds;
totals.concPumpTimeHrs = !totals.concPumpTimeHrs ? assem.equip.pumpTimeHrs : totals.concPumpTimeHrs+= assem.equip.pumpTimeHrs;
totals.concMobilizations = !totals.concMobilizations ? assem.labor.concMobilizations : totals.concMobilizations+= assem.labor.concMobilizations;

totals.concCostMachineFuel = !totals.concCostMachineFuel ? assem.equip.costFuel.pump : totals.concCostMachineFuel+= assem.equip.costFuel.pump;
totals.concCostMachineMaintenance = !totals.concCostMachineMaintenance ? assem.equip.costMaintenance.pump : totals.concCostMachineMaintenance+= assem.equip.costMaintenance.pump;
totals.concCostEquip = !totals.concCostEquipment ? assem.equip.costFuel.pump + assem.equip.costMaintenance.pump : totals.concCostEquipment+= assem.equip.costFuel.pump + assem.equip.costMaintenance.pump;

totals.concCostLabor = !totals.concCostLabor ? assem.labor.costOfConcLaborers : totals.concCostLabor+= assem.labor.costOfConcLaborers; //what about sm labor?? right???

totals.concCostSaturdayOption = !totals.concCostSaturdayOption ? assem.costOfConcYdsOption + assem.labor.costOfConcLaborersOption : totals.concCostSaturdayOption+= assem.costOfConcYdsOption + assem.labor.costOfConcLaborersOption;

totals.concCostTrucksFuel = !totals.concCostTrucksFuel ? assem.trucks.costFuel : totals.concCostTrucksFuel+= assem.trucks.costFuel;
totals.concCostTrucksMaintenance = !totals.concCostTrucksMaintenance ? assem.trucks.costMaintenance : totals.concCostTrucksMaintenance+= assem.trucks.costMaintenance;
totals.concCostOverTimeLabor = !totals.concCostOverTimeLabor ? assem.labor.costOfOverTimeConcLabor + assem.labor.costOfOverTimeSoundMatLabor : totals.concCostOverTimeLabor+= assem.labor.costOfOverTimeConcLabor + assem.labor.costOfOverTimeSoundMatLabor;
totals.concCostAfterMilesThreshold = !totals.concCostAfterMilesThreshold ? assem.costAfterMilesThreshold : totals.concCostAfterMilesThreshold+= assem.costAfterMilesThreshold;
totals.concCostTravel = !totals.concCostTravel ? assem.costTravel : totals.concCostTravel+= assem.costTravel;

totals.concCostProduction = !totals.concCostProduction ? assem.costProduction : totals.concCostProduction+= assem.costProduction;
totals.concCostTotal = !totals.concCostTotal ? assem.costTotal : totals.concCostTotal+= assem.costTotal;