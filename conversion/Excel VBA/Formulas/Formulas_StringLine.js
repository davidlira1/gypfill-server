Function stringLineRolls(SF As Long) As Integer
      Dim dict As Dictionary: Set dict = getValues("Prices_StringLine", Array("Type"), Array("String Line"), Array("LF/Roll"))
      stringLineRolls = Round((lFt(SF) / dict("LF/Roll")) + 0.49)
End Function
Function costOfStringLineRolls(stringLineRolls As Integer)
      Dim dict As Dictionary: Set dict = getValues("Prices_StringLine", Array("Type"), Array("String Line"), Array("Price/Roll"))
      costOfStringLineRolls = Round((stringLineRolls * dict("Price/Roll")) + 0.49)
End Function
