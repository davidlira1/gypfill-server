Function calculateSOV(projData As Dictionary, estimateVersion As Byte) As Dictionary
      Dim sov As Dictionary: Set sov = New Dictionary
      Dim estimate As Dictionary: Set estimate = projData("estimates")("estimate" & estimateVersion)
      Dim structureType As String: structureType = projData("projectInfo")("projectType")
      If structureType = "Unit" Then
            structureType = "Building"
      End If
      Dim gypFloors As Dictionary: Set gypFloors = New Dictionary
      '==========================================================================================
      '1. CHECK IF GYP EXISTS
      Dim costTotalGypScope As Long: costTotalGypScope = estimate("totals")("gypCostTotal")
      Dim gypExists As Boolean: gypExists = True
      If costTotalGypScope = 0 Then
            gypExists = False
      End If
      '2. CHECK IF CONC EXISTS
      Dim costTotalConcScope As Long: costTotalConcScope = estimate("totals")("concCostTotal")
      Dim concExists As Boolean: concExists = True
      If costTotalConcScope = 0 Then
            concExists = False
      End If
      Dim costTotalGrand As Long: costTotalGrand = estimate("totals")("grandCostTotal")
      '==========================================================================================
      If gypExists = False And concExists = False Then
            Exit Function
      End If
      '==========================================================================================
      'PERCENTS OF GYPCRETE AND CONCRETE
      If gypExists Then
            Dim percentGypScopeOfGrandTotal As Double: percentGypScopeOfGrandTotal = Round((costTotalGypScope / costTotalGrand) * 100, 2)
      End If
      
      If concExists Then
            Dim percentConcScopeOfGrandTotal As Double: percentConcScopeOfGrandTotal = 100 - percentGypScopeOfGrandTotal
      End If
      
      Dim sovNum As Byte: sovNum = 1
      
      '==========================================================================================
      '2. EITHER HOUSE OR ANYTHING ELSE
      If structureType = "House" Then
            'HOUSE
            
            If gypExists = True Then
                  '1.UPON SIGNING
                  Dim percentUponSigning As Double: percentUponSigning = Round(((0.5 * costTotalGypScope) / costTotalGrand) * 100, 2)
                  sov.Add "sov" & sovNum, New Dictionary
                  sov("sov" & sovNum).Add "description", "Upon Start Of Work"
                  sov("sov" & sovNum).Add "payment", 0
                  sov("sov" & sovNum).Add "percent", 0
                  sov("sov" & sovNum).Add "type", "gyp"
                  sovNum = sovNum + 1
                  
                  '2.INTERIOR SCOPE
                  Dim percentInteriorScope As Double: percentInteriorScope = percentGypScopeOfGrandTotal - percentUponSigning
                  Dim costOfInteriorScope As Long: costOfInteriorScope = costTotalGrand * (percentInteriorScope / 100)
                  sov.Add "sov" & sovNum, New Dictionary
                  sov("sov" & sovNum).Add "description", "Upon Completion Of Interior Scope"
                  sov("sov" & sovNum).Add "payment", costOfInteriorScope
                  sov("sov" & sovNum).Add "percent", percentInteriorScope
                  sov("sov" & sovNum).Add "type", "gyp"
                  sovNum = sovNum + 1
            End If
            
            If concExists = True Then
                  '3.EXTERIOR SCOPE
                  Dim costOfExteriorScope As Long: costOfExteriorScope = costTotalGrand * (percentConcScopeOfGrandTotal / 100)
                  sov.Add "sov" & sovNum, New Dictionary
                  sov("sov" & sovNum).Add "description", "Upon Completion Of Exterior Scope"
                  sov("sov" & sovNum).Add "payment", costOfExteriorScope
                  sov("sov" & sovNum).Add "percent", percentConcScopeOfGrandTotal
                  sov("sov" & sovNum).Add "type", "conc"
                  sovNum = sovNum + 1
            End If
      ElseIf structureType = "Building" Or structureType = "Unit" Then
            '==========================================================================================
            'BUILDING OR MULTI-BUILDING OR UNIT
            '==========================================================================================
            If gypExists Then
                  '1.IF THERE ARE PRE POUR TUBS
                  If estimate("structures")("structure1")("prePours")("tubs") <> 0 Then
                        Dim percentPrePours As Double: percentPrePours = Round(((0.1 * costTotalGypScope) / costTotalGrand) * 100, 2)
                        sov.Add "sov" & sovNum, New Dictionary
                        sov("sov" & sovNum).Add "description", "Upon Completion Of Pre Pour Tubs"
                        sov("sov" & sovNum).Add "payment", 0
                        sov("sov" & sovNum).Add "percent", 0
                        sov("sov" & sovNum).Add "type", "gyp-prepours"
                        sovNum = sovNum + 1
                  End If
                  '==========================================================================================
                  '2.GET ALL THE FLOORS FOR GYP     *(what if there are no gypAssemblies?)
                  For Each gypAssembly In estimate("structures")("structure1")("gypAssemblies")
                        For Each Floor In estimate("structures")("structure1")("gypAssemblies")(gypAssembly)("floors")
                              'ADD UNIQUE FLOOR TO DICTIONARY
                              If gypFloors.Exists(Floor) = False Then
                                    gypFloors.Add Floor, Floor
                              End If
                        Next Floor
                  Next gypAssembly
                  
                  '3. NUMBER OF FLOORS
                  Dim numOfFloors As Byte
                  If gypFloors.Exists("floorR") Then
                        numOfFloors = gypFloors.count - 1
                  Else
                        numOfFloors = gypFloors.count
                  End If
                  
                  '4. PAYMENT FOR EACH FLOOR
                  Dim percentForEachGypFloor As Double: percentForEachGypFloor = (percentGypScopeOfGrandTotal - percentPrePours) / numOfFloors
                  Dim paymentForEachGypFloor As Long: paymentForEachGypFloor = costTotalGrand * (percentForEachGypFloor / 100)
                  
                  '5. INPUT THE FLOORS FOR GYP
                  Dim floorNum As Byte
                  For Each Floor In gypFloors
                        If Floor <> "floorR" Then
                              sov.Add "sov" & sovNum, New Dictionary
                              If Floor = "floorB" Then
                                    sov("sov" & sovNum).Add "description", "Upon Completion Of Basement Floor"
                                    sov("sov" & sovNum).Add "floor", "B"
                              Else
                                    floorNum = Right(Floor, 1)
                                    sov("sov" & sovNum).Add "description", "Upon Completion Of " & numberToOrdinal(floorNum) & " Floor Interior"
                                    sov("sov" & sovNum).Add "floor", floorNum
                              End If
                              sov("sov" & sovNum).Add "payment", paymentForEachGypFloor
                              sov("sov" & sovNum).Add "percent", percentForEachGypFloor
                              sov("sov" & sovNum).Add "type", "gyp"
                              sovNum = sovNum + 1
                        End If
                  Next Floor
            End If
            '==========================================================================================
            '6. TOTAL COST OF CONCRETE MATERIAL AND LABOR
            If concExists Then
                  Dim costOfConcAssem As Long
                  Dim percentConcAssemOfGrandTotal As Double
                  
                  '7. LOOP THRU THE CONCRETE ASSEMBLIES
                  For Each concAssembly In estimate("structures")("structure1")("concAssemblies")
                  
                        costOfConcAssem = estimate("structures")("structure1")("concAssemblies")(concAssembly)("costTotal")
                        
                        If estimate("structures")("structure1")("concAssemblies")(concAssembly)("contractOrOption") = "Contract" Then
                              percentConcAssemOfGrandTotal = Round((costOfConcAssem / costTotalGrand) * 100, 2)
                              sov.Add "sov" & sovNum, New Dictionary
                              sov("sov" & sovNum).Add "description", "Upon Completion of " & estimate("structures")("structure1")("concAssemblies")(concAssembly)("section")
                              sov("sov" & sovNum).Add "payment", costOfConcAssem
                              sov("sov" & sovNum).Add "percent", percentConcAssemOfGrandTotal
                              sov("sov" & sovNum).Add "type", "conc"
                              sovNum = sovNum + 1
                        End If
                  Next concAssembly
            End If
            '==========================================================================================
            

      Else
            Set calculateSOV = calculateSOVMulti(estimate, costTotalGrand, costTotalGypScope, percentGypScopeOfGrandTotal, costTotalConcScope, percentConcScopeOfGrandTotal, gypExists, concExists)
            Debug.Print JSONstringify(calculateSOV)
            Exit Function
      End If
            
      '8. ADJUSTMENT
      'GET THE SUM OF ALL BUT THE FIRST ROW
      Dim sum As Long
      For i = 2 To sov.count
            sum = sum + sov("sov" & i)("payment")
      Next i
            
      sov("sov1")("payment") = costTotalGrand - sum
      sov("sov1")("percent") = Round(((sov("sov1")("payment")) / costTotalGrand) * 100, 2)
      
      Debug.Print JSONstringify(sov)
      
      '9.
      Set calculateSOV = sov
End Function
Function calculateSOVMulti(estimate As Dictionary, costTotalGrand As Long, costTotalGypScope As Long, percentGypScopeOfGrandTotal As Double, costTotalConcScope As Long, percentConcScopeOfGrandTotal As Double, gypExists As Boolean, concExists As Boolean) As Dictionary
      Set calculateSOVMulti = New Dictionary
      Dim dict As Dictionary: Set dict = New Dictionary
      Dim costGypAssemsTotal As Long
      Dim costPrePoursTotal As Long
      Dim gypFloors As Dictionary
      Dim perc As Double
      Dim prePoursPercentOneStruct As Double
      Dim gypPercentOneStruct As Double
      Dim percentForEachGypFloor As Double
      Dim paymentForEachGypFloor As Long
      Dim costOfConcAssem As Long
      Dim percentConcAssemOfGrandTotal As Double
      Dim runningTotal As Double
      Dim sov As String
      Dim sovNum As Byte

      For Each structure In estimate("structures")
            For Each gypAssem In estimate("structures")(structure)("gypAssemblies")
                  costGypAssemsTotal = costGypAssemsTotal + estimate("structures")(structure)("gypAssemblies")(gypAssem)("gypAssemCost")
            Next gypAssem
            costPrePoursTotal = costPrePoursTotal + estimate("structures")(structure)("prePours")("costOfPrePours")
      Next structure
      
      For Each structure In estimate("structures")
            sovNum = 1
            
            'create a dictionary
            dict.Add structure, New Dictionary
            
            'reset gypFloors
            Set gypFloors = New Dictionary
            
            If gypExists Then
                  '1.IF THERE ARE PRE POUR TUBS
                  If estimate("structures")(structure)("prePours")("tubs") <> 0 Then
                        perc = estimate("structures")(structure)("prePours")("costOfPrePours") / costPrePoursTotal
                        prePoursPercentOneStruct = Round(perc * 0.1 * percentGypScopeOfGrandTotal, 2)
                        'Dim percentPrePours As Double: percentPrePours = Round(((0.1 * costTotalGypScope) / costTotalGrand) * 100, 2)
                        dict(structure).Add "sov" & sovNum, New Dictionary
                        dict(structure)("sov" & sovNum).Add "description", "Upon Completion Of Pre Pour Tubs"
                        dict(structure)("sov" & sovNum).Add "payment", Round((prePoursPercentOneStruct / 100) * costTotalGrand)
                        dict(structure)("sov" & sovNum).Add "percent", prePoursPercentOneStruct
                        dict(structure)("sov" & sovNum).Add "type", "gyp-prepours"
                        runningTotal = runningTotal + dict(structure)("sov" & sovNum)("payment")
                        sovNum = sovNum + 1
                  End If
            
                  '2.GET ALL THE FLOORS FOR GYP
                  gypAssemsStructureTotal = 0
                  For Each gypAssembly In estimate("structures")(structure)("gypAssemblies")
                        gypAssemsStructureTotal = gypAssemsStructureTotal + estimate("structures")(structure)("gypAssemblies")(gypAssembly)("gypAssemCost")
                        For Each Floor In estimate("structures")(structure)("gypAssemblies")(gypAssembly)("floors")
                              'ADD UNIQUE FLOOR TO DICTIONARY
                              If gypFloors.Exists(Floor) = False Then
                                    gypFloors.Add Floor, Floor
                              End If
                        Next Floor
                  Next gypAssembly
                  
                  '3. NUMBER OF FLOORS
                  Dim numOfFloors As Byte
                  If gypFloors.Exists("floorR") Then
                        numOfFloors = gypFloors.count - 1
                  Else
                        numOfFloors = gypFloors.count
                  End If
                  
                  '4. PAYMENT FOR EACH FLOOR
                  perc = gypAssemsStructureTotal / costGypAssemsTotal
                  gypPercentOneStruct = perc * percentGypScopeOfGrandTotal
                  percentForEachGypFloor = (gypPercentOneStruct - prePoursPercentOneStruct) / numOfFloors
                  paymentForEachGypFloor = Round(costTotalGrand * (percentForEachGypFloor / 100))
                  
                  '5. INPUT THE FLOORS FOR GYP
                  Dim floorNum As Byte
                  For Each Floor In gypFloors
                        If Floor <> "floorR" Then
                              dict(structure).Add "sov" & sovNum, New Dictionary
                              If Floor = "floorB" Then
                                    dict(structure)("sov" & sovNum).Add "description", "Upon Completion Of Basement Floor"
                                    dict(structure)("sov" & sovNum).Add "floor", "B"
                              Else
                                    floorNum = Right(Floor, 1)
                                    dict(structure)("sov" & sovNum).Add "description", "Upon Completion Of " & numberToOrdinal(floorNum) & " Floor Interior"
                                    dict(structure)("sov" & sovNum).Add "floor", floorNum
                              End If
                              dict(structure)("sov" & sovNum).Add "payment", paymentForEachGypFloor
                              dict(structure)("sov" & sovNum).Add "percent", percentForEachGypFloor
                              dict(structure)("sov" & sovNum).Add "type", "gyp"
                              runningTotal = runningTotal + dict(structure)("sov" & sovNum)("payment")
                              sovNum = sovNum + 1
                        End If
                  Next Floor
            
            End If
            
            If concExists Then

                  '7. LOOP THRU THE CONCRETE ASSEMBLIES
                  For Each concAssembly In estimate("structures")(structure)("concAssemblies")
                  
                        costOfConcAssem = estimate("structures")(structure)("concAssemblies")(concAssembly)("costTotal")
                        
                        If estimate("structures")(structure)("concAssemblies")(concAssembly)("contractOrOption") = "Contract" Then
                              percentConcAssemOfGrandTotal = Round((costOfConcAssem / costTotalGrand) * 100, 2)
                              dict(structure).Add "sov" & sovNum, New Dictionary
                              dict(structure)("sov" & sovNum).Add "description", "Upon Completion Of " & estimate("structures")(structure)("concAssemblies")(concAssembly)("section")
                              dict(structure)("sov" & sovNum).Add "payment", costOfConcAssem
                              dict(structure)("sov" & sovNum).Add "percent", percentConcAssemOfGrandTotal
                              dict(structure)("sov" & sovNum).Add "type", "conc"
                              runningTotal = runningTotal + dict(structure)("sov" & sovNum)("payment")
                              sovNum = sovNum + 1
                        End If
                  Next concAssembly
            End If
            
      Next structure
      
      '8. ADJUSTMENT
      'GET THE SUM OF ALL BUT THE FIRST ROW
      runningTotal = runningTotal - dict("structure1")("sov1")("payment")
            
      dict("structure1")("sov1")("payment") = costTotalGrand - runningTotal
      dict("structure1")("sov1")("percent") = Round(((dict("structure1")("sov1")("payment")) / costTotalGrand) * 100, 2)
      
      
      Set calculateSOVMulti = dict
End Function
