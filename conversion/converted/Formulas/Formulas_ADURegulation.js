var costOfADURegLabor = function(wageType, mobilizations) {
      var dict = getValues("Wage_" + wageType + "_Gyp", {"Laborer": "Average"}, ["Price/Day"]);
      return dict["Price/Day"] * mobilizations;
}

module.exports = costOfADURegLabor;