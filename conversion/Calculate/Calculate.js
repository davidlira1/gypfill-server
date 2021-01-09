var calcGyp = function(projData, estimateVersion) {
      //DECLARE VARIABLES FOR EASIER ACCESS
      var estimate = projData.estimates(`estimate${estimateVersion}`);
      var projectType = projData.projectInfo.projectType === "Unit" ? "Building" :  projData.projectInfo.projectType;//House, Building, Multi-Building, Unit
      var wageType = projData.projectInfo.wageType; //Non-Prevailing, Prevailing
      var mixDesign = estimate.gyp.mixDesign; //0, 1.4
      var overnight = false;
      var saturdayGyp = estimate.saturday.gyp;
      var saturdayConc = estimate.saturday.conc;
      var city = projData.projectInfo.city;
      var zipCode = CLng((projData.projectInfo.zipCode))
      var concPumpCostOption = estimate.conc.concPumpCostOption;
      var totalGypSF = estimate.totals.gypSF;
      var totalGypSFWithSoundMat = estimate.totals.gypSFWithSoundMat;

      var structure, assem, f, assemOption
      var dict
      //==========================================================================================
      var gypExists = estimate.structures.structure1.gypAssemblies.gypAssem1 ? true : false

      var concExists = false
      if (estimate.structures.structure1.concAssemblies.concAssem1) {
            if (estimate.structures.structure1.concAssemblies.concAssem1.contractOrOption === "Contract") {
                  concExists = true
            }
      }
      //==========================================================================================
      //==========================================================================================
      //DRIVING
      
      //==========================================================================================
      //1. ADD DISTANCE  DICTIONARY
      estimate.distance = distance((projData.projectInfo.zipCode), (projData.projectInfo.city))
      var miles = estimate.distance("Van Nuys")
      
      //2. ADD DRIVING TIME TO TRUCK DICTIONARY (ROUND TRIP at 55mph)
      estimate.trucks.drivingTime = drivingTime((estimate.distance("Van Nuys")))
      var drivingTimeHrs = estimate.trucks.drivingTime
      
      //3. DETERMINE IF OVERNIGHT
      if (gypExists === true) {
            dict = getValues("Prices_PerDiem", Array("Per Diem"), Array.Default, Array("Miles Threshold"))
            //the assumption is it must be a certain minimum distance && must have soundmat
            //what if it is only gyp though? good question for Tamir. but let//s study this first.
            if (miles > dict("Miles Threshold") && estimate.totals.gypSFWithSoundMat !== 0) {
                  overnight = true
            }
      }
      //==========================================================================================
      //==========================================================================================
      //SIZE

      //==========================================================================================
      if (gypExists === true) {
            estimate.gyp.size = totalGypSF < 900 ? "Small Pour" : "Normal";
      }
      //==========================================================================================
      //==========================================================================================        
      //GYPCRETE LABOR
                  
      //==========================================================================================
      if (gypExists === true) {
            var gypThick1stAssem = estimate.structures.structure1.gypAssemblies.gypAssem1.gypThick
            var difficultyLevel = estimate.gyp.difficultyLevel
            var gypType = estimate.structures.structure1.gypAssemblies.gypAssem1.gypType
      
            if (estimate.totals.gypSFWithSoundMat > 0 && estimate.totals.gypSFWithSoundMat <= 4000) {
                  estimate.gyp.sameDay = "Yes"
            } else {
                  estimate.gyp.sameDay = "No"
            }
            
            var sameDay = estimate.gyp.sameDay
      
            gypLabor(wageType, projectType, totalGypSF, totalGypSFWithSoundMat, gypThick1stAssem, difficultyLevel, gypType, miles, overnight, saturdayGyp, estimate)
            estimate.totals.gypCostAfterMilesThreshold = estimate.gyp.labor.costOfAfterMilesThreshold //more will be added later
            estimate.gyp.labor.mobilizationsSoundMat = gypMobilizations(estimate.totals.gypSFWithSoundMat, "Normal");
            dict = addMobilsCost(estimate.gyp.labor.addMobils.mobils, estimate.gyp.labor.addMobils.mobilCost, wageType);
            estimate.gyp.labor.addMobils.addMobilsCost = dict.addMobilsCostTotal;
            estimate.gyp.labor.addMobils.enabled = false;
            estimate.totals.gypCostAddMobilsProduction = dict.addMobilsCostProduction;
            estimate.totals.gypCostAddMobilsTotal = dict.addMobilsCostTotal;
            estimate.totals.gypCostSaturdayOption = estimate.gyp.labor.costOfGypLaborOption; //more will be added later
      }
      //==========================================================================================
      //==========================================================================================                                                                                                                                                                                    
      //CALCULATE MATERIALS && LABOR FOR GYPCRETE && CONCRETE
      
      //==========================================================================================
      //LOOP OVER EACH STRUCTURE
      //==========================================================================================
      var totals = estimate.totals;
      for(structure in estimate.structures) {
            structure = estimate.structures[structure];
            //==========================================================================================
            // LOOP OVER EACH GYP ASSEM
            //==========================================================================================
            for(gypAssem in structure.gypAssemblies) {
                  
                  //1. SET ASSEM VARIABLE FOR EASIER ACCESS
                  assem = structure.gypAssemblies[gypAssem];
                  
                  //2. CALCULATE MATERIALS && LABOR COSTS FOR ASSEMBLY
                  calculateGypAssembly(estimate, assem, mixDesign, wageType, sameDay, overnight, miles, projectType, saturdayGyp)
                  
                  //3. LOOP OVER EACH FLOOR
                  for(Floor in structure.gypAssemblies[gypAssem].floors) {
                      //1. SET F VARIABLE FOR EASIER ACCESS
                      f = structure.gypAssemblies[gypAssem].floors[Floor]
                      //2. CALCULATE MATERIALS && COSTS FOR FLOOR
                      materialsAndCostsGyp(f, assem, mixDesign, wageType, projectType, saturdayGyp)
                  }
                  
                  //4. LOOP OVER EACH OPTION
                  for(opt in structure.gypAssemblies[gypAssem].options) {
                      //1. SET assemOption VARIABLE FOR EASIER ACCESS
                      assemOption = structure.gypAssemblies[gypAssem].options[opt]
                      //2. CALCULATE MATERIALS && COSTS FOR FLOOR
                      calculateGypAssembly(estimate, assemOption, mixDesign, wageType, sameDay, overnight, miles, projectType, saturdayGyp)
                      //3. CALCULATE DIFFERENCE BETWEEN OPTION ASSEMBLY && REGULAR ASSEMBLY
                      assemOption.difference = assemOption.gypAssemCost - assem.gypAssemCost
                  }
           
                  //6. TOTAL GYP BAGS, ADD TO IT THE AMOUNT OF GYP BAGS
                  totals.gypBags = totals.gypBags + assem.gypBags;
                  
                  //7. TOTAL TONS, ADD TO IT THE AMOUNT OF TONS
                  totals.gypTons = totals.gypTons + assem.tons;

                  //8. TOTAL GYP ASSEMBLIES COST, ADD TO IT THIS GYP ASSEMBLY COST
                  totals.gypCostAssemsMaterialAndLabor = totals.gypCostAssemsMaterialAndLabor + assem.gypAssemCost;
                  
                  //PER DIEM
                  totals.gypCostPerDiem = totals.gypCostPerDiem + assem.costOfPerDiem;
                  
                  //AFTER MILES THRESHOLD
                  totals.gypCostAfterMilesThreshold = totals.gypCostAfterMilesThreshold + assem.costAfterMilesThresholdSoundMat;
                  
                  //SATURDAY COST
                  totals.gypCostSaturdayOption = totals.gypCostSaturdayOption + assem.costOfTonsOption;
                
            }
            //==========================================================================================
            //==========================================================================================
            //PREPOURS
            //==========================================================================================
            if (structure.prePours.tubs !== 0) {
                  
                  //1. CALCULATE MATERIAL QUANTITIES && COSTS
                  structure.prePours.gypBags = structure.prePours.tubs;
                  structure.prePours.costOfGypBags = costOfGypBags("2010+", structure.prePours.gypBags);
                  structure.prePours.tons = tons("2010+", structure.prePours.gypBags, 0);
                  structure.prePours.costOfTons = costOfTons(structure.prePours.tons, "No").cost;
                  structure.prePours.costOfMaterials = structure.prePours.costOfGypBags + structure.prePours.costOfTons;
              
                  //2. CALCULATE MOBILIZATIONS
                  structure.prePours.mobilizations = prePourMobilizations(structure.prePours.tubs);
              
                  //3. CALCULATE LABOR CREW
                  structure.prePours.laborCrew = prePourLaborCrew(structure.prePours.tubs, structure.prePours.mobilizations);
            
                  //4. CALCULATE LABOR CREW TOTAL COST
                  structure.prePours.costOfPrePoursLabor = costOfPrePoursLabor(wageType, structure.prePours.laborCrew.Laborers, miles);
              
                  //5. CALCULATE TOTAL COST OF PREPOURS (WITHOUT OVERTIME)
                   structure.prePours.costOfPrePours = structure.prePours.costOfMaterials + structure.prePours.costOfPrePoursLabor;
              
                  //6. CALCULATE OVER TIME COST
                  structure.prePours.costOfOverTimePrePours = costOfOverTimePrePours(wageType, estimate.trucks.drivingTime, structure.prePours.mobilizations);
                  
                  //7. ADD TO THE TOTALS
                  estimate.totals.prePoursCostMaterials = estimate.totals.prePoursCostMaterials + structure.prePours.costOfMaterials;
                  estimate.totals.prePoursCostLabor = estimate.totals.prePoursCostLabor + structure.prePours.costOfPrePoursLabor;
                  estimate.totals.prePoursCostMaterialAndLabor = estimate.totals.prePoursCostMaterialAndLabor + structure.prePours.costOfPrePours;
                  estimate.gyp.labor.mobilizationsPrePours = estimate.gyp.labor.mobilizationsPrePours + structure.prePours.mobilizations;
                  estimate.gyp.labor.costOfOverTimePrePoursLabor = estimate.gyp.labor.costOfOverTimePrePoursLabor + structure.prePours.costOfOverTimePrePours;

                  tempDict = getValues("Prices_AfterMileThreshold", Array.Description, Array.Threshold, Array("Miles", "Price/Day"))
                  if (miles > tempDict.Miles) {
                        totals.gypCostAfterMilesThreshold = totals.gypCostAfterMilesThreshold + ((structure.prePours.laborCrew.Laborers - 1) * structure.prePours.mobilizations * tempDict("Price/Day"))
                  }
                  
            }
            //==========================================================================================
            //==========================================================================================
            //ADU REGULATION
            //==========================================================================================
            if (structure.aduRegulation.units !== 0) {
                  
                  //1. CALCULATE MATERIAL QUANTITIES && COSTS
                  structure.aduRegulation.gypBags = structure.aduRegulation.units
                  structure.aduRegulation.costOfGypBags = costOfGypBags("2010+", (structure.aduRegulation.gypBags))
                  structure.aduRegulation.tons = tons("2010+", structure.aduRegulation.gypBags, mixDesign)
                  structure.aduRegulation.costOfTons = costOfTons(structure.aduRegulation.tons, "No").cost
                  structure.aduRegulation.stringLineRolls = stringLineRolls(structure.aduRegulation.units * 194) //60 LF for each kitchen. that will convert to 194SF
                  structure.aduRegulation.costOfStringLineRolls = costOfStringLineRolls(structure.aduRegulation.stringLineRolls)
                  structure.aduRegulation.costOfMaterials = structure.aduRegulation.costOfGypBags + structure.aduRegulation.costOfTons + structure.aduRegulation.costOfStringLineRolls
                  
                  //2. MOBILIZATIONS WOULD BE SAME MOBILIZATIONS
                  structure.aduRegulation.mobilizations = estimate.gyp.labor.mobilizations;

                  //3. CALCULATE LABOR CREW TOTAL COST
                  structure.aduRegulation.costOfADURegLabor = costOfADURegLabor(wageType, structure.aduRegulation.mobilizations);


                  //4. CALCULATE TOTAL COST OF ADU REGULATION
                  structure.aduRegulation.costOfADUReg = structure.aduRegulation.costOfMaterials + structure.aduRegulation.costOfADURegLabor;

                  //5. ADD TO THE TOTALS
                  estimate.totals.ADURegCostMaterials = estimate.totals.ADURegCostMaterials + structure.aduRegulation.costOfMaterials;
                  estimate.totals.ADURegCostLabor = estimate.totals.ADURegCostLabor + structure.aduRegulation.costOfADURegLabor;
                  estimate.totals.ADURegCostMaterialAndLabor = estimate.totals.ADURegCostMaterialAndLabor + structure.aduRegulation.costOfADUReg;
                  estimate.totals.ADURegMobilizations = estimate.totals.ADURegMobilizations + structure.aduRegulation.mobilizations;
                 
            }
            //==========================================================================================
            //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
            //==========================================================================================
            //LOOP OVER EACH CONC ASSEMBLY
            //==========================================================================================
            for(concAssem in structure.concAssemblies) {
                  
                  //1. SET VARIABLE ASSEM FOR EASIER ACCESS TO THIS CONCRETE ASSEMBLY DICTIONARY
                  assem = (structure.concAssemblies(concAssem))
       
                  //2. SET VARIABLE NUM_OF_FLOORS
                  var numOfFloors = assem.floors.count
                  
                  //3. CALCULATE CONCRETE MATERIALS
                  calculateConcAssembly(assem, drivingTimeHrs, wageType, city, miles, zipCode, saturdayConc, concPumpCostOption, numOfFloors)
                  
                  //4. LOOP OVER EACH FLOOR
                  for(Floor in assem.floors) {
                      //1. SET F VARIABLE FOR EASIER ACCESS
                      f = assem.floors[Floor]
                      //2. CALCULATE MATERIALS && COSTS FOR FLOOR
                      materialsAndCostsConc(f, assem, wageType, city, zipCode, saturdayConc)
                  }
                  
                  //5. LOOP OVER EACH OPTION
                  for(opt in assem.options) {
                      //1. SET assemOption VARIABLE FOR EASIER ACCESS
                      assemOption = assem.options[opt]
                      //2. CALCULATE MATERIALS && COSTS FOR FLOOR
                      calculateConcAssembly(assemOption, drivingTimeHrs, wageType, city, miles, zipCode, saturdayConc, concPumpCostOption, numOfFloors)
                      //3. CALCULATE DIFFERENCE BETWEEN OPTION ASSEMBLY && REGULAR ASSEMBLY
                      assemOption.difference = assemOption.costTotal - assem.costTotal
                  }
                  
                  //5. ADD TO TOTAL VARIABLES
                  if (assem.contractOrOption === "Contract") {
                        totals.concYds = totals.concYds + assem.concYds;
                        totals.concPumpTimeHrs = totals.concPumpTimeHrs + assem.equip.pumpTimeHrs;
                        totals.concMobilizations = totals.concMobilizations + assem.labor.concMobilizations;
                        
                        totals.concCostMachineFuel = totals.concCostMachineFuel + assem.equip.costFuel.pump;
                        totals.concCostMachineMaintenance = totals.concCostMachineMaintenance + assem.equip.costMaintenance.pump;
                        totals.concCostEquip = totals.concCostEquipment + assem.equip.costFuel.pump + assem.equip.costMaintenance.pump;
                        
                        totals.concCostLabor = totals.concCostLabor + assem.labor.costOfConcLaborers; //what about sm labor?? right???

                        totals.concCostSaturdayOption = totals.concCostSaturdayOption + assem.costOfConcYdsOption + assem.labor.costOfConcLaborersOption;
            
                        totals.concCostTrucksFuel = totals.concCostTrucksFuel + assem.trucks.costFuel;
                        totals.concCostTrucksMaintenance = totals.concCostTrucksMaintenance + assem.trucks.costMaintenance;
                        totals.concCostOverTimeLabor = totals.concCostOverTimeLabor + assem.labor.costOfOverTimeConcLabor + assem.labor.costOfOverTimeSoundMatLabor;
                        totals.concCostAfterMilesThreshold = totals.concCostAfterMilesThreshold + assem.costAfterMilesThreshold;
                        totals.concCostTravel = totals.concCostTravel + assem.costTravel;
                        
                        totals.concCostProduction = totals.concCostProduction + assem.costProduction;
                        totals.concCostTotal = totals.concCostTotal + assem.costTotal;
                  }
            
            }
      }
      //==========================================================================================
      //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
      //==========================================================================================
            
      //GYP - COSTS BASED ON TOTAL SF
            
      //==========================================================================================
      //PERIMETER FOAM CUTTING //theres no "No" option for perimeter foam cutting
      estimate.gyp.labor.laborers.perFoamCuttingLaborers = perFoamCuttingLaborers(totalGypSF);
      estimate.totals.gypCostPerFoamCutting = costOfPerFoamCutting(wageType, estimate.gyp.labor.laborers.perFoamCuttingLaborers);
      if (estimate.gyp.perFoamCutting === "Yes") {
            estimate.totals.gypCostAssemsMaterialAndLabor = estimate.totals.gypCostAssemsMaterialAndLabor + estimate.totals.gypCostPerFoamCutting;
      }
      
      //FLAGMEN //for building it would be no
      if (estimate.gyp.flagmen !== "No") {
            if (estimate.gyp.flagmen === "Yes") {
                  estimate.totals.gypCostAssemsMaterialAndLabor = estimate.totals.gypCostAssemsMaterialAndLabor + estimate.gyp.labor.costOfGypFlagmenLabor;
            }
      }
      
      //STRING LINE GRID SYSTEM //for building it would be no
      if (estimate.gyp.slgs !== "No") {
            estimate.totals.stringLineRolls = stringLineRolls(totalGypSF);
            estimate.totals.costOfStringLineRolls = costOfStringLineRolls(estimate.totals.stringLineRolls);
            estimate.totals.costOfStringLineInstallation = estimate.totals.costOfStringLineRolls + estimate.gyp.labor.costOfGypStringLineLabor;
            if (estimate.gyp.slgs === "Yes") {
                  estimate.totals.gypCostAssemsMaterialAndLabor = estimate.totals.gypCostAssemsMaterialAndLabor + estimate.totals.costOfStringLineInstallation;
            }
      }
      
      //MOIST STOP
      if (estimate.gyp.moistStop !== "No" && estimate.gyp.moistStop !== Empty) {
            estimate.totals.blackPaperRollsMoistStop = blackPaperRollsMoistStop("Default", totalGypSF);
            estimate.totals.costOfBlackPaperRollsMoistStop = costOfBlackPaperRolls("1-Ply (10 Min Single Layer)", estimate.totals.blackPaperRollsMoistStop);
            estimate.totals.moistStopLaborers = blackPaperMoistStopLaborers(totalGypSF);
            estimate.totals.costOfMoistStopLaborers = costOfBlackPaperLaborers(wageType, estimate.totals.moistStopLaborers);
            estimate.totals.costOfMoistStop = estimate.totals.costOfBlackPaperRollsMoistStop + estimate.totals.costOfMoistStopLaborers;
            if (estimate.gyp.moistStop === "Yes") {
                  estimate.totals.gypCostAssemsMaterialAndLabor = estimate.totals.gypCostAssemsMaterialAndLabor + estimate.totals.costOfMoistStop;
            }
      }
      
      //SEALER
      if (estimate.gyp.sealer !== "No" && estimate.gyp.sealer !== Empty) {
            estimate.totals.sealerGallons = sealerGallons("Gyp", estimate.gyp.sealerType, totalGypSF);
            estimate.totals.costOfSealerGallons = costOfSealerGallons("Gyp", estimate.gyp.sealerType, totalGypSF);
            if (estimate.gyp.sealer === "Yes") {
                  estimate.totals.gypCostAssemsMaterialAndLabor = estimate.totals.gypCostAssemsMaterialAndLabor + estimate.totals.costOfSealerGallons;
            }
      }
      
      //RAM BOARD
      if (estimate.gyp.ramboard !== "No" && estimate.gyp.ramboard !== Empty) {
            estimate.totals.ramBoardRolls = ramBoardRolls(totalGypSF);
            estimate.totals.costOfRamBoardRolls = costOfRamBoardRolls(estimate.totals.ramBoardRolls);
            estimate.totals.ductTapeRollsForRamBoard = ductTapeRollsForRamBoard(totalGypSF);
            estimate.totals.costOfDuctTapeRollsForRamBoard = costOfDuctTapeRolls(estimate.totals.ductTapeRollsForRamBoard);
            estimate.totals.ramBoardLaborers = soundMatLaborers(totalGypSF, false, estimate.gyp.labor.mobilizations, "2010+");
            estimate.totals.costOfRamBoardLaborers = costOfSoundMatLabor(estimate.totals.ramBoardLaborers, wageType);
            estimate.totals.costOfRamBoard = estimate.totals.costOfRamBoardRolls + estimate.totals.costOfDuctTapeRollsForRamBoard + estimate.totals.costOfRamBoardLaborers;
            if (estimate.gyp.ramboard === "Yes") {
                  estimate.totals.gypCostAssemsMaterialAndLabor = estimate.totals.gypCostAssemsMaterialAndLabor + estimate.totals.costOfRamBoard;
            }
      }
      

      //==========================================================================================
      //==========================================================================================
      //TRUCKS
            
      //==========================================================================================
      calculateTrucks(estimate, gypExists, concExists, overnight, sameDay)
      
      //==========================================================================================
      //==========================================================================================
            
      //EQUIPMENT
            
      //==========================================================================================
      calculateEquip(estimate, gypExists, concExists)
      
      //==========================================================================================
      //==========================================================================================
      //TIME
      
      //==========================================================================================
      estimate.gyp.time = {}
      estimate.gyp.time.setupTime = setupTime(projectType)
      estimate.gyp.time.cleanupTime = cleanupTime //fn
      estimate.gyp.time.lunchTime = lunchTime //fn
      //==========================================================================================
      //OVERTIME LABOR COST
      //==========================================================================================
      //1. OVERTIME FOR GYP
      estimate.gyp.labor.overTimeGypLabor = overTimeGypLabor(wageType, estimate.gyp.labor.mobilizations, estimate.gyp.labor.laborers.Laborers, estimate.trucks.drivingTime, estimate.gyp.time, estimate.gyp.equip, estimate.structures, estimate.totals.gypBags, overnight)
      
      //2. OVER TIME FOR SOUND MAT
      if (sameDay !== "Yes") {
            estimate.gyp.labor.costOfOverTimeSoundMatLabor = costOfOverTimeSoundMatLabor(wageType, estimate.gyp.labor.mobilizationsSoundMat, estimate.trucks.drivingTime, overnight)
      }

      //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
      //==========================================================================================
        
      //TRAVEL COST
        
      //==========================================================================================
      if (gypExists === true) {
            //TOTAL GYP TRAVEL COST
            estimate.totals.gypAssemsCostTravel = _
                                              estimate.trucks.gypDrivingFuelCost + _
                                              estimate.trucks.gypMaintenanceCost + _
                                              estimate.gyp.labor.overTimeGypLabor.costOfOverTimeGypLaborDrivers
      
            //TOTAL SOUNDMAT TRAVEL COST
            estimate.totals.soundMatCostTravel = _
                                              estimate.trucks.soundMatDrivingFuelCost + _
                                              estimate.trucks.soundMatMaintenanceCost + _
                                              estimate.gyp.labor.costOfOverTimeSoundMatLabor
       
            //TOTAL PREPOURS TRAVEL COST
            estimate.totals.prePoursCostTravel = _
                                              estimate.trucks.prePoursDrivingFuelCost + _
                                              estimate.trucks.prePoursMaintenanceCost + _
                                              estimate.gyp.labor.costOfOverTimePrePoursLabor
      
            //TOTAL ALL GYP RELATED TRAVEL COST
            estimate.totals.gypCostTravel = _
                                              estimate.totals.gypAssemsCostTravel + _
                                              estimate.totals.soundMatCostTravel + _
                                              estimate.totals.prePoursCostTravel + _
                                              estimate.totals.gypCostAfterMilesThreshold + _
                                              estimate.totals.gypCostPerDiem
      }
      
      //==========================================================================================
      //==========================================================================================
      //PRODUCTION COSTS && TOTALS
            
      //=========================================================================================
      //GYPCRETE
      if (gypExists === true) {
            estimate.totals.gypCostProduction = estimate.totals.gypCostAssemsMaterialAndLabor + _
                                                                                  estimate.totals.prePoursCostMaterialAndLabor + _
                                                                                  estimate.totals.gypCostEquip + _
                                                                                  estimate.gyp.labor.overTimeGypLabor.costOfOverTimeGypLaborCrew + _
                                                                                  estimate.totals.gypCostTravel
                                                                                  
            estimate.totals.gypCostTotalMarket = costAfterMargin(estimate.totals.gypCostProduction, estimate.totals.gypMarginMarket);
            estimate.totals.gypCostTotalInter = costAfterMargin(estimate.totals.gypCostProduction, estimate.totals.gypMarginInter);
            estimate.totals.gypCostTotal = costAfterMargin(estimate.totals.gypCostProduction, estimate.totals.gypMargin);
      }
      
      //CONCRETE
      if (concExists === true) {
            estimate.totals.concCostTotalMarket = costAfterMargin(estimate.totals.concCostProduction, estimate.totals.concMarginMarket);
            estimate.totals.concCostTotalInter = Round(estimate.totals.concCostTotal + 0.49);
            estimate.totals.concCostTotal = estimate.totals.concCostTotalInter;
            
            estimate.totals.concMarginInter = ((totals.concCostTotal - totals.concCostProduction) / totals.concCostTotal) * 100;
            estimate.totals.concMargin = estimate.totals.concMarginInter;
      }
      
      estimate.totals.grandCostTotal = estimate.totals.gypCostTotal + estimate.totals.concCostTotal;

      //=============================================================
      estimate.totalsPerGypFloor = calculatePerGypFloorTotals(estimate);

      //=============================================================
      //CALCULATE OPTIONALS
      //=============================================================
      //1. CHECK IF OPTIONALS DICT ALREADY EXISTS
      if (estimate.optionals) {
            delete estimate.optionals;
      }
      
      //2. MAKE OPTIONALS DICT
      estimate.optionals = calculateOptionals(projData, estimateVersion);
      
      //=============================================================
      //CALCULATE SOV
      //=============================================================
      //1. CHECK IF SCHEDULE OF VALUES DICT ALREADY EXISTS
      if (estimate.scheduleOfValues) {
            delete estimate.scheduleOfValues;
      }
      
      //2. MAKE SCHEDULE OF VALUES DICT
      estimate.scheduleOfValues = calculateSOV(projData, estimateVersion);
    
}
var materialsAndCostsPrimer = function(gypOrConc, assem, dict) {
      assem.primerGallons = primerGallons(gypOrConc, dict.primerType, assem.SF)
      assem.costOfPrimerGallons = costOfPrimerGallons(gypOrConc, dict.primerType, assem.SF)
}
var materialsAndCostsWire = function(assem, dict, wageType) {
      var temp = wireUnits(dict.wireType, assem.SF)
      assem.wireUnitType = temp.unitType
      assem.wireUnits = temp.units
      assem.costOfWireUnits = costOfWireUnits(dict.wireType, assem.SF)
      assem.pinBoxes = pinBoxes(dict.thick, assem.wireUnits)
      assem.costOfPinBoxes = costOfPinBoxes(assem.pinBoxes)
      assem.washerBoxes = washerBoxes(assem.pinBoxes)
      assem.costOfWasherBoxes = costOfWasherBoxes(assem.washerBoxes)
}
var laborAndCostsWire = function(assem, dict, wageType) {
      assem.wireLaborers = wireLaborers(dict.wireType, assem.SF)
      assem.costOfWireLaborers = costOfWireLaborers(wageType, (assem.wireLaborers))
}
var materialsAndCostsBlackPaper = function(assem, dict) {
      assem.blackPaperRolls = blackPaperRolls(dict.blackPaperType, assem.SF)
      assem.costOfBlackPaperRolls = costOfBlackPaperRolls(dict.blackPaperType, assem.blackPaperRolls)
      //duct tape rolls for black paper will be calculated in the same way tape rolls for ramboard
      assem.ductTapeRollsForBlackPaper = ductTapeRollsForRamBoard(assem.SF)
      assem.costOfDuctTapeRollsForBlackPaper = costOfDuctTapeRolls(assem.ductTapeRollsForBlackPaper)
}
var materialsAndCostsBlackPaperMoistStop = function(assem, dict) {
      assem.blackPaperRollsMoistStop = blackPaperRollsMoistStop("Default", assem.SF)
      assem.costOfBlackPaperRollsMoistStop = costOfBlackPaperRolls("1-Ply (10 Min Single Layer)", assem.blackPaperRollsMoistStop)
}
var materialsAndCostsSprayGlue = function(assem) {
      assem.cansOfSprayGlue = cansOfSprayGlue(assem.SF)
      assem.costOfCansOfSprayGlue = costOfCansOfSprayGlue(assem.cansOfSprayGlue)
}
var materialsAndCostsDuctTapeRollsWhenNoSM = function(assem) {
      assem.ductTapeRollsWhenNoSM = ductTapeRollsWhenNoSM(assem.SF)
      assem.costOfDuctTapeRollsWhenNoSM = costOfDuctTapeRolls(assem.ductTapeRollsWhenNoSM)
}
var materialsAndCostsSealer = function(gypOrConc, assem, dict) {
      assem.sealerGallons = sealerGallons(gypOrConc, dict.sealerType, dict.SF)
      assem.costOfSealerGallons = costOfSealerGallons(gypOrConc, dict.sealerType, dict.SF)
}
var materialsAndCostsRamboard = function(assem) {
      assem.ramBoardRolls = ramBoardRolls(assem.SF)
      assem.costOfRamBoardRolls = costOfRamBoardRolls(assem.ramBoardRolls)
      assem.ductTapeRollsForRamBoard = ductTapeRollsForRamBoard(assem.SF)
      assem.costOfDuctTapeRollsForRamBoard = costOfDuctTapeRolls(assem.ductTapeRollsForRamBoard)
}
