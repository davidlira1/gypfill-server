Sub gypLabor(wageType As String, structureType As String, SF As Long, SFsm As Long, gypThick As Double, difficultyLevel As String, gypType As String, miles As Variant, overnight As Boolean, saturday As String, estimate As Dictionary, overrideGypBarrelMix As String)
      Dim labor As Dictionary: Set labor = estimate("gyp")("labor")
      Dim dict As Dictionary: Dim dict2 As Dictionary
      Dim tableName As String
      
      '1. SET METHOD. MIGHT BE CHANGED LATER IF VERY SMALL POUR
      labor.Add "method", "Pump"
      
      '2. CALCULATE EXTRA LABORERS (DEPENDS OF DIFFICULTY LEVEL)
      Set dict = getValues("Gyp_DifficultyLevel", Array("Level"), Array(difficultyLevel), Array("Extra Laborers"))
      labor("laborers").Add "Extra Laborers", dict("Extra Laborers")

      Dim gypSqFt As Long: gypSqFt = SF
      If SF > 15000 Then 'this way it will get the maximum crew for a day if more than 15000
            gypSqFt = 15000
      End If
    
      'SMALL POUR
      If SF <= 400 And overrideGypBarrelMix = "No" Then
            Set dict = getValue2ParamsSmallPours("Labor_SmallPours", gypSqFt, gypThick, Array("Laborers", "Foam/Primer", "String Line", "Flagmen", "Pumper", "Bobcat", "Baggers", "Screeder", "Hose Pourer", "Hose Puller"))
            
            labor("method") = dict("method")
            labor.Add "mobilizations", 1
            labor("laborers").Add "Laborers", dict("Laborers") + labor("laborers")("Extra Laborers")
            labor("laborers").Add "crew", dict
            labor("laborers")("crew").Remove "Laborers"
            Set dict = costOfGypLabor(wageType, (labor("laborers")("Laborers")), labor("mobilizations"), saturday)
            labor("costOfGypLabor") = dict("cost")
            labor("costOfGypLaborOption") = dict("costOption") 'related to saturday as an option
            'Flagmen (will be optional)
            Set dict = costOfGypLabor(wageType, (labor("laborers")("crew")("Flagmen")), labor("mobilizations"), saturday)
            labor("costOfGypFlagmenLabor") = dict("cost")
            'StringLine (will be optional)
            Set dict = costOfGypLabor(wageType, (labor("laborers")("crew")("String Line")), labor("mobilizations"), saturday)
            labor("costOfGypStringLineLabor") = dict("cost")
    'HOUSE AND BIGGER THAN 900 SF
      ElseIf structureType = "House" Then
            If SFsm = 0 Then
                  tableName = "Labor_Houses_NoSM"
            Else
                  tableName = "Labor_Houses_SM"
            End If
            Set dict = getValuesBasedOnNum(tableName, gypSqFt, (Array("Laborers", "String Line", "Flagmen", "Foam/Primer", "Pumper", "Bobcat", "Baggers", "Screeder", "Hose Pourer", "Hose Puller")))
            
            labor.Add "mobilizations", gypMobilizations(SF, "Normal")
            labor("laborers").Add "Laborers", dict("Laborers") + labor("laborers")("Extra Laborers")
            labor("laborers").Add "crew", dict
            labor("laborers")("crew").Remove "Laborers"
            Set dict = costOfGypLabor(wageType, (labor("laborers")("Laborers")), labor("mobilizations"), saturday)
            labor("costOfGypLabor") = dict("cost")
            labor("costOfGypLaborOption") = dict("costOption")
            'Flagmen (will be optional)
            Set dict = costOfGypLabor(wageType, (labor("laborers")("crew")("Flagmen")), labor("mobilizations"), saturday)
            labor("costOfGypFlagmenLabor") = dict("cost")
            'StringLine (will be optional)
            Set dict = costOfGypLabor(wageType, (labor("laborers")("crew")("String Line")), labor("mobilizations"), saturday)
            labor("costOfGypStringLineLabor") = dict("cost")
      'BUILDING
      ElseIf structureType = "Building" Or structureType = "Multi-Building" Or structureType = "Unit" Then
            If SFsm = 0 Then
                  tableName = "Labor_Buildings_NoSM"
            Else
                  tableName = "Labor_Buildings_SM"
            End If
            Set dict = getValuesBasedOnNum(tableName, gypSqFt, (Array("Laborers", "Flagmen", "Foam/Primer", "Pumper", "Bobcat", "Baggers", "Screeder", "Hose Pourer", "Hose Puller")))
            
            labor.Add "mobilizations", gypMobilizations(SF, "Normal")
            labor("laborers").Add "Laborers", dict("Laborers") + labor("laborers")("Extra Laborers")
            labor("laborers").Add "crew", dict
            labor("laborers")("crew").Remove "Laborers"
            Set dict = costOfGypLabor(wageType, (labor("laborers")("Laborers")), labor("mobilizations"), saturday)
            labor("costOfGypLabor") = dict("cost")
            labor("costOfGypLaborOption") = dict("costOption")
                  
            If gypType = "CMD" Then
                  labor.Add "mobilizationsFlutes", gypMobilizations(SF, "CMD")
                  If SF > 23000 Then
                        gypSqFt = 23000
                  Else
                        gypSqFt = 23000
                  End If
                  Set dict = getValuesBasedOnNum("Labor_Buildings_CMDFlutes", gypSqFt, (Array("Laborers", "Flagmen", "Foam/Primer", "Pumper", "Bobcat", "Baggers", "Screeder", "Hose Pourer", "Hose Puller")))
                  labor("laborers").Add "cmdLaborers", dict("Laborers") + labor("laborers")("extraLaborers")
                  labor("laborers").Add "cmdCrew", dict
                  labor("laborers")("cmdCrew").Remove "Laborers"
                  Set dict = costOfGypLabor(wageType, (labor("laborers")("cmdLaborers")), labor("mobilizationsFlutes"), saturday)
                  labor("costOfGypLabor")("cost") = labor("costOfGypLabor")("cost") + dict("costOfGypLabor")("cost")
                  labor("costOfGypLabor")("costOption") = labor("costOfGypLabor")("costOption") + dict("costOfGypLabor")("costOption")
            End If
      End If
      
      'ONCE DISTANCE IS MORE THAN SPECIFIED miles in table, we give each guy, except for the drivers, 50 bucks for traveling both ways (25$ each way).
      Set dict = getValues("Prices_AfterMileThreshold", Array("Description"), Array("Threshold"), Array("Miles", "Price/Day"))
      If miles > dict("Miles") Then
            Set dict2 = getValues("Prices_AfterMileThreshold", Array("Description"), Array("House Threshold"), Array("SF"))
                  labor.Add "costOfAfterMilesThreshold", ((labor("laborers")("Laborers") - 2) * labor("mobilizations") * dict("Price/Day"))
                  If gypType = "CMD" Then
                        labor("costOfAfterMilesThreshold") = labor("costOfAfterMilesThreshold") + ((labor("laborers")("Laborers") - 2) * labor("mobilizationsFlutes") * dict("Price/Day"))
                  End If
      End If
          
End Sub
Function gypMobilizations(SF As Long, gypType As String) As Integer
      Dim dict As Dictionary: Set dict = getValues("Mobils_Gyp", Array("Type"), Array(gypType), Array("SF/Day"))
      gypMobilizations = Round((SF / dict("SF/Day")) + 0.49)
End Function
Function addMobilsCost(mobils As Integer, mobilCost As Integer, wageType As String) As Dictionary
      Set addMobilsCost = New Dictionary
      Dim dict As Dictionary: Set dict = getValues("Wage_" & wageType & "_Gyp", Array("Laborer"), Array("Average"), Array("Price/Day"))
      addMobilsCost.Add "addMobilsCostProduction", mobils * dict("Price/Day") * 8
      addMobilsCost.Add "addMobilsCostTotal", mobils * mobilCost
End Function
Function costOfGypLabor(wageType As String, numOfLaborers As Integer, mobilizations As Integer, saturday As String) As Dictionary
      Set costOfGypLabor = New Dictionary
      Dim dict As Dictionary: Set dict = getValues("Wage_" & wageType & "_Gyp", Array("Laborer"), Array("Average"), Array("Price/Day", "Price/Hr (OT)"))
      Dim costOfLaborerPerDay As Double
      
      '1. GET PRICE/DAY FOR LABORER
      '===========================================================================
            'REGULAR WAGE
            If saturday = "No" Or saturday = "Yes - Option" Then
                  costOfLaborerPerDay = dict("Price/Day")
            
            'OVERTIME WAGE
            ElseIf saturday = "Yes" Then
                  costOfLaborerPerDay = dict("Price/Hr (OT)") * 8
                        
            End If
      '===========================================================================
      
      '2. CALCULATE COST OF GYP LABOR
      costOfGypLabor.Add "cost", costOfLaborerPerDay * numOfLaborers * mobilizations
      
      '3. IF OPTION, CALCULATE OPTION COST
      If saturday = "Yes - Option" Then
            costOfGypLabor.Add "costOption", ((dict("Price/Hr (OT)") * 8) - dict("Price/Day")) * numOfLaborers * mobilizations
      Else
            costOfGypLabor.Add "costOption", 0
      End If
      
End Function
Function costOfGypPrePourLabor(wageType As String, numOfLaborers As Integer) As Long
            
End Function
Function overTimeGypLabor(wageType As String, mobilizations As Integer, numOfLaborers As Integer, drivingTime As Double, cleanSetTime As Dictionary, equip As Dictionary, structures As Dictionary, totalGypBags As Long, overnight As Boolean) As Dictionary
      Set overTimeGypLabor = New Dictionary
      Dim dict As Dictionary
      Dim pump As String: pump = equip("pump")
      Dim totalGypTimeWOutDriving As Double
      Dim overTimeHrsWOutDriving As Double
      Dim overTimeHrsDriving As Double
      Dim costOfOverTimeGypLaborCrew As Long
      Dim costOfOverTimeGypLaborDrivers As Long
      
      '==========================================================================================
      'IF ONE MOBILIZATION
      '==========================================================================================
      If mobilizations = 1 Then
            '1. CALCULATE TOTAL GYP TIME WITH OUT DRIVING
            totalGypTimeWOutDriving = cleanSetTime("setupTime") + (equip("pumpTime")(pump)) + cleanSetTime("cleanupTime")
            
            '2. CACULATE OVER TIME HOURS WITHOUT DRIVING
            overTimeHrsWOutDriving = overTimeGyp(totalGypTimeWOutDriving)
            
            '3. COST OF OVERTIME FOR CREW
            costOfOverTimeGypLaborCrew = costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving, numOfLaborers)
            '__________________________________________________________________________________________
            '4. CALCULATE OVERTIME HOURS FOR DRIVING
            If totalGypTimeWOutDriving > 7.5 Then
                  overTimeHrsDriving = drivingTime
                  'IF OVERNIGHT IS TRUE, THEN IT'S FINE
                  costOfOverTimeGypLaborDrivers = costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving + overTimeHrsDriving, 2) - costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving, 2)
            Else
                  'IF REACHES HERE, CREW RECEIVED NO OVERTIME
                  If (7.5 - totalGypTimeWOutDriving - drivingTime) < 0 Then
                        overTimeHrsDriving = (7.5 - totalGypTimeWOutDriving - drivingTime) * -1
                        If overnight = True Then
                              overTimeHrsDriving = (overTimeHrsDriving - (drivingTime / 2)) + drivingTime / 2
                        End If
                        costOfOverTimeGypLaborDrivers = costOfOverTimeGypLaborHelper(wageType, overTimeHrsDriving, 2)
                  Else
                  'IF REACHES HERE, NO ONE RECEIVED ANY OVERTIME
                        overTimeHrsDriving = 0
                        costOfOverTimeGypLaborDrivers = 0
                  End If
            End If
            '__________________________________________________________________________________________
      Else
            'COUNT NUMBER OF FLOORS
        Dim numOfFloors As Byte
            For Each s In structures.Keys
                  For Each gA In structures(s)("gypAssemblies").Keys
                        numOfFloors = numOfFloors + structures(s)("gypAssemblies")(gA)("floors").count
                  Next gA
            Next s
            
            '==========================================================================================
            'IF NUMBER OF FLOORS EQUALS MOBILIZATIONS
            '==========================================================================================
            If numOfFloors = mobilizations Then
            For Each s In structures.Keys
                  For Each gA In structures(s)("gypAssemblies").Keys
                        For Each f In structures(s)("gypAssemblies")(gA)("floors").Keys
                              '1. CALCULATE PUMP TIME FOR THIS FLOOR
                              Set dict = pumpTime((structures(s)("gypAssemblies")(gA)("floors")(f)("gypBags")))
                              '__________________________________________________________________________________________
                              '2. CALCULATE TOTAL GYP TIME WITHOUT DRIVING
                              totalGypTimeWOutDriving = cleanSetTime("setupTime") + dict(pump) + cleanSetTime("cleanupTime")
                              
                              '3. CALCULATE OVER TIME HOURS WITHOUT DRIVING
                              overTimeHrsWOutDriving = overTimeHrsWOutDriving + overTimeGyp(totalGypTimeWOutDriving)
                              
                              '4. CALCULATE COST OF OVER TIME WITHOUT DRIVING (FOR WHOLE CREW)
                              costOfOverTimeGypLabor = costOfOverTimeGypLabor + costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving, numOfLaborers)
                              '__________________________________________________________________________________________
                              '5. CALCULATE OVERTIME HOURS FOR DRIVING
                              If totalGypTimeWOutDriving > 7.5 Then
                                    overTimeHrsDriving = drivingTime
                                    costOfOverTimeGypLaborDrivers = costOfOverTimeGypLaborDrivers + costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving + overTimeHrsDriving, 2) - costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving, 2)
                              Else
                                    'IF REACHES HERE, CREW RECEIVED NO OVERTIME
                                    If (7.5 - totalGypTimeWOutDriving - drivingTime) < 0 Then
                                          overTimeHrsDriving = (7.5 - totalGypTimeWOutDriving - drivingTime) * -1
                                          If overnight = True Then
                                                overTimeHrsDriving = (overTimeHrsDriving - (drivingTime / 2)) + drivingTime / 2
                                          End If
                                          costOfOverTimeGypLaborDrivers = costOfOverTimeGypLaborDrivers + costOfOverTimeGypLaborHelper(wageType, overTimeHrsDriving, 2)
                                    Else
                                    'IF REACHES HERE, NO ONE RECEIVED ANY OVERTIME
                                          overTimeHrsDriving = 0
                                          costOfOverTimeGypLaborDrivers = costOfOverTimeGypLaborDrivers + 0
                                    End If
                              End If
                              '__________________________________________________________________________________________
                        Next f
                  Next gA
            Next s
            
            '==========================================================================================
            'ELSE GET THE AVERAGE
            '==========================================================================================
            Else
'                  '1. CALCULATE AVERAGE SF PER FLOOR
'                  Dim averagePerFloor As Long
'                  averagePerFloor = Round((totalSF / mobilizations) + 0.49)
                  
                  '1. CALCULATE AVERAGE BAGS PER FLOOR
                  Dim averageBags As Long
                  averageBags = Round((totalGypBags / mobilizations) + 0.49)
                  
                  '3. CALCULATE PUMP TIME
                  Set dict = pumpTime(averageBags)
                  '__________________________________________________________________________________________
                  '4. CALCULATE TOTAL GYP TIME WITHOUT DRIVING
                  totalGypTimeWOutDriving = cleanSetTime("setupTime") + dict(pump) + cleanSetTime("cleanupTime")
                  
                  '5. CALCULATE OVER TIME HOURS WITHOUT DRIVING
                  overTimeHrsWOutDriving = overTimeGyp(totalGypTimeWOutDriving)
                  
                  '6. CALCULATE COST OF OVER TIME WITHOUT DRIVING (FOR WHOLE CREW)
                  costOfOverTimeGypLaborCrew = costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving, numOfLaborers)
                   '__________________________________________________________________________________________
                  '4. CALCULATE OVERTIME HOURS FOR DRIVING
                  If totalGypTimeWOutDriving > 7.5 Then
                        overTimeHrsDriving = drivingTime
                        costOfOverTimeGypLaborDrivers = costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving + overTimeHrsDriving, 2) - costOfOverTimeGypLaborHelper(wageType, overTimeHrsWOutDriving, 2)
                  Else
                        'IF REACHES HERE, CREW RECEIVED NO OVERTIME
                        If (7.5 - totalGypTimeWOutDriving - drivingTime) < 0 Then
                              overTimeHrsDriving = (7.5 - totalGypTimeWOutDriving - drivingTime) * -1
                              If overnight = True Then
                                    overTimeHrsDriving = (overTimeHrsDriving - (drivingTime / 2)) + drivingTime / 2
                              End If
                              costOfOverTimeGypLaborDrivers = costOfOverTimeGypLaborHelper(wageType, overTimeHrsDriving, 2)
                        Else
                        'IF REACHES HERE, NO ONE RECEIVED ANY OVERTIME
                              overTimeHrsDriving = 0
                              costOfOverTimeGypLaborDrivers = 0
                        End If
                  End If
                  
                  overTimeHrsWOutDriving = overTimeHrsWOutDriving * mobilizations
                  costOfOverTimeGypLaborCrew = costOfOverTimeGypLaborCrew * mobilizations
                  overTimeHrsDriving = overTimeHrsDriving * mobilizations
                  costOfOverTimeGypLaborDrivers = costOfOverTimeGypLaborDrivers * mobilizations
                  
            End If
      End If
      
      '1. PLACE OVERTIME HOURS WITHOUT DRIVING IN DICTIONARY
      overTimeGypLabor.Add "overTimeHrsWOutDriving", overTimeHrsWOutDriving
      
      '2. PLACE COST OF OVERTIME HOURS WITHOUT DRIVING IN DICTIONARY
      overTimeGypLabor.Add "costOfOverTimeGypLaborCrew", costOfOverTimeGypLaborCrew
      
      '3. PLACE OVERTIME HOURS WITH DRIVING IN DICTIONARY
      overTimeGypLabor.Add "overTimeHrsDriving", overTimeHrsDriving
            
      '4. PLACE COST OF OVERTIME HOURS WITH DRIVING IN DICTIONARY
      overTimeGypLabor.Add "costOfOverTimeGypLaborDrivers", costOfOverTimeGypLaborDrivers
    
End Function
Function costOfOverTimeGypLaborHelper(wageType As String, overTimeHrs As Double, numOfLaborers As Integer) As Long
      If overTimeHrs > 0 Then
            If overTimeHrs > 4 Then
                  costOfOverTimeGypLaborHelper = costOfOverTimeGypLaborHelper + (4 * overTimeRate("Gyp", wageType, 1) * numOfLaborers) 'this will be regular OT
                  costOfOverTimeGypLaborHelper = costOfOverTimeGypLaborHelper + ((overTimeHrs - 4) * overTimeRate("Gyp", wageType, overTimeHrs) * numOfLaborers) 'this will be DT
            Else
                  costOfOverTimeGypLaborHelper = costOfOverTimeGypLaborHelper + (overTimeHrs * overTimeRate("Gyp", wageType, 1) * numOfLaborers)
            End If
      End If
End Function
Function costOfOverTimeSoundMatLabor(wageType As String, mobilizations As Integer, drivingTime As Double, overnight As Boolean) As Long
      'number of sound mat mobilizations is equal to gyp mobilizations
      'only the 1 driver will get overtime
      If overnight = True Then
            costOfOverTimeSoundMatLabor = 0
            Exit Function
      End If
      If drivingTime > 4 Then
            costOfOverTimeSoundMatLabor = overTimeRate("SM", wageType, 1) * 4
            costOfOverTimeSoundMatLabor = overTimeRate("SM", wageType, drivingTime) * drivingTime 'the hours after 4 hours
      Else
            costOfOverTimeSoundMatLabor = overTimeRate("SM", wageType, drivingTime)
      End If
      
      costOfOverTimeSoundMatLabor = costOfOverTimeSoundMatLabor * mobilizations
End Function
Function overTimeRate(material As String, wageType As String, overTimeHrs As Double) As Double
      Dim typeOfOverTime As String
      If overTimeHrs <= 4 Then
            typeOfOverTime = "Price/Hr (OT)"
      ElseIf overTimeHrs > 4 Then
            typeOfOverTime = "Price/Hr (DT)"
      End If
    
      Dim dict As Dictionary: Set dict = getValues("Wage_" & wageType & "_" & material, Array("Laborer"), Array("Average"), Array(typeOfOverTime))
      overTimeRate = dict(typeOfOverTime)
End Function
