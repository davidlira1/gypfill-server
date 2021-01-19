var concYds = function(SF, thick) {
      concYds = Round(SF * (thick / 12) / 27, 2)
}
var costOfConcYds = function(concType, psi, yds, zipCode, saturday) {
      costOfConcYds = {}
      
      //1. DETERMINE IF ZIP CODE IS AN EXPENSIVE ONE
      var dict = getValues("Conc_FarZipCodes", Array("Zip Code"), Array[zipCode], Array("Zip Code"))

      var location
      if (IsEmpty(dict("Zip Code")) === true) {
            location = "Far From Plant"
      } else {
            location = "Santa Monica"
      }
      
      //2. GET PRICE 1 CONCRETE YD
      dict = getValues("Prices_ConcYD", Array("Concrete Type", "PSI"), Array(concType, psi), Array[location])
      var costPerYd = dict[location]
      
      //3. CALCULATE PRICE OF CONCRETE YARDS
      dict = getValues("Prices_Fees", Array.Fee, Array("Saturay Cost Per Yd"), Array.Cost)
      if (saturday = "No" Or saturday === "Yes - Option") {
            costOfConcYds.cost = yds * costPerYd
      } else {
            costOfConcYds.cost = yds * (costPerYd + dict.Cost)
      }
 
      //4. OPTION
      if (saturday === "Yes - Option") {
            costOfConcYds.costOption = yds * dict.Cost
      } else {
            costOfConcYds.costOption = 0
      }
      
}
var concShortLoad = function(yds) {
      concShortLoad = yds Mod 10
}
var costOfConcShortLoad = function(yds) {
      if (yds <= 8.75 && yds !== 0) {
          var dict = getValues("Prices_ConcShortLoad", Array.Description, Array.Base, Array("Yds", "Price"))
          var baseAmount = dict.Yds
          
          var basePrice = dict.Price
          dict = getValues("Prices_ConcShortLoad", Array.Description, Array("Every .25 Yd Less"), Array.Price)
          var everyQuarterLess = dict.Price
      
          costOfConcShortLoad = basePrice + (((baseAmount - yds) * 4) * everyQuarterLess)
      } else {
          costOfConcShortLoad = 0
      }
}
var concTrucks = function(yds, slope, city) {
    concTrucks = {}
    var key
    if (city === "Beverly Hills") {
        key = "Beverly Hills"
    } else {
        key = slope
    }

    var dict = getValues("Conc_TruckLoad", Array.Description, Array[key], Array("Truck Load"))
    concTrucks.truckLoad = dict("Truck Load")
    concTrucks.trucks = Round((yds / dict("Truck Load")) + 0.49)
}
var costOfEnvironmental = function(trucks) {
    var dict = getValues("Prices_Fees", Array.Fee, Array.Environmental, Array.Cost)
    var environmentalFee = dict.Cost
    
    costOfEnvironmental = trucks * environmentalFee
}
var costOfEnergy = function(trucks) {
    var dict = getValues("Prices_Fees", Array.Fee, Array.Energy, Array.Cost)
    var energyFee = dict.Cost
    
    costOfEnergy = trucks * energyFee
}
var costOfWashOut = function(trucks) {
    var dict = getValues("Prices_Fees", Array.Fee, Array.Washout, Array.Cost)
    var washoutFee = dict.Cost
    
    costOfWashOut = trucks * washoutFee
}
var costOfDownTime = function(wageType, yds, section, numOfTrucks) {
    var rowName
    if (wageType === "NonPrevailing") {
        rowName = "Add Time/Min"
    } else {
        rowName = "Add Time/Min[Prev]"
    }
    
    var dict = getValues("Prices_Fees", Array.Fee, Array[rowName], Array.Cost)
    var dict2 = getValues("Conc_DownTime", Array.Section, Array[section], Array("Mins/Truck"))
    
    costOfDownTime = numOfTrucks * dict2("Mins/Truck") * dict.Cost

}
var costOfTracker = function() {
      var dict = getValues("Prices_Fees", Array.Fee, Array("Tracker [Prevailing]"), Array.Cost)
      
      costOfTracker = dict.Cost
}
var concMobilizations = function(section, SF, count) {
      if (section = "Stairs" Or sections === "Stair Landings") {
            concMobilizations = count
      } else {
            var dict = getValues("Conc_MaxPerDay", Array.Section, Array[section], Array("Max/Day"))
            concMobilizations = Round((SF / dict("Max/Day")) + 0.499)
      }
}
var concLaborers = function(section, concType, SF, nosing, numOfFloors, mobilizations, addMobils) {
      concLaborers = {}
      var cl = {}
      cl.crew = {}
      cl.remCrew = {}
      cl.totalCrew = {}
      
      //GET the Max/Day for the section
      var dict = getValues("Conc_MaxPerDay", Array.Section, Array[section], Array("Max/Day"))
      
      var renamedConcType = Split[concType][0]
    
      if (renamedConcType === "Hydrolite") {
          renamedConcType = "Lightweight"
      } else if (renamedConcType === "Pea") {
          renamedConcType = "Peagravel"
      }
    
      if (section = "Stairs" Or section === "Stair Landings") {
            section = "Stairs + Mid Landings"
      } else if (section === "Exterior Corridors") {
            section = "Corridors"
      }
      
      var concWork = section + " " + renamedConcType
      if (section === "Stairs + Mid Landings") {
            cl.crew = getValues("Labor_Concrete", Array("Type Of Concrete Work", "SF"), Array(concWork, numOfFloors), Array("Prep Guy", "Pumper", "Hose Carrier", "Pourers", "Finishers", "Cleaners", "Laborers", "Total"))
            if (nosing === "Yes") {
                  cl.crew.Finishers = cl.crew.Finishers + 1
                  cl.crew.Total = cl.crew.Total + 1
            }
            
            For Each key In cl.crew
                  cl.totalCrew[key] = cl.crew[key] * mobilizations
            }
      
      } else {
           
            //if the count is less than the section, then get the crew for that size
            if (SF < dict("Max/Day")) {
                  cl.crew = getValuesConcLabor("Labor_Concrete", Array("Type Of Concrete Work"), Array[concWork], Array("Prep Guy", "Pumper", "Hose Carrier", "Pourers", "Finishers", "Cleaners", "Laborers", "Total"), SF)
                  
                  cl.totalCrew = cl.crew
            } else {
                  //GET THE CREW SIZE FOR THE MAX AMOUNT
                  cl.crew = getValuesConcLabor("Labor_Concrete", Array("Type Of Concrete Work"), Array[concWork], Array("Prep Guy", "Pumper", "Hose Carrier", "Pourers", "Finishers", "Cleaners", "Laborers", "Total"), dict("Max/Day"))
                  //GET THE CREW SIZE FOR THE REMAINDER
                  cl.remCrew = getValuesConcLabor("Labor_Concrete", Array("Type Of Concrete Work"), Array[concWork], Array("Prep Guy", "Pumper", "Hose Carrier", "Pourers", "Finishers", "Cleaners", "Laborers", "Total"), SF Mod dict("Max/Day"))
                  
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
      var dict = getValues("Wage_" + wageType + "_Conc", Array.Laborer, Array.Average, Array("Price/Day", "Price/Hr [OT]"))
      
      //2. CALCULATE COST OF LABORERS
      if (saturday = "No" Or saturday === "Yes - Option") {
            costOfConcLaborers.cost = Round((dict("Price/Day") * laborers) + 0.49)
      } else {
            costOfConcLaborers.cost = Round((dict("Price/Hr [OT]") * 8 * laborers) + 0.49)
      }
      
      //3. IF SATURDAY OPTION
      if (saturday === "Yes - Option") {
            costOfConcLaborers.costOption = Round((((dict("Price/Hr [OT]") * 8) - dict("Price/Day")) * laborers) + 0.49)
      } else {
            costOfConcLaborers.costOption = 0
      }

}
var costOfOvertimeConcLaborers = function(wageType, drivingTime, mobilizations) {
      //THIS SEEMS TO BE FOR ONE DRIVER
      var dict = getValues("Wage_" + wageType + "_Conc", Array.Laborer, Array.Average, Array("Price/Hr [OT]", "Price/Hr [DT]"))
      var wageOT = dict("Price/Hr [OT]")
      var wageDT = dict("Price/Hr [DT]")
 
      if (drivingTime > 4) {
            costOfOvertimeConcLaborers = (drivingTime - 4) * wageDT
            costOfOvertimeConcLaborers = costOfOvertimeConcLaborers + (4 * wageOT)
      } else {
            costOfOvertimeConcLaborers = drivingTime * wageOT
      }
      
      costOfOvertimeConcLaborers = costOfOvertimeConcLaborers * mobilizations
}
