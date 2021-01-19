Function drivingFuelsCost(material As String, miles As Variant, mobilizations As Byte) As Integer
      'WE DRIVE FOR EACH MOBILIZATION, ROUND TRIP
      If miles <> "Not Available" Then
            '1. CALCULATE COST FOR ONE WAY
            'here we hardcoded the truck type
            drivingFuelsCost = drivingFuelCost("F-550", miles)
                  
            '2. MULTIPLY BY 2 FOR ROUND TRIP
            drivingFuelsCost = drivingFuelsCost * 2
                  
            '3. MULTIPLY DRIVING FUELS COST BY MOBILIZATIONS
            drivingFuelsCost = drivingFuelsCost * mobilizations
            
            If material = "Gyp" Then
                  '1. MULTIPLY BY 2 FOR DRIVERS
                  drivingFuelsCost = drivingFuelsCost * 2
            End If
      Else
            drivingFuelsCost = "Not Available"
      End If
End Function
Function drivingFuelCost(vehicle As String, miles As Variant) As Integer
    'ONE WAY
    
    Dim dict As Dictionary
    
    Dim fuelType As String
    Set dict = getValues("Equip_Vehicles", Array("Model"), Array(vehicle), Array("Fuel"))
    fuelType = dict("Fuel")
    
    Dim MPG As Integer
    Set dict = getValues("Equip_Vehicles", Array("Model"), Array(vehicle), Array("MPG"))
    MPG = dict("MPG")
    
    Dim gallons As Double
    gallons = miles / MPG

    Dim pricePerGallon As Double
    Set dict = getValues("Prices_Fuel", Array("Fuel Type"), Array(fuelType), Array("Price/Gallon"))
    pricePerGallon = dict("Price/Gallon")
    
    drivingFuelCost = Round((gallons * pricePerGallon) + 0.49)
End Function
Function machinesFuelCost(gypOrConc As String, hrs As Double, machines As Variant) As Dictionary
      Set machinesFuelCost = New Dictionary
      
      If gypOrConc = "Gyp" Then
            machinesFuelCost.Add "pump", machineFuelCost("gypPump", (machines(0)), hrs)
            machinesFuelCost.Add "bobcat", machineFuelCost("bobcat", (machines(1)), hrs)
      Else
            machinesFuelCost.Add "pump", machineFuelCost("concPump", (machines(0)), hrs)
      End If
      
End Function
Function machineFuelCost(machineType As String, machine As String, hrs As Double) As Long
      Dim tableName As String
      
      '1. DETERMINE TABLE NAME
      If machineType = "gypPump" Then
            tableName = "Equip_Gyp_Pumps"
      ElseIf machineType = "concPump" Then
            tableName = "Equip_Conc_Pumps"
      ElseIf machineType = "bobcat" Then
            tableName = "Equip_Bobcats"
            hrs = hrs + 1 'the bobcat will work for one more hour than the pump, since it's setting up at the beginning, and cleaning up at the end
      End If
      
      '2. GET GALS/HR AND FUEL TYPE FOR MACHINE
      Dim dict As Dictionary: Set dict = getValues(tableName, Array("Model-Num"), Array(machine), Array("Gals/Hr", "Fuel Type"))
      
      '3. CALCULATE GALLONS
      Dim gallons As Long: gallons = hrs * dict("Gals/Hr")
      
      '4. SET FUEL TYPE VARIABLE
      Dim fuelType As String: fuelType = dict("Fuel Type")
      
      '5. GET PRICE/GALLON FOR FUEL
      Set dict = getValues("Prices_Fuel", Array("Fuel Type"), Array(fuelType), Array("Price/Gallon"))
      
      '6. SET PRICE/GALLON VARIABLE
      Dim fuelCostPerGal As Double: fuelCostPerGal = dict("Price/Gallon")
      
      '7. CALCULATE MACHINE FUEL COST
      machineFuelCost = gallons * fuelCostPerGal
      
End Function
