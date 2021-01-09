Function prePourMobilizations(numOfPrePours As Integer) As Integer
    Dim dict As Dictionary: Set dict = getValues("Mobils_PrePours", Array("Type"), Array("Max"), Array("Tubs/Day"))
    prePourMobilizations = Round((numOfPrePours / dict("Tubs/Day")) + 0.49)
End Function
Function prePourLaborCrew(numOfTubs As Long, mobilizations As Integer) As Dictionary
      Dim dict As Dictionary: Set dict = getValues("Mobils_PrePours", Array("Type"), Array("Max"), Array("Tubs/Day"))
      Dim crew As Dictionary
      If numOfTubs <= dict("Tubs/Day") Then
            Set crew = getValuesBasedOnNum("Labor_PrePours", numOfTubs, Array("Laborers", "Pumper", "Bobcat", "Hosers", "Screeder", "Baggers"))
      Else
            Set crew = getValuesBasedOnNum("Labor_PrePours", 60, Array("Laborers", "Pumper", "Bobcat", "Hosers", "Screeder", "Baggers"))
            For Each key In crew
                  crew(key) = crew(key) * mobilizations
            Next key
      End If
      
      Set prePourLaborCrew = crew
End Function
Function costOfPrePoursLabor(wageType As String, laborers As Integer, miles As Integer) As Long
      Dim dict As Dictionary: Set dict = getValues("Wage_" & wageType & "_Gyp", Array("Laborer"), Array("Average"), Array("Price/Day"))
      costOfPrePoursLabor = laborers * dict("Price/Day")
End Function
Function costOfOverTimePrePours(wageType As String, drivingTime As Double, mobilizations As Byte)
      Dim dict As Dictionary: Set dict = getValues("Wage_" & wageType & "_Gyp", Array("Laborer"), Array("Average"), Array("Price/Hr (OT)", "Price/Hr (DT)"))
      Dim wageOT As Double: wageOT = dict("Price/Hr (OT)")
      Dim wageDT As Double: wageDT = dict("Price/Hr (DT)")
 
      If drivingTime > 4 Then
            costOfOverTimePrePours = (drivingTime - 4) * wageDT
            costOfOverTimePrePours = costOfOverTimePrePours + (4 * wageOT)
      Else
            costOfOverTimePrePours = drivingTime * wageOT
      End If
      
      costOfOverTimePrePours = costOfOverTimePrePours * mobilizations
End Function
