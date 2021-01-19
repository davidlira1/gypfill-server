Sub calcGyp(projData As Dictionary, estimateVersion As Byte)
      '1. SET THIS ESTIMATE'S VERSION OBJECT
      Dim estimate As Dictionary: Set estimate = projData("estimates")("estimate" & estimateVersion)
      
      '2. SOME SOME VARIABLES WITH VALUES FROM PROJ DATA FOR EASIER ACCESS
      Dim projectType As String: projectType = projData("projectInfo")("projectType") 'House, Building, Multi-Building, Unit
      If projectType = "Unit" Then
            projectType = "Building"
      End If
      Dim wageType As String: wageType = projData("projectInfo")("wageType") 'Non-Prevailing, Prevailing
      Dim mixDesign As Double: mixDesign = estimate("gyp")("mixDesign") '0, 1.4
      Dim overnight As Boolean: overnight = False
      Dim saturdayGyp As String: saturdayGyp = estimate("saturday")("gyp")
      Dim saturdayConc As String: saturdayConc = estimate("saturday")("conc")
      Dim city As String: city = projData("projectInfo")("city")
      Dim zipCode As Long: zipCode = CLng((projData("projectInfo")("zipCode")))
      Dim concPumpCostOption As String: concPumpCostOption = estimate("conc")("concPumpCostOption")
      Dim totalGypSF As Long: totalGypSF = estimate("totals")("gypSF")
      Dim totalGypSFWithSoundMat As Long: totalGypSFWithSoundMat = estimate("totals")("gypSFWithSoundMat")
      Dim overrideGypBarrelMix As String: overrideGypBarrelMix = estimate("gyp")("overrideGypBarrelMix")
      Dim overrideConcBarrelMix As String: overrideConcBarrelMix = estimate("gyp")("overrideConcBarrelMix")

      Dim assem As Dictionary: Dim f As Dictionary: Dim assemOption As Dictionary
      Dim dict As Dictionary
      '==========================================================================================
      Dim gypExists As Boolean: gypExists = False
      If estimate("structures")("structure1")("gypAssemblies").Exists("gypAssem1") Then
            gypExists = True
      End If

      Dim concExists As Boolean: concExists = False
      If estimate("structures")("structure1")("concAssemblies").Exists("concAssem1") Then
            If estimate("structures")("structure1")("concAssemblies")("concAssem1")("contractOrOption") = "Contract" Then
                  concExists = True
            End If
      End If
      '==========================================================================================
      '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
      '==========================================================================================
    
      'DRIVING
      
      '==========================================================================================
      '1. ADD DISTANCE  DICTIONARY
      estimate.Add "distance", distance((projData("projectInfo")("zipCode")), (projData("projectInfo")("city")))
      Dim miles As Integer: miles = estimate("distance")("Van Nuys")
      
      '2. ADD DRIVING TIME TO TRUCK DICTIONARY (ROUND TRIP at 55mph)
      estimate("trucks").Add "drivingTime", drivingTime((estimate("distance")("Van Nuys")))
      Dim drivingTimeHrs As Double: drivingTimeHrs = estimate("trucks")("drivingTime")
      
      '3. DETERMINE IF OVERNIGHT
      If gypExists = True Then
            Set dict = getValues("Prices_PerDiem", Array("Per Diem"), Array("Default"), Array("Miles Threshold"))
            'the assumption is it must be a certain minimum distance and must have soundmat
            'what if it is only gyp though? good question for Tamir. but let's study this first.
            If miles > dict("Miles Threshold") And estimate("totals")("gypSFWithSoundMat") <> 0 Then
                  overnight = True
            End If
      End If
      '==========================================================================================
      '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
      '==========================================================================================
            
      'SIZE
            
      '==========================================================================================
      If gypExists = True Then
            If totalGypSF <= 400 Then
                  estimate("gyp").Add "size", "Small Pour"
            Else
                  estimate("gyp").Add "size", "Normal"
            End If
      End If
      '==========================================================================================
      '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
      '==========================================================================================
                  
      'GYPCRETE LABOR
                  
      '==========================================================================================
      If gypExists = True Then
            Dim gypThick1stAssem As Double: gypThick1stAssem = estimate("structures")("structure1")("gypAssemblies")("gypAssem1")("gypThick")
            Dim difficultyLevel As String: difficultyLevel = estimate("gyp")("difficultyLevel")
            Dim gypType As String: gypType = estimate("structures")("structure1")("gypAssemblies")("gypAssem1")("gypType")
      
            If estimate("totals")("gypSFWithSoundMat") > 0 And estimate("totals")("gypSFWithSoundMat") <= 4000 Then
                  estimate("gyp")("sameDay") = "Yes"
            Else
                  estimate("gyp")("sameDay") = "No"
            End If
            
            Dim sameDay As String: sameDay = estimate("gyp")("sameDay")
      
            gypLabor wageType, projectType, totalGypSF, totalGypSFWithSoundMat, gypThick1stAssem, difficultyLevel, gypType, miles, overnight, saturdayGyp, estimate, overrideGypBarrelMix
            estimate("totals")("gypCostAfterMilesThreshold") = estimate("gyp")("labor")("costOfAfterMilesThreshold") 'more will be added later
            estimate("gyp")("labor").Add "mobilizationsSoundMat", gypMobilizations((estimate("totals")("gypSFWithSoundMat")), "Normal")
            Set dict = addMobilsCost((estimate("gyp")("labor")("addMobils")("mobils")), (estimate("gyp")("labor")("addMobils")("mobilCost")), wageType)
            estimate("gyp")("labor")("addMobils").Add "addMobilsCost", dict("addMobilsCostTotal")
            estimate("gyp")("labor")("addMobils")("enabled") = False
            estimate("totals").Add "gypCostAddMobilsProduction", dict("addMobilsCostProduction")
            estimate("totals").Add "gypCostAddMobilsTotal", dict("addMobilsCostTotal")
            estimate("totals")("gypCostSaturdayOption") = estimate("gyp")("labor")("costOfGypLaborOption") 'more will be added later
      End If
      '==========================================================================================
      '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
      '==========================================================================================
                                                                                                                                                                                                      
      'CALCULATE MATERIALS AND LABOR FOR GYPCRETE AND CONCRETE
      
      '==========================================================================================
      'LOOP OVER EACH STRUCTURE
      '==========================================================================================
      Dim totals As Dictionary: Set totals = estimate("totals")
      For Each structure In estimate("structures").Keys
            '==========================================================================================
            '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
            '==========================================================================================
            ' LOOP OVER EACH GYP ASSEM
            '==========================================================================================
            For Each gypAssem In estimate("structures")(structure)("gypAssemblies").Keys
                  
                  '1. SET ASSEM VARIABLE FOR EASIER ACCESS
                  Set assem = (estimate("structures")(structure)("gypAssemblies")(gypAssem))
                  
                  '2. CALCULATE MATERIALS AND LABOR COSTS FOR ASSEMBLY
                  calculateGypAssembly estimate, assem, mixDesign, wageType, sameDay, overnight, miles, projectType, saturdayGyp
                  
                  '3. LOOP OVER EACH FLOOR
                  For Each Floor In estimate("structures")(structure)("gypAssemblies")(gypAssem)("floors").Keys
                      '1. SET F VARIABLE FOR EASIER ACCESS
                      Set f = estimate("structures")(structure)("gypAssemblies")(gypAssem)("floors")(Floor)
                      '2. CALCULATE MATERIALS AND COSTS FOR FLOOR
                      materialsAndCostsGyp f, assem, mixDesign, wageType, projectType, saturdayGyp
                  Next Floor
                  
                  '4. LOOP OVER EACH OPTION
                  For Each opt In estimate("structures")(structure)("gypAssemblies")(gypAssem)("options").Keys
                      '1. SET assemOption VARIABLE FOR EASIER ACCESS
                      Set assemOption = estimate("structures")(structure)("gypAssemblies")(gypAssem)("options")(opt)
                      '2. CALCULATE MATERIALS AND COSTS FOR FLOOR
                      calculateGypAssembly estimate, assemOption, mixDesign, wageType, sameDay, overnight, miles, projectType, saturdayGyp
                      '3. CALCULATE DIFFERENCE BETWEEN OPTION ASSEMBLY AND REGULAR ASSEMBLY
                      assemOption.Add "difference", assemOption("gypAssemCost") - assem("gypAssemCost")
                  Next opt
           
                  '6. TOTAL GYP BAGS: ADD TO IT THE AMOUNT OF GYP BAGS
                  totals("gypBags") = totals("gypBags") + assem("gypBags")
                  
                  '7. TOTAL TONS: ADD TO IT THE AMOUNT OF TONS
                  totals("gypTons") = totals("gypTons") + assem("tons")

                  '8. TOTAL GYP ASSEMBLIES COST: ADD TO IT THIS GYP ASSEMBLY COST
                  totals("gypCostAssemsMaterialAndLabor") = totals("gypCostAssemsMaterialAndLabor") + assem("gypAssemCost")
                  
                  'PER DIEM
                  totals("gypCostPerDiem") = totals("gypCostPerDiem") + assem("costOfPerDiem")
                  
                  'AFTER MILES THRESHOLD
                  totals("gypCostAfterMilesThreshold") = totals("gypCostAfterMilesThreshold") + assem("costAfterMilesThresholdSoundMat")
                  
                  'SATURDAY COST
                  totals("gypCostSaturdayOption") = totals("gypCostSaturdayOption") + assem("costOfTonsOption")
                
            Next gypAssem
            '==========================================================================================
            '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
            '==========================================================================================
            'PREPOURS
            '==========================================================================================
            If estimate("structures")(structure)("prePours")("tubs") <> 0 Then
                  
                  '1. CALCULATE MATERIAL QUANTITIES AND COSTS
                  estimate("structures")(structure)("prePours").Add "gypBags", estimate("structures")(structure)("prePours")("tubs")
                  estimate("structures")(structure)("prePours").Add "costOfGypBags", costOfGypBags("2010+", (estimate("structures")(structure)("prePours")("gypBags")))
                  estimate("structures")(structure)("prePours").Add "tons", tons("2010+", (estimate("structures")(structure)("prePours")("gypBags")), 0)
                  estimate("structures")(structure)("prePours").Add "costOfTons", costOfTons((estimate("structures")(structure)("prePours")("tons")), "No")("cost")
                  estimate("structures")(structure)("prePours").Add "costOfMaterials", estimate("structures")(structure)("prePours")("costOfGypBags") + estimate("structures")(structure)("prePours")("costOfTons")
              
                  '2. CALCULATE MOBILIZATIONS
                  estimate("structures")(structure)("prePours").Add "mobilizations", prePourMobilizations((estimate("structures")(structure)("prePours")("tubs")))
              
                  '3. CALCULATE LABOR CREW
                  estimate("structures")(structure)("prePours").Add "laborCrew", prePourLaborCrew((estimate("structures")(structure)("prePours")("tubs")), (estimate("structures")(structure)("prePours")("mobilizations")))
            
                  '4. CALCULATE LABOR CREW TOTAL COST
                  estimate("structures")(structure)("prePours").Add "costOfPrePoursLabor", costOfPrePoursLabor(wageType, (estimate("structures")(structure)("prePours")("laborCrew")("Laborers")), miles)
              
                  '5. CALCULATE TOTAL COST OF PREPOURS (WITHOUT OVERTIME)
                   estimate("structures")(structure)("prePours").Add "costOfPrePours", estimate("structures")(structure)("prePours")("costOfMaterials") + estimate("structures")(structure)("prePours")("costOfPrePoursLabor")
              
                  '6. CALCULATE OVER TIME COST
                  estimate("structures")(structure)("prePours").Add "costOfOverTimePrePours", costOfOverTimePrePours(wageType, (estimate("trucks")("drivingTime")), (estimate("structures")(structure)("prePours")("mobilizations")))
                  
                  '7. ADD TO THE TOTALS
                  estimate("totals")("prePoursCostMaterials") = estimate("totals")("prePoursCostMaterials") + estimate("structures")(structure)("prePours")("costOfMaterials")
                  estimate("totals")("prePoursCostLabor") = estimate("totals")("prePoursCostLabor") + estimate("structures")(structure)("prePours")("costOfPrePoursLabor")
                  estimate("totals")("prePoursCostMaterialAndLabor") = estimate("totals")("prePoursCostMaterialAndLabor") + estimate("structures")(structure)("prePours")("costOfPrePours")
                  estimate("gyp")("labor")("mobilizationsPrePours") = estimate("gyp")("labor")("mobilizationsPrePours") + estimate("structures")(structure)("prePours")("mobilizations")
                  estimate("gyp")("labor")("costOfOverTimePrePoursLabor") = estimate("gyp")("labor")("costOfOverTimePrePoursLabor") + estimate("structures")(structure)("prePours")("costOfOverTimePrePours")

                  Set tempDict = getValues("Prices_AfterMileThreshold", Array("Description"), Array("Threshold"), Array("Miles", "Price/Day"))
                  If miles > tempDict("Miles") Then
                        estimate("totals")("prePoursCostAfterMilesThreshold") = estimate("totals")("prePoursCostAfterMilesThreshold") + (((estimate("structures")(structure)("prePours")("laborCrew")("Laborers")) - 1) * (estimate("structures")(structure)("prePours")("mobilizations")) * tempDict("Price/Day"))
                        If estimate("structures")(structure)("prePours")("contractOrOption") = "Contract" Then
                              totals("gypCostAfterMilesThreshold") = totals("gypCostAfterMilesThreshold") + (((estimate("structures")(structure)("prePours")("laborCrew")("Laborers")) - 1) * (estimate("structures")(structure)("prePours")("mobilizations")) * tempDict("Price/Day"))
                        End If
                  End If
                  
                  'IF CONTRACT
                  If estimate("structures")(structure)("prePours")("contractOrOption") = "Contract" Then
                        estimate("totals")("gypCostAssemsMaterialAndLabor") = estimate("totals")("gypCostAssemsMaterialAndLabor") + estimate("structures")(structure)("prePours")("costOfPrePours")
                  End If
                  
            End If
            '==========================================================================================
            '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
            '==========================================================================================
            'ADU REGULATION
            '==========================================================================================
            If estimate("structures")(structure)("aduRegulation")("units") <> 0 Then
                  
                  '1. CALCULATE MATERIAL QUANTITIES AND COSTS
                  estimate("structures")(structure)("aduRegulation").Add "gypBags", estimate("structures")(structure)("aduRegulation")("units")
                  estimate("structures")(structure)("aduRegulation").Add "costOfGypBags", costOfGypBags("2010+", (estimate("structures")(structure)("aduRegulation")("gypBags")))
                  estimate("structures")(structure)("aduRegulation").Add "tons", tons("2010+", (estimate("structures")(structure)("aduRegulation")("gypBags")), mixDesign)
                  estimate("structures")(structure)("aduRegulation").Add "costOfTons", costOfTons((estimate("structures")(structure)("aduRegulation")("tons")), "No")("cost")
                  estimate("structures")(structure)("aduRegulation").Add "stringLineRolls", stringLineRolls((estimate("structures")(structure)("aduRegulation")("units")) * 194) '60 LF for each kitchen. that will convert to 194SF
                  estimate("structures")(structure)("aduRegulation").Add "costOfStringLineRolls", costOfStringLineRolls((estimate("structures")(structure)("aduRegulation")("stringLineRolls")))
                  estimate("structures")(structure)("aduRegulation").Add "costOfMaterials", estimate("structures")(structure)("aduRegulation")("costOfGypBags") + estimate("structures")(structure)("aduRegulation")("costOfTons") + estimate("structures")(structure)("aduRegulation")("costOfStringLineRolls")
                  
                  '2. MOBILIZATIONS WOULD BE SAME AS PRODUCTION MOBILIZATIONS
                  estimate("structures")(structure)("aduRegulation").Add "mobilizations", estimate("gyp")("labor")("mobilizations")

                  '3. CALCULATE LABOR CREW TOTAL COST
                  estimate("structures")(structure)("aduRegulation").Add "costOfADURegLabor", costOfADURegLabor(wageType, (estimate("structures")(structure)("aduRegulation")("mobilizations")))


                  '4. CALCULATE TOTAL COST OF ADU REGULATION
                   estimate("structures")(structure)("aduRegulation").Add "costOfADUReg", estimate("structures")(structure)("aduRegulation")("costOfMaterials") + estimate("structures")(structure)("aduRegulation")("costOfADURegLabor")

                  '5. ADD TO THE TOTALS
                  estimate("totals")("ADURegCostMaterials") = estimate("totals")("ADURegCostMaterials") + estimate("structures")(structure)("aduRegulation")("costOfMaterials")
                  estimate("totals")("ADURegCostLabor") = estimate("totals")("ADURegCostLabor") + estimate("structures")(structure)("aduRegulation")("costOfADURegLabor")
                  estimate("totals")("ADURegCostMaterialAndLabor") = estimate("totals")("ADURegCostMaterialAndLabor") + estimate("structures")(structure)("aduRegulation")("costOfADUReg")
                  estimate("totals")("ADURegMobilizations") = estimate("totals")("ADURegMobilizations") + estimate("structures")(structure)("aduRegulation")("mobilizations")
                  
                  'IF CONTRACT
                  If estimate("structures")(structure)("aduRegulation")("contractOrOption") = "Contract" Then
                        estimate("totals")("gypCostAssemsMaterialAndLabor") = estimate("totals")("gypCostAssemsMaterialAndLabor") + estimate("structures")(structure)("aduRegulation")("costOfADUReg")
                  End If
                 
            End If
            '==========================================================================================
            '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
            '==========================================================================================
            'LOOP OVER EACH CONC ASSEMBLY
            '==========================================================================================
            For Each concAssem In estimate("structures")(structure)("concAssemblies").Keys
                  
                  '1. SET VARIABLE ASSEM FOR EASIER ACCESS TO THIS CONCRETE ASSEMBLY DICTIONARY
                  Set assem = (estimate("structures")(structure)("concAssemblies")(concAssem))
       
                  '2. SET VARIABLE NUM_OF_FLOORS
                  Dim numOfFloors As Byte: numOfFloors = assem("floors").count
                  
                  '3. CALCULATE CONCRETE MATERIALS
                  calculateConcAssembly assem, drivingTimeHrs, wageType, city, miles, zipCode, saturdayConc, concPumpCostOption, numOfFloors, overrideConcBarrelMix
                  
                  '4. LOOP OVER EACH FLOOR
                  For Each Floor In assem("floors").Keys
                      '1. SET F VARIABLE FOR EASIER ACCESS
                      Set f = assem("floors")(Floor)
                      '2. CALCULATE MATERIALS AND COSTS FOR FLOOR
                      materialsAndCostsConc f, assem, wageType, (projData("projectInfo")("city")), zipCode, saturdayConc, overrideConcBarrelMix
                  Next Floor
                  
                  '5. LOOP OVER EACH OPTION
                  For Each opt In assem("options").Keys
                      '1. SET assemOption VARIABLE FOR EASIER ACCESS
                      Set assemOption = assem("options")(opt)
                      '2. CALCULATE MATERIALS AND COSTS FOR FLOOR
                      calculateConcAssembly assemOption, drivingTimeHrs, wageType, (projData("projectInfo")("city")), miles, zipCode, saturdayConc, concPumpCostOption, numOfFloors, overrideConcBarrelMix
                      '3. CALCULATE DIFFERENCE BETWEEN OPTION ASSEMBLY AND REGULAR ASSEMBLY
                      assemOption.Add "difference", assemOption("costTotal") - assem("costTotal")
                  Next opt
                  
                  '5. ADD TO TOTAL VARIABLES
                  If assem("contractOrOption") = "Contract" Then
                        totals("concYds") = totals("concYds") + assem("concYds")
                        totals("concPumpTimeHrs") = totals("concPumpTimeHrs") + assem("equip")("pumpTimeHrs")
                        totals("concMobilizations") = totals("concMobilizations") + assem("labor")("concMobilizations")
                        
                        totals("concCostMachineFuel") = totals("concCostMachineFuel") + assem("equip")("costFuel")("pump")
                        totals("concCostMachineMaintenance") = totals("concCostMachineMaintenance") + assem("equip")("costMaintenance")("pump")
                        totals("concCostEquip") = totals("concCostEquipment") + assem("equip")("costFuel")("pump") + assem("equip")("costMaintenance")("pump")
                        
                        totals("concCostLabor") = totals("concCostLabor") + assem("labor")("costOfConcLaborers") 'what about sm labor?? right???

                        totals("concCostSaturdayOption") = totals("concCostSaturdayOption") + assem("costOfConcYdsOption") + assem("labor")("costOfConcLaborersOption")
            
                        totals("concCostTrucksFuel") = totals("concCostTrucksFuel") + assem("trucks")("costFuel")
                        totals("concCostTrucksMaintenance") = totals("concCostTrucksMaintenance") + assem("trucks")("costMaintenance")
                        totals("concCostOverTimeLabor") = totals("concCostOverTimeLabor") + assem("labor")("costOfOverTimeConcLabor") + assem("labor")("costOfOverTimeSoundMatLabor")
                        totals("concCostAfterMilesThreshold") = totals("concCostAfterMilesThreshold") + assem("costAfterMilesThreshold")
                        totals("concCostTravel") = totals("concCostTravel") + assem("costTravel")
                        
                        totals("concCostProduction") = totals("concCostProduction") + assem("costProduction")
                        totals("concCostTotal") = totals("concCostTotal") + assem("costTotal")
                  End If
            
            Next concAssem
      Next structure
      '==========================================================================================
      '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
      '==========================================================================================
            
      'GYP - COSTS BASED ON TOTAL SF
            
      '==========================================================================================
      'PERIMETER FOAM CUTTING 'theres no "No" option for perimeter foam cutting
      estimate("gyp")("labor")("laborers")("perFoamCuttingLaborers") = perFoamCuttingLaborers(totalGypSF)
      estimate("totals")("gypCostPerFoamCutting") = costOfPerFoamCutting(wageType, (estimate("gyp")("labor")("laborers")("perFoamCuttingLaborers")))
      If estimate("gyp")("perFoamCutting") = "Yes" Then
            estimate("totals")("gypCostAssemsMaterialAndLabor") = estimate("totals")("gypCostAssemsMaterialAndLabor") + estimate("totals")("gypCostPerFoamCutting")
      End If
      
      'FLAGMEN 'for building it would be no
      If estimate("gyp")("flagmen") <> "No" Then
            If estimate("gyp")("flagmen") = "Yes" Then
                  estimate("totals")("gypCostAssemsMaterialAndLabor") = estimate("totals")("gypCostAssemsMaterialAndLabor") + estimate("gyp")("labor")("costOfGypFlagmenLabor")
            End If
      End If
      
      'STRING LINE GRID SYSTEM 'for building it would be no
      If estimate("gyp")("slgs") <> "No" Then
            estimate("totals")("stringLineRolls") = stringLineRolls(totalGypSF)
            estimate("totals")("costOfStringLineRolls") = costOfStringLineRolls((estimate("totals")("stringLineRolls")))
            estimate("totals")("costOfStringLineInstallation") = estimate("totals")("costOfStringLineRolls") + estimate("gyp")("labor")("costOfGypStringLineLabor")
            If estimate("gyp")("slgs") = "Yes" Then
                  estimate("totals")("gypCostAssemsMaterialAndLabor") = estimate("totals")("gypCostAssemsMaterialAndLabor") + estimate("totals")("costOfStringLineInstallation")
            End If
      End If
      
      'MOIST STOP
      If estimate("gyp")("moistStop") <> "No" And estimate("gyp")("moistStop") <> Empty Then
            estimate("totals")("blackPaperRollsMoistStop") = blackPaperRollsMoistStop("Default", totalGypSF)
            estimate("totals")("costOfBlackPaperRollsMoistStop") = costOfBlackPaperRolls("1-Ply (10 Min Single Layer)", (estimate("totals")("blackPaperRollsMoistStop")))
            estimate("totals")("moistStopLaborers") = blackPaperMoistStopLaborers(totalGypSF)
            estimate("totals")("costOfMoistStopLaborers") = costOfBlackPaperLaborers(wageType, (estimate("totals")("moistStopLaborers")))
            estimate("totals")("costOfMoistStop") = estimate("totals")("costOfBlackPaperRollsMoistStop") + estimate("totals")("costOfMoistStopLaborers")
            If estimate("gyp")("moistStop") = "Yes" Then
                  estimate("totals")("gypCostAssemsMaterialAndLabor") = estimate("totals")("gypCostAssemsMaterialAndLabor") + estimate("totals")("costOfMoistStop")
            End If
      End If
      
      'SEALER
      If estimate("gyp")("sealer") <> "No" And estimate("gyp")("sealer") <> Empty Then
            estimate("totals")("sealerGallons") = sealerGallons("Gyp", (estimate("gyp")("sealerType")), totalGypSF)
            estimate("totals")("costOfSealerGallons") = costOfSealerGallons("Gyp", (estimate("gyp")("sealerType")), totalGypSF)
            If estimate("gyp")("sealer") = "Yes" Then
                  estimate("totals")("gypCostAssemsMaterialAndLabor") = estimate("totals")("gypCostAssemsMaterialAndLabor") + estimate("totals")("costOfSealerGallons")
            End If
      End If
      
      'RAM BOARD
      If estimate("gyp")("ramboard") <> "No" And estimate("gyp")("ramboard") <> Empty Then
            estimate("totals")("ramBoardRolls") = ramBoardRolls(totalGypSF)
            estimate("totals")("costOfRamBoardRolls") = costOfRamBoardRolls((estimate("totals")("ramBoardRolls")))
            estimate("totals")("ductTapeRollsForRamBoard") = ductTapeRollsForRamBoard(totalGypSF)
            estimate("totals")("costOfDuctTapeRollsForRamBoard") = costOfDuctTapeRolls((estimate("totals")("ductTapeRollsForRamBoard")))
            estimate("totals")("ramBoardLaborers") = soundMatLaborers(totalGypSF, False, (estimate("gyp")("labor")("mobilizations")), "2010+")
            estimate("totals")("costOfRamBoardLaborers") = costOfSoundMatLabor((estimate("totals")("ramBoardLaborers")), wageType)
            estimate("totals")("costOfRamBoard") = estimate("totals")("costOfRamBoardRolls") + estimate("totals")("costOfDuctTapeRollsForRamBoard") + estimate("totals")("costOfRamBoardLaborers")
            If estimate("gyp")("ramboard") = "Yes" Then
                  estimate("totals")("gypCostAssemsMaterialAndLabor") = estimate("totals")("gypCostAssemsMaterialAndLabor") + estimate("totals")("costOfRamBoard")
            End If
      End If
      

      '==========================================================================================
      '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
      '==========================================================================================
            
      'TRUCKS
            
      '==========================================================================================
      calculateTrucks estimate, gypExists, concExists, overnight, sameDay
      
      '==========================================================================================
      '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
      '==========================================================================================
            
      'EQUIPMENT
            
      '==========================================================================================
      calculateEquip estimate, gypExists, concExists
      
      '==========================================================================================
      '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
      '==========================================================================================
      
      'TIME
      
      '==========================================================================================
      estimate("gyp").Add "time", New Dictionary
      estimate("gyp")("time").Add "setupTime", setupTime(projectType)
      estimate("gyp")("time").Add "cleanupTime", cleanupTime 'fn
      estimate("gyp")("time").Add "lunchTime", lunchTime 'fn
      '==========================================================================================
      'OVERTIME LABOR COST
      '==========================================================================================
      Dim estimate_gyp_time As Dictionary: Set estimate_gyp_time = estimate("gyp")("time") 'i think i did these two like this since it wasn't working otherwise?
      Dim estimate_gyp_equip As Dictionary: Set estimate_gyp_equip = estimate("gyp")("equip")
      
      '1. OVERTIME FOR GYP
      estimate("gyp")("labor").Add "overTimeGypLabor", overTimeGypLabor(wageType, (estimate("gyp")("labor")("mobilizations")), (estimate("gyp")("labor")("laborers")("Laborers")), (estimate("trucks")("drivingTime")), estimate_gyp_time, estimate_gyp_equip, estimate("structures"), (estimate("totals")("gypBags")), overnight)
      
      '2. OVER TIME FOR SOUND MAT
      If sameDay <> "Yes" Then
            estimate("gyp")("labor").Add "costOfOverTimeSoundMatLabor", costOfOverTimeSoundMatLabor(wageType, (estimate("gyp")("labor")("mobilizationsSoundMat")), (estimate("trucks")("drivingTime")), overnight)
      End If

      '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
      '==========================================================================================
        
      'TRAVEL COST
        
      '==========================================================================================
      If gypExists = True Then
            'TOTAL GYP TRAVEL COST
            estimate("totals").Add "gypAssemsCostTravel", _
                                              estimate("trucks")("gypDrivingFuelCost") + _
                                              estimate("trucks")("gypMaintenanceCost") + _
                                              estimate("gyp")("labor")("overTimeGypLabor")("costOfOverTimeGypLaborDrivers")
      
            'TOTAL SOUNDMAT TRAVEL COST
            estimate("totals").Add "soundMatCostTravel", _
                                              estimate("trucks")("soundMatDrivingFuelCost") + _
                                              estimate("trucks")("soundMatMaintenanceCost") + _
                                              estimate("gyp")("labor")("costOfOverTimeSoundMatLabor")
       
            'TOTAL PREPOURS TRAVEL COST
            estimate("totals").Add "prePoursCostTravel", _
                                              estimate("trucks")("prePoursDrivingFuelCost") + _
                                              estimate("trucks")("prePoursMaintenanceCost") + _
                                              estimate("gyp")("labor")("costOfOverTimePrePoursLabor")
      
            'TOTAL ALL GYP RELATED TRAVEL COST
            estimate("totals").Add "gypCostTravel", _
                                              estimate("totals")("gypAssemsCostTravel") + _
                                              estimate("totals")("soundMatCostTravel") + _
                                              estimate("totals")("gypCostAfterMilesThreshold") + _
                                              estimate("totals")("gypCostPerDiem")
                                              
            If estimate("structures")("structure1")("prePours")("contractOrOption") = "Contract" Then
                  estimate("totals")("gypCostTravel") = estimate("totals")("gypCostTravel") + estimate("totals")("prePoursCostTravel")
            End If
            
      End If
      
      '==========================================================================================
      '||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||
      '==========================================================================================
            
      'PRODUCTION COSTS AND TOTALS
            
      '=========================================================================================
      'GYPCRETE
      If gypExists = True Then
            estimate("totals")("gypCostProduction") = estimate("totals")("gypCostAssemsMaterialAndLabor") + _
                                                                                  estimate("totals")("gypCostEquip") + _
                                                                                  estimate("gyp")("labor")("overTimeGypLabor")("costOfOverTimeGypLaborCrew") + _
                                                                                  estimate("totals")("gypCostTravel")
                                                                                  
            estimate("totals")("gypCostTotalMarket") = costAfterMargin((estimate("totals")("gypCostProduction")), (estimate("totals")("gypMarginMarket")))
            estimate("totals")("gypCostTotalInter") = costAfterMargin((estimate("totals")("gypCostProduction")), (estimate("totals")("gypMarginInter")))
            estimate("totals")("gypCostTotal") = costAfterMargin((estimate("totals")("gypCostProduction")), (estimate("totals")("gypMargin")))
      End If
      
      'CONCRETE
      If concExists = True Then
            estimate("totals")("concCostTotalMarket") = costAfterMargin((estimate("totals")("concCostProduction")), (estimate("totals")("concMarginMarket")))
            estimate("totals")("concCostTotalInter") = Round(estimate("totals")("concCostTotal") + 0.49)
            estimate("totals")("concCostTotal") = estimate("totals")("concCostTotalInter")
            
            estimate("totals")("concMarginInter") = ((totals("concCostTotal") - totals("concCostProduction")) / totals("concCostTotal")) * 100
            estimate("totals")("concMargin") = estimate("totals")("concMarginInter")
      End If
      
      estimate("totals")("grandCostTotal") = estimate("totals")("gypCostTotal") + estimate("totals")("concCostTotal")

      '=============================================================

      estimate.Add "totalsPerGypFloor", calculatePerGypFloorTotals(estimate)
      

      '=============================================================
      'CALCULATE OPTIONALS
      '=============================================================
      '1. CHECK IF OPTIONALS DICT ALREADY EXISTS
      If estimate.Exists("optionals") Then
            estimate.Remove "optionals"
      End If
      
      '2. MAKE OPTIONALS DICT
      estimate.Add "optionals", calculateOptionals(projData, estimateVersion)
      
      '=============================================================
      'CALCULATE SOV
      '=============================================================
      '1. CHECK IF SCHEDULE OF VALUES DICT ALREADY EXISTS
      If estimate.Exists("scheduleOfValues") Then
            estimate.Remove "scheduleOfValues"
      End If
      
      '2. MAKE SCHEDULE OF VALUES DICT
      estimate.Add "scheduleOfValues", calculateSOV(projData, estimateVersion)

End Sub
Sub materialsAndCostsPrimer(gypOrConc As String, assem As Dictionary, dict As Dictionary)
      assem.Add "primerGallons", primerGallons(gypOrConc, dict("primerType"), assem("SF"))
      assem.Add "costOfPrimerGallons", costOfPrimerGallons(gypOrConc, dict("primerType"), assem("SF"))
End Sub
Sub materialsAndCostsWire(assem As Dictionary, dict As Dictionary, wageType As String)
      Dim temp As Dictionary: Set temp = wireUnits(dict("wireType"), assem("SF"))
      assem.Add "wireUnitType", temp("unitType")
      assem.Add "wireUnits", temp("units")
      assem.Add "costOfWireUnits", costOfWireUnits(dict("wireType"), assem("SF"))
      assem.Add "pinBoxes", pinBoxes(dict("thick"), assem("wireUnits"))
      assem.Add "costOfPinBoxes", costOfPinBoxes(assem("pinBoxes"))
      assem.Add "washerBoxes", washerBoxes(assem("pinBoxes"))
      assem.Add "costOfWasherBoxes", costOfWasherBoxes(assem("washerBoxes"))
End Sub
Sub laborAndCostsWire(assem As Dictionary, dict As Dictionary, wageType As String)
      assem.Add "wireLaborers", wireLaborers(dict("wireType"), assem("SF"))
      assem.Add "costOfWireLaborers", costOfWireLaborers(wageType, (assem("wireLaborers")))
End Sub
Sub materialsAndCostsBlackPaper(assem As Dictionary, dict As Dictionary)
      assem.Add "blackPaperRolls", blackPaperRolls(dict("blackPaperType"), assem("SF"))
      assem.Add "costOfBlackPaperRolls", costOfBlackPaperRolls(dict("blackPaperType"), assem("blackPaperRolls"))
      'duct tape rolls for black paper will be calculated in the same way as duct tape rolls for ramboard
      assem.Add "ductTapeRollsForBlackPaper", ductTapeRollsForRamBoard(assem("SF"))
      assem.Add "costOfDuctTapeRollsForBlackPaper", costOfDuctTapeRolls(assem("ductTapeRollsForBlackPaper"))
End Sub
Sub materialsAndCostsBlackPaperMoistStop(assem As Dictionary, dict As Dictionary)
      assem.Add "blackPaperRollsMoistStop", blackPaperRollsMoistStop("Default", assem("SF"))
      assem.Add "costOfBlackPaperRollsMoistStop", costOfBlackPaperRolls("1-Ply (10 Min Single Layer)", assem("blackPaperRollsMoistStop"))
End Sub
Sub materialsAndCostsSprayGlue(assem As Dictionary)
      assem.Add "cansOfSprayGlue", cansOfSprayGlue(assem("SF"))
      assem.Add "costOfCansOfSprayGlue", costOfCansOfSprayGlue(assem("cansOfSprayGlue"))
End Sub
Sub materialsAndCostsDuctTapeRollsWhenNoSM(assem As Dictionary)
      assem.Add "ductTapeRollsWhenNoSM", ductTapeRollsWhenNoSM(assem("SF"))
      assem.Add "costOfDuctTapeRollsWhenNoSM", costOfDuctTapeRolls(assem("ductTapeRollsWhenNoSM"))
End Sub
Sub materialsAndCostsSealer(gypOrConc As String, assem As Dictionary, dict As Dictionary)
      assem.Add "sealerGallons", sealerGallons(gypOrConc, dict("sealerType"), dict("SF"))
      assem.Add "costOfSealerGallons", costOfSealerGallons(gypOrConc, dict("sealerType"), dict("SF"))
End Sub
Sub materialsAndCostsRamboard(assem As Dictionary)
      assem.Add "ramBoardRolls", ramBoardRolls(assem("SF"))
      assem.Add "costOfRamBoardRolls", costOfRamBoardRolls(assem("ramBoardRolls"))
      assem.Add "ductTapeRollsForRamBoard", ductTapeRollsForRamBoard(assem("SF"))
      assem.Add "costOfDuctTapeRollsForRamBoard", costOfDuctTapeRolls(assem("ductTapeRollsForRamBoard"))
End Sub
