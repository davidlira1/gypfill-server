var calculateSOV = function(projData, estimateVersion) {
      var sov = {}
      var estimate = projData.estimates("estimate" + estimateVersion)
      var structureType = projData.projectInfo.projectType
      if (structureType === "Unit") {
            structureType = "Building"
      }
      var gypFloors = {}
      //==========================================================================================
      //1. CHECK IF GYP EXISTS
      var costTotalGypScope = estimate.totals.gypCostTotal
      var gypExists = true
      if (costTotalGypScope === 0) {
            gypExists = false
      }
      //2. CHECK IF CONC EXISTS
      var costTotalConcScope = estimate.totals.concCostTotal
      var concExists = true
      if (costTotalConcScope === 0) {
            concExists = false
      }
      var costTotalGrand = estimate.totals.grandCostTotal
      //==========================================================================================
      if (gypExists = false && concExists === false) {
            Exit Function
      }
      //==========================================================================================
      //PERCENTS OF GYPCRETE AND CONCRETE
      if (gypExists) {
            var percentGypScopeOfGrandTotal = Round((costTotalGypScope / costTotalGrand) * 100, 2)
      }
      
      if (concExists) {
            var percentConcScopeOfGrandTotal = 100 - percentGypScopeOfGrandTotal
      }
      
      var sovNum = 1
      
      //==========================================================================================
      //2. EITHER HOUSE OR ANYTHING ELSE
      if (structureType === "House") {
            //HOUSE
            
            if (gypExists === true) {
                  //1.UPON SIGNING
                  var percentUponSigning = Round(((0.5 * costTotalGypScope) / costTotalGrand) * 100, 2)
                  sov["sov" + sovNum] = {}
                  sov("sov" + sovNum).description = "Upon Start Of Work"
                  sov("sov" + sovNum).payment = 0
                  sov("sov" + sovNum).percent = 0
                  sov("sov" + sovNum).type = "gyp"
                  sovNum = sovNum + 1
                  
                  //2.INTERIOR SCOPE
                  var percentInteriorScope = percentGypScopeOfGrandTotal - percentUponSigning
                  var costOfInteriorScope = costTotalGrand * (percentInteriorScope / 100)
                  sov["sov" + sovNum] = {}
                  sov("sov" + sovNum).description = "Upon Completion Of Interior Scope"
                  sov("sov" + sovNum).payment = costOfInteriorScope
                  sov("sov" + sovNum).percent = percentInteriorScope
                  sov("sov" + sovNum).type = "gyp"
                  sovNum = sovNum + 1
            }
            
            if (concExists === true) {
                  //3.EXTERIOR SCOPE
                  var costOfExteriorScope = costTotalGrand * (percentConcScopeOfGrandTotal / 100)
                  sov["sov" + sovNum] = {}
                  sov("sov" + sovNum).description = "Upon Completion Of Exterior Scope"
                  sov("sov" + sovNum).payment = costOfExteriorScope
                  sov("sov" + sovNum).percent = percentConcScopeOfGrandTotal
                  sov("sov" + sovNum).type = "conc"
                  sovNum = sovNum + 1
            }
      } else if (structureType = "Building" Or structureType === "Unit") {
            //==========================================================================================
            //BUILDING OR MULTI-BUILDING OR UNIT
            //==========================================================================================
            if (gypExists) {
                  //1.IF THERE ARE PRE POUR TUBS
                  if (estimate.structures.structure1.prePours.tubs !== 0) {
                        var percentPrePours = Round(((0.1 * costTotalGypScope) / costTotalGrand) * 100, 2)
                        sov["sov" + sovNum] = {}
                        sov("sov" + sovNum).description = "Upon Completion Of Pre Pour Tubs"
                        sov("sov" + sovNum).payment = 0
                        sov("sov" + sovNum).percent = 0
                        sov("sov" + sovNum).type = "gyp-prepours"
                        sovNum = sovNum + 1
                  }
                  //==========================================================================================
                  //2.GET ALL THE FLOORS FOR GYP     *(what if there are no gypAssemblies?)
                  For Each gypAssembly In estimate.structures.structure1.gypAssemblies
                        For Each Floor In estimate.structures.structure1.gypAssemblies[gypAssembly].floors
                              //ADD UNIQUE FLOOR TO DICTIONARY
                              if (gypFloors.Exists[Floor] === false) {
                                    gypFloors[Floor] = Floor
                              }
                        }
                  }
                  
                  //3. NUMBER OF FLOORS
                  var numOfFloors
                  if (gypFloors.floorR) {
                        numOfFloors = gypFloors.count - 1
                  } else {
                        numOfFloors = gypFloors.count
                  }
                  
                  //4. PAYMENT FOR EACH FLOOR
                  var percentForEachGypFloor = (percentGypScopeOfGrandTotal - percentPrePours) / numOfFloors
                  var paymentForEachGypFloor = costTotalGrand * (percentForEachGypFloor / 100)
                  
                  //5. INPUT THE FLOORS FOR GYP
                  var floorNum
                  For Each Floor In gypFloors
                        if (Floor !== "floorR") {
                              sov["sov" + sovNum] = {}
                              if (Floor === "floorB") {
                                    sov("sov" + sovNum).description = "Upon Completion Of Basement Floor"
                                    sov("sov" + sovNum).floor = "B"
                              } else {
                                    floorNum = Right(Floor, 1)
                                    sov("sov" + sovNum).description = "Upon Completion Of " + numberToOrdinal[floorNum] + " Floor Interior"
                                    sov("sov" + sovNum).floor = floorNum
                              }
                              sov("sov" + sovNum).payment = paymentForEachGypFloor
                              sov("sov" + sovNum).percent = percentForEachGypFloor
                              sov("sov" + sovNum).type = "gyp"
                              sovNum = sovNum + 1
                        }
                  }
            }
            //==========================================================================================
            //6. TOTAL COST OF CONCRETE MATERIAL AND LABOR
            if (concExists) {
                  var costOfConcAssem
                  var percentConcAssemOfGrandTotal
                  
                  //7. LOOP THRU THE CONCRETE ASSEMBLIES
                  For Each concAssembly In estimate.structures.structure1.concAssemblies
                  
                        costOfConcAssem = estimate.structures.structure1.concAssemblies[concAssembly].costTotal
                        
                        if (estimate.structures.structure1.concAssemblies[concAssembly].contractOrOption === "Contract") {
                              percentConcAssemOfGrandTotal = Round((costOfConcAssem / costTotalGrand) * 100, 2)
                              sov["sov" + sovNum] = {}
                              sov("sov" + sovNum).description = "Upon Completion of " + estimate.structures.structure1.concAssemblies[concAssembly].section
                              sov("sov" + sovNum).payment = costOfConcAssem
                              sov("sov" + sovNum).percent = percentConcAssemOfGrandTotal
                              sov("sov" + sovNum).type = "conc"
                              sovNum = sovNum + 1
                        }
                  }
            }
            //==========================================================================================
            

      } else {
            calculateSOV = calculateSOVMulti(estimate, costTotalGrand, costTotalGypScope, percentGypScopeOfGrandTotal, costTotalConcScope, percentConcScopeOfGrandTotal, gypExists, concExists)
            Debug.Print JSONstringify[calculateSOV]
            Exit Function
      }
            
      //8. ADJUSTMENT
      //GET THE SUM OF ALL BUT THE FIRST ROW
      var sum
      For i = 2 To sov.count
            sum = sum + sov("sov" + i).payment
      }
            
      sov.sov1.payment = costTotalGrand - sum
      sov.sov1.percent = Round(((sov.sov1.payment) / costTotalGrand) * 100, 2)
      
      Debug.Print JSONstringify[sov]
      
      //9.
      calculateSOV = sov
}
var calculateSOVMulti = function(estimate, costTotalGrand, costTotalGypScope, percentGypScopeOfGrandTotal, costTotalConcScope, percentConcScopeOfGrandTotal, gypExists, concExists) {
      calculateSOVMulti = {}
      var dict = {}
      var costGypAssemsTotal
      var costPrePoursTotal
      var gypFloors
      var perc
      var prePoursPercentOneStruct
      var gypPercentOneStruct
      var percentForEachGypFloor
      var paymentForEachGypFloor
      var costOfConcAssem
      var percentConcAssemOfGrandTotal
      var runningTotal
      var sov
      var sovNum

      For Each structure In estimate.structures
            For Each gypAssem In estimate.structures[structure].gypAssemblies
                  costGypAssemsTotal = costGypAssemsTotal + estimate.structures[structure].gypAssemblies[gypAssem].gypAssemCost
            }
            costPrePoursTotal = costPrePoursTotal + estimate.structures[structure].prePours.costOfPrePours
      }
      
      For Each structure In estimate.structures
            sovNum = 1
            
            //create a dictionary
            dict[structure] = {}
            
            //reset gypFloors
            gypFloors = {}
            
            if (gypExists) {
                  //1.IF THERE ARE PRE POUR TUBS
                  if (estimate.structures[structure].prePours.tubs !== 0) {
                        perc = estimate.structures[structure].prePours.costOfPrePours / costPrePoursTotal
                        prePoursPercentOneStruct = Round(perc * 0.1 * percentGypScopeOfGrandTotal, 2)
                        //var percentPrePours = Round(((0.1 * costTotalGypScope) / costTotalGrand) * 100, 2)
                        dict[structure]["sov" + sovNum] = {}
                        dict[structure]("sov" + sovNum).description = "Upon Completion Of Pre Pour Tubs"
                        dict[structure]("sov" + sovNum).payment = Round((prePoursPercentOneStruct / 100) * costTotalGrand)
                        dict[structure]("sov" + sovNum).percent = prePoursPercentOneStruct
                        dict[structure]("sov" + sovNum).type = "gyp-prepours"
                        runningTotal = runningTotal + dict[structure]("sov" + sovNum).payment
                        sovNum = sovNum + 1
                  }
            
                  //2.GET ALL THE FLOORS FOR GYP
                  gypAssemsStructureTotal = 0
                  For Each gypAssembly In estimate.structures[structure].gypAssemblies
                        gypAssemsStructureTotal = gypAssemsStructureTotal + estimate.structures[structure].gypAssemblies[gypAssembly].gypAssemCost
                        For Each Floor In estimate.structures[structure].gypAssemblies[gypAssembly].floors
                              //ADD UNIQUE FLOOR TO DICTIONARY
                              if (gypFloors.Exists[Floor] === false) {
                                    gypFloors[Floor] = Floor
                              }
                        }
                  }
                  
                  //3. NUMBER OF FLOORS
                  var numOfFloors
                  if (gypFloors.floorR) {
                        numOfFloors = gypFloors.count - 1
                  } else {
                        numOfFloors = gypFloors.count
                  }
                  
                  //4. PAYMENT FOR EACH FLOOR
                  perc = gypAssemsStructureTotal / costGypAssemsTotal
                  gypPercentOneStruct = perc * percentGypScopeOfGrandTotal
                  percentForEachGypFloor = (gypPercentOneStruct - prePoursPercentOneStruct) / numOfFloors
                  paymentForEachGypFloor = Round(costTotalGrand * (percentForEachGypFloor / 100))
                  
                  //5. INPUT THE FLOORS FOR GYP
                  var floorNum
                  For Each Floor In gypFloors
                        if (Floor !== "floorR") {
                              dict[structure]["sov" + sovNum] = {}
                              if (Floor === "floorB") {
                                    dict[structure]("sov" + sovNum).description = "Upon Completion Of Basement Floor"
                                    dict[structure]("sov" + sovNum).floor = "B"
                              } else {
                                    floorNum = Right(Floor, 1)
                                    dict[structure]("sov" + sovNum).description = "Upon Completion Of " + numberToOrdinal[floorNum] + " Floor Interior"
                                    dict[structure]("sov" + sovNum).floor = floorNum
                              }
                              dict[structure]("sov" + sovNum).payment = paymentForEachGypFloor
                              dict[structure]("sov" + sovNum).percent = percentForEachGypFloor
                              dict[structure]("sov" + sovNum).type = "gyp"
                              runningTotal = runningTotal + dict[structure]("sov" + sovNum).payment
                              sovNum = sovNum + 1
                        }
                  }
            
            }
            
            if (concExists) {

                  //7. LOOP THRU THE CONCRETE ASSEMBLIES
                  For Each concAssembly In estimate.structures[structure].concAssemblies
                  
                        costOfConcAssem = estimate.structures[structure].concAssemblies[concAssembly].costTotal
                        
                        if (estimate.structures[structure].concAssemblies[concAssembly].contractOrOption === "Contract") {
                              percentConcAssemOfGrandTotal = Round((costOfConcAssem / costTotalGrand) * 100, 2)
                              dict[structure]["sov" + sovNum] = {}
                              dict[structure]("sov" + sovNum).description = "Upon Completion Of " + estimate.structures[structure].concAssemblies[concAssembly].section
                              dict[structure]("sov" + sovNum).payment = costOfConcAssem
                              dict[structure]("sov" + sovNum).percent = percentConcAssemOfGrandTotal
                              dict[structure]("sov" + sovNum).type = "conc"
                              runningTotal = runningTotal + dict[structure]("sov" + sovNum).payment
                              sovNum = sovNum + 1
                        }
                  }
            }
            
      }
      
      //8. ADJUSTMENT
      //GET THE SUM OF ALL BUT THE FIRST ROW
      runningTotal = runningTotal - dict.structure1.sov1.payment
            
      dict.structure1.sov1.payment = costTotalGrand - runningTotal
      dict.structure1.sov1.percent = Round(((dict.structure1.sov1.payment) / costTotalGrand) * 100, 2)
      
      
      calculateSOVMulti = dict
}
