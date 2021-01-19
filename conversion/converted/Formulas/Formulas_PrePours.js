var prePourMobilizations = function(numOfPrePours) {
    var dict = getValues("Mobils_PrePours", Array.Type, Array.Max, Array("Tubs/Day"))
    prePourMobilizations = Round((numOfPrePours / dict("Tubs/Day")) + 0.49)
}
var prePourLaborCrew = function(numOfTubs, mobilizations) {
      var dict = getValues("Mobils_PrePours", Array.Type, Array.Max, Array("Tubs/Day"))
      var crew
      if (numOfTubs <= dict("Tubs/Day")) {
            crew = getValuesBasedOnNum("Labor_PrePours", numOfTubs, Array("Laborers", "Pumper", "Bobcat", "Hosers", "Screeder", "Baggers"))
      } else {
            crew = getValuesBasedOnNum("Labor_PrePours", 60, Array("Laborers", "Pumper", "Bobcat", "Hosers", "Screeder", "Baggers"))
            For Each key In crew
                  crew[key] = crew[key] * mobilizations
            }
      }
      
      prePourLaborCrew = crew
}
var costOfPrePoursLabor = function(wageType, laborers, miles) {
      var dict = getValues("Wage_" + wageType + "_Gyp", Array.Laborer, Array.Average, Array("Price/Day"))
      costOfPrePoursLabor = laborers * dict("Price/Day")
}
var costOfOverTimePrePours = function(wageType, drivingTime, mobilizations) {
      var dict = getValues("Wage_" + wageType + "_Gyp", Array.Laborer, Array.Average, Array("Price/Hr [OT]", "Price/Hr [DT]"))
      var wageOT = dict("Price/Hr [OT]")
      var wageDT = dict("Price/Hr [DT]")
 
      if (drivingTime > 4) {
            costOfOverTimePrePours = (drivingTime - 4) * wageDT
            costOfOverTimePrePours = costOfOverTimePrePours + (4 * wageOT)
      } else {
            costOfOverTimePrePours = drivingTime * wageOT
      }
      
      costOfOverTimePrePours = costOfOverTimePrePours * mobilizations
}
