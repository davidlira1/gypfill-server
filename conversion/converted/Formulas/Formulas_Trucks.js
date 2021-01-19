var vehiclesInsuranceCost = function(gypOrConc, mobilizations, overnight) {
      var dict = getValues("Ins_Vehicles", Array.Type, Array.Yearly, Array("Per Day/Truck"))
      var insCostPerDayPerTruck = dict("Per Day/Truck")
    
      //1. CALCULATE VEHICLE INSURANCE COST
      vehiclesInsuranceCost = mobilizations * insCostPerDayPerTruck
      if (overnight === true) {
            vehiclesInsuranceCost = vehiclesInsuranceCost * 2
      }
    
      if (gypOrConc === "Gyp") {
        //1. Multiply by 2 for 2 trucks
        vehiclesInsuranceCost = vehiclesInsuranceCost * 2
      }
    
}
var vehiclesRegistCost = function(gypOrConc, mobilizations, overnight) {
      var dict = getValues("Regist_Vehicles_Total", Array.Type, Array.Yearly, Array("Per Day/Truck"))
      var registCostPerDayPerTruck = dict("Per Day/Truck")
    
      //1. CALCULATE VEHICLE REGISTRATION COST
      vehiclesRegistCost = Round((mobilizations * registCostPerDayPerTruck) + 0.49)
      if (overnight === true) {
            vehiclesRegistCost = vehiclesRegistCost * 2
      }
            
      if (gypOrConc === "Gyp") {
            //1. Multiply by 2 Drivers
            vehiclesRegistCost = vehiclesRegistCost * 2
      }
}
var vehiclesDotCost = function(gypOrConc, mobilizations, overnight) {
    var dict = getValues("Equip_Vehicles", Array.Model, Array("F-550"), Array("DOT Cost/Day"))
    var dotCostPerDayPerTruck = dict("DOT Cost/Day")
    
      //1. CALCULATE VEHICLE DOT COST
      vehiclesDotCost = Round((mobilizations * dotCostPerDayPerTruck) + 0.49)
      if (overnight === true) {
            vehiclesDotCost = vehiclesDotCost * 2
      }
    
      if (gypOrConc === "Gyp") {
            //1. Multiply by 2 for 2 trucks
            vehiclesDotCost = vehiclesDotCost * 2
      }
}
