Function trucksMaintCost(gypOrConc As String, miles As Integer, mobilizations As Byte, overnight As Boolean) As Integer
      Dim dict As Dictionary
    
      '1. GET MAINTENANCE COST PER DAY (BASED ON THE YEARLY TRUCK BREAK COST)
      Set dict = getValues("Maint_Trucks", Array("Truck"), Array("Yearly"), Array("Maint Cost/Day"))
      Dim maintCostPerDay As Double: maintCostPerDay = dict("Maint Cost/Day")
      If overnight = True Then
            maintCostPerDay = maintCostPerDay * 2
      End If
      
      '2. GET MAINTENANCE COST PER MILE
      Set dict = getValues("Maint_Trucks", Array("Truck"), Array("Total"), Array("Maint Cost/Mile"))
      Dim maintCostPerMile As Double: maintCostPerMile = dict("Maint Cost/Mile")
      
      '3. CALCULATE FOR ROUND TRIP
      trucksMaintCost = maintCostPerDay + (miles * 2 * maintCostPerMile)
      
      '4. MULTIPLY BY AMOUNT OF MOBILIZATIONS
      trucksMaintCost = trucksMaintCost * mobilizations
    
      If gypOrConc = "Gyp" Then
            'MULTIPLY BY 2 DRIVERS
            trucksMaintCost = trucksMaintCost * 2
      End If
    
End Function
Function machinesMaintCost(gypOrConc As String, hours As Double, machines As Variant, mobilizations As Integer) As Dictionary
    Set machinesMaintCost = New Dictionary

    If gypOrConc = "Gyp" Then
      machinesMaintCost.Add "pump", machineMaintCost("gypPump", hours, (machines(0)), mobilizations)
      machinesMaintCost.Add "bobcat", machineMaintCost("bobcat", hours, (machines(1)), mobilizations)
    Else
      machinesMaintCost.Add "pump", machineMaintCost("concPump", hours, (machines(0)), mobilizations)
    End If
    
End Function
Function machineMaintCost(machineType As String, hours As Double, machine As String, mobilizations As Integer) As Integer
    
    Dim tableName As String
    If machineType = "gypPump" Then
        tableName = "Equip_Gyp_Pumps"
    ElseIf machineType = "bobcat" Then
        tableName = "Equip_Bobcats"
    ElseIf machineType = "concPump" Then
        tableName = "Equip_Conc_Pumps"
    End If
    
    Dim dict As Dictionary: Set dict = getValues(tableName, Array("Model-Num"), Array(machine), Array("Total Maint / Hr", "Maint Cost/Day"))
    machineMaintCost = dict("Maint Cost/Day") * mobilizations
    machineMaintCost = machineMaintCost + Round((hours * dict("Total Maint / Hr")) + 0.49)
    
End Function


