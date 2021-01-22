const lb = require('../library.js');

module.exports.prePourMobilizations = function(numOfPrePours) {
    var dict = lb.getValues("Mobils_PrePours", {"Type": "Max"}, ["Tubs/Day"]);
    return Math.ceil(numOfPrePours / dict["Tubs/Day"]);
}
module.exports.prePourLaborCrew = function(numOfTubs, mobilizations) {
      var dict = lb.getValues("Mobils_PrePours", {"Type": "Max"}, ["Tubs/Day"]);
      if (numOfTubs <= dict["Tubs/Day"]) {
            var crew = lb.getValuesBasedOnNum("Labor_PrePours", numOfTubs, ["Laborers", "Pumper", "Bobcat", "Hosers", "Screeder", "Baggers"]);
      } else {
            var crew = lb.getValuesBasedOnNum("Labor_PrePours", 60, ["Laborers", "Pumper", "Bobcat", "Hosers", "Screeder", "Baggers"]);
            for (var key in crew) {
                  crew[key] = crew[key] * mobilizations;
            }
      }
      return crew;
}
module.exports.costOfPrePoursLabor = function(wageType, laborers, miles) {
      var dict = lb.getValues("Wage_" + wageType + "_Gyp", {"Laborer": "Average"}, ["Price/Day"])
      return laborers * dict["Price/Day"];
}
module.exports.costOfOverTimePrePours = function(wageType, drivingTime, mobilizations) {
      var dict = lb.getValues("Wage_" + wageType + "_Gyp", {"Laborer": "Average"}, ["Price/Hr (OT)", "Price/Hr (DT)"]);
      var wageOT = dict["Price/Hr (OT)"];
      var wageDT = dict["Price/Hr (DT)"];
      var cost;
 
      if (drivingTime > 4) {
            cost = (drivingTime - 4) * wageDT;
            cost+= (4 * wageOT);
      } else {
            cost = drivingTime * wageOT;
      }
      
      return cost * mobilizations;
}
