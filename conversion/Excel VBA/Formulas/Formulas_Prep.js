Function perFoamRollType(soundMatType As String) As String
      'The ENKA + sound mats require a thicker perimeter foam (1/4" from Neway)
      
      Dim dict As Dictionary
      
      If Right(soundMatType, 1) = "+" Then
            Set dict = getValues("Prices_PerimeterFoam", Array("Default"), Array("Default (Enka +)"), Array("Manufacturer", "Width", "Model"))
            perFoamRollType = dict("Manufacturer") & " " & dict("Width") & " " & dict("Model")
      Else
            Set dict = getValues("Prices_PerimeterFoam", Array("Default"), Array("Default"), Array("Manufacturer", "Width", "Model"))
            perFoamRollType = dict("Manufacturer") & " " & dict("Width") & " " & dict("Model")
      End If
      
End Function
Function perFoamRolls(SF As Long, soundMatType As String) As Integer
      Dim dict As Dictionary
      
      If Right(soundMatType, 1) = "+" Then
            Set dict = getValues("Prices_PerimeterFoam", Array("Default"), Array("Default (Enka +)"), Array("LF/Roll"))
      Else
            Set dict = getValues("Prices_PerimeterFoam", Array("Default"), Array("Default"), Array("LF/Roll"))
      End If
      
      perFoamRolls = Round((lFt(SF) / dict("LF/Roll")) + 0.49)
      
End Function
Function costOfPerFoamRolls(perFoamRolls As Integer, soundMatType As String) As Integer
      Dim dict As Dictionary
      
      If Right(soundMatType, 1) = "+" Then
            Set dict = getValues("Prices_PerimeterFoam", Array("Default"), Array("Default (Enka +)"), Array("Price/Roll"))
      Else
            Set dict = getValues("Prices_PerimeterFoam", Array("Default"), Array("Default"), Array("Price/Roll"))
      End If
      
      costOfPerFoamRolls = Round((perFoamRolls * dict("Price/Roll")) + 0.49)
      
End Function
Function perFoamCuttingLaborers(SF As Long) As Integer
      Dim dict As Dictionary: Set dict = getValues("Labor_PerFoamCut", Array("Per Day"), Array("Per Laborer"), Array("SF/Laborer"))
      perFoamCuttingLaborers = Round((SF / dict("SF/Laborer")) + 0.49)
End Function
Function costOfPerFoamCutting(wageType As String, laborers As Integer) As Long
      Dim dict As Dictionary: Set dict = getValues("Wage_" & wageType & "_SM", Array("Laborer"), Array("Average"), Array("Price/Day"))
      costOfPerFoamCutting = Round((laborers * dict("Price/Day")) + 0.49)
End Function
Function stapleBoxes(SF As Long) As Integer
    Dim dict As Dictionary: Set dict = getValues("Prices_Staples", Array("Default"), Array("Default"), Array("LF/Box"))
    stapleBoxes = Round((lFt(SF) / dict("LF/Box")) + 0.49)
End Function
Function costOfStapleBoxes(stapleBoxes As Integer) As Long
    Dim dict As Dictionary: Set dict = getValues("Prices_Staples", Array("Default"), Array("Default"), Array("Price/Box"))
    costOfStapleBoxes = Round((stapleBoxes * dict("Price/Box")) + 0.49)
End Function
Function cansOfSprayGlue(SF As Long) As Byte
      '1. GET THE COVERAGE PROVIDED BY A CAN OF SPRAY GLUE
      Dim dict As Dictionary: Set dict = getValues("Prices_SprayGlue", Array("Default"), Array("Default"), Array("SF/Can"))
      
      '2. DIVIDE THE SF BY THE COVERAGE OF THE SPRAY GLUE
      cansOfSprayGlue = Round((SF / dict("SF/Can")) + 0.49)
End Function
Function costOfCansOfSprayGlue(cansOfSprayGlue As Byte)
      'Since the price is minimal..im considering rounding up to a whole can
      
      '1. GET THE COST OF EACH CAN OF SPRAY GLUE
      Dim dict As Dictionary: Set dict = getValues("Prices_SprayGlue", Array("Default"), Array("Default"), Array("Price/Can"))
      
      '2. MULTIPLY NUM OF CANS BY COST OF CAN
      costOfCansOfSprayGlue = Round((cansOfSprayGlue * dict("Price/Can")) + 0.49)
End Function
