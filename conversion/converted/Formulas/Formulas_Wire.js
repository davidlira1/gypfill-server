var wireUnits = function(wireType, SF) {
    var dict = getValues("Prices_Wire", {"Wire Type": wireType}, ["Unit Type", "SF/Unit"]);
    return {
        unitType: dict["Unit Type"],
        units: Math.ceil(SF / dict["SF/Unit"])
    }
}
var costOfWireUnits = function(wireType, SF) {
    var dict = getValues("Prices_Wire", {"Wire Type": wireType}, ["Price/SF"]);
    return Math.ceil(SF * dict["Price/SF"]);
}
var pinBoxes = function(thick, units) {
    var key_thick = thick <= 0.75 ? `Less Than 3/4"` ? `More Than 3/4"`;
                                       //8 pins            //6 pins
    var dict = getValues("Prices_Pins", {"Thickness": key_thick}, ["Pins Per Unit"]);
    return units * dict["Pins Per Unit"] / 1000
}
var costOfPinBoxes = function(pinBoxes) {
                               //both will be same value
    var dict = getValues("Prices_Pins", {"Thickness": `Less Than 3/4"`}, ["Price/Box"]);
    return pinBoxes * dict["Price/Box"];
}
var washerBoxes = function(pinBoxes) {
    return pinBoxes / 4;
}
var costOfWasherBoxes = function(washerBoxes) {
    var dict = getValues("Prices_Washers", {"Type": "Box"}, ["Price/Box"]);
    return washerBoxes * dict["Price/Box"];
}
var wireLaborers = function(wireType, SF) {
    var dict = getValues("Labor_Wire", {"Wire Type": wireType}, ["SF/Laborer"]);
    return Math.ceil(SF / dict["SF/Laborer"]);
}
var costOfWireLaborers = function(wageType, wireLaborers) {
    var dict = getValues("Wage_" + wageType + "_Wire", {"Laborer": "Wire Installer"}, ["Price/Day"]);
    return wireLaborers * dict["Price/Day"];
}




