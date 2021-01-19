var wireUnits = function(wireType, SF) {
    wireUnits = {}
    var dict = getValues("Prices_Wire", Array("Wire Type"), Array[wireType], Array("Unit Type", "SF/Unit"))
    wireUnits.unitType = dict("Unit Type")
    wireUnits.units = Round((SF / dict("SF/Unit")) + 0.49)
}
var costOfWireUnits = function(wireType, SF) {
    var dict = getValues("Prices_Wire", Array("Wire Type"), Array[wireType], Array("Price/SF"))
    costOfWireUnits = Round((SF * dict("Price/SF")) + 0.49)
}
var pinBoxes = function(thick, units) {
    var key_thick
    
    if (thick <= 0.75) {
        key_thick = "Less Than 3/4" + """" //will result in 8 pins
    } else {
        key_thick = "More Than 3/4" + """" //will result in 6 pins
    }
   
    var dict = getValues("Prices_Pins", Array.Thickness, Array[key_thick], Array("Pins Per Unit"))
    pinBoxes = units * dict("Pins Per Unit") / 1000
}
var costOfPinBoxes = function(pinBoxes) {
                                                                                        //both will be same value
    var dict = getValues("Prices_Pins", Array.Thickness, Array("Less Than 3/4" + """"), Array("Price/Box"))
    costOfPinBoxes = pinBoxes * dict("Price/Box")
}
var washerBoxes = function(pinBoxes) {
    washerBoxes = pinBoxes / 4
}
var costOfWasherBoxes = function(washerBoxes) {
    var dict = getValues("Prices_Washers", Array.Type, Array.Box, Array("Price/Box"))
    costOfWasherBoxes = washerBoxes * dict("Price/Box")
}
var wireLaborers = function(wireType, SF) {
    var dict = getValues("Labor_Wire", Array("Wire Type"), Array[wireType], Array("SF/Laborer"))
    wireLaborers = Round((SF / dict("SF/Laborer")) + 0.49)
}
var costOfWireLaborers = function(wageType, wireLaborers) {
    var dict = getValues("Wage_" + wageType + "_Wire", Array.Laborer, Array("Wire Installer"), Array("Price/Day"))
    costOfWireLaborers = wireLaborers * dict("Price/Day")
}




