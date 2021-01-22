const lb = require('../library.js');

module.exports.perFoamRollType = function(soundMatType) {
      //The ENKA + sound mats require a thicker perimeter foam (1/4" from Neway)
      var dict; 
      if (soundMatType[soundMatType.length - 1] === "+") {
            dict = lb.getValues("Prices_PerimeterFoam", {"Default": "Default (Enka +)"}, ["Manufacturer", "Width", "Model"]);
            return dict.Manufacturer + " " + dict.Width + " " + dict.Model;
      } else {
            dict = lb.getValues("Prices_PerimeterFoam", {"Default": "Default"}, ["Manufacturer", "Width", "Model"]);
            return dict.Manufacturer + " " + dict.Width + " " + dict.Model;
      } 
}
module.exports.perFoamRolls = function(SF, soundMatType) {
      var dict;
      if (soundMatType[soundMatType.length - 1] === "+") {
            dict = lb.getValues("Prices_PerimeterFoam", {"Default": "Default (Enka +)"}, ["LF/Roll"]);
      } else {
            dict = lb.getValues("Prices_PerimeterFoam", {"Default": "Default"}, ["LF/Roll"]);
      }
      return Math.ceil(lb.lFt(SF) / dict["LF/Roll"]);
}
module.exports.costOfPerFoamRolls = function(perFoamRolls, soundMatType) {
      var dict;
      if (soundMatType[soundMatType.length - 1] === "+") {
            dict = lb.getValues("Prices_PerimeterFoam", {"Default": "Default (Enka +)"}, ["Price/Roll"]);
      } else {
            dict = lb.getValues("Prices_PerimeterFoam", {"Default": "Default"}, ["Price/Roll"]);
      }
      return Math.ceil(perFoamRolls * dict["Price/Roll"]);
}
module.exports.perFoamCuttingLaborers = function(SF) {
      var dict = lb.getValues("Labor_PerFoamCut", {"Per Day": "Per Laborer"}, ["SF/Laborer"]);
      return Math.ceil(SF / dict["SF/Laborer"]);
}
module.exports.costOfPerFoamCutting = function(wageType, laborers) {
      var dict = lb.getValues("Wage_" + wageType + "_SM", {"Laborer": "Average"}, ["Price/Day"]);
      return Math.ceil(laborers * dict["Price/Day"]);
}
module.exports.stapleBoxes = function(SF) {
    var dict = lb.getValues("Prices_Staples", {"Default": "Default"}, ["LF/Box"]);
    return Math.ceil(lb.lFt(SF) / dict["LF/Box"]);
}
module.exports.costOfStapleBoxes = function(stapleBoxes) {
    var dict = lb.getValues("Prices_Staples", {"Default": "Default"}, ["Price/Box"]);
    return Math.ceil(stapleBoxes * dict["Price/Box"]);
}
module.exports.cansOfSprayGlue = function(SF) {
      var dict = lb.getValues("Prices_SprayGlue", {"Default": "Default"}, ["SF/Can"]);
      return Math.ceil(SF / dict["SF/Can"]);
}
module.exports.costOfCansOfSprayGlue = function(cansOfSprayGlue) {      
      var dict = lb.getValues("Prices_SprayGlue", {"Default": "Default"}, ["Price/Can"]);
      return Math.ceil(cansOfSprayGlue * dict["Price/Can"]);
}
