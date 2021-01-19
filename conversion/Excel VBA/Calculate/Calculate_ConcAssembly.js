Sub calculateConcAssembly(assem As Dictionary, drivingTimeHrs As Double, wageType As String, city As String, miles As Integer, zipCode As Long, saturdayConc As String, concPumpCostOption As String, numOfFloors As Byte, overrideConcBarrelMix As String)
      '1. CALCULATE MATERIALS AND COST FOR ASSEMBLY
      materialsAndCostsConc assem, assem, wageType, city, zipCode, saturdayConc, overrideConcBarrelMix
      
      '2. CALCULATE LABOR COSTS FOR ASSEMBLY
      laborAndCostsConc assem, drivingTimeHrs, wageType, miles, saturdayConc, numOfFloors, overrideConcBarrelMix
      
      '3. CALCULATE EQUIPMENT COST FOR ASSEMBLY
      equipCostsConc assem, concPumpCostOption, (assem("labor")("concMobilizations")) + assem("addMobils"), overrideConcBarrelMix
      
      '4. CALCULATE TRUCKS' COSTS (FUEL, MAINTENANCE).
      calculateTrucksConc assem, miles

      '5. CALCULATE TRAVEL COST
      assem.Add "costTravel", assem("trucks")("costFuel") + _
                                          assem("trucks")("costMaintenance") + _
                                          assem("labor")("costOfOverTimeConcLabor") + _
                                          assem("labor")("costOfOverTimeSoundMatLabor") + _
                                          assem("costAfterMilesThreshold")
                                          'what about per diem
      
      '6. CALCULATE PRODUCTION COST
      assem.Add "costProduction", _
                                                   assem("costOfMaximizerBags") + _
                                                   assem("costOfConcYds") + assem("costOfConcShortLoad") + _
                                                   assem("costOfEnvironmental") + assem("costOfEnergy") + assem("costOfWashOut") + assem("costOfDownTime") + assem("costOfTracker") + _
                                                   assem("labor")("costOfConcLaborers") + _
                                                   assem("costOfBlackPaperRolls") + assem("labor")("costOfBlackPaperLaborers") + _
                                                   assem("costOfPrimerGallons") + _
                                                   assem("costOfWireUnits") + assem("labor")("costOfWireLaborers") + _
                                                   assem("costOfSoundMat") + assem("labor")("costOfSoundMatLabor") + _
                                                   assem("costOfCansOfSprayGlue") + _
                                                   assem("costOfDuctTapeRollsWhenNoSM") + _
                                                   assem("equip")("costFuel")("pump") + assem("equip")("costMaintenance")("pump") + assem("equip")("costConcPump") + _
                                                   assem("trucks")("costFuel") + assem("trucks")("costMaintenance") + _
                                                   assem("labor")("costOfOverTimeConcLabor") + assem("labor")("costOfOverTimeSoundMatLabor") + assem("costAfterMilesThreshold") 'what about per diem
      
                                                   
      '6. CALCULATE TOTAL COST
      assem.Add "costTotal", costAfterMargin(assem("costProduction"), assem("margin"))
      assem("margin") = ((assem("costTotal") - assem("costProduction")) / assem("costTotal")) * 100
      
End Sub

