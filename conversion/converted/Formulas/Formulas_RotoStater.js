module.exports.rotoStaterCost = function(SF, gypBags) {
      var dict = getValuesBasedOnNum("Coverage_RotoStater", SF, ["Cost Per Bag"]);
      return Math.ceil(gypBags * dict["Cost Per Bag"]);
}
