const lb = require('../library.js');

module.exports.stringLineRolls = function(SF) {
      var dict = lb.getValues("Prices_StringLine", {"Type": "String Line"}, ["LF/Roll"]);
      return Math.ceil(lb.lFt[SF] / dict["LF/Roll"]);
}
module.exports.costOfStringLineRolls = function(stringLineRolls) {
      var dict = lb.getValues("Prices_StringLine", {"Type": "String Line"}, ["Price/Roll"]);
      return Math.ceil(stringLineRolls * dict["Price/Roll"]);
}