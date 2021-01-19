var perFoamRollType = function(soundMatType) {
      //The ENKA + sound mats require a thicker perimeter foam (1/4" from Neway)
      
      var dict
      
      if (Right(soundMatType, 1) === "+") {
            dict = getValues("Prices_PerimeterFoam", Array.Default, Array("Default (Enka +)"), Array("Manufacturer", "Width", "Model"))
            perFoamRollType = dict.Manufacturer + " " + dict.Width + " " + dict.Model
      } else {
            dict = getValues("Prices_PerimeterFoam", Array.Default, Array.Default, Array("Manufacturer", "Width", "Model"))
            perFoamRollType = dict.Manufacturer + " " + dict.Width + " " + dict.Model
      }
      
}
var perFoamRolls = function(SF, soundMatType) {
      var dict
      
      if (Right(soundMatType, 1) === "+") {
            dict = getValues("Prices_PerimeterFoam", Array.Default, Array("Default (Enka +)"), Array("LF/Roll"))
      } else {
            dict = getValues("Prices_PerimeterFoam", Array.Default, Array.Default, Array("LF/Roll"))
      }
      
      perFoamRolls = Round((lFt[SF] / dict("LF/Roll")) + 0.49)
      
}
var costOfPerFoamRolls = function(perFoamRolls, soundMatType) {
      var dict
      
      if (Right(soundMatType, 1) === "+") {
            dict = getValues("Prices_PerimeterFoam", Array.Default, Array("Default (Enka +)"), Array("Price/Roll"))
      } else {
            dict = getValues("Prices_PerimeterFoam", Array.Default, Array.Default, Array("Price/Roll"))
      }
      
      costOfPerFoamRolls = Round((perFoamRolls * dict("Price/Roll")) + 0.49)
      
}
var perFoamCuttingLaborers = function(SF) {
      var dict = getValues("Labor_PerFoamCut", Array("Per Day"), Array("Per Laborer"), Array("SF/Laborer"))
      perFoamCuttingLaborers = Round((SF / dict("SF/Laborer")) + 0.49)
}
var costOfPerFoamCutting = function(wageType, laborers) {
      var dict = getValues("Wage_" + wageType + "_SM", Array.Laborer, Array.Average, Array("Price/Day"))
      costOfPerFoamCutting = Round((laborers * dict("Price/Day")) + 0.49)
}
var stapleBoxes = function(SF) {
    var dict = getValues("Prices_Staples", Array.Default, Array.Default, Array("LF/Box"))
    stapleBoxes = Round((lFt[SF] / dict("LF/Box")) + 0.49)
}
var costOfStapleBoxes = function(stapleBoxes) {
    var dict = getValues("Prices_Staples", Array.Default, Array.Default, Array("Price/Box"))
    costOfStapleBoxes = Round((stapleBoxes * dict("Price/Box")) + 0.49)
}
var cansOfSprayGlue = function(SF) {
      //1. GET THE COVERAGE PROVIDED BY A CAN OF SPRAY GLUE
      var dict = getValues("Prices_SprayGlue", Array.Default, Array.Default, Array("SF/Can"))
      
      //2. DIVIDE THE SF BY THE COVERAGE OF THE SPRAY GLUE
      cansOfSprayGlue = Round((SF / dict("SF/Can")) + 0.49)
}
var costOfCansOfSprayGlue = function(cansOfSprayGlue) {
      //Since the price is minimal..im considering rounding up to a whole can
      
      //1. GET THE COST OF EACH CAN OF SPRAY GLUE
      var dict = getValues("Prices_SprayGlue", Array.Default, Array.Default, Array("Price/Can"))
      
      //2. MULTIPLY NUM OF CANS BY COST OF CAN
      costOfCansOfSprayGlue = Round((cansOfSprayGlue * dict("Price/Can")) + 0.49)
}
