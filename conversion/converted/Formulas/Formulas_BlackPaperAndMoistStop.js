var blackPaperRolls = function(blackPaperType, SF) {
    var dict = getValues("Prices_BlackPaper", Array.Type, Array[blackPaperType], Array("SF/Roll"))
    blackPaperRolls = Round((SF / dict("SF/Roll")) + 0.49)
}
var blackPaperRollsMoistStop = function(blackPaperType, SF) {
      var dict = getValues("Prices_BlackPaper", Array.Default, Array[blackPaperType], Array("LF/Roll"))
      blackPaperRollsMoistStop = Round(lFt[SF] / dict("LF/Roll") + 0.49)
}
var costOfBlackPaperRolls = function(blackPaperType, blackPaperRolls) {
    var dict = getValues("Prices_BlackPaper", Array.Type, Array[blackPaperType], Array("Price/Roll"))
    costOfBlackPaperRolls = Round((blackPaperRolls * dict("Price/Roll")) + 0.49)
}
var blackPaperLaborers = function(blackPaperType, SF) {
    var dict = getValues("Labor_BlackPaper", Array("Black Paper Type"), Array[blackPaperType], Array("SF/Laborer"))
    blackPaperLaborers = Round(SF / dict("SF/Laborer") + 0.49)
}
var costOfBlackPaperLaborers = function(wageType, numOfLaborers) {
    var dict = getValues("Wage_" + wageType + "_BlackPaper", Array.Laborer, Array("Black Paper Installer"), Array("Price/Day"))
    costOfBlackPaperLaborers = numOfLaborers * dict("Price/Day")
}
var blackPaperMoistStopLaborers = function(SF) {
    var dict = getValues("Labor_MoistStop", Array("Per Day"), Array("Per Laborer"), Array("SF/Laborer"))
    blackPaperMoistStopLaborers = Round((SF / dict("SF/Laborer")) + 0.49)
}

