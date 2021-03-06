const lb = require('../library.js');

module.exports.gypLabor = function(wageType, structureType, SF, SFsm, gypThick, difficultyLevel, gypType, miles, overnight, saturday, estimate, overrideGypBarrelMix) {
      var labor = estimate.gyp.labor;
      var dict, dict2;
      var tableName;
      
      //1. SET METHOD. CHANGED LATER IF VERY SMALL POUR
      labor.method = "Pump";
      
      //2. CALCULATE EXTRA LABORERS (DEPENDS OF DIFFICULTY LEVEL)
      dict = lb.getValues("Gyp_DifficultyLevel", {"Level": difficultyLevel}, ["Extra Laborers"]);
      labor.laborers["Extra Laborers"] = dict["Extra Laborers"];

      var gypSqFt = SF > 15000 ? 15000 : SF; //this way it will get the maximum crew for a day if more than 15000

      //SMALL POUR
      if (SF <= 400 && overrideGypBarrelMix === "No") {
            dict = lb.getValuesBasedOnNum("Labor_SmallPours", gypSqFt, ["Laborers", "Foam/Primer", "String Line", "Flagmen", "Pumper", "Bobcat", "Baggers", "Screeder", "Hose Pourer", "Hose Puller"]);
            
            labor.method = "Barrel";
            labor.mobilizations = 1;
            labor.laborers.Laborers = dict.Laborers + labor.laborers["Extra Laborers"];
            labor.laborers.crew = dict;
            delete labor.laborers.crew.Laborers;
            dict = lb.costOfGypLabor(wageType, labor.laborers.Laborers, labor.mobilizations, saturday);
            labor.costOfGypLabor = dict.cost;
            labor.costOfGypLaborOption = dict.costOption; //related to saturday as an option
            //Flagmen (will be optional)
            dict = lb.costOfGypLabor(wageType, labor.laborers.crew.Flagmen, labor.mobilizations, saturday);
            labor.costOfGypFlagmenLabor = dict.cost;
            //StringLine (will be optional)
            dict = lb.costOfGypLabor(wageType, labor.laborers.crew["String Line"], labor.mobilizations, saturday);
            labor.costOfGypStringLineLabor = dict.cost;
    //HOUSE AND BIGGER THAN 900 SF
      } else if (structureType === "House") {
            tableName = SFsm === 0 ? "Labor_Houses_NoSM" : "Labor_Houses_SM";
            
            dict = lb.getValuesBasedOnNum(tableName, gypSqFt, ["Laborers", "String Line", "Flagmen", "Foam/Primer", "Pumper", "Bobcat", "Baggers", "Screeder", "Hose Pourer", "Hose Puller"]);
            
            labor.mobilizations = lb.gypMobilizations(SF, "Normal");
            labor.laborers.Laborers = dict.Laborers + labor.laborers["Extra Laborers"];
            labor.laborers.crew = dict;
            delete labor.laborers.crew.Laborers;
            dict = lb.costOfGypLabor(wageType, labor.laborers.Laborers, labor.mobilizations, saturday);
            labor.costOfGypLabor = dict.cost;
            labor.costOfGypLaborOption = dict.costOption;
            //Flagmen (will be optional)
            dict = lb.costOfGypLabor(wageType, labor.laborers.crew.Flagmen, labor.mobilizations, saturday);
            labor.costOfGypFlagmenLabor = dict.cost;
            //StringLine (will be optional)
            dict = lb.costOfGypLabor(wageType, labor.laborers.crew["String Line"], labor.mobilizations, saturday);
            labor.costOfGypStringLineLabor = dict.cost;
      //BUILDING
      } else {
            tableName = SFsm === 0 ? "Labor_Buildings_NoSM" : "Labor_Buildings_SM";

            dict = lb.getValuesBasedOnNum(tableName, gypSqFt, ["Laborers", "Flagmen", "Foam/Primer", "Pumper", "Bobcat", "Baggers", "Screeder", "Hose Pourer", "Hose Puller"]);
            
            labor.mobilizations = lb.gypMobilizations(SF, "Normal");
            labor.laborers.Laborers = dict.Laborers + labor.laborers["Extra Laborers"];
            labor.laborers.crew = dict;
            delete labor.laborers.crew.Laborers;
            dict = lb.costOfGypLabor(wageType, labor.laborers.Laborers, labor.mobilizations, saturday);
            labor.costOfGypLabor = dict.cost;
            labor.costOfGypLaborOption = dict.costOption;
                  
            if (gypType === "CMD") {
                  labor.mobilizationsFlutes = lb.gypMobilizations(SF, "CMD");
                  gypSfFt = SF > 23000 ? 23000 : SF;

                  dict = lb.getValuesBasedOnNum("Labor_Buildings_CMDFlutes", gypSqFt, ["Laborers", "Flagmen", "Foam/Primer", "Pumper", "Bobcat", "Baggers", "Screeder", "Hose Pourer", "Hose Puller"]);
                  labor.laborers.cmdLaborers = dict.Laborers + labor.laborers.extraLaborers;
                  labor.laborers.cmdCrew = dict;
                  delete labor.laborers.cmdCrew.Laborers;
                  dict = lb.costOfGypLabor(wageType, labor.laborers.cmdLaborers, labor.mobilizationsFlutes, saturday);
                  labor.costOfGypLabor.cost = labor.costOfGypLabor.cost + dict.costOfGypLabor.cost;
                  labor.costOfGypLabor.costOption = labor.costOfGypLabor.costOption + dict.costOfGypLabor.costOption;
            }
      }
      
      //ONCE DISTANCE IS MORE THAN SPECIFIED miles in table, we give each guy, except for the drivers, 50 bucks for traveling both ways (25$ each way).
      dict = lb.getValues("Prices_AfterMileThreshold", {"Description": "Threshold"}, ["Miles", "Price/Day"]);
      if (miles > dict.Miles) {
            dict2 = lb.getValues("Prices_AfterMileThreshold", {"Description": "House Threshold"}, [SF]);
                  labor.costOfAfterMilesThreshold = ((labor.laborers.Laborers - 2) * labor.mobilizations * dict["Price/Day"]);
                  if (gypType === "CMD") {
                        labor.costOfAfterMilesThreshold = labor.costOfAfterMilesThreshold + ((labor.laborers.Laborers - 2) * labor.mobilizationsFlutes * dict["Price/Day"]);
                  }
      }      
}
module.exports.gypMobilizations = function(SF, gypType) {
      var dict = lb.getValues("Mobils_Gyp", {"Type": gypType}, ["SF/Day"]);
      return Math.ceil(SF / dict["SF/Day"]);
}

module.exports.addMobilsCost = function(mobils, mobilCost, wageType) {
      var dict = lb.getValues("Wage_" + wageType + "_Gyp", {"Laborer": "Average"}, ["Price/Day"]);
      
      return {
            addMobilsCostProduction: Math.ceil(mobils * dict["Price/Day"] * 8),
            addMobilsCostTotal: mobils * mobilCost
      };
}

module.exports.costOfGypLabor = function(wageType, numOfLaborers, mobilizations, saturday) {
      var costOfGypLabor = {};
      var dict = lb.getValues("Wage_" + wageType + "_Gyp", {"Laborer": "Average"}, ["Price/Day", "Price/Hr (OT)"]);
      var costOfLaborerPerDay;
      
      //1. GET PRICE/DAY FOR LABORER
      //===========================================================================
      //REGULAR WAGE
      if (saturday === "No" || saturday === "Yes - Option") {
            costOfLaborerPerDay = dict["Price/Day"];

      //OVERTIME WAGE
      } else if (saturday === "Yes") {
            costOfLaborerPerDay = dict["Price/Hr (OT)"] * 8;         
      }
      //===========================================================================
      //2. CALCULATE COST OF GYP LABOR
      costOfGypLabor.cost = Math.ceil(costOfLaborerPerDay * numOfLaborers * mobilizations);
      
      //3. IF OPTION, CALCULATE OPTION COST
      if (saturday === "Yes - Option") {
            costOfGypLabor.costOption = Math.ceil(((dict["Price/Hr (OT)"] * 8) - dict["Price/Day"]) * numOfLaborers * mobilizations);
      } else {
            costOfGypLabor.costOption = 0;
      }
      //===========================================================================
      return costOfGypLabor;
}

module.exports.overTimeGypLabor = function(wageType, mobilizations, numOfLaborers, drivingTime, cleanSetTime, equip, structures, totalGypBags, overnight) {
      var overTimeGypLabor = {};
      var dict;
      var pump = equip.pump;
      var totalGypTimeWOutDriving;
      var overTimeHrsWOutDriving;
      var overTimeHrsDriving;
      var costOfOverTimeGypLaborCrew;
      var costOfOverTimeGypLaborDrivers;
      
      //==========================================================================================
      //IF ONE MOBILIZATION
      //==========================================================================================
      if (mobilizations === 1) {
            //1. CALCULATE TOTAL GYP TIME WITHOUT DRIVING
            totalGypTimeWOutDriving = cleanSetTime.setupTime + equip.pumpTime[pump] + cleanSetTime.cleanupTime;
            
            //2. CACULATE OVER TIME HOURS WITHOUT DRIVING
            overTimeHrsWOutDriving = lb.overTimeGyp(totalGypTimeWOutDriving);
            
            //3. COST OF OVERTIME FOR CREW
            costOfOverTimeGypLaborCrew = lb.costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving, numOfLaborers);
            //__________________________________________________________________________________________
            //4. CALCULATE OVERTIME HOURS FOR DRIVING
            if (totalGypTimeWOutDriving > 7.5) {
                  overTimeHrsDriving = drivingTime;
                  //IF OVERNIGHT IS TRUE, THEN IT//S FINE
                  costOfOverTimeGypLaborDrivers = lb.costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving + overTimeHrsDriving, 2) - costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving, 2);
            } else {
                  //IF REACHES HERE, CREW RECEIVED NO OVERTIME
                  if ((7.5 - totalGypTimeWOutDriving - drivingTime) < 0) {
                        overTimeHrsDriving = (7.5 - totalGypTimeWOutDriving - drivingTime) * -1;
                        if (overnight === true) {
                              overTimeHrsDriving = (overTimeHrsDriving - (drivingTime / 2)) + drivingTime / 2;
                        }
                        costOfOverTimeGypLaborDrivers = lb.costOfOverTimeGypLaborHelper(wageType, overTimeHrsDriving, 2);
                  } else {
                  //IF REACHES HERE, NO ONE RECEIVED ANY OVERTIME
                        overTimeHrsDriving = 0;
                        costOfOverTimeGypLaborDrivers = 0;
                  }
            }
            //__________________________________________________________________________________________
      } else {
            //COUNT NUMBER OF FLOORS
        var numOfFloors = 0;
            for(s in structures) {
                  for(gA in structures[s].gypAssemblies) {
                        numOfFloors+= Object.keys(structures[s].gypAssemblies[gA].floors).length;
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
                              dict = lb.pumpTime((structures[s].gypAssemblies[gA].floors[f].gypBags));
                              //__________________________________________________________________________________________
                              //2. CALCULATE TOTAL GYP TIME WITHOUT DRIVING
                              totalGypTimeWOutDriving = cleanSetTime.setupTime + dict[pump] + cleanSetTime.cleanupTime;
                              
                              //3. CALCULATE OVER TIME HOURS WITHOUT DRIVING
                              overTimeHrsWOutDriving = overTimeHrsWOutDriving + overTimeGyp[totalGypTimeWOutDriving];
                              
                              //4. CALCULATE COST OF OVER TIME WITHOUT DRIVING (FOR WHOLE CREW)
                              costOfOverTimeGypLabor = costOfOverTimeGypLabor + lb.costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving, numOfLaborers);
                              //__________________________________________________________________________________________
                              //5. CALCULATE OVERTIME HOURS FOR DRIVING
                              if (totalGypTimeWOutDriving > 7.5) {
                                    overTimeHrsDriving = drivingTime;
                                    costOfOverTimeGypLaborDrivers = costOfOverTimeGypLaborDrivers + lb.costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving + overTimeHrsDriving, 2) - lb.costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving, 2)
                              } else {
                                    //IF REACHES HERE, CREW RECEIVED NO OVERTIME
                                    if ((7.5 - totalGypTimeWOutDriving - drivingTime) < 0) {
                                          overTimeHrsDriving = (7.5 - totalGypTimeWOutDriving - drivingTime) * -1
                                          if (overnight === true) {
                                                overTimeHrsDriving = (overTimeHrsDriving - (drivingTime / 2)) + drivingTime / 2;
                                          }
                                          costOfOverTimeGypLaborDrivers = costOfOverTimeGypLaborDrivers + lb.costOfOverTimeGypLaborHelper(wageType, overTimeHrsDriving, 2)
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
                  var averageBags = Math.ceil(totalGypBags / mobilizations);
                  
                  //3. CALCULATE PUMP TIME
                  dict = lb.pumpTime(averageBags);
                  //__________________________________________________________________________________________
                  //4. CALCULATE TOTAL GYP TIME WITHOUT DRIVING
                  totalGypTimeWOutDriving = cleanSetTime.setupTime + dict[pump] + cleanSetTime.cleanupTime;
                  
                  //5. CALCULATE OVER TIME HOURS WITHOUT DRIVING
                  overTimeHrsWOutDriving = lb.overTimeGyp(totalGypTimeWOutDriving);
                  
                  //6. CALCULATE COST OF OVER TIME WITHOUT DRIVING (FOR WHOLE CREW)
                  costOfOverTimeGypLaborCrew = lb.costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving, numOfLaborers)
                   //__________________________________________________________________________________________
                  //4. CALCULATE OVERTIME HOURS FOR DRIVING
                  if (totalGypTimeWOutDriving > 7.5) {
                        overTimeHrsDriving = drivingTime;
                        costOfOverTimeGypLaborDrivers = lb.costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving + overTimeHrsDriving, 2) - costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving, 2)
                  } else {
                        //IF REACHES HERE, CREW RECEIVED NO OVERTIME
                        if ((7.5 - totalGypTimeWOutDriving - drivingTime) < 0) {
                              overTimeHrsDriving = (7.5 - totalGypTimeWOutDriving - drivingTime) * -1;
                              if (overnight === true) {
                                    overTimeHrsDriving = (overTimeHrsDriving - (drivingTime / 2)) + drivingTime / 2;
                              }
                              costOfOverTimeGypLaborDrivers = lb.costOfOverTimeGypLaborHelper(wageType, overTimeHrsDriving, 2)
                        } else {
                        //IF REACHES HERE, NO ONE RECEIVED ANY OVERTIME
                              overTimeHrsDriving = 0
                              costOfOverTimeGypLaborDrivers = 0
                        }
                  }
                  
                  overTimeHrsWOutDriving = overTimeHrsWOutDriving * mobilizations;
                  costOfOverTimeGypLaborCrew = costOfOverTimeGypLaborCrew * mobilizations;
                  overTimeHrsDriving = overTimeHrsDriving * mobilizations;
                  costOfOverTimeGypLaborDrivers = costOfOverTimeGypLaborDrivers * mobilizations;
                  
            }
      }
      
      //1. PLACE OVERTIME HOURS WITHOUT DRIVING IN DICTIONARY
      overTimeGypLabor.overTimeHrsWOutDriving = overTimeHrsWOutDriving;
      
      //2. PLACE COST OF OVERTIME HOURS WITHOUT DRIVING IN DICTIONARY
      overTimeGypLabor.costOfOverTimeGypLaborCrew = costOfOverTimeGypLaborCrew;
      
      //3. PLACE OVERTIME HOURS WITH DRIVING IN DICTIONARY
      overTimeGypLabor.overTimeHrsDriving = lb.rndDec(overTimeHrsDriving);
            
      //4. PLACE COST OF OVERTIME HOURS WITH DRIVING IN DICTIONARY
      overTimeGypLabor.costOfOverTimeGypLaborDrivers = costOfOverTimeGypLaborDrivers;
    
      return overTimeGypLabor;
}
module.exports.costOfOverTimeGypLaborHelper = function(wageType, overTimeHrs, numOfLaborers) {
      var cost = 0;
      if (overTimeHrs > 0) {
            if (overTimeHrs > 4) {
                  cost = (4 * lb.overTimeRate("Gyp", wageType, 1) * numOfLaborers) //this will be regular OT
                  cost+= ((overTimeHrs - 4) * lb.overTimeRate("Gyp", wageType, overTimeHrs) * numOfLaborers) //this will be DT
            } else {
                  cost = (overTimeHrs * lb.overTimeRate("Gyp", wageType, 1) * numOfLaborers)
            }
      }
      return Math.ceil(cost);
}
module.exports.costOfOverTimeSoundMatLabor = function(wageType, mobilizations, drivingTime, overnight) {
      //number of sound mat mobilizations is equal to gyp mobilizations
      //only the 1 driver will get overtime
      var cost = 0;
      if (overnight === true) {
            return 0;
      }
      if (drivingTime > 4) {
            cost = lb.overTimeRate("SM", wageType, 1) * 4;
            cost+= lb.overTimeRate("SM", wageType, drivingTime) * drivingTime; //the hours after 4 hours
      } else {
            cost = lb.overTimeRate("SM", wageType, drivingTime)
      }
      
      return Math.ceil(cost * mobilizations);
}
module.exports.overTimeRate = function(material, wageType, overTimeHrs) {
      var typeOfOverTime;
      if (overTimeHrs <= 4) {
            typeOfOverTime = "Price/Hr (OT)";
      } else if (overTimeHrs > 4) {
            typeOfOverTime = "Price/Hr (DT)";
      }
    
      var dict = lb.getValues("Wage_" + wageType + "_" + material, {"Laborer": "Average"}, [typeOfOverTime]);
      return dict[typeOfOverTime];
}
