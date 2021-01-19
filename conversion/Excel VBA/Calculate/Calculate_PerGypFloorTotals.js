Function calculatePerGypFloorTotals(estimate As Dictionary) As Dictionary
      '1. SETTING THE DICTIONARY
      Dim totalsPerGypFloor As Dictionary: Set totalsPerGypFloor = New Dictionary
      
      '2. SETTING THE GYP ASSEMBLIES DICTIONARY
      Dim gypAssemblies As Dictionary: Set gypAssemblies = estimate("structures")("structure1")("gypAssemblies")
      
      
      For Each gypAssem In gypAssemblies
            For Each Floor In gypAssemblies(gypAssem)("floors")
                  '1. IF THE FLOOR ISN'T IN THE TOTALS_BY_GYP_FLOOR DICT
                  If totalsPerGypFloor.Exists(Floor) = False Then
                        totalsPerGypFloor.Add Floor, New Dictionary
                  End If
                  
                  '2. ADD THE COST OF GYP BAGS AT THIS ASSEMBLY AT THIS FLOOR
                  totalsPerGypFloor(Floor)("costOfGypBags") = totalsPerGypFloor(Floor)("costOfGypBags") + gypAssemblies(gypAssem)("floors")(Floor)("costOfGypBags")
                  
                  '3. ADD THE COST OF TONS  AT THIS ASSEMBLY AT THIS FLOOR
                  totalsPerGypFloor(Floor)("costOfTons") = totalsPerGypFloor(Floor)("costOfTons") + gypAssemblies(gypAssem)("floors")(Floor)("costOfTons")
            Next Floor
      Next gypAssem
      
      Set calculatePerGypFloorTotals = totalsPerGypFloor
      
End Function

