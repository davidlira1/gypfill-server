Function concYds(SF As Long, thick As Double) As Double
      concYds = Round(SF * (thick / 12) / 27, 2)
End Function
Function costOfConcYds(concType As String, psi As Integer, yds As Integer, zipCode As Long, saturday As String) As Dictionary
      Set costOfConcYds = New Dictionary
      
      '1. DETERMINE IF ZIP CODE IS AN EXPENSIVE ONE
      Dim dict As Dictionary: Set dict = getValues("Conc_FarZipCodes", Array("Zip Code"), Array(zipCode), Array("Zip Code"))

      Dim location As String
      If IsEmpty(dict("Zip Code")) = True Then
            location = "Far From Plant"
      Else
            location = "Santa Monica"
      End If
      
      '2. GET PRICE 1 CONCRETE YD
      Set dict = getValues("Prices_ConcYD", Array("Concrete Type", "PSI"), Array(concType, psi), Array(location))
      Dim costPerYd As Long: costPerYd = dict(location)
      
      '3. CALCULATE PRICE OF CONCRETE YARDS
      Set dict = getValues("Prices_Fees", Array("Fee"), Array("Saturay Cost Per Yd"), Array("Cost"))
      If saturday = "No" Or saturday = "Yes - Option" Then
            costOfConcYds.Add "cost", yds * costPerYd
      Else
            costOfConcYds.Add "cost", yds * (costPerYd + dict("Cost"))
      End If
 
      '4. OPTION
      If saturday = "Yes - Option" Then
            costOfConcYds.Add "costOption", yds * dict("Cost")
      Else
            costOfConcYds.Add "costOption", 0
      End If
      
End Function
Function concShortLoad(yds As Integer)
      concShortLoad = yds Mod 10
End Function
Function costOfConcShortLoad(yds As Integer)
      If yds <= 8.75 And yds <> 0 Then
          Dim dict As Dictionary: Set dict = getValues("Prices_ConcShortLoad", Array("Description"), Array("Base"), Array("Yds", "Price"))
          Dim baseAmount As Double: baseAmount = dict("Yds")
          
          Dim basePrice As Double: basePrice = dict("Price")
          Set dict = getValues("Prices_ConcShortLoad", Array("Description"), Array("Every .25 Yd Less"), Array("Price"))
          Dim everyQuarterLess As Double: everyQuarterLess = dict("Price")
      
          costOfConcShortLoad = basePrice + (((baseAmount - yds) * 4) * everyQuarterLess)
      Else
          costOfConcShortLoad = 0
      End If
End Function
Function concTrucks(yds As Integer, slope As String, city As String) As Dictionary
    Set concTrucks = New Dictionary
    Dim key As String
    If city = "Beverly Hills" Then
        key = "Beverly Hills"
    Else
        key = slope
    End If

    Dim dict As Dictionary: Set dict = getValues("Conc_TruckLoad", Array("Description"), Array(key), Array("Truck Load"))
    concTrucks.Add "truckLoad", dict("Truck Load")
    concTrucks.Add "trucks", Round((yds / dict("Truck Load")) + 0.49)
End Function
Function costOfEnvironmental(trucks As Integer)
    Dim dict As Dictionary: Set dict = getValues("Prices_Fees", Array("Fee"), Array("Environmental"), Array("Cost"))
    Dim environmentalFee As Integer: environmentalFee = dict("Cost")
    
    costOfEnvironmental = trucks * environmentalFee
End Function
Function costOfEnergy(trucks As Integer)
    Dim dict As Dictionary: Set dict = getValues("Prices_Fees", Array("Fee"), Array("Energy"), Array("Cost"))
    Dim energyFee As Integer: energyFee = dict("Cost")
    
    costOfEnergy = trucks * energyFee
End Function
Function costOfWashOut(trucks As Integer)
    Dim dict As Dictionary: Set dict = getValues("Prices_Fees", Array("Fee"), Array("Washout"), Array("Cost"))
    Dim washoutFee As Integer: washoutFee = dict("Cost")
    
    costOfWashOut = trucks * washoutFee
End Function
Function costOfDownTime(wageType As String, yds As Integer, section As String, numOfTrucks As Integer) As Integer
    Dim rowName As String
    If wageType = "NonPrevailing" Then
        rowName = "Add Time/Min"
    Else
        rowName = "Add Time/Min(Prev)"
    End If
    
    Dim dict As Dictionary: Set dict = getValues("Prices_Fees", Array("Fee"), Array(rowName), Array("Cost"))
    Dim dict2 As Dictionary: Set dict2 = getValues("Conc_DownTime", Array("Section"), Array(section), Array("Mins/Truck"))
    
    costOfDownTime = numOfTrucks * dict2("Mins/Truck") * dict("Cost")

End Function
Function costOfTracker() As Integer
      Dim dict As Dictionary: Set dict = getValues("Prices_Fees", Array("Fee"), Array("Tracker (Prevailing)"), Array("Cost"))
      
      costOfTracker = dict("Cost")
End Function
Function concMobilizations(section As String, SF As Long, count As Long) As Byte
      If section = "Stairs" Or sections = "Stair Landings" Then
            concMobilizations = count
      Else
            Dim dict As Dictionary: Set dict = getValues("Conc_MaxPerDay", Array("Section"), Array(section), Array("Max/Day"))
            concMobilizations = Round((SF / dict("Max/Day")) + 0.499)
      End If
End Function
Function concLaborers(section As String, concType As String, SF As Long, nosing As String, numOfFloors As Byte, mobilizations As Byte, addMobils As Byte) As Dictionary
      Set concLaborers = New Dictionary
      Dim cl As Dictionary: Set cl = New Dictionary
      cl.Add "crew", New Dictionary
      cl.Add "remCrew", New Dictionary
      cl.Add "totalCrew", New Dictionary
      
      'GET the Max/Day for the section
      Dim dict As Dictionary: Set dict = getValues("Conc_MaxPerDay", Array("Section"), Array(section), Array("Max/Day"))
      
      Dim renamedConcType As String: renamedConcType = Split(concType)(0)
    
      If renamedConcType = "Hydrolite" Then
          renamedConcType = "Lightweight"
      ElseIf renamedConcType = "Pea" Then
          renamedConcType = "Peagravel"
      End If
    
      If section = "Stairs" Or section = "Stair Landings" Then
            section = "Stairs & Mid Landings"
      ElseIf section = "Exterior Corridors" Then
            section = "Corridors"
      End If
      
      Dim concWork As String: concWork = section & " " & renamedConcType
      If section = "Stairs & Mid Landings" Then
            Set cl("crew") = getValues("Labor_Concrete", Array("Type Of Concrete Work", "SF"), Array(concWork, numOfFloors), Array("Prep Guy", "Pumper", "Hose Carrier", "Pourers", "Finishers", "Cleaners", "Laborers", "Total"))
            If nosing = "Yes" Then
                  cl("crew")("Finishers") = cl("crew")("Finishers") + 1
                  cl("crew")("Total") = cl("crew")("Total") + 1
            End If
            
            For Each key In cl("crew")
                  cl("totalCrew").Add key, cl("crew")(key) * mobilizations
            Next key
      
      Else
           
            'if the count is less than the section, then get the crew for that size
            If SF < dict("Max/Day") Then
                  Set cl("crew") = getValuesConcLabor("Labor_Concrete", Array("Type Of Concrete Work"), Array(concWork), Array("Prep Guy", "Pumper", "Hose Carrier", "Pourers", "Finishers", "Cleaners", "Laborers", "Total"), SF)
                  
                  Set cl("totalCrew") = cl("crew")
            Else
                  'GET THE CREW SIZE FOR THE MAX AMOUNT
                  Set cl("crew") = getValuesConcLabor("Labor_Concrete", Array("Type Of Concrete Work"), Array(concWork), Array("Prep Guy", "Pumper", "Hose Carrier", "Pourers", "Finishers", "Cleaners", "Laborers", "Total"), dict("Max/Day"))
                  'GET THE CREW SIZE FOR THE REMAINDER
                  Set cl("remCrew") = getValuesConcLabor("Labor_Concrete", Array("Type Of Concrete Work"), Array(concWork), Array("Prep Guy", "Pumper", "Hose Carrier", "Pourers", "Finishers", "Cleaners", "Laborers", "Total"), SF Mod dict("Max/Day"))
                  
                  For Each key In cl("crew")
                        cl("totalCrew").Add key, (cl("crew")(key) * (mobilizations - 1)) + cl("remCrew")(key)
                  Next key
            End If
      End If

      'ADD FOR ADD MOBILS
      cl("totalCrew")("Pumper") = cl("totalCrew")("Pumper") + addMobils
      cl("totalCrew")("Hose Carrier") = cl("totalCrew")("Hose Carrier") + (addMobils * 2)
      cl("totalCrew")("Pourers") = cl("totalCrew")("Pourers") + addMobils
      cl("totalCrew")("Total") = cl("totalCrew")("Total") + addMobils + (addMobils * 2) + addMobils
      
      Set concLaborers = cl
End Function
Function costOfConcLaborers(laborers As Integer, wageType As String, miles As Integer, saturday As String) As Dictionary
      Set costOfConcLaborers = New Dictionary
      
      '1. GET WAGE PRICES
      Dim dict As Dictionary: Set dict = getValues("Wage_" & wageType & "_Conc", Array("Laborer"), Array("Average"), Array("Price/Day", "Price/Hr (OT)"))
      
      '2. CALCULATE COST OF LABORERS
      If saturday = "No" Or saturday = "Yes - Option" Then
            costOfConcLaborers.Add "cost", Round((dict("Price/Day") * laborers) + 0.49)
      Else
            costOfConcLaborers.Add "cost", Round((dict("Price/Hr (OT)") * 8 * laborers) + 0.49)
      End If
      
      '3. IF SATURDAY OPTION
      If saturday = "Yes - Option" Then
            costOfConcLaborers.Add "costOption", Round((((dict("Price/Hr (OT)") * 8) - dict("Price/Day")) * laborers) + 0.49)
      Else
            costOfConcLaborers.Add "costOption", 0
      End If

End Function
Function costOfOvertimeConcLaborers(wageType As String, drivingTime As Double, mobilizations As Byte) As Long
      'THIS SEEMS TO BE FOR ONE DRIVER
      Dim dict As Dictionary: Set dict = getValues("Wage_" & wageType & "_Conc", Array("Laborer"), Array("Average"), Array("Price/Hr (OT)", "Price/Hr (DT)"))
      Dim wageOT As Double: wageOT = dict("Price/Hr (OT)")
      Dim wageDT As Double: wageDT = dict("Price/Hr (DT)")
 
      If drivingTime > 4 Then
            costOfOvertimeConcLaborers = (drivingTime - 4) * wageDT
            costOfOvertimeConcLaborers = costOfOvertimeConcLaborers + (4 * wageOT)
      Else
            costOfOvertimeConcLaborers = drivingTime * wageOT
      End If
      
      costOfOvertimeConcLaborers = costOfOvertimeConcLaborers * mobilizations
End Function
