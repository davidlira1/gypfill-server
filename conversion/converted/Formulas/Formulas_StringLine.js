module.exports.stringLineRolls = function(SF) {
      var dict = getValues("Prices_StringLine", {"Type": "String Line"}, ["LF/Roll"]);
      return Math.ceil(lFt[SF] / dict["LF/Roll"]);
}
module.exports.costOfStringLineRolls = function(stringLineRolls) {
      var dict = getValues("Prices_StringLine", {"Type": "String Line"}, ["Price/Roll"]);
      return Math.ceil(stringLineRolls * dict["Price/Roll"]);
}