Function vehiclesInsuranceCost(gypOrConc As String, mobilizations As Byte, overnight As Boolean) As Integer
      Dim dict As Dictionary: Set dict = getValues("Ins_Vehicles", Array("Type"), Array("Yearly"), Array("Per Day/Truck"))
      Dim insCostPerDayPerTruck As Double: insCostPerDayPerTruck = dict("Per Day/Truck")
    
      '1. CALCULATE VEHICLE INSURANCE COST
      vehiclesInsuranceCost = mobilizations * insCostPerDayPerTruck
      If overnight = True Then
            vehiclesInsuranceCost = vehiclesInsuranceCost * 2
      End If
    
      If gypOrConc = "Gyp" Then
        '1. Multiply by 2 for 2 trucks
        vehiclesInsuranceCost = vehiclesInsuranceCost * 2
      End If
    
End Function
Function vehiclesRegistCost(gypOrConc As String, mobilizations As Byte, overnight As Boolean) As Integer
      Dim dict As Dictionary: Set dict = getValues("Regist_Vehicles_Total", Array("Type"), Array("Yearly"), Array("Per Day/Truck"))
      Dim registCostPerDayPerTruck As Double: registCostPerDayPerTruck = dict("Per Day/Truck")
    
      '1. CALCULATE VEHICLE REGISTRATION COST
      vehiclesRegistCost = Round((mobilizations * registCostPerDayPerTruck) + 0.49)
      If overnight = True Then
            vehiclesRegistCost = vehiclesRegistCost * 2
      End If
            
      If gypOrConc = "Gyp" Then
            '1. Multiply by 2 Drivers
            vehiclesRegistCost = vehiclesRegistCost * 2
      End If
End Function
Function vehiclesDotCost(gypOrConc As String, mobilizations As Byte, overnight As Boolean) As Integer
    Dim dict As Dictionary: Set dict = getValues("Equip_Vehicles", Array("Model"), Array("F-550"), Array("DOT Cost/Day"))
    Dim dotCostPerDayPerTruck As Double: dotCostPerDayPerTruck = dict("DOT Cost/Day")
    
      '1. CALCULATE VEHICLE DOT COST
      vehiclesDotCost = Round((mobilizations * dotCostPerDayPerTruck) + 0.49)
      If overnight = True Then
            vehiclesDotCost = vehiclesDotCost * 2
      End If
    
      If gypOrConc = "Gyp" Then
            '1. Multiply by 2 for 2 trucks
            vehiclesDotCost = vehiclesDotCost * 2
      End If
End Function
