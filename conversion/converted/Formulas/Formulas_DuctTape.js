var ductTapeRolls = function(SF) {
      
      var dict = getValues("Prices_DuctTape", Array.Default, Array.Default, Array("LF/Roll"))
      ductTapeRolls = Round((lFt[SF] / dict("LF/Roll")) + 0.49)
      
}
var ductTapeRollsWhenNoSM = function(SF) {

      var dict = getValues("Labor_DuctTape", Array.Usage, Array("No Sound Mat"), Array("SF/Roll"))
      ductTapeRollsWhenNoSM = Round((SF / dict("SF/Roll")) + 0.49)
      
}
var costOfDuctTapeRolls = function(ductTapeRolls) {

      var dict = getValues("Prices_DuctTape", Array.Default, Array.Default, Array.Total)
      costOfDuctTapeRolls = Round((ductTapeRolls * dict.Total) + 0.49)
    
}
