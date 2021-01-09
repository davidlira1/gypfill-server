Function ductTapeRolls(SF As Long) As Integer
      
      Dim dict As Dictionary: Set dict = getValues("Prices_DuctTape", Array("Default"), Array("Default"), Array("LF/Roll"))
      ductTapeRolls = Round((lFt(SF) / dict("LF/Roll")) + 0.49)
      
End Function
Function ductTapeRollsWhenNoSM(SF As Long) As Integer

      Dim dict As Dictionary: Set dict = getValues("Labor_DuctTape", Array("Usage"), Array("No Sound Mat"), Array("SF/Roll"))
      ductTapeRollsWhenNoSM = Round((SF / dict("SF/Roll")) + 0.49)
      
End Function
Function costOfDuctTapeRolls(ductTapeRolls As Integer) As Integer

      Dim dict As Dictionary: Set dict = getValues("Prices_DuctTape", Array("Default"), Array("Default"), Array("Total"))
      costOfDuctTapeRolls = Round((ductTapeRolls * dict("Total")) + 0.49)
    
End Function
