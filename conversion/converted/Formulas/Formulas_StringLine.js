var stringLineRolls = function(SF) {
      var dict = getValues("Prices_StringLine", Array.Type, Array("String Line"), Array("LF/Roll"))
      stringLineRolls = Round((lFt[SF] / dict("LF/Roll")) + 0.49)
}
var costOfStringLineRolls = function(stringLineRolls) {
      var dict = getValues("Prices_StringLine", Array.Type, Array("String Line"), Array("Price/Roll"))
      costOfStringLineRolls = Round((stringLineRolls * dict("Price/Roll")) + 0.49)
}
