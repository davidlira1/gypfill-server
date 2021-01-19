var maximizerBags = function(yds) {
    var cuFt
    cuFt = Round((yds * 27) + 0.49)
    maximizerBags = cuFt
}
var costOfMaximizerBags = function(bags) {
      var dict = getValues("Prices_ConcBag", Array.Type, Array.Maximizer, Array("Price/Bag"))
      costOfMaximizerBags = bags * dict("Price/Bag")
}
var maximizerLaborers = function(yds, addMobils) {
      var ml = {}
      //var dict = getValues("Labor_ConcBag", Array.CuYds, Array[yds], Array("CuYds", "Laborers", "Finishers"))
      var dict = getValuesBasedOnNum("Labor_ConcBag", CLng[yds], Array("CuYds", "Laborers", "Finishers"))
      var sets = Round((yds / 2.37) + 0.49)
      ml.sets = sets
      ml.totalCrew = {}
      ml.totalCrew.Laborers = dict.Laborers * sets * (addMobils + 1)
      ml.totalCrew.Finishers = dict.Finishers * sets * (addMobils + 1)
      ml.totalCrew.Total = ml.totalCrew.Laborers + ml.totalCrew.Finishers
      maximizerLaborers = ml
}
var costOfMaximizerLaborers = function(wageType, laborers, miles, saturday) {
      costOfMaximizerLaborers = {}
      
      var dict = getValues("Wage_" + wageType + "_Conc", Array.Laborer, Array.Average, Array("Price/Day", "Price/Hr [OT]"))
    
      //dict = getValues("Prices_AfterMileThreshold", Array.Description, Array.Threshold, Array("Miles", "Price/Day"))
      //2. CALCULATE COST OF LABORERS
      if (saturday = "No" Or saturday === "Yes - Option") {
            costOfMaximizerLaborers.cost = Round((dict("Price/Day") * laborers) + 0.49)
      } else {
            costOfMaximizerLaborers.cost = Round((dict("Price/Hr [OT]") * 8 * laborers) + 0.49)
      }
      
      //3. IF SATURDAY OPTION
      if (saturday === "Yes - Option") {
            costOfMaximizerLaborers.costOption = Round((((dict("Price/Hr [OT]") * 8) - dict("Price/Day")) * laborers) + 0.49)
      } else {
            costOfMaximizerLaborers.costOption = 0
      }
//      if (miles > dict.Miles) {
//            costOfMaximizerLaborers = costOfMaximizerLaborers + (4 * dict("Price/Day")) //4 guys, 1 driver. 5 guys for doing i set, which is 2.37 cYDs
//      }
}


