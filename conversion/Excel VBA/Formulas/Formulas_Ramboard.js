Function ramBoardRolls(SF As Long) As Byte
      '1. GET THE SF/ROLL
      Dim dict As Dictionary: Set dict = getValues("Prices_RamBoard", Array("Default"), Array("Default"), Array("SF/Roll"))
      
      '2. CALCULATE NUMBER OF RAMBOARD ROLLS
      ramBoardRolls = Round((SF / dict("SF/Roll")) + 0.49)
      
End Function
Function costOfRamBoardRolls(rolls As Integer) As Integer
       '1. GET THE PRICE/ROLL
      Dim dict As Dictionary: Set dict = getValues("Prices_RamBoard", Array("Default"), Array("Default"), Array("Price/Roll"))
      
      '2. CALCULATE COST OF ROLLS
      costOfRamBoardRolls = Round((rolls * dict("Price/Roll")) + 0.49)
      
End Function
Function ductTapeRollsForRamBoard(SF As Long) As Integer
      Dim dict As Dictionary
      '1. GET LF OF DUCT TAPE PER SF OF PROJECT
      Set dict = getValues("Materials_DuctTapeForRamBoard", Array("Quantity"), Array("LF / SF"), Array("SF", "LF"))
      
      '2. CALCULATE LF OF DUCT TAPE
      Dim linearFeetOfDuctTape As Integer: linearFeetOfDuctTape = SF / dict("SF") * dict("LF")
      
      '3. GET LF/ DUCT TAPE ROLL
      Set dict = getValues("Prices_DuctTape", Array("Default"), Array("Default"), Array("LF/Roll"))
      
      '4. CALCULATE NUMBER OF DUCT TAPE ROLLS
      'LF / LF/DUC
      ductTapeRollsForRamBoard = Round((linearFeetOfDuctTape / dict("LF/Roll")) + 0.49)
      
End Function
