var trucksMaintCost = function(gypOrConc, miles, mobilizations, overnight) {
      //1. GET MAINTENANCE COST PER DAY (BASED ON THE YEARLY TRUCK BREAK COST)
      var dict = getValues("Maint_Trucks", {"Truck": "Yearly"}, ["Maint Cost/Day"]);
      var maintCostPerDay = dict["Maint Cost/Day"];
      if (overnight === true) {
            maintCostPerDay = maintCostPerDay * 2;
      }
      
      //2. GET MAINTENANCE COST PER MILE
      dict = getValues("Maint_Trucks",{"Truck": "Total"}, ["Maint Cost/Mile"]);
      var maintCostPerMile = dict["Maint Cost/Mile"];
      
      //3. CALCULATE FOR ROUND TRIP
      trucksMaintCost = maintCostPerDay + (miles * 2 * maintCostPerMile);
      
      //4. MULTIPLY BY AMOUNT OF MOBILIZATIONS
      trucksMaintCost *= mobilizations;
    
      if (gypOrConc === "Gyp") {
            //MULTIPLY BY 2 DRIVERS
            trucksMaintCost*= 2;
      }
      return trucksMaintCost
}
var machinesMaintCost = function(gypOrConc, hours, machines, mobilizations) {
    var machinesMaintCost = {};

    if (gypOrConc === "Gyp") {
      machinesMaintCost.pump = machineMaintCost("gypPump", hours, machines[0], mobilizations);
      machinesMaintCost.bobcat = machineMaintCost("bobcat", hours, machines[1], mobilizations);
    } else {
      machinesMaintCost.pump = machineMaintCost("concPump", hours, machines[0], mobilizations);
    }
    return machinesMaintCost;
}
var machineMaintCost = function(machineType, hours, machine, mobilizations) {
    var tableName;
    if (machineType === "gypPump") {
        tableName = "Equip_Gyp_Pumps"
    } else if (machineType === "bobcat") {
        tableName = "Equip_Bobcats"
    } else if (machineType === "concPump") {
        tableName = "Equip_Conc_Pumps"
    }
    
    var dict = getValues(tableName, {"Model-Num": machine}, ["Total Maint / Hr", "Maint Cost/Day"]);
    machineMaintCost = dict["Maint Cost/Day"] * mobilizations;
    machineMaintCost+= Math.ceil(hours * dict["Total Maint / Hr"]);
    return machineMaintCost;
}


