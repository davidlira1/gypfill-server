const lb = require('../library.js');

module.exports.calcGyp = function(projData, estimateVersion) {
      //1. SET THE ESTIMATE VERSION OBJECT
      var estimate = projData.estimates["estimate" + estimateVersion];
      
      //2. SET VARIABLES FOR EASIER ACCESS
      var projectType = projData.projectInfo.projectType; //House, Building, Multi-Building, Unit, Commercial, Industrial
      if (projectType === "Unit" || projectType === "Commercial" || projectType === "Industrial") {
            projectType = "Building";
      }
      var wageType = projData.projectInfo.wageType; //Non-Prevailing, Prevailing
      var mixDesign = estimate.gyp.mixDesign; //0, 1.4
      var overnight = false;
      var saturdayGyp = estimate.saturday.gyp;
      var saturdayConc = estimate.saturday.conc;
      var city = projData.projectInfo.city;
      var zipCode = Number(projData.projectInfo.zipCode); //!!!
      var concPumpCostOption = estimate.conc.concPumpCostOption;
      var totalGypSF = estimate.totals.gypSF;
      var totalGypSFWithSoundMat = estimate.totals.gypSFWithSoundMat;
      var overrideGypBarrelMix = estimate.gyp.overrideGypBarrelMix;
      var overrideConcBarrelMix = estimate.gyp.overrideConcBarrelMix;

      var assem, f, assemOption, prePours, aduReg;
      var dict;
      //==========================================================================================
      var gypExists = false;
      if (estimate.structures.structure1.gypAssemblies.gypAssem1) {
            gypExists = true;
      }

      var concExists = false;
      if (estimate.structures.structure1.concAssemblies.concAssem1) {
            if (estimate.structures.structure1.concAssemblies.concAssem1.contractOrOption === "Contract") {
                  concExists = true;
            }
      }
      //==========================================================================================
      //DRIVING
      //==========================================================================================
      //1. ADD DISTANCE  DICTIONARY
      estimate.distance = lb.distance(zipCode, city);
      var miles = estimate.distance["Van Nuys"];
      
      //2. ADD DRIVING TIME TO TRUCK DICTIONARY (ROUND TRIP at 55mph)
      estimate.trucks.drivingTime = lb.drivingTime(miles);
      var drivingTimeHrs = estimate.trucks.drivingTime;
      
      //3. DETERMINE IF OVERNIGHT
      if (gypExists === true) {
            dict = lb.getValues("Prices_PerDiem", {"Per Diem": "Default"}, ["Miles Threshold"]);
            //the assumption is it must be a certain minimum distance and must have soundmat
            //what if it is only gyp though? good question for Tamir. but let//s study this first.
            if (miles > dict["Miles Threshold"] && estimate.totals.gypSFWithSoundMat !== 0) {
                  overnight = true;
            }
      }
      //==========================================================================================
      //SIZE
      //==========================================================================================
      if (gypExists === true) {
            if (totalGypSF <= 400) {
                  estimate.gyp.size = "Small Pour";
            } else {
                  estimate.gyp.size = "Normal";
            }
      }
      //==========================================================================================
      //GYPCRETE LABOR    
      //==========================================================================================
      if (gypExists === true) {
            var gypThick1stAssem = estimate.structures.structure1.gypAssemblies.gypAssem1.gypThick;
            var difficultyLevel = estimate.gyp.difficultyLevel;
            var gypType = estimate.structures.structure1.gypAssemblies.gypAssem1.gypType;
      
            if (estimate.totals.gypSFWithSoundMat > 0 && estimate.totals.gypSFWithSoundMat <= 4000) {
                  estimate.gyp.sameDay = "Yes";
            } else {
                  estimate.gyp.sameDay = "No";
            }
            
            var sameDay = estimate.gyp.sameDay;
      
            lb.gypLabor(wageType, projectType, totalGypSF, totalGypSFWithSoundMat, gypThick1stAssem, difficultyLevel, gypType, miles, overnight, saturdayGyp, estimate, overrideGypBarrelMix);
            estimate.totals.gypCostAfterMilesThreshold = estimate.gyp.labor.costOfAfterMilesThreshold; //more will be added later
            estimate.gyp.labor.mobilizationsSoundMat = lb.gypMobilizations(estimate.totals.gypSFWithSoundMat, "Normal");
            dict = lb.addMobilsCost(estimate.gyp.labor.addMobils.mobils, estimate.gyp.labor.addMobils.mobilCost, wageType);
            estimate.gyp.labor.addMobils.addMobilsCost = dict.addMobilsCostTotal;
            estimate.gyp.labor.addMobils.enabled = false;
            estimate.totals.gypCostAddMobilsProduction = dict.addMobilsCostProduction;
            estimate.totals.gypCostAddMobilsTotal = dict.addMobilsCostTotal;
            estimate.totals.gypCostSaturdayOption = estimate.gyp.labor.costOfGypLaborOption; //more will be added later
      }
      //==========================================================================================                                                                                                   
      //CALCULATE MATERIALS AND LABOR FOR GYPCRETE AND CONCRETE
      //==========================================================================================
      //LOOP OVER EACH STRUCTURE
      //==========================================================================================
      var totals = estimate.totals;
      for(structure in estimate.structures) {
            //==========================================================================================
            // LOOP OVER EACH GYP ASSEM
            //==========================================================================================
            for(gypAssem in estimate.structures[structure].gypAssemblies) {

                  //1. SET ASSEM VARIABLE FOR EASIER ACCESS
                  assem = estimate.structures[structure].gypAssemblies[gypAssem];
                  
                  //2. CALCULATE MATERIALS AND LABOR COSTS FOR ASSEMBLY
                  lb.calculateGypAssembly(estimate, assem, mixDesign, wageType, sameDay, overnight, miles, projectType, saturdayGyp);
                  
                  //3. LOOP OVER EACH FLOOR
                  for(Floor in estimate.structures[structure].gypAssemblies[gypAssem].floors) {
                      //1. SET F VARIABLE FOR EASIER ACCESS
                      f = estimate.structures[structure].gypAssemblies[gypAssem].floors[Floor]
                      //2. CALCULATE MATERIALS AND COSTS FOR FLOOR
                      lb.materialsAndCostsGyp (f, assem, mixDesign, wageType, projectType, saturdayGyp);
                  }
                  
                  //4. LOOP OVER EACH OPTION
                  for(opt in estimate.structures[structure].gypAssemblies[gypAssem].options) {
                      //1. SET assemOption VARIABLE FOR EASIER ACCESS
                      assemOption = estimate.structures[structure].gypAssemblies[gypAssem].options[opt];
                      //2. CALCULATE MATERIALS AND COSTS FOR FLOOR
                      lb.calculateGypAssembly(estimate, assemOption, mixDesign, wageType, sameDay, overnight, miles, projectType, saturdayGyp);
                      //3. CALCULATE DIFFERENCE BETWEEN OPTION ASSEMBLY AND REGULAR ASSEMBLY
                      assemOption.difference = assemOption.gypAssemCost - assem.gypAssemCost;
                  }
           
                  //6. TOTAL GYP BAGS, ADD TO IT THE AMOUNT OF GYP BAGS
                  totals.gypBags = lb.sum([totals.gypBags, assem.gypBags]);
                  
                  //7. TOTAL TONS, ADD TO IT THE AMOUNT OF TONS
                  totals.gypTons = lb.sum([totals.gypTons, assem.tons]);

                  //8. TOTAL GYP ASSEMBLIES COST, ADD TO IT THIS GYP ASSEMBLY COST
                  totals.gypCostAssemsMaterialAndLabor = lb.sum([totals.gypCostAssemsMaterialAndLabor, assem.gypAssemCost]);
                  
                  //PER DIEM
                  totals.gypCostPerDiem = lb.sum([totals.gypCostPerDiem, assem.costOfPerDiem]);
                  
                  //AFTER MILES THRESHOLD
                  totals.gypCostAfterMilesThreshold = lb.sum([totals.gypCostAfterMilesThreshold, assem.costAfterMilesThresholdSoundMat]);
                  
                  //SATURDAY COST
                  totals.gypCostSaturdayOption = lb.sum([totals.gypCostSaturdayOption, assem.costOfTonsOption]);
            }
            //==========================================================================================
            //PREPOURS
            //==========================================================================================
            if (estimate.structures[structure].prePours.tubs !== 0) {
                  prePours = estimate.structures[structure].prePours;
                  //1. CALCULATE MATERIAL QUANTITIES AND COSTS
                  prePours.gypBags = prePours.tubs;
                  prePours.costOfGypBags = lb.costOfGypBags("2010+", prePours.gypBags);
                  prePours.tons = lb.tons("2010+", prePours.gypBags, 0);
                  prePours.costOfTons = lb.costOfTons(prePours.tons, "No").cost;
                  prePours.costOfMaterials = prePours.costOfGypBags + prePours.costOfTons;
              
                  //2. CALCULATE MOBILIZATIONS
                  prePours.mobilizations = lb.prePourMobilizations(prePours.tubs);
              
                  //3. CALCULATE LABOR CREW
                  prePours.laborCrew = lb.prePourLaborCrew(prePours.tubs, prePours.mobilizations);
            
                  //4. CALCULATE LABOR CREW TOTAL COST
                  prePours.costOfPrePoursLabor = lb.costOfPrePoursLabor(wageType, prePours.laborCrew.Laborers, miles);
              
                  //5. CALCULATE TOTAL COST OF PREPOURS (WITHOUT OVERTIME)
                  prePours.costOfPrePours = prePours.costOfMaterials + prePours.costOfPrePoursLabor;
              
                  //6. CALCULATE OVER TIME COST
                  prePours.costOfOverTimePrePours = lb.costOfOverTimePrePours(wageType, estimate.trucks.drivingTime, prePours.mobilizations);
                  
                  //7. ADD TO THE TOTALS
                  totals.prePoursCostMaterials = lb.sum([totals.prePoursCostMaterials, prePours.costOfMaterials]);
                  totals.prePoursCostLabor = lb.sum([totals.prePoursCostLabor, prePours.costOfPrePoursLabor]);
                  totals.prePoursCostMaterialAndLabor = lb.sum([totals.prePoursCostMaterialAndLabor, prePours.costOfPrePours]);
                  estimate.gyp.labor.mobilizationsPrePours = !estimate.gyp.labor.mobilizationsPrePours ? prePours.mobilizations : estimate.gyp.labor.mobilizationsPrePours+=prePours.mobilizations;
                  estimate.gyp.labor.costOfOverTimePrePoursLabor = !estimate.gyp.labor.costOfOverTimePrePoursLabor ? prePours.costOfOverTimePrePours : estimate.gyp.labor.costOfOverTimePrePoursLabor+=prePours.costOfOverTimePrePours;

                  tempDict = lb.getValues("Prices_AfterMileThreshold", {"Description": "Threshold"}, ["Miles", "Price/Day"]);
                  if (miles > tempDict.Miles) {
                        totals.prePoursCostAfterMilesThreshold = lb.sum([totals.prePoursCostAfterMilesThreshold, (((prePours.laborCrew.Laborers) - 1) * (prePours.mobilizations) * tempDict["Price/Day"])]);
                        if (prePours.contractOrOption === "Contract") {
                              totals.gypCostAfterMilesThreshold = lb.sum([totals.gypCostAfterMilesThreshold, (((prePours.laborCrew.Laborers) - 1) * (prePours.mobilizations) * tempDict["Price/Day"])]);
                        }
                  }
                  
                  //IF CONTRACT
                  if (prePours.contractOrOption === "Contract") {
                        totals.gypCostAssemsMaterialAndLabor = lb.sum([totals.gypCostAssemsMaterialAndLabor, prePours.costOfPrePours]);
                  }
            }
            //==========================================================================================
            //ADU REGULATION
            //==========================================================================================
            if (estimate.structures[structure].aduRegulation.units !== 0) {
                  aduReg = estimate.structures[structure].aduRegulation;
                  //1. CALCULATE MATERIAL QUANTITIES AND COSTS
                  aduReg.gypBags = aduReg.units
                  aduReg.costOfGypBags = lb.costOfGypBags("2010+", aduReg.gypBags);
                  aduReg.tons = lb.tons("2010+", aduReg.gypBags, mixDesign);
                  aduReg.costOfTons = lb.costOfTons(aduReg.tons, "No").cost;
                  aduReg.stringLineRolls = lb.stringLineRolls(aduReg.units * 194); //60 LF for each kitchen. that will convert to 194SF
                  aduReg.costOfStringLineRolls = lb.costOfStringLineRolls(aduReg.stringLineRolls);
                  aduReg.costOfMaterials = aduReg.costOfGypBags + aduReg.costOfTons + aduReg.costOfStringLineRolls;
                  
                  //2. MOBILIZATIONS WOULD BE SAME AS PRODUCTION MOBILIZATIONS
                  aduReg.mobilizations = estimate.gyp.labor.mobilizations;

                  //3. CALCULATE LABOR CREW TOTAL COST
                  aduReg.costOfADURegLabor = lb.costOfADURegLabor(wageType, aduReg.mobilizations);

                  //4. CALCULATE TOTAL COST OF ADU REGULATION
                  aduReg.costOfADUReg = aduReg.costOfMaterials + aduReg.costOfADURegLabor;

                  //5. ADD TO THE TOTALS
                  totals.ADURegCostMaterials = lb.sum([totals.ADURegCostMaterials, aduReg.costOfMaterials]);
                  totals.ADURegCostLabor = lb.sum([totals.ADURegCostLabor, aduReg.costOfADURegLabor]);
                  totals.ADURegCostMaterialAndLabor = lb.sum([totals.ADURegCostMaterialAndLabor, aduReg.costOfADUReg]);
                  totals.ADURegMobilizations = lb.sum([totals.ADURegMobilizations, aduReg.mobilizations]);
                  
                  //IF CONTRACT
                  if (aduReg.contractOrOption === "Contract") {
                        totals.gypCostAssemsMaterialAndLabor = lb.sum([totals.gypCostAssemsMaterialAndLabor, aduReg.costOfADUReg]);
                  }
                 
            }
            //==========================================================================================
            //LOOP OVER EACH CONC ASSEMBLY
            //==========================================================================================
            for(concAssem in estimate.structures[structure].concAssemblies) {
                  //1. SET VARIABLE ASSEM FOR EASIER ACCESS TO THIS CONCRETE ASSEMBLY DICTIONARY
                  assem = estimate.structures[structure].concAssemblies[concAssem];
       
                  //2. SET VARIABLE NUM_OF_FLOORS
                  var numOfFloors = Object.keys(assem.floors).length;
                  
                  //3. CALCULATE CONCRETE MATERIALS
                  lb.calculateConcAssembly(assem, drivingTimeHrs, wageType, city, miles, zipCode, saturdayConc, concPumpCostOption, numOfFloors, overrideConcBarrelMix);
                  
                  //4. LOOP OVER EACH FLOOR
                  for(Floor in assem.floors) {
                      //1. SET F VARIABLE FOR EASIER ACCESS
                      f = assem.floors[Floor];
                      //2. CALCULATE MATERIALS AND COSTS FOR FLOOR
                      lb.materialsAndCostsConc(f, assem, wageType, projData.projectInfo.city, zipCode, saturdayConc, overrideConcBarrelMix);
                  }
                  
                  //5. LOOP OVER EACH OPTION
                  for(opt in assem.options) {
                      //1. SET assemOption VARIABLE FOR EASIER ACCESS
                      assemOption = assem.options[opt];
                      //2. CALCULATE MATERIALS AND COSTS FOR FLOOR
                      lb.calculateConcAssembly(assemOption, drivingTimeHrs, wageType, projData.projectInfo.city, miles, zipCode, saturdayConc, concPumpCostOption, numOfFloors, overrideConcBarrelMix);
                      //3. CALCULATE DIFFERENCE BETWEEN OPTION ASSEMBLY AND REGULAR ASSEMBLY
                      assemOption.difference = assemOption.costTotal - assem.costTotal;
                  }
                  
                  //5. ADD TO TOTAL VARIABLES
                  if (assem.contractOrOption === "Contract") {
                        totals.concYds = lb.sum([totals.concYds, assem.concYds]);
                        totals.concPumpTimeHrs = lb.sum([totals.concPumpTimeHrs, assem.equip.pumpTimeHrs]);
                        totals.concMobilizations = lb.sum([totals.concMobilizations, assem.labor.concMobilizations]);
                                                
                        totals.concCostMachineFuel = lb.sum([totals.concCostMachineFuel, assem.equip.costFuel.pump]);
                        totals.concCostMachineMaintenance = lb.sum([totals.concCostMachineMaintenance, assem.equip.costMaintenance.pump]);
                        totals.concCostEquip = lb.sum([totals.concCostEquipment, assem.equip.costFuel.pump, assem.equip.costMaintenance.pump]);
                                                
                        totals.concCostLabor = lb.sum([totals.concCostLabor, assem.labor.costOfConcLaborers]);
                                                
                        totals.concCostSaturdayOption = lb.sum([totals.concCostSaturdayOption, assem.costOfConcYdsOption, assem.labor.costOfConcLaborersOption]);
                                                
                        totals.concCostTrucksFuel = lb.sum([totals.concCostTrucksFuel, assem.trucks.costFuel]);
                        totals.concCostTrucksMaintenance = lb.sum([totals.concCostTrucksMaintenance, assem.trucks.costMaintenance]);
                        totals.concCostOverTimeLabor = lb.sum([totals.concCostOverTimeLabor, assem.labor.costOfOverTimeConcLabor, assem.labor.costOfOverTimeSoundMatLabor]);
                        totals.concCostAfterMilesThreshold = lb.sum([totals.concCostAfterMilesThreshold, assem.costAfterMilesThreshold]);
                        totals.concCostTravel = lb.sum([totals.concCostTravel, assem.costTravel]);
                                                
                        totals.concCostProduction = lb.sum([totals.concCostProduction, assem.costProduction]);
                        totals.concCostTotal = lb.sum([totals.concCostTotal, assem.costTotal]);
                  }
            }
      }
      //==========================================================================================   
      //GYP - COSTS BASED ON TOTAL SF  
      //==========================================================================================
      //PERIMETER FOAM CUTTING //theres no "No" option for perimeter foam cutting
      estimate.gyp.labor.laborers.perFoamCuttingLaborers = lb.perFoamCuttingLaborers(totalGypSF);
      estimate.totals.gypCostPerFoamCutting = lb.costOfPerFoamCutting(wageType, estimate.gyp.labor.laborers.perFoamCuttingLaborers);
      if (estimate.gyp.perFoamCutting === "Yes") {
            totals.gypCostAssemsMaterialAndLabor+= totals.gypCostPerFoamCutting;
      }
      
      //FLAGMEN //for building it would be no
      if (estimate.gyp.flagmen !== "No") {
            if (estimate.gyp.flagmen === "Yes") {
                  totals.gypCostAssemsMaterialAndLabor+= estimate.gyp.labor.costOfGypFlagmenLabor;
            }
      }
      
      //STRING LINE GRID SYSTEM //for building it would be no
      if (estimate.gyp.slgs !== "No") {
            totals.stringLineRolls = lb.stringLineRolls(totalGypSF);
            totals.costOfStringLineRolls = lb.costOfStringLineRolls(totals.stringLineRolls);
            totals.costOfStringLineInstallation = totals.costOfStringLineRolls + estimate.gyp.labor.costOfGypStringLineLabor;
            if (estimate.gyp.slgs === "Yes") {
                  totals.gypCostAssemsMaterialAndLabor+= totals.costOfStringLineInstallation;
            }
      }
      
      //MOIST STOP
      if (estimate.gyp.moistStop !== "No" && estimate.gyp.moistStop !== undefined) {
            totals.blackPaperRollsMoistStop = lb.blackPaperRollsMoistStop("Default", totalGypSF);
            totals.costOfBlackPaperRollsMoistStop = lb.costOfBlackPaperRolls("1-Ply (10 Min Single Layer)", totals.blackPaperRollsMoistStop);
            totals.moistStopLaborers = lb.blackPaperMoistStopLaborers(totalGypSF);
            totals.costOfMoistStopLaborers = lb.costOfBlackPaperLaborers(wageType, totals.moistStopLaborers);
            totals.costOfMoistStop = totals.costOfBlackPaperRollsMoistStop + totals.costOfMoistStopLaborers;
            if (estimate.gyp.moistStop === "Yes") {
                  totals.gypCostAssemsMaterialAndLabor+= totals.costOfMoistStop;
            }
      }
      
      //SEALER
      if (estimate.gyp.sealer !== "No" && estimate.gyp.sealer !== undefined) {
            totals.sealerGallons = lb.sealerGallons("Gyp", estimate.gyp.sealerType, totalGypSF);
            totals.costOfSealerGallons = lb.costOfSealerGallons("Gyp", estimate.gyp.sealerType, totalGypSF);
            if (estimate.gyp.sealer === "Yes") {
                  totals.gypCostAssemsMaterialAndLabor+= totals.costOfSealerGallons;
            }
      }
      
      //RAM BOARD
      if (estimate.gyp.ramboard !== "No" && estimate.gyp.ramboard !== undefined) {
            totals.ramBoardRolls = lb.ramBoardRolls(totalGypSF);
            totals.costOfRamBoardRolls = lb.costOfRamBoardRolls(totals.ramBoardRolls);
            totals.ductTapeRollsForRamBoard = lb.ductTapeRollsForRamBoard(totalGypSF);
            totals.costOfDuctTapeRollsForRamBoard = lb.costOfDuctTapeRolls(totals.ductTapeRollsForRamBoard);
            totals.ramBoardLaborers = lb.soundMatLaborers(totalGypSF, false, estimate.gyp.labor.mobilizations, "2010+");
            totals.costOfRamBoardLaborers = lb.costOfSoundMatLabor(totals.ramBoardLaborers, wageType);
            totals.costOfRamBoard = totals.costOfRamBoardRolls + totals.costOfDuctTapeRollsForRamBoard + totals.costOfRamBoardLaborers;
            if (estimate.gyp.ramboard === "Yes") {
                  totals.gypCostAssemsMaterialAndLabor+= totals.costOfRamBoard;
            }
      }
      
      //==========================================================================================
      //TRUCKS
      //==========================================================================================
      lb.calculateTrucks(estimate, gypExists, concExists, overnight, sameDay)
      //==========================================================================================
      //EQUIPMENT
      //==========================================================================================
      lb.calculateEquip(estimate, gypExists, concExists);
      //==========================================================================================
      //TIME
      //==========================================================================================
      estimate.gyp.time = {
            setupTime: lb.setupTime(projectType),
            cleanupTime: lb.cleanupTime(),
            lunchTime: lb.lunchTime()
      }
      //==========================================================================================
      //OVERTIME LABOR COST
      //==========================================================================================
      //1. OVERTIME FOR GYP
      estimate.gyp.labor.overTimeGypLabor = lb.overTimeGypLabor(wageType, estimate.gyp.labor.mobilizations, estimate.gyp.labor.laborers.Laborers, estimate.trucks.drivingTime, estimate.gyp.time, estimate.gyp.equip, estimate.structures, estimate.totals.gypBags, overnight);
      
      //2. OVER TIME FOR SOUND MAT
      if (sameDay !== "Yes") {
            estimate.gyp.labor.costOfOverTimeSoundMatLabor = lb.costOfOverTimeSoundMatLabor(wageType, estimate.gyp.labor.mobilizationsSoundMat, estimate.trucks.drivingTime, overnight);
      }
      //==========================================================================================
      //TRAVEL COST
      //==========================================================================================
      if (gypExists === true) {
            //TOTAL GYP TRAVEL COST
            totals.gypAssemsCostTravel = lb.sum([estimate.trucks.gypDrivingFuelCost,
                                                 estimate.trucks.gypMaintenanceCost,
                                                 estimate.gyp.labor.overTimeGypLabor.costOfOverTimeGypLaborDrivers]);
      
            //TOTAL SOUNDMAT TRAVEL COST
            totals.soundMatCostTravel = lb.sum([estimate.trucks.soundMatDrivingFuelCost,
                                                estimate.trucks.soundMatMaintenanceCost,
                                                estimate.gyp.labor.costOfOverTimeSoundMatLabor]);
       
            //TOTAL PREPOURS TRAVEL COST
            totals.prePoursCostTravel = lb.sum([estimate.trucks.prePoursDrivingFuelCost, 
                                                estimate.trucks.prePoursMaintenanceCost,
                                                estimate.gyp.labor.costOfOverTimePrePoursLabor]);
      
            //TOTAL ALL GYP RELATED TRAVEL COST
            totals.gypCostTravel = lb.sum([estimate.totals.gypAssemsCostTravel,
                                           estimate.totals.soundMatCostTravel, 
                                           estimate.totals.gypCostAfterMilesThreshold,
                                           estimate.totals.gypCostPerDiem]);
                                              
            if (estimate.structures.structure1.prePours.contractOrOption === "Contract") {
                  estimate.totals.gypCostTravel+= estimate.totals.prePoursCostTravel;
            }
            
      }
      
      //==========================================================================================
      //PRODUCTION COSTS AND TOTALS
      //=========================================================================================
      //GYPCRETE
      if (gypExists === true) {
            estimate.totals.gypCostProduction = lb.sum([estimate.totals.gypCostAssemsMaterialAndLabor,
                                                        estimate.totals.gypCostEquip,
                                                        estimate.gyp.labor.overTimeGypLabor.costOfOverTimeGypLaborCrew,
                                                        estimate.totals.gypCostTravel]);
                                                                                  
            estimate.totals.gypCostTotalMarket = lb.costAfterMargin(estimate.totals.gypCostProduction, estimate.totals.gypMarginMarket);
            estimate.totals.gypCostTotalInter = lb.costAfterMargin(estimate.totals.gypCostProduction, estimate.totals.gypMarginInter);
            estimate.totals.gypCostTotal = lb.costAfterMargin(estimate.totals.gypCostProduction, estimate.totals.gypMargin);
      }
      
      //CONCRETE
      if (concExists === true) {
            estimate.totals.concCostTotalMarket = lb.costAfterMargin(estimate.totals.concCostProduction, estimate.totals.concMarginMarket);
            estimate.totals.concCostTotalInter = Math.ceil(estimate.totals.concCostTotal);
            estimate.totals.concCostTotal = estimate.totals.concCostTotalInter;
            
            estimate.totals.concMarginInter = ((totals.concCostTotal - totals.concCostProduction) / totals.concCostTotal) * 100;
            estimate.totals.concMargin = estimate.totals.concMarginInter;
      }
      
      estimate.totals.grandCostTotal = lb.sum([estimate.totals.gypCostTotal, estimate.totals.concCostTotal]);
      //=============================================================

      estimate.totalsPerGypFloor = lb.calculatePerGypFloorTotals(estimate);
      
      //=============================================================
      //CALCULATE OPTIONALS
      //=============================================================
      //1. CHECK IF OPTIONALS DICT ALREADY EXISTS
      if (estimate.optionals) {
            delete estimate.optionals;
      }
      //2. MAKE OPTIONALS DICT
      estimate.optionals = lb.calculateOptionals(projData, estimateVersion);
      
      //=============================================================
      //CALCULATE SOV
      //=============================================================
      //1. CHECK IF SCHEDULE OF VALUES DICT ALREADY EXISTS
      if (estimate.scheduleOfValues) {
            delete estimate.scheduleOfValues;
      }
      //2. MAKE SCHEDULE OF VALUES DICT
      estimate.scheduleOfValues = lb.calculateSOV(projData, estimateVersion);

}
module.exports.materialsAndCostsPrimer = function(gypOrConc, assem, dict) {
      assem.primerGallons = lb.primerGallons(gypOrConc, dict.primerType, assem.SF);
      assem.costOfPrimerGallons = lb.costOfPrimerGallons(gypOrConc, dict.primerType, assem.SF);
}
module.exports.materialsAndCostsWire = function(assem, dict, wageType) {
      var temp = lb.wireUnits(dict.wireType, assem.SF);
      assem.wireUnitType = temp.unitType;
      assem.wireUnits = temp.units;
      assem.costOfWireUnits = lb.costOfWireUnits(dict.wireType, assem.SF);
      assem.pinBoxes = lb.pinBoxes(assem.SF);
      assem.costOfPinBoxes = lb.costOfPinBoxes(assem.pinBoxes);
      assem.washerBoxes = lb.washerBoxes(assem.pinBoxes);
      assem.costOfWasherBoxes = lb.costOfWasherBoxes(assem.washerBoxes);
}
module.exports.laborAndCostsWire = function(assem, dict, wageType) {
      assem.wireLaborers = lb.wireLaborers(dict.wireType, assem.SF);
      assem.costOfWireLaborers = lb.costOfWireLaborers(wageType, (assem.wireLaborers));
}
module.exports.materialsAndCostsBlackPaper = function(assem, dict) {
      assem.blackPaperRolls = lb.blackPaperRolls(dict.blackPaperType, assem.SF);
      assem.costOfBlackPaperRolls = lb.costOfBlackPaperRolls(dict.blackPaperType, assem.blackPaperRolls);
      //duct tape rolls for black paper will be calculated in the same way as duct tape rolls for ramboard
      assem.ductTapeRollsForBlackPaper = lb.ductTapeRollsForRamBoard(assem.SF);
      assem.costOfDuctTapeRollsForBlackPaper = lb.costOfDuctTapeRolls(assem.ductTapeRollsForBlackPaper);
}
module.exports.materialsAndCostsBlackPaperMoistStop = function(assem, dict) {
      assem.blackPaperRollsMoistStop = lb.blackPaperRollsMoistStop("Default", assem.SF);
      assem.costOfBlackPaperRollsMoistStop = lb.costOfBlackPaperRolls("1-Ply (10 Min Single Layer)", assem.blackPaperRollsMoistStop);
}
module.exports.materialsAndCostsSprayGlue = function(assem) {
      assem.cansOfSprayGlue = lb.cansOfSprayGlue(assem.SF);
      assem.costOfCansOfSprayGlue = lb.costOfCansOfSprayGlue(assem.cansOfSprayGlue);
}
module.exports.materialsAndCostsDuctTapeRollsWhenNoSM = function(assem) {
      assem.ductTapeRollsWhenNoSM = lb.ductTapeRollsWhenNoSM(assem.SF);
      assem.costOfDuctTapeRollsWhenNoSM = lb.costOfDuctTapeRolls(assem.ductTapeRollsWhenNoSM);
}
module.exports.materialsAndCostsSealer = function(gypOrConc, assem, dict) {
      assem.sealerGallons = lb.sealerGallons(gypOrConc, dict.sealerType, dict.SF);
      assem.costOfSealerGallons = lb.costOfSealerGallons(gypOrConc, dict.sealerType, dict.SF);
}
module.exports.materialsAndCostsRamboard = function(assem) {
      assem.ramBoardRolls = lb.ramBoardRolls(assem.SF);
      assem.costOfRamBoardRolls = lb.costOfRamBoardRolls(assem.ramBoardRolls);
      assem.ductTapeRollsForRamBoard = lb.ductTapeRollsForRamBoard(assem.SF);
      assem.costOfDuctTapeRollsForRamBoard = lb.costOfDuctTapeRolls(assem.ductTapeRollsForRamBoard);
}
