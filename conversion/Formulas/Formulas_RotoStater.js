Function rotoStaterCost(SF As Long, gypBags As Long)
      Dim dict As Dictionary: Set dict = getValuesBasedOnNum("Coverage_RotoStater", SF, Array("Cost Per Bag"))
      
      rotoStaterCost = Round((gypBags * dict("Cost Per Bag")) + 0.49)
End Function
