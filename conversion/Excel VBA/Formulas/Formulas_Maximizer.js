Function maximizerBags(yds As Double) As Byte
    Dim cuFt As Integer
    cuFt = Round((yds * 27) + 0.49)
    maximizerBags = cuFt
End Function
Function costOfMaximizerBags(bags As Integer) As Integer
      Dim dict As Dictionary: Set dict = getValues("Prices_ConcBag", Array("Type"), Array("Maximizer"), Array("Price/Bag"))
      costOfMaximizerBags = bags * dict("Price/Bag")
End Function
Function maximizerLaborers(yds As Double, addMobils As Byte) As Dictionary
      Dim ml As Dictionary: Set ml = New Dictionary
      'Dim dict As Dictionary: Set dict = getValues("Labor_ConcBag", Array("CuYds"), Array(yds), Array("CuYds", "Laborers", "Finishers"))
      Dim dict As Dictionary: Set dict = getValuesBasedOnNum("Labor_ConcBag", CLng(yds), Array("CuYds", "Laborers", "Finishers"))
      Dim sets As Byte: sets = Round((yds / 2.37) + 0.49)
      ml.Add "sets", sets
      ml.Add "totalCrew", New Dictionary
      ml("totalCrew").Add "Laborers", dict("Laborers") * sets * (addMobils + 1)
      ml("totalCrew").Add "Finishers", dict("Finishers") * sets * (addMobils + 1)
      ml("totalCrew").Add "Total", ml("totalCrew")("Laborers") + ml("totalCrew")("Finishers")
      Set maximizerLaborers = ml
End Function
Function costOfMaximizerLaborers(wageType As String, laborers As Integer, miles As Integer, saturday As String) As Dictionary
      Set costOfMaximizerLaborers = New Dictionary
      
      Dim dict As Dictionary: Set dict = getValues("Wage_" & wageType & "_Conc", Array("Laborer"), Array("Average"), Array("Price/Day", "Price/Hr (OT)"))
    
      'Set dict = getValues("Prices_AfterMileThreshold", Array("Description"), Array("Threshold"), Array("Miles", "Price/Day"))
      '2. CALCULATE COST OF LABORERS
      If saturday = "No" Or saturday = "Yes - Option" Then
            costOfMaximizerLaborers.Add "cost", Round((dict("Price/Day") * laborers) + 0.49)
      Else
            costOfMaximizerLaborers.Add "cost", Round((dict("Price/Hr (OT)") * 8 * laborers) + 0.49)
      End If
      
      '3. IF SATURDAY OPTION
      If saturday = "Yes - Option" Then
            costOfMaximizerLaborers.Add "costOption", Round((((dict("Price/Hr (OT)") * 8) - dict("Price/Day")) * laborers) + 0.49)
      Else
            costOfMaximizerLaborers.Add "costOption", 0
      End If
'      If miles > dict("Miles") Then
'            costOfMaximizerLaborers = costOfMaximizerLaborers + (4 * dict("Price/Day")) '4 guys, 1 driver. 5 guys for doing i set, which is 2.37 cYDs
'      End If
End Function


