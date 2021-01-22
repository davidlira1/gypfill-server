const lb = require('../library.js');

module.exports.concYds = function(SF, thick) {
      return Number((SF * (thick / 12) / 27).toFixed(2));
}
module.exports.costOfConcYds = function(concType, psi, yds, zipCode, saturday) {
      costOfConcYds = {};
      
      //1. DETERMINE IF ZIP CODE IS AN EXPENSIVE ONE
      var dict = lb.getValues("Conc_FarZipCodes", {"Zip Code": zipCode}, ["Zip Code"]);

      var location = dict["Zip Code"] ?  "Santa Monica" : "Far From Plant";

      //2. GET PRICE 1 CONCRETE YD
      dict = lb.getValues("Prices_ConcYD", {"Concrete Type": concType, "PSI": psi}, [location]);
      var costPerYd = dict[location];
      
      //3. CALCULATE PRICE OF CONCRETE YARDS
      dict = lb.getValues("Prices_Fees", {"Fee": "Saturay Cost Per Yd"}, ["Cost"]);
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
module.exports.concShortLoad = function(yds) {
      return yds % 10;
}
module.exports.costOfConcShortLoad = function(yds) {
      if (yds <= 8.75 && yds !== 0) {
          var dict = lb.getValues("Prices_ConcShortLoad", {"Description": "Base"}, ["Yds", "Price"]);
          var baseAmount = dict.Yds;
          
          var basePrice = dict.Price;
          dict = lb.getValues("Prices_ConcShortLoad", {"Description": "Every .25 Yd Less"}, ["Price"]);
          var everyQuarterLess = dict.Price;
      
          return basePrice + (((baseAmount - yds) * 4) * everyQuarterLess)
      } else {
          return 0;
      }
}
module.exports.concTrucks = function(yds, slope, city) {
    var key = city === "Beverly Hills" ? "Beverly Hills" : slope;
    var dict = lb.getValues("Conc_TruckLoad", {"Description": key}, ["Truck Load"]);
    return {
          truckLoad: dict["Truck Load"],
          trucks: Math.ceil(yds / dict["Truck Load"])
    }
}
module.exports.costOfEnvironmental = function(trucks) {
    var dict = lb.getValues("Prices_Fees", {"Fee": "Environmental"}, ["Cost"]);
    return trucks * dict.Cost;
}
module.exports.costOfEnergy = function(trucks) {
    var dict = lb.getValues("Prices_Fees", {"Fee": "Energy"}, ["Cost"]);
    return trucks * dict.Cost;
}
module.exports.costOfWashOut = function(trucks) {
    var dict = lb.getValues("Prices_Fees", {"Fee": "Washout"}, ["Cost"]);
    return trucks * dict.Cost;
}
module.exports.costOfDownTime = function(wageType, yds, section, numOfTrucks) {
    var rowName = wageType === "NonPrevailing" ? "Add Time/Min" : "Add Time/Min[Prev]";

    var dict = lb.getValues("Prices_Fees", {"Fee": rowName}, ["Cost"]);
    var dict2 = lb.getValues("Conc_DownTime", {"Section": section}, ["Mins/Truck"]);
    
    return numOfTrucks * dict2["Mins/Truck"] * dict.Cost;
}
module.exports.costOfTracker = function() {
      var dict = lb.getValues("Prices_Fees", {"Fee": "Tracker [Prevailing]"}, ["Cost"]);
      return dict.Cost;
}
module.exports.concMobilizations = function(section, SF, count) {
      if (section === "Stairs" || section === "Stair Landings") {
            return count;
      } else {
            var dict = lb.getValues("Conc_MaxPerDay", {"Section": section}, ["Max/Day"]);
            return Math.ceil(SF / dict["Max/Day"]);
      }
}
module.exports.concLaborers = function(section, concType, SF, nosing, numOfFloors, mobilizations, addMobils) {
      concLaborers = {};
      var cl = {
            crew: {},
            remCrew: {},
            totalCrew: {}
      };

      //GET the Max/Day for the section
      var dict = lb.getValues("Conc_MaxPerDay", {"Section": section}, ["Max/Day"]);
      
      var renamedConcType = concType.split(" ")[0];
    
      if (renamedConcType === "Hydrolite") {
          renamedConcType = "Lightweight";
      } else if (renamedConcType === "Pea") {
          renamedConcType = "Peagravel";
      }
    
      if (section === "Stairs" || section === "Stair Landings") {
            section = "Stairs & Mid Landings";
      } else if (section === "Exterior Corridors") {
            section = "Corridors";
      }
      
      var concWork = section + " " + renamedConcType
      if (section === "Stairs & Mid Landings") {
            cl.crew = lb.getValues("Labor_Concrete", {"Type Of Concrete Work": concWork, "SF": numOfFloors}, ["Prep Guy", "Pumper", "Hose Carrier", "Pourers", "Finishers", "Cleaners", "Laborers", "Total"]);
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
                  cl.crew = lb.getValuesConcLabor("Labor_Concrete", ("Type Of Concrete Work"), [concWork], ("Prep Guy", "Pumper", "Hose Carrier", "Pourers", "Finishers", "Cleaners", "Laborers", "Total"), SF)
                  
                  cl.totalCrew = cl.crew
            } else {
                  //GET THE CREW SIZE FOR THE MAX AMOUNT
                  cl.crew = lb.getValuesConcLabor("Labor_Concrete", ("Type Of Concrete Work"), [concWork], ("Prep Guy", "Pumper", "Hose Carrier", "Pourers", "Finishers", "Cleaners", "Laborers", "Total"), dict["Max/Day"])
                  //GET THE CREW SIZE FOR THE REMAINDER
                  cl.remCrew = lb.getValuesConcLabor("Labor_Concrete", ("Type Of Concrete Work"), [concWork], ("Prep Guy", "Pumper", "Hose Carrier", "Pourers", "Finishers", "Cleaners", "Laborers", "Total"), SF % dict["Max/Day"])
                  
                  for(var key in cl.crew) {
                        cl.totalCrew[key] = (cl.crew[key] * (mobilizations - 1)) + cl.remCrew[key];
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
module.exports.costOfConcLaborers = function(laborers, wageType, miles, saturday) {
      costOfConcLaborers = {}
      
      //1. GET WAGE PRICES
      var dict = lb.getValues("Wage_" + wageType + "_Conc", {"Laborer": "Average"}, ["Price/Day", "Price/Hr [OT]"]);
      
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
module.exports.costOfOvertimeConcLaborers = function(wageType, drivingTime, mobilizations) {
      //THIS SEEMS TO BE FOR ONE DRIVER
      var dict = lb.getValues("Wage_" + wageType + "_Conc", {"Laborer": "Average"}, ["Price/Hr [OT]", "Price/Hr [DT]"]);
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
