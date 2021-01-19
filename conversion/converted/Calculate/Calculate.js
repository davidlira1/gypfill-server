var calcGyp = function(projData, estimateVersion) {
      //1. SET THE ESTIMATE VERSION OBJECT
      var estimate = projData.estimates("estimate" + estimateVersion);
      
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

      var assem, f, assemOption;
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
      //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
      //==========================================================================================
    
      //DRIVING
      
      //==========================================================================================
      //1. ADD DISTANCE  DICTIONARY
      estimate.distance = distance(zipCode, city);
      var miles = estimate.distance("Van Nuys")
      
      //2. ADD DRIVING TIME TO TRUCK DICTIONARY (ROUND TRIP at 55mph)
      estimate.trucks.drivingTime = drivingTime((estimate.distance("Van Nuys")))
      var drivingTimeHrs = estimate.trucks.drivingTime
      
      //3. DETERMINE IF OVERNIGHT
      if (gypExists === true) {
            dict = getValues("Prices_PerDiem", Array("Per Diem"), Array.Default, Array("Miles Threshold"))
            //the assumption is it must be a certain minimum distance and must have soundmat
            //what if it is only gyp though? good question for Tamir. but let//s study this first.
            if (miles > dict("Miles Threshold") && estimate.totals.gypSFWithSoundMat !== 0) {
                  overnight = true
            }
      }
      //==========================================================================================
      //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
      //==========================================================================================
            
      //SIZE
            
      //==========================================================================================
      if (gypExists === true) {
            if (totalGypSF <= 400) {
                  estimate.gyp.size = "Small Pour"
            } else {
                  estimate.gyp.size = "Normal"
            }
      }
      //==========================================================================================
      //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
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
      
            gypLabor wageType, projectType, totalGypSF, totalGypSFWithSoundMat, gypThick1stAssem, difficultyLevel, gypType, miles, overnight, saturdayGyp, estimate, overrideGypBarrelMix
            estimate.totals.gypCostAfterMilesThreshold = estimate.gyp.labor.costOfAfterMilesThreshold //more will be added later
            estimate.gyp.labor.mobilizationsSoundMat = gypMobilizations((estimate.totals.gypSFWithSoundMat), "Normal")
            dict = addMobilsCost((estimate.gyp.labor.addMobils.mobils), (estimate.gyp.labor.addMobils.mobilCost), wageType)
            estimate.gyp.labor.addMobils.addMobilsCost = dict.addMobilsCostTotal
            estimate.gyp.labor.addMobils.enabled = false
            estimate.totals.gypCostAddMobilsProduction = dict.addMobilsCostProduction
            estimate.totals.gypCostAddMobilsTotal = dict.addMobilsCostTotal
            estimate.totals.gypCostSaturdayOption = estimate.gyp.labor.costOfGypLaborOption //more will be added later
      }
      //==========================================================================================
      //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
      //==========================================================================================
                                                                                                                                                                                                      
      //CALCULATE MATERIALS AND LABOR FOR GYPCRETE AND CONCRETE
      
      //==========================================================================================
      //LOOP OVER EACH STRUCTURE
      //==========================================================================================
      var totals = estimate.totals
      for(structure in estimate.structures) {
            //==========================================================================================
            //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
            //==========================================================================================
            // LOOP OVER EACH GYP ASSEM
            //==========================================================================================
            for(gypAssem in estimate.structures[structure].gypAssemblies) {
                  
                  //1. SET ASSEM VARIABLE FOR EASIER ACCESS
                  assem = (estimate.structures[structure].gypAssemblies[gypAssem])
                  
                  //2. CALCULATE MATERIALS AND LABOR COSTS FOR ASSEMBLY
                  calculateGypAssembly estimate, assem, mixDesign, wageType, sameDay, overnight, miles, projectType, saturdayGyp
                  
                  //3. LOOP OVER EACH FLOOR
                  for(Floor in estimate.structures[structure].gypAssemblies[gypAssem].floors) {
                      //1. SET F VARIABLE FOR EASIER ACCESS
                      f = estimate.structures[structure].gypAssemblies[gypAssem].floors[Floor]
                      //2. CALCULATE MATERIALS AND COSTS FOR FLOOR
                      materialsAndCostsGyp f, assem, mixDesign, wageType, projectType, saturdayGyp
                  }
                  
                  //4. LOOP OVER EACH OPTION
                  for(opt in estimate.structures[structure].gypAssemblies[gypAssem].options) {
                      //1. SET assemOption VARIABLE FOR EASIER ACCESS
                      assemOption = estimate.structures[structure].gypAssemblies[gypAssem].options[opt]
                      //2. CALCULATE MATERIALS AND COSTS FOR FLOOR
                      calculateGypAssembly estimate, assemOption, mixDesign, wageType, sameDay, overnight, miles, projectType, saturdayGyp
                      //3. CALCULATE DIFFERENCE BETWEEN OPTION ASSEMBLY AND REGULAR ASSEMBLY
                      assemOption.difference = assemOption.gypAssemCost - assem.gypAssemCost
                  }
           
                  //6. TOTAL GYP BAGS, ADD TO IT THE AMOUNT OF GYP BAGS
                  totals.gypBags = totals.gypBags + assem.gypBags
                  
                  //7. TOTAL TONS, ADD TO IT THE AMOUNT OF TONS
                  totals.gypTons = totals.gypTons + assem.tons

                  //8. TOTAL GYP ASSEMBLIES COST, ADD TO IT THIS GYP ASSEMBLY COST
                  totals.gypCostAssemsMaterialAndLabor = totals.gypCostAssemsMaterialAndLabor + assem.gypAssemCost
                  
                  //PER DIEM
                  totals.gypCostPerDiem = totals.gypCostPerDiem + assem.costOfPerDiem
                  
                  //AFTER MILES THRESHOLD
                  totals.gypCostAfterMilesThreshold = totals.gypCostAfterMilesThreshold + assem.costAfterMilesThresholdSoundMat
                  
                  //SATURDAY COST
                  totals.gypCostSaturdayOption = totals.gypCostSaturdayOption + assem.costOfTonsOption
                
            }
            //==========================================================================================
            //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
            //==========================================================================================
            //PREPOURS
            //==========================================================================================
            if (estimate.structures[structure].prePours.tubs !== 0) {
                  
                  //1. CALCULATE MATERIAL QUANTITIES AND COSTS
                  estimate.structures[structure].prePours.gypBags = estimate.structures[structure].prePours.tubs
                  estimate.structures[structure].prePours.costOfGypBags = costOfGypBags("2010+", (estimate.structures[structure].prePours.gypBags))
                  estimate.structures[structure].prePours.tons = tons("2010+", (estimate.structures[structure].prePours.gypBags), 0)
                  estimate.structures[structure].prePours.costOfTons = costOfTons((estimate.structures[structure].prePours.tons), "No").cost
                  estimate.structures[structure].prePours.costOfMaterials = estimate.structures[structure].prePours.costOfGypBags + estimate.structures[structure].prePours.costOfTons
              
                  //2. CALCULATE MOBILIZATIONS
                  estimate.structures[structure].prePours.mobilizations = prePourMobilizations((estimate.structures[structure].prePours.tubs))
              
                  //3. CALCULATE LABOR CREW
                  estimate.structures[structure].prePours.laborCrew = prePourLaborCrew((estimate.structures[structure].prePours.tubs), (estimate.structures[structure].prePours.mobilizations))
            
                  //4. CALCULATE LABOR CREW TOTAL COST
                  estimate.structures[structure].prePours.costOfPrePoursLabor = costOfPrePoursLabor(wageType, (estimate.structures[structure].prePours.laborCrew.Laborers), miles)
              
                  //5. CALCULATE TOTAL COST OF PREPOURS (WITHOUT OVERTIME)
                   estimate.structures[structure].prePours.costOfPrePours = estimate.structures[structure].prePours.costOfMaterials + estimate.structures[structure].prePours.costOfPrePoursLabor
              
                  //6. CALCULATE OVER TIME COST
                  estimate.structures[structure].prePours.costOfOverTimePrePours = costOfOverTimePrePours(wageType, (estimate.trucks.drivingTime), (estimate.structures[structure].prePours.mobilizations))
                  
                  //7. ADD TO THE TOTALS
                  estimate.totals.prePoursCostMaterials = estimate.totals.prePoursCostMaterials + estimate.structures[structure].prePours.costOfMaterials
                  estimate.totals.prePoursCostLabor = estimate.totals.prePoursCostLabor + estimate.structures[structure].prePours.costOfPrePoursLabor
                  estimate.totals.prePoursCostMaterialAndLabor = estimate.totals.prePoursCostMaterialAndLabor + estimate.structures[structure].prePours.costOfPrePours
                  estimate.gyp.labor.mobilizationsPrePours = estimate.gyp.labor.mobilizationsPrePours + estimate.structures[structure].prePours.mobilizations
                  estimate.gyp.labor.costOfOverTimePrePoursLabor = estimate.gyp.labor.costOfOverTimePrePoursLabor + estimate.structures[structure].prePours.costOfOverTimePrePours

                  tempDict = getValues("Prices_AfterMileThreshold", Array.Description, Array.Threshold, Array("Miles", "Price/Day"))
                  if (miles > tempDict.Miles) {
                        estimate.totals.prePoursCostAfterMilesThreshold = estimate.totals.prePoursCostAfterMilesThreshold + (((estimate.structures[structure].prePours.laborCrew.Laborers) - 1) * (estimate.structures[structure].prePours.mobilizations) * tempDict("Price/Day"))
                        if (estimate.structures[structure].prePours.contractOrOption === "Contract") {
                              totals.gypCostAfterMilesThreshold = totals.gypCostAfterMilesThreshold + (((estimate.structures[structure].prePours.laborCrew.Laborers) - 1) * (estimate.structures[structure].prePours.mobilizations) * tempDict("Price/Day"))
                        }
                  }
                  
                  //IF CONTRACT
                  if (estimate.structures[structure].prePours.contractOrOption === "Contract") {
                        estimate.totals.gypCostAssemsMaterialAndLabor = estimate.totals.gypCostAssemsMaterialAndLabor + estimate.structures[structure].prePours.costOfPrePours
                  }
                  
            }
            //==========================================================================================
            //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
            //==========================================================================================
            //ADU REGULATION
            //==========================================================================================
            if (estimate.structures[structure].aduRegulation.units !== 0) {
                  
                  //1. CALCULATE MATERIAL QUANTITIES AND COSTS
                  estimate.structures[structure].aduRegulation.gypBags = estimate.structures[structure].aduRegulation.units
                  estimate.structures[structure].aduRegulation.costOfGypBags = costOfGypBags("2010+", (estimate.structures[structure].aduRegulation.gypBags))
                  estimate.structures[structure].aduRegulation.tons = tons("2010+", (estimate.structures[structure].aduRegulation.gypBags), mixDesign)
                  estimate.structures[structure].aduRegulation.costOfTons = costOfTons((estimate.structures[structure].aduRegulation.tons), "No").cost
                  estimate.structures[structure].aduRegulation.stringLineRolls = stringLineRolls((estimate.structures[structure].aduRegulation.units) * 194) //60 LF for each kitchen. that will convert to 194SF
                  estimate.structures[structure].aduRegulation.costOfStringLineRolls = costOfStringLineRolls((estimate.structures[structure].aduRegulation.stringLineRolls))
                  estimate.structures[structure].aduRegulation.costOfMaterials = estimate.structures[structure].aduRegulation.costOfGypBags + estimate.structures[structure].aduRegulation.costOfTons + estimate.structures[structure].aduRegulation.costOfStringLineRolls
                  
                  //2. MOBILIZATIONS WOULD BE SAME AS PRODUCTION MOBILIZATIONS
                  estimate.structures[structure].aduRegulation.mobilizations = estimate.gyp.labor.mobilizations

                  //3. CALCULATE LABOR CREW TOTAL COST
                  estimate.structures[structure].aduRegulation.costOfADURegLabor = costOfADURegLabor(wageType, (estimate.structures[structure].aduRegulation.mobilizations))


                  //4. CALCULATE TOTAL COST OF ADU REGULATION
                   estimate.structures[structure].aduRegulation.costOfADUReg = estimate.structures[structure].aduRegulation.costOfMaterials + estimate.structures[structure].aduRegulation.costOfADURegLabor

                  //5. ADD TO THE TOTALS
                  estimate.totals.ADURegCostMaterials = estimate.totals.ADURegCostMaterials + estimate.structures[structure].aduRegulation.costOfMaterials
                  estimate.totals.ADURegCostLabor = estimate.totals.ADURegCostLabor + estimate.structures[structure].aduRegulation.costOfADURegLabor
                  estimate.totals.ADURegCostMaterialAndLabor = estimate.totals.ADURegCostMaterialAndLabor + estimate.structures[structure].aduRegulation.costOfADUReg
                  estimate.totals.ADURegMobilizations = estimate.totals.ADURegMobilizations + estimate.structures[structure].aduRegulation.mobilizations
                  
                  //IF CONTRACT
                  if (estimate.structures[structure].aduRegulation.contractOrOption === "Contract") {
                        estimate.totals.gypCostAssemsMaterialAndLabor = estimate.totals.gypCostAssemsMaterialAndLabor + estimate.structures[structure].aduRegulation.costOfADUReg
                  }
                 
            }
            //==========================================================================================
            //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
            //==========================================================================================
            //LOOP OVER EACH CONC ASSEMBLY
            //==========================================================================================
            for(concAssem in estimate.structures[structure].concAssemblies) {
                  
                  //1. SET VARIABLE ASSEM FOR EASIER ACCESS TO THIS CONCRETE ASSEMBLY DICTIONARY
                  assem = (estimate.structures[structure].concAssemblies[concAssem])
       
                  //2. SET VARIABLE NUM_OF_FLOORS
                  var numOfFloors = assem.floors.count
                  
                  //3. CALCULATE CONCRETE MATERIALS
                  calculateConcAssembly assem, drivingTimeHrs, wageType, city, miles, zipCode, saturdayConc, concPumpCostOption, numOfFloors, overrideConcBarrelMix
                  
                  //4. LOOP OVER EACH FLOOR
                  for(Floor in assem.floors) {
                      //1. SET F VARIABLE FOR EASIER ACCESS
                      f = assem.floors[Floor]
                      //2. CALCULATE MATERIALS AND COSTS FOR FLOOR
                      materialsAndCostsConc f, assem, wageType, (projData.projectInfo.city), zipCode, saturdayConc, overrideConcBarrelMix
                  }
                  
                  //5. LOOP OVER EACH OPTION
                  for(opt in assem.options) {
                      //1. SET assemOption VARIABLE FOR EASIER ACCESS
                      assemOption = assem.options[opt]
                      //2. CALCULATE MATERIALS AND COSTS FOR FLOOR
                      calculateConcAssembly assemOption, drivingTimeHrs, wageType, (projData.projectInfo.city), miles, zipCode, saturdayConc, concPumpCostOption, numOfFloors, overrideConcBarrelMix
                      //3. CALCULATE DIFFERENCE BETWEEN OPTION ASSEMBLY AND REGULAR ASSEMBLY
                      assemOption.difference = assemOption.costTotal - assem.costTotal
                  }
                  
                  //5. ADD TO TOTAL VARIABLES
                  if (assem.contractOrOption === "Contract") {
                        totals.concYds = totals.concYds + assem.concYds
                        totals.concPumpTimeHrs = totals.concPumpTimeHrs + assem.equip.pumpTimeHrs
                        totals.concMobilizations = totals.concMobilizations + assem.labor.concMobilizations
                        
                        totals.concCostMachineFuel = totals.concCostMachineFuel + assem.equip.costFuel.pump
                        totals.concCostMachineMaintenance = totals.concCostMachineMaintenance + assem.equip.costMaintenance.pump
                        totals.concCostEquip = totals.concCostEquipment + assem.equip.costFuel.pump + assem.equip.costMaintenance.pump
                        
                        totals.concCostLabor = totals.concCostLabor + assem.labor.costOfConcLaborers //what about sm labor?? right???

                        totals.concCostSaturdayOption = totals.concCostSaturdayOption + assem.costOfConcYdsOption + assem.labor.costOfConcLaborersOption
            
                        totals.concCostTrucksFuel = totals.concCostTrucksFuel + assem.trucks.costFuel
                        totals.concCostTrucksMaintenance = totals.concCostTrucksMaintenance + assem.trucks.costMaintenance
                        totals.concCostOverTimeLabor = totals.concCostOverTimeLabor + assem.labor.costOfOverTimeConcLabor + assem.labor.costOfOverTimeSoundMatLabor
                        totals.concCostAfterMilesThreshold = totals.concCostAfterMilesThreshold + assem.costAfterMilesThreshold
                        totals.concCostTravel = totals.concCostTravel + assem.costTravel
                        
                        totals.concCostProduction = totals.concCostProduction + assem.costProduction
                        totals.concCostTotal = totals.concCostTotal + assem.costTotal
                  }
            
            }
      }
      //==========================================================================================
      //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
      //==========================================================================================
            
      //GYP - COSTS BASED ON TOTAL SF
            
      //==========================================================================================
      //PERIMETER FOAM CUTTING //theres no "No" option for perimeter foam cutting
      estimate.gyp.labor.laborers.perFoamCuttingLaborers = perFoamCuttingLaborers[totalGypSF]
      estimate.totals.gypCostPerFoamCutting = costOfPerFoamCutting(wageType, (estimate.gyp.labor.laborers.perFoamCuttingLaborers))
      if (estimate.gyp.perFoamCutting === "Yes") {
            estimate.totals.gypCostAssemsMaterialAndLabor = estimate.totals.gypCostAssemsMaterialAndLabor + estimate.totals.gypCostPerFoamCutting
      }
      
      //FLAGMEN //for building it would be no
      if (estimate.gyp.flagmen !== "No") {
            if (estimate.gyp.flagmen === "Yes") {
                  estimate.totals.gypCostAssemsMaterialAndLabor = estimate.totals.gypCostAssemsMaterialAndLabor + estimate.gyp.labor.costOfGypFlagmenLabor
            }
      }
      
      //STRING LINE GRID SYSTEM //for building it would be no
      if (estimate.gyp.slgs !== "No") {
            estimate.totals.stringLineRolls = stringLineRolls[totalGypSF]
            estimate.totals.costOfStringLineRolls = costOfStringLineRolls((estimate.totals.stringLineRolls))
            estimate.totals.costOfStringLineInstallation = estimate.totals.costOfStringLineRolls + estimate.gyp.labor.costOfGypStringLineLabor
            if (estimate.gyp.slgs === "Yes") {
                  estimate.totals.gypCostAssemsMaterialAndLabor = estimate.totals.gypCostAssemsMaterialAndLabor + estimate.totals.costOfStringLineInstallation
            }
      }
      
      //MOIST STOP
      if (estimate.gyp.moistStop !== "No" && estimate.gyp.moistStop !== Empty) {
            estimate.totals.blackPaperRollsMoistStop = blackPaperRollsMoistStop("Default", totalGypSF)
            estimate.totals.costOfBlackPaperRollsMoistStop = costOfBlackPaperRolls("1-Ply (10 Min Single Layer)", (estimate.totals.blackPaperRollsMoistStop))
            estimate.totals.moistStopLaborers = blackPaperMoistStopLaborers[totalGypSF]
            estimate.totals.costOfMoistStopLaborers = costOfBlackPaperLaborers(wageType, (estimate.totals.moistStopLaborers))
            estimate.totals.costOfMoistStop = estimate.totals.costOfBlackPaperRollsMoistStop + estimate.totals.costOfMoistStopLaborers
            if (estimate.gyp.moistStop === "Yes") {
                  estimate.totals.gypCostAssemsMaterialAndLabor = estimate.totals.gypCostAssemsMaterialAndLabor + estimate.totals.costOfMoistStop
            }
      }
      
      //SEALER
      if (estimate.gyp.sealer !== "No" && estimate.gyp.sealer !== Empty) {
            estimate.totals.sealerGallons = sealerGallons("Gyp", (estimate.gyp.sealerType), totalGypSF)
            estimate.totals.costOfSealerGallons = costOfSealerGallons("Gyp", (estimate.gyp.sealerType), totalGypSF)
            if (estimate.gyp.sealer === "Yes") {
                  estimate.totals.gypCostAssemsMaterialAndLabor = estimate.totals.gypCostAssemsMaterialAndLabor + estimate.totals.costOfSealerGallons
            }
      }
      
      //RAM BOARD
      if (estimate.gyp.ramboard !== "No" && estimate.gyp.ramboard !== Empty) {
            estimate.totals.ramBoardRolls = ramBoardRolls[totalGypSF]
            estimate.totals.costOfRamBoardRolls = costOfRamBoardRolls((estimate.totals.ramBoardRolls))
            estimate.totals.ductTapeRollsForRamBoard = ductTapeRollsForRamBoard[totalGypSF]
            estimate.totals.costOfDuctTapeRollsForRamBoard = costOfDuctTapeRolls((estimate.totals.ductTapeRollsForRamBoard))
            estimate.totals.ramBoardLaborers = soundMatLaborers(totalGypSF, false, (estimate.gyp.labor.mobilizations), "2010+")
            estimate.totals.costOfRamBoardLaborers = costOfSoundMatLabor((estimate.totals.ramBoardLaborers), wageType)
            estimate.totals.costOfRamBoard = estimate.totals.costOfRamBoardRolls + estimate.totals.costOfDuctTapeRollsForRamBoard + estimate.totals.costOfRamBoardLaborers
            if (estimate.gyp.ramboard === "Yes") {
                  estimate.totals.gypCostAssemsMaterialAndLabor = estimate.totals.gypCostAssemsMaterialAndLabor + estimate.totals.costOfRamBoard
            }
      }
      

      //==========================================================================================
      //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
      //==========================================================================================
            
      //TRUCKS
            
      //==========================================================================================
      calculateTrucks estimate, gypExists, concExists, overnight, sameDay
      
      //==========================================================================================
      //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
      //==========================================================================================
            
      //EQUIPMENT
            
      //==========================================================================================
      calculateEquip estimate, gypExists, concExists
      
      //==========================================================================================
      //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
      //==========================================================================================
      
      //TIME
      
      //==========================================================================================
      estimate.gyp.time = {}
      estimate.gyp.time.setupTime = setupTime[projectType]
      estimate.gyp.time.cleanupTime = cleanupTime //fn
      estimate.gyp.time.lunchTime = lunchTime //fn
      //==========================================================================================
      //OVERTIME LABOR COST
      //==========================================================================================
      var estimate_gyp_time = estimate.gyp.time //i think i did these two like this since it wasn//t working otherwise?
      var estimate_gyp_equip = estimate.gyp.equip
      
      //1. OVERTIME FOR GYP
      estimate.gyp.labor.overTimeGypLabor = overTimeGypLabor(wageType, (estimate.gyp.labor.mobilizations), (estimate.gyp.labor.laborers.Laborers), (estimate.trucks.drivingTime), estimate_gyp_time, estimate_gyp_equip, estimate.structures, (estimate.totals.gypBags), overnight)
      
      //2. OVER TIME FOR SOUND MAT
      if (sameDay !== "Yes") {
            estimate.gyp.labor.costOfOverTimeSoundMatLabor = costOfOverTimeSoundMatLabor(wageType, (estimate.gyp.labor.mobilizationsSoundMat), (estimate.trucks.drivingTime), overnight)
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
                                              estimate.totals.gypCostAfterMilesThreshold + _
                                              estimate.totals.gypCostPerDiem
                                              
            if (estimate.structures.structure1.prePours.contractOrOption === "Contract") {
                  estimate.totals.gypCostTravel = estimate.totals.gypCostTravel + estimate.totals.prePoursCostTravel
            }
            
      }
      
      //==========================================================================================
      //||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
      //==========================================================================================
            
      //PRODUCTION COSTS AND TOTALS
            
      //=========================================================================================
      //GYPCRETE
      if (gypExists === true) {
            estimate.totals.gypCostProduction = estimate.totals.gypCostAssemsMaterialAndLabor + _
                                                                                  estimate.totals.gypCostEquip + _
                                                                                  estimate.gyp.labor.overTimeGypLabor.costOfOverTimeGypLaborCrew + _
                                                                                  estimate.totals.gypCostTravel
                                                                                  
            estimate.totals.gypCostTotalMarket = costAfterMargin((estimate.totals.gypCostProduction), (estimate.totals.gypMarginMarket))
            estimate.totals.gypCostTotalInter = costAfterMargin((estimate.totals.gypCostProduction), (estimate.totals.gypMarginInter))
            estimate.totals.gypCostTotal = costAfterMargin((estimate.totals.gypCostProduction), (estimate.totals.gypMargin))
      }
      
      //CONCRETE
      if (concExists === true) {
            estimate.totals.concCostTotalMarket = costAfterMargin((estimate.totals.concCostProduction), (estimate.totals.concMarginMarket))
            estimate.totals.concCostTotalInter = Round(estimate.totals.concCostTotal + 0.49)
            estimate.totals.concCostTotal = estimate.totals.concCostTotalInter
            
            estimate.totals.concMarginInter = ((totals.concCostTotal - totals.concCostProduction) / totals.concCostTotal) * 100
            estimate.totals.concMargin = estimate.totals.concMarginInter
      }
      
      estimate.totals.grandCostTotal = estimate.totals.gypCostTotal + estimate.totals.concCostTotal

      //=============================================================

      estimate.totalsPerGypFloor = calculatePerGypFloorTotals[estimate]
      

      //=============================================================
      //CALCULATE OPTIONALS
      //=============================================================
      //1. CHECK IF OPTIONALS DICT ALREADY EXISTS
      if (estimate.optionals) {
            delete estimate.optionals
      }
      
      //2. MAKE OPTIONALS DICT
      estimate.optionals = calculateOptionals(projData, estimateVersion)
      
      //=============================================================
      //CALCULATE SOV
      //=============================================================
      //1. CHECK IF SCHEDULE OF VALUES DICT ALREADY EXISTS
      if (estimate.scheduleOfValues) {
            delete estimate.scheduleOfValues
      }
      
      //2. MAKE SCHEDULE OF VALUES DICT
      estimate.scheduleOfValues = calculateSOV(projData, estimateVersion)

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
      //duct tape rolls for black paper will be calculated in the same way as duct tape rolls for ramboard
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
