var rotoStaterCost = function(SF, gypBags) {
      var dict = getValuesBasedOnNum("Coverage_RotoStater", SF, Array("Cost Per Bag"))
      
      rotoStaterCost = Round((gypBags * dict("Cost Per Bag")) + 0.49)
}
