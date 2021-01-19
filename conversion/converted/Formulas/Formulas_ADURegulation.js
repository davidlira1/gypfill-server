var costOfADURegLabor = function(wageType, mobilizations) {
      var dict = getValues("Wage_" + wageType + "_Gyp", Array.Laborer, Array.Average, Array("Price/Day"))
      costOfADURegLabor = dict("Price/Day") * mobilizations
}
