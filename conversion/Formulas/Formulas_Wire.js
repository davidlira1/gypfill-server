Function wireUnits(wireType As String, SF As Long) As Dictionary
    Set wireUnits = New Dictionary
    Dim dict As Dictionary: Set dict = getValues("Prices_Wire", Array("Wire Type"), Array(wireType), Array("Unit Type", "SF/Unit"))
    wireUnits.Add "unitType", dict("Unit Type")
    wireUnits.Add "units", Round((SF / dict("SF/Unit")) + 0.49)
End Function
Function costOfWireUnits(wireType As String, SF As Long) As Integer
    Dim dict As Dictionary: Set dict = getValues("Prices_Wire", Array("Wire Type"), Array(wireType), Array("Price/SF"))
    costOfWireUnits = Round((SF * dict("Price/SF")) + 0.49)
End Function
Function pinBoxes(thick As Double, units As Integer) As Double
    Dim key_thick As String
    
    If thick <= 0.75 Then
        key_thick = "Less Than 3/4" & """" 'will result in 8 pins
    Else
        key_thick = "More Than 3/4" & """" 'will result in 6 pins
    End If
   
    Dim dict As Dictionary: Set dict = getValues("Prices_Pins", Array("Thickness"), Array(key_thick), Array("Pins Per Unit"))
    pinBoxes = units * dict("Pins Per Unit") / 1000
End Function
Function costOfPinBoxes(pinBoxes As Double) As Double
                                                                                        'both will be same value
    Dim dict As Dictionary: Set dict = getValues("Prices_Pins", Array("Thickness"), Array("Less Than 3/4" & """"), Array("Price/Box"))
    costOfPinBoxes = pinBoxes * dict("Price/Box")
End Function
Function washerBoxes(pinBoxes As Double) As Double
    washerBoxes = pinBoxes / 4
End Function
Function costOfWasherBoxes(washerBoxes As Double) As Double
    Dim dict As Dictionary: Set dict = getValues("Prices_Washers", Array("Type"), Array("Box"), Array("Price/Box"))
    costOfWasherBoxes = washerBoxes * dict("Price/Box")
End Function
Function wireLaborers(wireType As String, SF As Long) As Byte
    Dim dict As Dictionary: Set dict = getValues("Labor_Wire", Array("Wire Type"), Array(wireType), Array("SF/Laborer"))
    wireLaborers = Round((SF / dict("SF/Laborer")) + 0.49)
End Function
Function costOfWireLaborers(wageType As String, wireLaborers As Byte) As Integer
    Dim dict As Dictionary: Set dict = getValues("Wage_" & wageType & "_Wire", Array("Laborer"), Array("Wire Installer"), Array("Price/Day"))
    costOfWireLaborers = wireLaborers * dict("Price/Day")
End Function




