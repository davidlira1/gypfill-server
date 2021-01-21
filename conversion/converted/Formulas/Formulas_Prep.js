var perFoamRollType = function(soundMatType) {
      //The ENKA + sound mats require a thicker perimeter foam (1/4" from Neway)
      var dict; 
      if (soundMatType[soundMatType.length - 1] === "+") {
            dict = getValues("Prices_PerimeterFoam", {"Default": "Default (Enka +)"}, ["Manufacturer", "Width", "Model"]);
            return dict.Manufacturer + " " + dict.Width + " " + dict.Model;
      } else {
            dict = getValues("Prices_PerimeterFoam", {"Default": "Default"}, ["Manufacturer", "Width", "Model"]);
            return dict.Manufacturer + " " + dict.Width + " " + dict.Model;
      } 
}
var perFoamRolls = function(SF, soundMatType) {
      var dict;
      if (soundMatType[soundMatType.length - 1] === "+") {
            dict = getValues("Prices_PerimeterFoam", {"Default": "Default (Enka +)"}, ["LF/Roll"]);
      } else {
            dict = getValues("Prices_PerimeterFoam", {"Default": "Default"}, ["LF/Roll"]);
      }
      return Math.ceil(lFt(SF) / dict["LF/Roll"]);
}
var costOfPerFoamRolls = function(perFoamRolls, soundMatType) {
      var dict;
      if (soundMatType[soundMatType.length - 1] === "+") {
            dict = getValues("Prices_PerimeterFoam", {"Default": "Default (Enka +)"}, ["Price/Roll"]);
      } else {
            dict = getValues("Prices_PerimeterFoam", {"Default": "Default"}, ["Price/Roll"]);
      }
      return Math.ceil(perFoamRolls * dict["Price/Roll"]);
}
var perFoamCuttingLaborers = function(SF) {
      var dict = getValues("Labor_PerFoamCut", {"Per Day": "Per Laborer"}, ["SF/Laborer"]);
      return Math.ceil(SF / dict["SF/Laborer"]);
}
var costOfPerFoamCutting = function(wageType, laborers) {
      var dict = getValues("Wage_" + wageType + "_SM", {"Laborer": "Average"}, ["Price/Day"]);
      return Math.ceil(laborers * dict["Price/Day"]);
}
var stapleBoxes = function(SF) {
    var dict = getValues("Prices_Staples", {"Default": "Default"}, ["LF/Box"]);
    return Math.ceil(lFt(SF) / dict["LF/Box"]);
}
var costOfStapleBoxes = function(stapleBoxes) {
    var dict = getValues("Prices_Staples", {"Default": "Default"}, ["Price/Box"]);
    return Math.ceil(stapleBoxes * dict["Price/Box"]);
}
var cansOfSprayGlue = function(SF) {
      var dict = getValues("Prices_SprayGlue", {"Default": "Default"}, ["SF/Can"]);
      return Math.ceil(SF / dict["SF/Can"]);
}
var costOfCansOfSprayGlue = function(cansOfSprayGlue) {      
      var dict = getValues("Prices_SprayGlue", {"Default": "Default"}, ["Price/Can"]);
      return Math.ceil(cansOfSprayGlue * dict["Price/Can"]);
}
