module.exports.maximizerBags = function(yds) {
    return Math.ceil(yds * 27);
}
module.exports.costOfMaximizerBags = function(bags) {
      var dict = getValues("Prices_ConcBag", {"Type": "Maximizer"}, ["Price/Bag"]);
      return bags * dict["Price/Bag"];
}
module.exports.maximizerLaborers = function(yds, addMobils) {
      var ml = {}
      var dict = getValuesBasedOnNum("Labor_ConcBag", yds, ["CuYds", "Laborers", "Finishers"]);
      var sets = Math.ceil(yds / 2.37);
      ml.sets = sets;
      ml.totalCrew = {}
      ml.totalCrew.Laborers = dict.Laborers * sets * (addMobils + 1);
      ml.totalCrew.Finishers = dict.Finishers * sets * (addMobils + 1);
      ml.totalCrew.Total = ml.totalCrew.Laborers + ml.totalCrew.Finishers;
      return ml;
}
module.exports.costOfMaximizerLaborers = function(wageType, laborers, miles, saturday) {
      var costOfMaximizerLaborers = {};
      var dict = getValues("Wage_" + wageType + "_Conc", {"Laborer": "Average"}, ["Price/Day", "Price/Hr [OT]"]);
  
      //2. CALCULATE COST OF LABORERS;
      if (saturday === "No" || saturday === "Yes - Option") {
            costOfMaximizerLaborers.cost = Math.ceil(dict["Price/Day"] * laborers);
      } else {
            costOfMaximizerLaborers.cost = Math.ceil(dict["Price/Hr [OT]"] * 8 * laborers);
      }
      //3. IF SATURDAY OPTION;
      if (saturday === "Yes - Option") {
            costOfMaximizerLaborers.costOption = Math.ceil(((dict["Price/Hr [OT]"] * 8) - dict["Price/Day"]) * laborers);
      } else {
            costOfMaximizerLaborers.costOption = 0;
      }
      return costOfMaximizerLaborers;
}
