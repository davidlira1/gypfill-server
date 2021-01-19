Function blackPaperRolls(blackPaperType As String, SF As Long) As Integer
    Dim dict As Dictionary: Set dict = getValues("Prices_BlackPaper", Array("Type"), Array(blackPaperType), Array("SF/Roll"))
    blackPaperRolls = Round((SF / dict("SF/Roll")) + 0.49)
End Function
Function blackPaperRollsMoistStop(blackPaperType As String, SF As Long)
      Dim dict As Dictionary: Set dict = getValues("Prices_BlackPaper", Array("Default"), Array(blackPaperType), Array("LF/Roll"))
      blackPaperRollsMoistStop = Round(lFt(SF) / dict("LF/Roll") + 0.49)
End Function
Function costOfBlackPaperRolls(blackPaperType As String, blackPaperRolls As Long) As Integer
    Dim dict As Dictionary: Set dict = getValues("Prices_BlackPaper", Array("Type"), Array(blackPaperType), Array("Price/Roll"))
    costOfBlackPaperRolls = Round((blackPaperRolls * dict("Price/Roll")) + 0.49)
End Function
Function blackPaperLaborers(blackPaperType As String, SF As Long) As Byte
    Dim dict As Dictionary: Set dict = getValues("Labor_BlackPaper", Array("Black Paper Type"), Array(blackPaperType), Array("SF/Laborer"))
    blackPaperLaborers = Round(SF / dict("SF/Laborer") + 0.49)
End Function
Function costOfBlackPaperLaborers(wageType As String, numOfLaborers As Byte) As Integer
    Dim dict As Dictionary: Set dict = getValues("Wage_" & wageType & "_BlackPaper", Array("Laborer"), Array("Black Paper Installer"), Array("Price/Day"))
    costOfBlackPaperLaborers = numOfLaborers * dict("Price/Day")
End Function
Function blackPaperMoistStopLaborers(SF As Long) As Byte
    Dim dict As Dictionary: Set dict = getValues("Labor_MoistStop", Array("Per Day"), Array("Per Laborer"), Array("SF/Laborer"))
    blackPaperMoistStopLaborers = Round((SF / dict("SF/Laborer")) + 0.49)
End Function

