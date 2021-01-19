var calculatePerGypFloorTotals = function(estimate) {
      //1. SETTING THE DICTIONARY
      var totalsPerGypFloor = {}
      
      //2. SETTING THE GYP ASSEMBLIES DICTIONARY
      var gypAssemblies = estimate.structures.structure1.gypAssemblies
      
      
      For Each gypAssem In gypAssemblies
            For Each Floor In gypAssemblies[gypAssem].floors
                  //1. IF THE FLOOR ISN//T IN THE TOTALS_BY_GYP_FLOOR DICT
                  if (totalsPerGypFloor.Exists[Floor] === false) {
                        totalsPerGypFloor[Floor] = {}
                  }
                  
                  //2. ADD THE COST OF GYP BAGS AT THIS ASSEMBLY AT THIS FLOOR
                  totalsPerGypFloor[Floor].costOfGypBags = totalsPerGypFloor[Floor].costOfGypBags + gypAssemblies[gypAssem].floors[Floor].costOfGypBags
                  
                  //3. ADD THE COST OF TONS  AT THIS ASSEMBLY AT THIS FLOOR
                  totalsPerGypFloor[Floor].costOfTons = totalsPerGypFloor[Floor].costOfTons + gypAssemblies[gypAssem].floors[Floor].costOfTons
            }
      }
      
      calculatePerGypFloorTotals = totalsPerGypFloor
      
}

