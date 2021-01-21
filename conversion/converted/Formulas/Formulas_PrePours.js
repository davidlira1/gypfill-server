var prePourMobilizations = function(numOfPrePours) {
    var dict = getValues("Mobils_PrePours", {"Type": "Max"}, ["Tubs/Day"]);
    return Math.ceil(numOfPrePours / dict["Tubs/Day"]);
}

var prePourLaborCrew = function(numOfTubs, mobilizations) {
      var dict = getValues("Mobils_PrePours", {"Type": "Max"}, ["Tubs/Day"]);
      var crew = {};
      if (numOfTubs <= dict["Tubs/Day"]) {
            crew = getValuesBasedOnNum("Labor_PrePours", numOfTubs, ["Laborers", "Pumper", "Bobcat", "Hosers", "Screeder", "Baggers"]);
      } else {
            crew = getValuesBasedOnNum("Labor_PrePours", 60, ["Laborers", "Pumper", "Bobcat", "Hosers", "Screeder", "Baggers"]);
            for (var key in crew) {
                  crew[key] = crew[key] * mobilizations;
            }
      }
      return crew;
}

var costOfPrePoursLabor = function(wageType, laborers, miles) {
      var dict = getValues("Wage_" + wageType + "_Gyp", {"Laborer": "Average"}, ["Price/Day"])
      return laborers * dict["Price/Day"];
}

var costOfOverTimePrePours = function(wageType, drivingTime, mobilizations) {
      var dict = getValues("Wage_" + wageType + "_Gyp", {"Laborer": "Average"}, ["Price/Hr [OT]", "Price/Hr [DT]"]);
      var wageOT = dict["Price/Hr [OT]"];
      var wageDT = dict["Price/Hr [DT]"];
      var cost;
 
      if (drivingTime > 4) {
            cost = (drivingTime - 4) * wageDT;
            cost+= (4 * wageOT);
      } else {
            cost = drivingTime * wageOT;
      }
      
      return cost * mobilizations;
}
