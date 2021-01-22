const lb = require('../library.js');

module.exports.ductTapeRolls = function(SF) {
      var dict = lb.getValues("Prices_DuctTape", {"Default": "Default"}, ["LF/Roll"]);
      return Math.ceil(lb.lFt(SF) / dict["LF/Roll"]);
}
module.exports.ductTapeRollsWhenNoSM = function(SF) {
      var dict = lb.getValues("Labor_DuctTape", {"Usage": "No Sound Mat"}, ["SF/Roll"]);
      return Math.ceil(SF / dict["SF/Roll"]);
}
module.exports.costOfDuctTapeRolls = function(ductTapeRolls) {
      var dict = lb.getValues("Prices_DuctTape", {"Default": "Default"}, ["Total"]);
      return Math.ceil(ductTapeRolls * dict.Total);
}
