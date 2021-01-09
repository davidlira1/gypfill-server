Sub calculateEquip(estimate As Dictionary, gypExists As Boolean, concExists As Boolean)
      If gypExists Then
            '==========================================================================================
            'GYPCRETE EQUIP
            '==========================================================================================
            'GET PUMP TIMES FOR ALL PUMP MACHINES
            If estimate("gyp")("labor")("method") = "Pump" Then
                  Dim pumpTime_ As Dictionary: Set pumpTime_ = pumpTime((estimate("totals")("gypBags"))) 'so it is good to have the the total pumpTime for everything
                  Set estimate("gyp")("equip")("pumpTime") = pumpTime_
            End If
                  
            'MACHINE FUEL
            '1. DECLARE PUMP VARIABLE
            Dim pump As String: pump = estimate("gyp")("equip")("pump")
                    
            '2. DECLARE BOBCAT VARIABLE
            Dim bobcat As String: bobcat = "326E" 'for the future, if there are more bobcats...estimate("gyp")("equip")("bobcat")
            estimate("gyp")("equip").Add "bobcat", bobcat
            
            If estimate("gyp")("equip")("pumpTime")(pump) <> 0 Then
                  '3. CALCULATE MACHINES FUELS COST AND ADD IT TO EQUIPMENT DICTIONARY
                  estimate("gyp")("equip").Add "machineFuelsCost", machinesFuelCost("Gyp", (estimate("gyp")("equip")("pumpTime")(pump)), Array(pump, bobcat))
                          
                  '4. CALCULATE MACHINE MAINTENANCE COST AND ADD IT TO THE EQUIPMENT DICTIONARY
                  estimate("gyp")("equip").Add "maintenanceCost", machinesMaintCost("Gyp", (estimate("gyp")("equip")("pumpTime")(pump)), Array(pump, bobcat), (estimate("gyp")("labor")("mobilizations")))
      
                  '5. CALCULATE ROTO STATER COST
                  estimate("gyp")("equip").Add "rotoStaterCost", rotoStaterCost((estimate("totals")("gypSF")), (estimate("totals")("gypBags")))
      
                  '6. TOTAL GYPCRETE EQUIPMENT COST
                  estimate("totals").Add "gypCostEquip", estimate("gyp")("equip")("machineFuelsCost")("pump") + _
                                                                           estimate("gyp")("equip")("machineFuelsCost")("bobcat") + _
                                                                           estimate("gyp")("equip")("maintenanceCost")("pump") + _
                                                                           estimate("gyp")("equip")("maintenanceCost")("bobcat") + _
                                                                           estimate("gyp")("equip")("rotoStaterCost")
                                                                                     
            End If
            '==========================================================================================
      End If
End Sub
Sub equipCostsConc(assem As Dictionary, concPumpCostOption As String, mobilizations As Integer)
      assem.Add "equip", New Dictionary
      If assem("concYds") > 2.37 Then
            assem("equip").Add "pumpTimeHrs", concPumpTime(assem("concYds"), assem("section"))
            assem("equip").Add "costFuel", machinesFuelCost("Conc", (assem("equip")("pumpTimeHrs")), Array("757"))
            assem("equip").Add "costMaintenance", machinesMaintCost("Conc", (assem("equip")("concPumpTimeHrs")), Array("757"), mobilizations)
            assem("equip").Add "costConcPump", concPumpCost(concPumpCostOption, mobilizations)
      Else
            assem("equip").Add "pumpTimeHrs", 0
            assem("equip").Add "costFuel", New Dictionary
                  assem("equip")("costFuel").Add ("pump"), 0
            assem("equip").Add "costMaintenance", New Dictionary
                  assem("equip")("costMaintenance").Add ("pump"), 0
            assem("equip").Add "costConcPump", 0
      End If
End Sub
Function concPumpCost(concPumpCostOption As String, mobilizations As Integer) As Long
      If concPumpCostOption = "Yes" Then
            Dim dict As Dictionary: Set dict = getValues("Equip_Conc_Pumps", Array("Model-Num"), Array("757"), Array("Pump Cost/Day"))
            concPumpCost = dict("Pump Cost/Day") * mobilizations
      Else
            concPumpCost = 0
      End If
End Function

