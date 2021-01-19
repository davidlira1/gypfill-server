var ramBoardRolls = function(SF) {
      //1. GET THE SF/ROLL
      var dict = getValues("Prices_RamBoard", Array.Default, Array.Default, Array("SF/Roll"))
      
      //2. CALCULATE NUMBER OF RAMBOARD ROLLS
      ramBoardRolls = Round((SF / dict("SF/Roll")) + 0.49)
      
}
var costOfRamBoardRolls = function(rolls) {
       //1. GET THE PRICE/ROLL
      var dict = getValues("Prices_RamBoard", Array.Default, Array.Default, Array("Price/Roll"))
      
      //2. CALCULATE COST OF ROLLS
      costOfRamBoardRolls = Round((rolls * dict("Price/Roll")) + 0.49)
      
}
var ductTapeRollsForRamBoard = function(SF) {
      var dict
      //1. GET LF OF DUCT TAPE PER SF OF PROJECT
      dict = getValues("Materials_DuctTapeForRamBoard", Array.Quantity, Array("LF / SF"), Array("SF", "LF"))
      
      //2. CALCULATE LF OF DUCT TAPE
      var linearFeetOfDuctTape = SF / dict.SF * dict.LF
      
      //3. GET LF/ DUCT TAPE ROLL
      dict = getValues("Prices_DuctTape", Array.Default, Array.Default, Array("LF/Roll"))
      
      //4. CALCULATE NUMBER OF DUCT TAPE ROLLS
      //LF / LF/DUC
      ductTapeRollsForRamBoard = Round((linearFeetOfDuctTape / dict("LF/Roll")) + 0.49)
      
}
