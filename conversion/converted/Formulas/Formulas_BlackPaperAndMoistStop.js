module.exports.blackPaperRolls = function(blackPaperType, SF) {
    var dict = getValues("Prices_BlackPaper", {"Type": blackPaperType}, ["SF/Roll"]);
    return Math.ceil(SF / dict["SF/Roll"]);
}
module.exports.blackPaperRollsMoistStop = function(blackPaperType, SF) {
    var dict = getValues("Prices_BlackPaper", {"Default": blackPaperType}, ["LF/Roll"]);
    return Math.ceil(lFt[SF] / dict["LF/Roll"]);
}
module.exports.costOfBlackPaperRolls = function(blackPaperType, blackPaperRolls) {
    var dict = getValues("Prices_BlackPaper", {"Type": blackPaperType}, ["Price/Roll"]);
    return Math.ceil(blackPaperRolls * dict["Price/Roll"]);
}
module.exports.blackPaperLaborers = function(blackPaperType, SF) {
    var dict = getValues("Labor_BlackPaper", {"Black Paper Type": blackPaperType}, ["SF/Laborer"]);
    return Math.ceil(SF / dict["SF/Laborer"]);
}
module.exports.costOfBlackPaperLaborers = function(wageType, numOfLaborers) {
    var dict = getValues("Wage_" + wageType + "_BlackPaper", {"Laborer":"Black Paper Installer"}, ["Price/Day"]);
    return numOfLaborers * dict["Price/Day"];
}
module.exports.blackPaperMoistStopLaborers = function(SF) {
    var dict = getValues("Labor_MoistStop", {"Per Day": "Per Laborer"}, ["SF/Laborer"]);
    return Math.ceil(SF / dict["SF/Laborer"]);
}

