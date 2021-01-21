var calculateSOV = function(projData, estimateVersion) {
      var sov = {};
      var estimate = projData.estimates("estimate" + estimateVersion);
      var structureType = projData.projectinfo.projectType;
      var gypFloors = {};
      //==========================================================================================
      //1. CHECK IF GYP EXISTS
      var costTotalGypScope = estimate.totals.gypCostTotal;
      var gypExists = true;
      if (costTotalGypScope === 0) {
            gypExists = false;
      }
      //2. CHECK IF CONC EXISTS
      var costTotalConcScope = estimate.totals.concCostTotal;
      var concExists = true;
      if (costTotalConcScope === 0) {
            concExists = false;
      }
      var costTotalGrand = estimate.totals.grandCostTotal;
      //==========================================================================================
      if (gypExists === false && concExists === false) {
            return;
      }
      //==========================================================================================
      //PERCENTS OF GYPCRETE AND CONCRETE
      if (gypExists) {
            var percentGypScopeOfGrandTotal = Number(((costTotalGypScope / costTotalGrand) * 100).toFixed(2));
      }
      if (concExists) {
            var percentConcScopeOfGrandTotal = 100 - percentGypScopeOfGrandTotal;
      }
      var sovNum = 1;
      //==========================================================================================
      //2. EITHER HOUSE OR ANYTHinG ELSE
      if (structureType === "House") {
            //HOUSE
            
            if (gypExists === true) {
                  //1.UPON SIGNinG
                  var percentUponSigning = Number((((0.5 * costTotalGypScope) / costTotalGrand) * 100).toFixed(2));
                  sov["sov" + sovNum] = {
                      description: "Upon Start Of Work",
                      payment: 0,
                      percent: 0,
                      type: "gyp"
                  }
                  sovNum++;
                  
                  //2.inTERIOR SCOPE
                  var percentinteriorScope = percentGypScopeOfGrandTotal - percentUponSigning;
                  var costOfinteriorScope = costTotalGrand * (percentinteriorScope / 100);
                  sov["sov" + sovNum] = {
                      description: "Upon Completion Of interior Scope",
                      payment: costOfinteriorScope,
                      percent: percentinteriorScope,
                      type: "gyp"
                  }
                  sovNum++;
            }
            
            if (concExists === true) {
                  //3.EXTERIOR SCOPE
                  var costOfExteriorScope = costTotalGrand * (percentConcScopeOfGrandTotal / 100)
                  sov["sov" + sovNum] = {
                        description: "Upon Completion Of Exterior Scope",
                        payment: costOfExteriorScope,
                        percent: percentConcScopeOfGrandTotal,
                        type: "conc"
                  }
                  sovNum++;
            }
      } else if (structureType === "Building" || structureType === "Unit") {
            //==========================================================================================
            //BUILDinG OR MULTI-BUILDinG OR UNIT
            //==========================================================================================
            if (gypExists) {
                  //1.IF THERE ARE PRE POUR TUBS
                  if (estimate.structures.structure1.prePours.tubs !== 0) {
                        var percentPrePours = Number((((0.1 * costTotalGypScope) / costTotalGrand) * 100).toFixed(2));
                        sov["sov" + sovNum] = {
                              description: "Upon Completion Of Pre Pour Tubs",
                              payment: 0,
                              percent: 0,
                              type: "gyp-prepours"
                        }
                        sovNum++;
                  }
                  //==========================================================================================
                  //2.GET ALL THE FLOORS FOR GYP     *(what if there are no gypAssemblies?)
                  for(var gypAssembly in estimate.structures.structure1.gypAssemblies) {
                        for(var Floor in estimate.structures.structure1.gypAssemblies[gypAssembly].floors) {
                              //ADD UNIQUE FLOOR TO DICTIONARY
                              if (gypFloors.Exists[Floor] === false) {
                                    gypFloors[Floor] = Floor;
                              }
                        }
                  }
                  
                  //3. NUMBER OF FLOORS
                  var numOfFloors;
                  if (gypFloors.floorR) {
                        numOfFloors = gypFloors.count - 1;
                  } else {
                        numOfFloors = gypFloors.count;
                  }
                  
                  //4. PAYMENT for (var FLOOR
                  var percentForEachGypFloor = (percentGypScopeOfGrandTotal - percentPrePours) / numOfFloors;
                  var paymentForEachGypFloor = costTotalGrand * (percentForEachGypFloor / 100);
                  
                  //5. inPUT THE FLOORS FOR GYP
                  var floorNum;
                  for(var Floor in gypFloors) {
                        if (Floor !== "floorR") {
                              sov["sov" + sovNum] = {}
                              if (Floor === "floorB") {
                                    sov("sov" + sovNum).description = "Upon Completion Of Basement Floor";
                                    sov("sov" + sovNum).floor = "B";
                              } else {
                                    floorNum = Right(Floor, 1)
                                    sov("sov" + sovNum).description = "Upon Completion Of " + numberToOrdinal(floorNum) + " Floor interior";
                                    sov("sov" + sovNum).floor = floorNum;
                              }
                              sov("sov" + sovNum).payment = paymentForEachGypFloor;
                              sov("sov" + sovNum).percent = percentForEachGypFloor;
                              sov("sov" + sovNum).type = "gyp";
                              sovNum++;
                        }
                  }
            }
            //==========================================================================================
            //6. TOTAL COST OF CONCRETE MATERIAL AND LABOR
            if (concExists) {
                  var costOfConcAssem;
                  var percentConcAssemOfGrandTotal;
                  
                  //7. LOOP THRU THE CONCRETE ASSEMBLIES
                  for(var concAssembly in estimate.structures.structure1.concAssemblies) {
                  
                        costOfConcAssem = estimate.structures.structure1.concAssemblies[concAssembly].costTotal;
                        
                        if (estimate.structures.structure1.concAssemblies[concAssembly].contractOrOption === "Contract") {
                              percentConcAssemOfGrandTotal = Number(((costOfConcAssem / costTotalGrand) * 100).toFixed(2));
                              sov["sov" + sovNum] = {
                                    description: "Upon Completion of " + estimate.structures.structure1.concAssemblies[concAssembly].section,
                                    payment: costOfConcAssem,
                                    percent: percentConcAssemOfGrandTotal,
                                    type: "conc"
                              }
                              sovNum++;
                        }
                  }
            }
            //==========================================================================================
            

      } else {
            calculateSOV = calculateSOVMulti(estimate, costTotalGrand, costTotalGypScope, percentGypScopeOfGrandTotal, costTotalConcScope, percentConcScopeOfGrandTotal, gypExists, concExists);
            return;
      }
            
      //8. ADJUSTMENT
      //GET THE SUM OF ALL BUT THE FIRST ROW
      var sum;
      for(var i = 2; i <= sov.count; i++) {
            sum = sum + sov["sov" + i].payment;
      }
            
      sov.sov1.payment = costTotalGrand - sum;
      sov.sov1.percent = Number((((sov.sov1.payment) / costTotalGrand) * 100).toFixed(2));
      
      //9.
      return sov;
}
var calculateSOVMulti = function(estimate, costTotalGrand, costTotalGypScope, percentGypScopeOfGrandTotal, costTotalConcScope, percentConcScopeOfGrandTotal, gypExists, concExists) {
      var dict = {}
      var costGypAssemsTotal;
      var costPrePoursTotal;
      var gypFloors;
      var perc;
      var prePoursPercentOneStruct;
      var gypPercentOneStruct;
      var percentForEachGypFloor;
      var paymentForEachGypFloor;
      var costOfConcAssem;
      var percentConcAssemOfGrandTotal;
      var runningTotal;
      var sov;
      var sovNum;

      for (var structure in estimate.structures) {
            for (var gypAssem in estimate.structures[structure].gypAssemblies) {
                  costGypAssemsTotal = costGypAssemsTotal + estimate.structures[structure].gypAssemblies[gypAssem].gypAssemCost;
            }
            costPrePoursTotal = costPrePoursTotal + estimate.structures[structure].prePours.costOfPrePours;
      }
      
      for (var structure in estimate.structures) {
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
                        dict[structure]["sov" + sovNum] = {
                              description: "Upon Completion Of Pre Pour Tubs",
                              payment: Math.round((prePoursPercentOneStruct / 100) * costTotalGrand),
                              percent: prePoursPercentOneStruct,
                              type: "gyp-prepours"
                        }
                        runningTotal = runningTotal + dict[structure]["sov" + sovNum].payment;
                        sovNum++;
                  }
            
                  //2.GET ALL THE FLOORS FOR GYP
                  gypAssemsStructureTotal = 0
                  for (var gypAssembly in estimate.structures[structure].gypAssemblies) {
                        gypAssemsStructureTotal = gypAssemsStructureTotal + estimate.structures[structure].gypAssemblies[gypAssembly].gypAssemCost
                        for (var Floor in estimate.structures[structure].gypAssemblies[gypAssembly].floors) {
                              //ADD UNIQUE FLOOR TO DICTIONARY
                              if (gypFloors.Exists[Floor] === false) {
                                    gypFloors[Floor] = Floor;
                              }
                        }
                  }
                  
                  //3. NUMBER OF FLOORS
                  var numOfFloors
                  if (gypFloors.floorR) {
                        numOfFloors = gypFloors.count - 1;
                  } else {
                        numOfFloors = gypFloors.count;
                  }
                  
                  //4. PAYMENT for (var FLOOR
                  perc = gypAssemsStructureTotal / costGypAssemsTotal;
                  gypPercentOneStruct = perc * percentGypScopeOfGrandTotal;
                  percentForEachGypFloor = (gypPercentOneStruct - prePoursPercentOneStruct) / numOfFloors;
                  paymentForEachGypFloor = Math.round(costTotalGrand * (percentForEachGypFloor / 100));
                  
                  //5. inPUT THE FLOORS FOR GYP
                  var floorNum;
                  for (var Floor in gypFloors) {
                        if (Floor !== "floorR") {
                              dict[structure]["sov" + sovNum] = {}
                              if (Floor === "floorB") {
                                    dict[structure]["sov" + sovNum].description = "Upon Completion Of Basement Floor";
                                    dict[structure]["sov" + sovNum].floor = "B";
                              } else {
                                    floorNum = Right(Floor, 1)
                                    dict[structure]["sov" + sovNum].description = "Upon Completion Of " + numberToOrdinal[floorNum] + " Floor interior";
                                    dict[structure]["sov" + sovNum].floor = floorNum;
                              }
                              dict[structure]["sov" + sovNum].payment = paymentForEachGypFloor;
                              dict[structure]["sov" + sovNum].percent = percentForEachGypFloor;
                              dict[structure]["sov" + sovNum].type = "gyp";
                              runningTotal = runningTotal + dict[structure]("sov" + sovNum).payment;
                              sovNum++;
                        }
                  }
            
            }
            
            if (concExists) {
                  //7. LOOP THRU THE CONCRETE ASSEMBLIES
                  for (var concAssembly in estimate.structures[structure].concAssemblies) {
                  
                        costOfConcAssem = estimate.structures[structure].concAssemblies[concAssembly].costTotal
                        
                        if (estimate.structures[structure].concAssemblies[concAssembly].contractOrOption === "Contract") {
                              percentConcAssemOfGrandTotal = Number(((costOfConcAssem / costTotalGrand) * 100).toFixed(2));
                              dict[structure]["sov" + sovNum] = {
                                    description: "Upon Completion Of " + estimate.structures[structure].concAssemblies[concAssembly].section,
                                    payment: costOfConcAssem,
                                    percent: percentConcAssemOfGrandTotal,
                                    type: "conc"
                              }
                              runningTotal = runningTotal + dict[structure]["sov" + sovNum].payment;
                              sovNum++;
                        }
                  }
            }
            
      }
      
      //8. ADJUSTMENT
      //GET THE SUM OF ALL BUT THE FIRST ROW
      runningTotal = runningTotal - dict.structure1.sov1.payment;
            
      dict.structure1.sov1.payment = costTotalGrand - runningTotal;
      dict.structure1.sov1.percent = Number((((dict.structure1.sov1.payment) / costTotalGrand) * 100).toFixed(2));
      
      return dict;
}
