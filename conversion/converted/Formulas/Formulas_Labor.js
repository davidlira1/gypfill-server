var gypLabor = function(wageType, structureType, SF, SFsm, gypThick, difficultyLevel, gypType, miles, overnight, saturday, estimate, overrideGypBarrelMix) {
      var labor = estimate.gyp.labor
      var dict, var dict2
      var tableName
      
      //1. SET METHOD. MIGHT BE CHANGED LATER IF VERY SMALL POUR
      labor.method = "Pump"
      
      //2. CALCULATE EXTRA LABORERS (DEPENDS OF DIFFICULTY LEVEL)
      dict = getValues("Gyp_DifficultyLevel", Array.Level, Array[difficultyLevel], Array("Extra Laborers"))
      labor.laborers.Extra Laborers = dict("Extra Laborers")

      var gypSqFt = SF
      if (SF > 15000) { //this way it will get the maximum crew for a day if more than 15000
            gypSqFt = 15000
      }
    
      //SMALL POUR
      if (SF <= 400 && overrideGypBarrelMix === "No") {
            dict = getValue2ParamsSmallPours("Labor_SmallPours", gypSqFt, gypThick, Array("Laborers", "Foam/Primer", "String Line", "Flagmen", "Pumper", "Bobcat", "Baggers", "Screeder", "Hose Pourer", "Hose Puller"))
            
            labor.method = dict.method
            labor.mobilizations = 1
            labor.laborers.Laborers = dict.Laborers + labor.laborers("Extra Laborers")
            labor.laborers.crew = dict
            labor.laborers.delete crew.Laborers
            dict = costOfGypLabor(wageType, (labor.laborers.Laborers), labor.mobilizations, saturday)
            labor.costOfGypLabor = dict.cost
            labor.costOfGypLaborOption = dict.costOption //related to saturday as an option
            //Flagmen (will be optional)
            dict = costOfGypLabor(wageType, (labor.laborers.crew.Flagmen), labor.mobilizations, saturday)
            labor.costOfGypFlagmenLabor = dict.cost
            //StringLine (will be optional)
            dict = costOfGypLabor(wageType, (labor.laborers.crew("String Line")), labor.mobilizations, saturday)
            labor.costOfGypStringLineLabor = dict.cost
    //HOUSE AND BIGGER THAN 900 SF
      } else if (structureType === "House") {
            if (SFsm === 0) {
                  tableName = "Labor_Houses_NoSM"
            } else {
                  tableName = "Labor_Houses_SM"
            }
            dict = getValuesBasedOnNum(tableName, gypSqFt, (Array("Laborers", "String Line", "Flagmen", "Foam/Primer", "Pumper", "Bobcat", "Baggers", "Screeder", "Hose Pourer", "Hose Puller")))
            
            labor.mobilizations = gypMobilizations(SF, "Normal")
            labor.laborers.Laborers = dict.Laborers + labor.laborers("Extra Laborers")
            labor.laborers.crew = dict
            labor.laborers.delete crew.Laborers
            dict = costOfGypLabor(wageType, (labor.laborers.Laborers), labor.mobilizations, saturday)
            labor.costOfGypLabor = dict.cost
            labor.costOfGypLaborOption = dict.costOption
            //Flagmen (will be optional)
            dict = costOfGypLabor(wageType, (labor.laborers.crew.Flagmen), labor.mobilizations, saturday)
            labor.costOfGypFlagmenLabor = dict.cost
            //StringLine (will be optional)
            dict = costOfGypLabor(wageType, (labor.laborers.crew("String Line")), labor.mobilizations, saturday)
            labor.costOfGypStringLineLabor = dict.cost
      //BUILDING
      } else if (structureType = "Building" Or structureType = "Multi-Building" Or structureType === "Unit") {
            if (SFsm === 0) {
                  tableName = "Labor_Buildings_NoSM"
            } else {
                  tableName = "Labor_Buildings_SM"
            }
            dict = getValuesBasedOnNum(tableName, gypSqFt, (Array("Laborers", "Flagmen", "Foam/Primer", "Pumper", "Bobcat", "Baggers", "Screeder", "Hose Pourer", "Hose Puller")))
            
            labor.mobilizations = gypMobilizations(SF, "Normal")
            labor.laborers.Laborers = dict.Laborers + labor.laborers("Extra Laborers")
            labor.laborers.crew = dict
            labor.laborers.delete crew.Laborers
            dict = costOfGypLabor(wageType, (labor.laborers.Laborers), labor.mobilizations, saturday)
            labor.costOfGypLabor = dict.cost
            labor.costOfGypLaborOption = dict.costOption
                  
            if (gypType === "CMD") {
                  labor.mobilizationsFlutes = gypMobilizations(SF, "CMD")
                  if (SF > 23000) {
                        gypSqFt = 23000
                  } else {
                        gypSqFt = 23000
                  }
                  dict = getValuesBasedOnNum("Labor_Buildings_CMDFlutes", gypSqFt, (Array("Laborers", "Flagmen", "Foam/Primer", "Pumper", "Bobcat", "Baggers", "Screeder", "Hose Pourer", "Hose Puller")))
                  labor.laborers.cmdLaborers = dict.Laborers + labor.laborers.extraLaborers
                  labor.laborers.cmdCrew = dict
                  labor.laborers.delete cmdCrew.Laborers
                  dict = costOfGypLabor(wageType, (labor.laborers.cmdLaborers), labor.mobilizationsFlutes, saturday)
                  labor.costOfGypLabor.cost = labor.costOfGypLabor.cost + dict.costOfGypLabor.cost
                  labor.costOfGypLabor.costOption = labor.costOfGypLabor.costOption + dict.costOfGypLabor.costOption
            }
      }
      
      //ONCE DISTANCE IS MORE THAN SPECIFIED miles in table, we give each guy, except for the drivers, 50 bucks for traveling both ways (25$ each way).
      dict = getValues("Prices_AfterMileThreshold", Array.Description, Array.Threshold, Array("Miles", "Price/Day"))
      if (miles > dict.Miles) {
            dict2 = getValues("Prices_AfterMileThreshold", Array.Description, Array("House Threshold"), Array.SF)
                  labor.costOfAfterMilesThreshold = ((labor.laborers.Laborers - 2) * labor.mobilizations * dict("Price/Day"))
                  if (gypType === "CMD") {
                        labor.costOfAfterMilesThreshold = labor.costOfAfterMilesThreshold + ((labor.laborers.Laborers - 2) * labor.mobilizationsFlutes * dict("Price/Day"))
                  }
      }
          
}
var gypMobilizations = function(SF, gypType) {
      var dict = getValues("Mobils_Gyp", Array.Type, Array[gypType], Array("SF/Day"))
      gypMobilizations = Round((SF / dict("SF/Day")) + 0.49)
}
var addMobilsCost = function(mobils, mobilCost, wageType) {
      addMobilsCost = {}
      var dict = getValues("Wage_" + wageType + "_Gyp", Array.Laborer, Array.Average, Array("Price/Day"))
      addMobilsCost.addMobilsCostProduction = mobils * dict("Price/Day") * 8
      addMobilsCost.addMobilsCostTotal = mobils * mobilCost
}
var costOfGypLabor = function(wageType, numOfLaborers, mobilizations, saturday) {
      costOfGypLabor = {}
      var dict = getValues("Wage_" + wageType + "_Gyp", Array.Laborer, Array.Average, Array("Price/Day", "Price/Hr [OT]"))
      var costOfLaborerPerDay
      
      //1. GET PRICE/DAY FOR LABORER
      //===========================================================================
            //REGULAR WAGE
            if (saturday = "No" Or saturday === "Yes - Option") {
                  costOfLaborerPerDay = dict("Price/Day")
            
            //OVERTIME WAGE
            } else if (saturday === "Yes") {
                  costOfLaborerPerDay = dict("Price/Hr [OT]") * 8
                        
            }
      //===========================================================================
      
      //2. CALCULATE COST OF GYP LABOR
      costOfGypLabor.cost = costOfLaborerPerDay * numOfLaborers * mobilizations
      
      //3. IF OPTION, CALCULATE OPTION COST
      if (saturday === "Yes - Option") {
            costOfGypLabor.costOption = ((dict("Price/Hr [OT]") * 8) - dict("Price/Day")) * numOfLaborers * mobilizations
      } else {
            costOfGypLabor.costOption = 0
      }
      
}
var costOfGypPrePourLabor = function(wageType, numOfLaborers) {
            
}
var overTimeGypLabor = function(wageType, mobilizations, numOfLaborers, drivingTime, cleanSetTime, equip, structures, totalGypBags, overnight) {
      overTimeGypLabor = {}
      var dict
      var pump = equip.pump
      var totalGypTimeWOutDriving
      var overTimeHrsWOutDriving
      var overTimeHrsDriving
      var costOfOverTimeGypLaborCrew
      var costOfOverTimeGypLaborDrivers
      
      //==========================================================================================
      //IF ONE MOBILIZATION
      //==========================================================================================
      if (mobilizations === 1) {
            //1. CALCULATE TOTAL GYP TIME WITH OUT DRIVING
            totalGypTimeWOutDriving = cleanSetTime.setupTime + (equip.pumpTime[pump]) + cleanSetTime.cleanupTime
            
            //2. CACULATE OVER TIME HOURS WITHOUT DRIVING
            overTimeHrsWOutDriving = overTimeGyp[totalGypTimeWOutDriving]
            
            //3. COST OF OVERTIME FOR CREW
            costOfOverTimeGypLaborCrew = costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving, numOfLaborers)
            //__________________________________________________________________________________________
            //4. CALCULATE OVERTIME HOURS FOR DRIVING
            if (totalGypTimeWOutDriving > 7.5) {
                  overTimeHrsDriving = drivingTime
                  //IF OVERNIGHT IS TRUE, THEN IT//S FINE
                  costOfOverTimeGypLaborDrivers = costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving + overTimeHrsDriving, 2) - costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving, 2)
            } else {
                  //IF REACHES HERE, CREW RECEIVED NO OVERTIME
                  if ((7.5 - totalGypTimeWOutDriving - drivingTime) < 0) {
                        overTimeHrsDriving = (7.5 - totalGypTimeWOutDriving - drivingTime) * -1
                        if (overnight === true) {
                              overTimeHrsDriving = (overTimeHrsDriving - (drivingTime / 2)) + drivingTime / 2
                        }
                        costOfOverTimeGypLaborDrivers = costOfOverTimeGypLaborHelper(wageType, overTimeHrsDriving, 2)
                  } else {
                  //IF REACHES HERE, NO ONE RECEIVED ANY OVERTIME
                        overTimeHrsDriving = 0
                        costOfOverTimeGypLaborDrivers = 0
                  }
            }
            //__________________________________________________________________________________________
      } else {
            //COUNT NUMBER OF FLOORS
        var numOfFloors
            for(s in structures) {
                  for(gA in structures[s].gypAssemblies) {
                        numOfFloors = numOfFloors + structures[s].gypAssemblies[gA].floors.count
                  }
            }
            
            //==========================================================================================
            //IF NUMBER OF FLOORS EQUALS MOBILIZATIONS
            //==========================================================================================
            if (numOfFloors === mobilizations) {
            for(s in structures) {
                  for(gA in structures[s].gypAssemblies) {
                        for(f in structures[s].gypAssemblies[gA].floors) {
                              //1. CALCULATE PUMP TIME FOR THIS FLOOR
                              dict = pumpTime((structures[s].gypAssemblies[gA].floors[f].gypBags))
                              //__________________________________________________________________________________________
                              //2. CALCULATE TOTAL GYP TIME WITHOUT DRIVING
                              totalGypTimeWOutDriving = cleanSetTime.setupTime + dict[pump] + cleanSetTime.cleanupTime
                              
                              //3. CALCULATE OVER TIME HOURS WITHOUT DRIVING
                              overTimeHrsWOutDriving = overTimeHrsWOutDriving + overTimeGyp[totalGypTimeWOutDriving]
                              
                              //4. CALCULATE COST OF OVER TIME WITHOUT DRIVING (FOR WHOLE CREW)
                              costOfOverTimeGypLabor = costOfOverTimeGypLabor + costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving, numOfLaborers)
                              //__________________________________________________________________________________________
                              //5. CALCULATE OVERTIME HOURS FOR DRIVING
                              if (totalGypTimeWOutDriving > 7.5) {
                                    overTimeHrsDriving = drivingTime
                                    costOfOverTimeGypLaborDrivers = costOfOverTimeGypLaborDrivers + costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving + overTimeHrsDriving, 2) - costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving, 2)
                              } else {
                                    //IF REACHES HERE, CREW RECEIVED NO OVERTIME
                                    if ((7.5 - totalGypTimeWOutDriving - drivingTime) < 0) {
                                          overTimeHrsDriving = (7.5 - totalGypTimeWOutDriving - drivingTime) * -1
                                          if (overnight === true) {
                                                overTimeHrsDriving = (overTimeHrsDriving - (drivingTime / 2)) + drivingTime / 2
                                          }
                                          costOfOverTimeGypLaborDrivers = costOfOverTimeGypLaborDrivers + costOfOverTimeGypLaborHelper(wageType, overTimeHrsDriving, 2)
                                    } else {
                                    //IF REACHES HERE, NO ONE RECEIVED ANY OVERTIME
                                          overTimeHrsDriving = 0
                                          costOfOverTimeGypLaborDrivers = costOfOverTimeGypLaborDrivers + 0
                                    }
                              }
                              //__________________________________________________________________________________________
                        }
                  }
            }
            
            //==========================================================================================
            //ELSE GET THE AVERAGE
            //==========================================================================================
            } else {
//                  //1. CALCULATE AVERAGE SF PER FLOOR
//                  var averagePerFloor
//                  averagePerFloor = Round((totalSF / mobilizations) + 0.49)
                  
                  //1. CALCULATE AVERAGE BAGS PER FLOOR
                  var averageBags
                  averageBags = Round((totalGypBags / mobilizations) + 0.49)
                  
                  //3. CALCULATE PUMP TIME
                  dict = pumpTime[averageBags]
                  //__________________________________________________________________________________________
                  //4. CALCULATE TOTAL GYP TIME WITHOUT DRIVING
                  totalGypTimeWOutDriving = cleanSetTime.setupTime + dict[pump] + cleanSetTime.cleanupTime
                  
                  //5. CALCULATE OVER TIME HOURS WITHOUT DRIVING
                  overTimeHrsWOutDriving = overTimeGyp[totalGypTimeWOutDriving]
                  
                  //6. CALCULATE COST OF OVER TIME WITHOUT DRIVING (FOR WHOLE CREW)
                  costOfOverTimeGypLaborCrew = costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving, numOfLaborers)
                   //__________________________________________________________________________________________
                  //4. CALCULATE OVERTIME HOURS FOR DRIVING
                  if (totalGypTimeWOutDriving > 7.5) {
                        overTimeHrsDriving = drivingTime
                        costOfOverTimeGypLaborDrivers = costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving + overTimeHrsDriving, 2) - costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving, 2)
                  } else {
                        //IF REACHES HERE, CREW RECEIVED NO OVERTIME
                        if ((7.5 - totalGypTimeWOutDriving - drivingTime) < 0) {
                              overTimeHrsDriving = (7.5 - totalGypTimeWOutDriving - drivingTime) * -1
                              if (overnight === true) {
                                    overTimeHrsDriving = (overTimeHrsDriving - (drivingTime / 2)) + drivingTime / 2
                              }
                              costOfOverTimeGypLaborDrivers = costOfOverTimeGypLaborHelper(wageType, overTimeHrsDriving, 2)
                        } else {
                        //IF REACHES HERE, NO ONE RECEIVED ANY OVERTIME
                              overTimeHrsDriving = 0
                              costOfOverTimeGypLaborDrivers = 0
                        }
                  }
                  
                  overTimeHrsWOutDriving = overTimeHrsWOutDriving * mobilizations
                  costOfOverTimeGypLaborCrew = costOfOverTimeGypLaborCrew * mobilizations
                  overTimeHrsDriving = overTimeHrsDriving * mobilizations
                  costOfOverTimeGypLaborDrivers = costOfOverTimeGypLaborDrivers * mobilizations
                  
            }
      }
      
      //1. PLACE OVERTIME HOURS WITHOUT DRIVING IN DICTIONARY
      overTimeGypLabor.overTimeHrsWOutDriving = overTimeHrsWOutDriving
      
      //2. PLACE COST OF OVERTIME HOURS WITHOUT DRIVING IN DICTIONARY
      overTimeGypLabor.costOfOverTimeGypLaborCrew = costOfOverTimeGypLaborCrew
      
      //3. PLACE OVERTIME HOURS WITH DRIVING IN DICTIONARY
      overTimeGypLabor.overTimeHrsDriving = overTimeHrsDriving
            
      //4. PLACE COST OF OVERTIME HOURS WITH DRIVING IN DICTIONARY
      overTimeGypLabor.costOfOverTimeGypLaborDrivers = costOfOverTimeGypLaborDrivers
    
}
var costOfOverTimeGypLaborHelper = function(wageType, overTimeHrs, numOfLaborers) {
      if (overTimeHrs > 0) {
            if (overTimeHrs > 4) {
                  costOfOverTimeGypLaborHelper = costOfOverTimeGypLaborHelper + (4 * overTimeRate("Gyp", wageType, 1) * numOfLaborers) //this will be regular OT
                  costOfOverTimeGypLaborHelper = costOfOverTimeGypLaborHelper + ((overTimeHrs - 4) * overTimeRate("Gyp", wageType, overTimeHrs) * numOfLaborers) //this will be DT
            } else {
                  costOfOverTimeGypLaborHelper = costOfOverTimeGypLaborHelper + (overTimeHrs * overTimeRate("Gyp", wageType, 1) * numOfLaborers)
            }
      }
}
var costOfOverTimeSoundMatLabor = function(wageType, mobilizations, drivingTime, overnight) {
      //number of sound mat mobilizations is equal to gyp mobilizations
      //only the 1 driver will get overtime
      if (overnight === true) {
            costOfOverTimeSoundMatLabor = 0
            Exit Function
      }
      if (drivingTime > 4) {
            costOfOverTimeSoundMatLabor = overTimeRate("SM", wageType, 1) * 4
            costOfOverTimeSoundMatLabor = overTimeRate("SM", wageType, drivingTime) * drivingTime //the hours after 4 hours
      } else {
            costOfOverTimeSoundMatLabor = overTimeRate("SM", wageType, drivingTime)
      }
      
      costOfOverTimeSoundMatLabor = costOfOverTimeSoundMatLabor * mobilizations
}
var overTimeRate = function(material, wageType, overTimeHrs) {
      var typeOfOverTime
      if (overTimeHrs <= 4) {
            typeOfOverTime = "Price/Hr [OT]"
      } else if (overTimeHrs > 4) {
            typeOfOverTime = "Price/Hr [DT]"
      }
    
      var dict = getValues("Wage_" + wageType + "_" + material, Array.Laborer, Array.Average, Array[typeOfOverTime])
      overTimeRate = dict[typeOfOverTime]
}
