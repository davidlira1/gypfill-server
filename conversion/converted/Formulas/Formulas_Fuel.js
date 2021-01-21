var drivingFuelsCost = function(material, miles, mobilizations) {
      //WE DRIVE FOR EACH MOBILIZATION, ROUND TRIP
      if (miles !== "Not Available") {
            //1. CALCULATE COST FOR ONE WAY
            //here we hardcoded the truck type
            drivingFuelsCost = drivingFuelCost("F-550", miles);
                  
            //2. MULTIPLY BY 2 FOR ROUND TRIP
            drivingFuelsCost = drivingFuelsCost * 2;
                  
            //3. MULTIPLY DRIVING FUELS COST BY MOBILIZATIONS
            drivingFuelsCost = drivingFuelsCost * mobilizations
            
            if (material === "Gyp") {
                  //1. MULTIPLY BY 2 FOR DRIVERS
                  drivingFuelsCost = drivingFuelsCost * 2
            }
      } else {
            drivingFuelsCost = "Not Available"
      }
      return drivingFuelsCost;
}
var drivingFuelCost = function(vehicle, miles) {
    //ONE WAY
    var dict;
    dict = getValues("Equip_Vehicles", {"Model": vehicle}, ["Fuel"]);
    var fuelType = dict.Fuel;
    
    dict = getValues("Equip_Vehicles", {"Model": vehicle}, ["MPG"]);
    var MPG = dict.MPG;
    
    var gallons = miles / MPG;

    dict = getValues("Prices_Fuel", {"Fuel Type": fuelType}, ["Price/Gallon"]);
    var pricePerGallon = dict["Price/Gallon"];
    
    return Math.ceil(gallons * pricePerGallon);
}
var machinesFuelCost = function(gypOrConc, hrs, machines) {
      machinesFuelCost = {}
      
      if (gypOrConc === "Gyp") {
            machinesFuelCost.pump = machineFuelCost("gypPump", machines[0], hrs);
            machinesFuelCost.bobcat = machineFuelCost("bobcat", machines[1], hrs);
      } else {
            machinesFuelCost.pump = machineFuelCost("concPump", machines[0], hrs);
      }
      return machineFuelCost;
}
var machineFuelCost = function(machineType, machine, hrs) {
      var tableName;
      //1. DETERMINE TABLE NAME
      if (machineType === "gypPump") {
            tableName = "Equip_Gyp_Pumps"
      } else if (machineType === "concPump") {
            tableName = "Equip_Conc_Pumps"
      } else if (machineType === "bobcat") {
            tableName = "Equip_Bobcats"
            hrs = hrs + 1 //the bobcat will work for one more hour than the pump, since it//s setting up at the beginning, and cleaning up at the end
      }
      
      //2. GET GALS/HR AND FUEL TYPE FOR MACHINE
      var dict = getValues(tableName, {"Model-Num": machine}, ["Gals/Hr", "Fuel Type"]);
      
      //3. CALCULATE GALLONS
      var gallons = hrs * dict["Gals/Hr"];
      
      //4. SET FUEL TYPE VARIABLE
      var fuelType = dict["Fuel Type"];
      
      //5. GET PRICE/GALLON FOR FUEL
      dict = getValues("Prices_Fuel", {"Fuel Type": fuelType}, ["Price/Gallon"]);
      
      //6. SET PRICE/GALLON VARIABLE
      var fuelCostPerGal = dict["Price/Gallon"];
      
      //7. CALCULATE MACHINE FUEL COST
      return gallons * fuelCostPerGal
}
