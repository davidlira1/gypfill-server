var concYds = function(SF, thick) {
      return Number((SF * (thick / 12) / 27).toFixed(2));
}
var costOfConcYds = function(concType, psi, yds, zipCode, saturday) {
      costOfConcYds = {};
      
      //1. DETERMINE IF ZIP CODE IS AN EXPENSIVE ONE
      var dict = getValues("Conc_FarZipCodes", {"Zip Code": zipCode}, ["Zip Code"]);

      var location = !("Zip Code" in dict) ?  "Far From Plant" : "Santa Monica";

      //2. GET PRICE 1 CONCRETE YD
      dict = getValues("Prices_ConcYD", {"Concrete Type": concType, "PSI": psi}, [location]);
      var costPerYd = dict[location];
      
      //3. CALCULATE PRICE OF CONCRETE YARDS
      dict = getValues("Prices_Fees", {"Fee": "Saturay Cost Per Yd"}, ["Cost"]);
      if (saturday === "No" || saturday === "Yes - Option") {
            costOfConcYds.cost = yds * costPerYd;
      } else {
            costOfConcYds.cost = yds * (costPerYd + dict.Cost);
      }
 
      //4. OPTION
      if (saturday === "Yes - Option") {
            costOfConcYds.costOption = yds * dict.Cost;
      } else {
            costOfConcYds.costOption = 0;
      }
      return costOfConcYds;
}
var concShortLoad = function(yds) {
      return yds % 10;
}
var costOfConcShortLoad = function(yds) {
      if (yds <= 8.75 && yds !== 0) {
          var dict = getValues("Prices_ConcShortLoad", {"Description": "Base"}, ["Yds", "Price"]);
          var baseAmount = dict.Yds;
          
          var basePrice = dict.Price;
          dict = getValues("Prices_ConcShortLoad", {"Description": "Every .25 Yd Less"}, ["Price"]);
          var everyQuarterLess = dict.Price;
      
          return basePrice + (((baseAmount - yds) * 4) * everyQuarterLess)
      } else {
          return 0;
      }
}
var concTrucks = function(yds, slope, city) {
    var key = city === "Beverly Hills" ? "Beverly Hills" : slope;
    var dict = getValues("Conc_TruckLoad", {"Description": key}, ["Truck Load"]);
    return {
          truckLoad = dict["Truck Load"],
          trucks = Math.ceil(yds / dict["Truck Load"])
    }
}
var costOfEnvironmental = function(trucks) {
    var dict = getValues("Prices_Fees", {"Fee": "Environmental"}, ["Cost"]);
    var environmentalFee = dict.Cost;
    return trucks * environmentalFee;
}
var costOfEnergy = function(trucks) {
    var dict = getValues("Prices_Fees", {"Fee": "Energy"}, ["Cost"]);
    var energyFee = dict.Cost;
    return trucks * energyFee;
}
var costOfWashOut = function(trucks) {
    var dict = getValues("Prices_Fees", {"Fee": "Washout"}, ["Cost"]);
    var washoutFee = dict.Cost;
    return trucks * washoutFee;
}
var costOfDownTime = function(wageType, yds, section, numOfTrucks) {
    var rowName = wageType === "NonPrevailing" ? "Add Time/Min" : "Add Time/Min[Prev]";

    var dict = getValues("Prices_Fees", {"Fee": rowName}, ["Cost"]);
    var dict2 = getValues("Conc_DownTime", {"Section", section}, ("Mins/Truck"));
    
    return numOfTrucks * dict2["Mins/Truck"] * dict.Cost;
}
var costOfTracker = function() {
      var dict = getValues("Prices_Fees", {"Fee": "Tracker [Prevailing]"}, ["Cost"]);
      return dict.Cost;
}
var concMobilizations = function(section, SF, count) {
      if (section === "Stairs" || sections === "Stair Landings") {
            return count
      } else {
            var dict = getValues("Conc_MaxPerDay", {"Section": section}, ["Max/Day"]);
            return Math.ceil(SF / dict["Max/Day"]);
      }
}
var concLaborers = function(section, concType, SF, nosing, numOfFloors, mobilizations, addMobils) {
      concLaborers = {};
      var cl = {
            crew: {},
            remCrew: {},
            totalCrew: {}
      };

      //GET the Max/Day for the section
      var dict = getValues("Conc_MaxPerDay", {"Section": section}, ["Max/Day"]);
      
      var renamedConcType = concType.split(" ")[0];
    
      if (renamedConcType === "Hydrolite") {
          renamedConcType = "Lightweight"
      } else if (renamedConcType === "Pea") {
          renamedConcType = "Peagravel"
      }
    
      if (section === "Stairs" || section === "Stair Landings") {
            section = "Stairs & Mid Landings";
      } else if (section === "Exterior Corridors") {
            section = "Corridors";
      }
      
      var concWork = section + " " + renamedConcType
      if (section === "Stairs & Mid Landings") {
            cl.crew = getValues("Labor_Concrete", {"Type Of Concrete Work": concWork, "SF": numOfFloors}, ["Prep Guy", "Pumper", "Hose Carrier", "Pourers", "Finishers", "Cleaners", "Laborers", "Total"]);
            if (nosing === "Yes") {
                  cl.crew.Finishers = cl.crew.Finishers + 1;
                  cl.crew.Total = cl.crew.Total + 1;
            }
            
            for(var key in cl.crew) {
                  cl.totalCrew[key] = cl.crew[key] * mobilizations;
            }
      
      } else {
            //if the count is less than the section, then get the crew for that size
            if (SF < dict["Max/Day"]) {
                  cl.crew = getValuesConcLabor("Labor_Concrete", ("Type Of Concrete Work"), [concWork], ("Prep Guy", "Pumper", "Hose Carrier", "Pourers", "Finishers", "Cleaners", "Laborers", "Total"), SF)
                  
                  cl.totalCrew = cl.crew
            } else {
                  //GET THE CREW SIZE FOR THE MAX AMOUNT
                  cl.crew = getValuesConcLabor("Labor_Concrete", ("Type Of Concrete Work"), [concWork], ("Prep Guy", "Pumper", "Hose Carrier", "Pourers", "Finishers", "Cleaners", "Laborers", "Total"), dict["Max/Day"])
                  //GET THE CREW SIZE FOR THE REMAINDER
                  cl.remCrew = getValuesConcLabor("Labor_Concrete", ("Type Of Concrete Work"), [concWork], ("Prep Guy", "Pumper", "Hose Carrier", "Pourers", "Finishers", "Cleaners", "Laborers", "Total"), SF Mod dict["Max/Day"])
                  
                  For Each key In cl.crew
                        cl.totalCrew[key] = (cl.crew[key] * (mobilizations - 1)) + cl.remCrew[key]
                  }
            }
      }

      //ADD FOR ADD MOBILS
      cl.totalCrew.Pumper = cl.totalCrew.Pumper + addMobils
      cl.totalCrew("Hose Carrier") = cl.totalCrew("Hose Carrier") + (addMobils * 2)
      cl.totalCrew.Pourers = cl.totalCrew.Pourers + addMobils
      cl.totalCrew.Total = cl.totalCrew.Total + addMobils + (addMobils * 2) + addMobils
      
      concLaborers = cl
}
var costOfConcLaborers = function(laborers, wageType, miles, saturday) {
      costOfConcLaborers = {}
      
      //1. GET WAGE PRICES
      var dict = getValues("Wage_" + wageType + "_Conc", {"Laborer": "Average"}, ["Price/Day", "Price/Hr [OT]"]);
      
      //2. CALCULATE COST OF LABORERS
      if (saturday === "No" || saturday === "Yes - Option") {
            costOfConcLaborers.cost = Math.ceil(dict["Price/Day"] * laborers);
      } else {
            costOfConcLaborers.cost = Math.ceil((dict["Price/Hr [OT]"] * 8 * laborers))
      }
      
      //3. IF SATURDAY OPTION
      if (saturday === "Yes - Option") {
            costOfConcLaborers.costOption = Math.ceil(((dict["Price/Hr [OT]"] * 8) - dict["Price/Day"]) * laborers);
      } else {
            costOfConcLaborers.costOption = 0;
      }
      return costOfConcLaborers;
}
var costOfOvertimeConcLaborers = function(wageType, drivingTime, mobilizations) {
      //THIS SEEMS TO BE FOR ONE DRIVER
      var dict = getValues("Wage_" + wageType + "_Conc", {"Laborer": "Average"}, ["Price/Hr [OT]", "Price/Hr [DT]"]);
      var wageOT = dict["Price/Hr [OT]"];
      var wageDT = dict["Price/Hr [DT]"];
      var costOfOvertimeConcLaborers;
 
      if (drivingTime > 4) {
            costOfOvertimeConcLaborers = (drivingTime - 4) * wageDT;
            costOfOvertimeConcLaborers+= + (4 * wageOT);
      } else {
            costOfOvertimeConcLaborers = drivingTime * wageOT;
      }
      
      costOfOvertimeConcLaborers*= mobilizations;

      return costOfOvertimeConcLaborers;
}
