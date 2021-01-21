var ramBoardRolls = function(SF) {
      var dict = getValues("Prices_RamBoard", {"Default": "Default"}, ["SF/Roll"]);
      return Math.ceil(SF / dict["SF/Roll"]);
}
var costOfRamBoardRolls = function(rolls) {
      var dict = getValues("Prices_RamBoard", {"Default": "Default"}, ["Price/Roll"]);
      return Math.ceil(rolls * dict["Price/Roll"]);
}
var ductTapeRollsForRamBoard = function(SF) {
      //1. GET LF OF DUCT TAPE PER SF OF PROJECT
      var dict = getValues("Materials_DuctTapeForRamBoard", {"Quantity": "LF / SF"}, ["SF", "LF"]);
      
      //2. CALCULATE LF OF DUCT TAPE
      var linearFeetOfDuctTape = SF / dict.SF * dict.LF;
      
      //3. GET LF/ DUCT TAPE ROLL
      dict = getValues("Prices_DuctTape", {"Default": "Default"}, ["LF/Roll"]);
      
      //4. CALCULATE NUMBER OF DUCT TAPE ROLLS
      //LF / LF/DUC
      return Math.ceil(linearFeetOfDuctTape / dict["LF/Roll"]);
}
