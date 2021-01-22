const lb = require('../library.js');

module.exports.wireUnits = function(wireType, SF) {
    var dict = lb.getValues("Prices_Wire", {"Wire Type": wireType}, ["Unit Type", "SF/Unit"]);
    return {
        unitType: dict["Unit Type"],
        units: Math.ceil(SF / dict["SF/Unit"])
    }
}
module.exports.costOfWireUnits = function(wireType, SF) {
    var dict = lb.getValues("Prices_Wire", {"Wire Type": wireType}, ["Price/SF"]);
    return Math.ceil(SF * dict["Price/SF"]);
}
module.exports.pinBoxes = function(units) {
    var dict = lb.getValues("Prices_Pins", {"Type": "Box"}, ["Pins Per Box"]);
    return units * dict["Pins Per Box"] / 1000;
}
module.exports.costOfPinBoxes = function(pinBoxes) {
    var dict = lb.getValues("Prices_Pins", {"Type": "Box"}, ["Price/Box"]);
    return pinBoxes * dict["Price/Box"];
}
module.exports.washerBoxes = function(pinBoxes) {
    return pinBoxes / 4;
}
module.exports.costOfWasherBoxes = function(washerBoxes) {
    var dict = lb.getValues("Prices_Washers", {"Type": "Box"}, ["Price/Box"]);
    return washerBoxes * dict["Price/Box"];
}
module.exports.wireLaborers = function(wireType, SF) {
    var dict = lb.getValues("Labor_Wire", {"Wire Type": wireType}, ["SF/Laborer"]);
    return Math.ceil(SF / dict["SF/Laborer"]);
}
module.exports.costOfWireLaborers = function(wageType, wireLaborers) {
    var dict = lb.getValues("Wage_" + wageType + "_Wire", {"Laborer": "Wire Installer"}, ["Price/Day"]);
    return wireLaborers * dict["Price/Day"];
}




