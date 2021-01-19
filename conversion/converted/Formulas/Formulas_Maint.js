var trucksMaintCost = function(gypOrConc, miles, mobilizations, overnight) {
      var dict
    
      //1. GET MAINTENANCE COST PER DAY (BASED ON THE YEARLY TRUCK BREAK COST)
      dict = getValues("Maint_Trucks", Array.Truck, Array.Yearly, Array("Maint Cost/Day"))
      var maintCostPerDay = dict("Maint Cost/Day")
      if (overnight === true) {
            maintCostPerDay = maintCostPerDay * 2
      }
      
      //2. GET MAINTENANCE COST PER MILE
      dict = getValues("Maint_Trucks", Array.Truck, Array.Total, Array("Maint Cost/Mile"))
      var maintCostPerMile = dict("Maint Cost/Mile")
      
      //3. CALCULATE FOR ROUND TRIP
      trucksMaintCost = maintCostPerDay + (miles * 2 * maintCostPerMile)
      
      //4. MULTIPLY BY AMOUNT OF MOBILIZATIONS
      trucksMaintCost = trucksMaintCost * mobilizations
    
      if (gypOrConc === "Gyp") {
            //MULTIPLY BY 2 DRIVERS
            trucksMaintCost = trucksMaintCost * 2
      }
    
}
var machinesMaintCost = function(gypOrConc, hours, machines, mobilizations) {
    machinesMaintCost = {}

    if (gypOrConc === "Gyp") {
      machinesMaintCost.pump = machineMaintCost("gypPump", hours, (machines[0]), mobilizations)
      machinesMaintCost.bobcat = machineMaintCost("bobcat", hours, (machines[1]), mobilizations)
    } else {
      machinesMaintCost.pump = machineMaintCost("concPump", hours, (machines[0]), mobilizations)
    }
    
}
var machineMaintCost = function(machineType, hours, machine, mobilizations) {
    
    var tableName
    if (machineType === "gypPump") {
        tableName = "Equip_Gyp_Pumps"
    } else if (machineType === "bobcat") {
        tableName = "Equip_Bobcats"
    } else if (machineType === "concPump") {
        tableName = "Equip_Conc_Pumps"
    }
    
    var dict = getValues(tableName, Array("Model-Num"), Array[machine], Array("Total Maint / Hr", "Maint Cost/Day"))
    machineMaintCost = dict("Maint Cost/Day") * mobilizations
    machineMaintCost = machineMaintCost + Round((hours * dict("Total Maint / Hr")) + 0.49)
    
}


