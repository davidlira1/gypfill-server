const lb = require('../library.js');

module.exports.costOfADURegLabor = function(wageType, mobilizations) {
      var dict = lb.getValues("Wage_" + wageType + "_Gyp", {"Laborer": "Average"}, ["Price/Day"]);
      return Math.ceil(dict["Price/Day"] * mobilizations);
}
