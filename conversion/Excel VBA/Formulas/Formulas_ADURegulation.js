Function costOfADURegLabor(wageType As String, mobilizations As Integer) As Long
      Dim dict As Dictionary: Set dict = getValues("Wage_" & wageType & "_Gyp", Array("Laborer"), Array("Average"), Array("Price/Day"))
      costOfADURegLabor = dict("Price/Day") * mobilizations
End Function
