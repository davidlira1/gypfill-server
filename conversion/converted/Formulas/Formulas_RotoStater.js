const lb = require('../library.js');

module.exports.rotoStaterCost = function(SF, gypBags) {
      var dict = lb.getValuesBasedOnNum("Coverage_RotoStater", SF, ["Cost Per Bag"]);
      return Math.ceil(gypBags * dict["Cost Per Bag"]);
}
