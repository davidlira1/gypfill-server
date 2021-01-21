var calculateOptionals = function(projData, estimateVersion) {
      var calculateOptionals = {}
      var optionalDict;
      var gypAssem;
      var concAssem;
      var optAssem;
      var comparison;
      var margin;
      var opt = 1;
      var estimate = projData.estimates("estimate" + estimateVersion);
      
      //GYPCRETE
      if (estimate.structures.structure1.gypAssemblies.count > 0) {
            //1. ESTABLISH MARGin
            margin = estimate.totals.gypMargin;
            
            //STRinG LinE
            if (estimate.gyp.slgs === "Yes - Option") {
                  calculateOptionals["option" + opt] = {
                        option: "Survey floor and install SLGS(String-Line Grid System) to control and enhance the floor leveling application",
                        cost: costAfterMargin(estimate.totals.costOfStringLineinstallation, margin)
                  };
                  opt++;
            }
            
            //FLAGMEN
            if (estimate.gyp.flagmen === "Yes - Option") {
                  calculateOptionals["option" + opt] = {
                        option: "Provide flagman to control street traffic",
                        cost: costAfterMargin(estimate.gyp.labor.costOfGypFlagmenLabor, margin)
                  }
                  opt++;
            }
      
            //PERIMETER FOAM
            if (estimate.gyp.perFoamCutting === "Yes - Option") {
                  calculateOptionals["option" + opt] = {
                        option: "Return to cut and remove excess perimeter foam",
                        cost: costAfterMargin(estimate.totals.gypCostPerFoamCutting, margin)
                  }
                  opt++;
            }

            //ADDITIONAL MOBILIZATION
            calculateOptionals["option" + opt] = {
                  option: "Additional day for production pour",
                  cost: estimate.gyp.labor.addMobils.mobilCost //this is just for one day
            }
            opt++;
            
            //PREPOURS
            if (estimate.structures.structure1.prePours.contractOrOption === "Optional") {
                  var mobilizationsPrePours = estimate.gyp.labor.mobilizationsPrePours;
                  var numOfPrePours = estimate.structures.structure1.prePours.tubs;
                  if (mobilizationsPrePours !== 0) {
                        optionalStr = "Pre Pour " + numOfPrePours + " tubs/dead spaces. To be done in " + mobilizationsPrePours;
                        optionalStr+= mobilizationsPrePours === 1 ? " mobilization" : " mobilizations";
                  }
                  calculateOptionals["option" + opt] = {
                        option: optionalStr,
                        cost: costAfterMargin(estimate.totals.prePoursCostMaterialAndLabor + estimate.totals.prePoursCostTravel + estimate.totals.prePoursCostAfterMilesThreshold, margin);
                  }
                  opt++;
            }

            //ADU REGULATION
            if (projData.projectinfo.projectType === "Building" && estimate.totals.ADURegCostMaterialAndLabor !== 0 && estimate.structures.structure1.aduRegulation.contractOrOption === "Optional") {
                  calculateOptionals["option" + opt] = {
                        option: "install string lines at all kitchen cabinet areas to achieve ADU height regulation",
                        cost: costAfterMargin(estimate.totals.ADURegCostMaterialAndLabor, margin)
                  }
                  opt++;
            }
            
            //GYP SATURDAY OPTION
            if (estimate.totals.gypCostSaturdayOption !== 0) {
                  calculateOptionals["option" + opt] = {
                        option: "Pour gypcrete on Saturday",
                        cost: costAfterMargin(estimate.totals.gypCostSaturdayOption, margin)
                  }
                  opt++;
            }
            
            //MOIST STOP
            if (estimate.gyp.moistStop === "Yes - Option") {
                  calculateOptionals["option" + opt] = {
                        option: "install moist stop at all floor to wall transitions receiving Gypsum Concrete",
                        cost: costAfterMargin(estimate.totals.costOfMoistStop, margin)
                  }
                  opt++;
            }
            
            //SEALER
            if (estimate.gyp.sealer === "Yes - Option") {
                  calculateOptionals["option" + opt] = {
                        option: "Apply " + estimate.totals.gypSF.toLocaleString('en') + " SF of Hacker sealer at all newly poured areas",
                        cost: costAfterMargin(estimate.totals.costOfSealerGallons, margin)
                  }
                  opt++;
            }
            
            //RAMBOARD
            if (estimate.gyp.ramboard === "Yes - Option") {
                  calculateOptionals["option" + opt] = {
                        option: "install " + estimate.totals.gypSF.toLocaleString('en') + " SF of ramboard at all newly poured areas",
                        cost: costAfterMargin(estimate.totals.costOfRamBoard, margin)
                  }
                  opt++;
            }
            
            //5. LOOP THRU GYP ASSEMBLIES
            for (var gypAssemKey in estimate.structures.structure1.gypAssemblies) {
                  //1. SET VARIABLE
                  gypAssem = estimate.structures.structure1.gypAssemblies[gypAssemKey];
                  
                  //2. LOOP THRU OPTIONS
                  for (var optAssemKey in gypAssem.options) {
                        optAssem = gypAssem.options[optAssemKey];
                        
                        //1. PASS THE OBJECTS TO THE FUNCTION AND GET STRinG
                        optionalDict = compareRegToOptGyp(gypAssem, optAssem, margin);
                        if (optionalDict.option !== "option is not different") {
                              calculateOptionals["option" + opt] = optionalDict;
                              opt++;
                        }
                  }
                  
            }
      }
     
      //CONCRETE
      //5. LOOP THRU CONC ASSEMBLIES
      
      //5. CONC SATURDAY OPTION
      if (estimate.totals.concCostSaturdayOption !== 0) {
            calculateOptionals["option" + opt] = {
                  option: "Pour concrete on Saturday",
                  cost: costAfterMargin(estimate.totals.concCostSaturdayOption, margin)
            }
            opt++;
      }

      for (var concAssemKey in estimate.structures.structure1.concAssemblies) {
            //1. SET VARIABLE
            concAssem = estimate.structures.structure1.concAssemblies[concAssemKey];
            
            //2. IF CONC ASSEMBLY IS AN OPTION
            if (concAssem.contractOrOption === "Optional") {
                  optionalStr = exteriorScopeStr(concAssem);
                  calculateOptionals["option" + opt] = {
                        option: optionalStr,
                        cost: concAssem.costTotal
                  }
                  opt++;
            }
                  
            //1. LOOP THRU OPTIONS
            for (var optAssemKey in concAssem.options) {
                  optAssem = concAssem.options[optAssemKey];
                        
                  //1. PASS THE OBJECTS TO THE FUNCTION AND GET STRinG
                  optionalDict = compareRegToOptConc(concAssem, optAssem, concAssem.margin);
                  if (optionalDict.option !== "option is not different") {
                        calculateOptionals["option" + opt] = optionalDict;
                        opt++;
                  }
            }
                                    
      }
      return calculateOptionals;
}
var compareRegToOptGyp = function(regAssem, optAssem, margin) {
      var compareRegToOptGyp = {};
      var totalCost = (optAssem.difference / (100 - margin)) * 100;
      var optionalStr;
      var addOrDeduct;
      var arrSM1;
      var arrSM2;
      var sm1;
      var sm2;
      
      //IF gypTypes ARE DIFFERENT
      if (regAssem.gypType !== optAssem.gypType) {
            
            //COMPARE gypThick
            if (regAssem.gypThick !== optAssem.gypThick) {
                  //WHEN gypType AND gypThick ARE DIFFERENT
                  if (optAssem.difference > 0) {
                        addOrDeduct = "ADD";
                        optionalStr = "Upgrade from " + doubleToFraction(regAssem.gypThick) + " Gypsum Concrete (Firm-Fill " + regAssem.gypType + ") to " + doubleToFraction(optAssem.gypThick) + " Gypsum Concrete (Firm-Fill " + optAssem.gypType + ")";
                  } else {
                        addOrDeduct = "DEDUCT";
                        optionalStr = "Downgrade from " + doubleToFraction(regAssem.gypThick) + " Gypsum Concrete (Firm-Fill " + regAssem.gypType + ") to " + doubleToFraction(optAssem.gypThick) + " Gypsum Concrete (Firm-Fill " + optAssem.gypType + ")";
                  }
            } else {
                  //WHEN ONLY gypType IS DIFFERENT
                  if (optAssem.difference > 0) {
                        addOrDeduct = "ADD"
                        optionalStr = "Upgrade from Firm-Fill" + "\xAE" + " " + regAssem.gypType + " / " + regAssem.PSI + " PSI" + " to " + " Firm-Fill" + "\xAE" + " " + optAssem.gypType + " / " + optAssem.PSI + " PSI"
                  } else {
                        addOrDeduct = "DEDUCT"
                        optionalStr = "Downgrade from Firm-Fill" + "\xAE" + " " + regAssem.gypType + " / " + regAssem.PSI + " PSI" + " to " + " Firm-Fill" + "\xAE" + " " + optAssem.gypType + " / " + optAssem.PSI + " PSI"
                  }
            }
      
      //IF GYP THICKNESSES ARE DIFFERENT
      } else if (regAssem.gypThick !== optAssem.gypThick) {
            
            //AND SOUND MAT TYPES ARE ALSO DIFFERENT
            if (regAssem.soundMatType !== optAssem.soundMatType) {
                  if (regAssem.soundMatType !== "") {
                        arrSM1 = Split(regAssem.soundMatType)
                        sm1 = arrSM1[0] + " Mat" + "(" + arrSM1[1] + "-" + arrSM1[2] + "\xAE" + ")"
                  }
                  
                  if (optAssem.soundMatType !== "") {
                        arrSM2 = Split(optAssem.soundMatType)
                        sm2 = arrSM2[0] + " Mat" + "(" + arrSM2[1] + "-" + arrSM2[2] + "\xAE" + ")"
                  }

                  if (optAssem.difference > 0) {
                        addOrDeduct = "ADD"
                        if (regAssem.soundMatType === "") {
                              optionalStr = "Upgrade from " + doubleToFraction(regAssem.gypThick) + " Gypsum Concrete to " + doubleToFraction(optAssem.gypThick) + " Gypsum Concrete over " + sm2;
                        } else {
                              optionalStr = "Upgrade from " + doubleToFraction(regAssem.gypThick) + " Gypsum Concrete over " + sm1 + " to " + doubleToFraction(optAssem.gypThick) + " Gypsum Concrete over " + sm2;
                        }
                        
                  } else {
                        addOrDeduct = "DEDUCT"
                        if (optAssem.soundMatType === "") {
                              optionalStr = "Downgrade from " + doubleToFraction(regAssem.gypThick) + " Gypsum Concrete over " + sm1 + " to " + doubleToFraction(optAssem.gypThick) + " Gypsum Concrete";
                        } else {
                              optionalStr = "Downgrade from " + doubleToFraction(regAssem.gypThick) + " Gypsum Concrete over " + sm1 + " to " + doubleToFraction(optAssem.gypThick) + " Gypsum Concrete over " + sm2;
                        }
                  }
                  
            //IF ONLY GYP THICKNESS IS DIFFERENT
            } else {
                  if (optAssem.difference > 0) {
                        addOrDeduct = "ADD";
                        optionalStr = "Upgrade from " + doubleToFraction(regAssem.gypThick) + " Gypsum Concrete to " + doubleToFraction(optAssem.gypThick) + " Gypsum Concrete";
                  } else {
                        addOrDeduct = "DEDUCT";
                        optionalStr = "Downgrade from " + doubleToFraction(regAssem.gypThick) + " Gypsum Concrete to " + doubleToFraction(optAssem.gypThick) + " Gypsum Concrete";
                  }
            }
      
      //IF SOUNDMAT TYPES DIFFERENT
      } else if (regAssem.soundMatType !== optAssem.soundMatType) {
            arrSM1 = regAssem.soundMatType.split(" ");
            arrSM2 = optAssem.soundMatType.split(" ");
            sm1 = arrSM1[0] + " Mat " + "(" + arrSM1[1] + "-" + arrSM1[2] + "\xAE" + ")";
            sm2 = arrSM2[0] + " Mat " + "(" + arrSM2[1] + "-" + arrSM2[2] + "\xAE" + ")";
            
            if (optAssem.difference > 0) {
                  addOrDeduct = "ADD";
                  if (regAssem.soundMatType === "") {
                        optionalStr = "Upgrade from no sound mat to " + sm2;
                  } else {
                        optionalStr = "Upgrade from " + sm1 + " to " + sm2;
                  }
            } else {
                  addOrDeduct = "DEDUCT";
                  if (optAssem.soundMatType === "") {
                        optionalStr = "Downgrade from " + sm1 + " to no sound mat";
                  } else {
                        optionalStr = "Downgrade from " + sm1 + " to " + sm2;
                  }
            }
            
      //IF WIRE TYPES ARE DIFFERENT
      } else if (regAssem.wireType !== optAssem.wireType) {
             if (optAssem.difference > 0) {
                  addOrDeduct = "ADD";
                  if (regAssem.wireType === "") {
                        if (regAssem.SF !== optAssem.SF) {
                              optionalStr = "install " + optAssem.SF + " SF of " + optAssem.wireType;
                        } else {
                              optionalStr = "install " + optAssem.wireType;
                        }
                  } else {
                        optionalStr = "Upgrade from " + regAssem.wireType + " to " + optAssem.wireType;
                  }
            } else {
                  addOrDeduct = "DEDUCT"
                  if (optAssem.wireType === "") {
                        optionalStr = "Remove " + regAssem.wireType;
                  } else {
                        optionalStr = "Downgrade from " + regAssem.wireType + " to " + optAssem.wireType;
                  }
            }
                
      //IF BLACK PAPER TYPES ARE DIFFERENT
      } else if (regAssem.blackPaperType !== optAssem.blackPaperType) {
             if (optAssem.difference > 0) {
                  addOrDeduct = "ADD";
                  optionalStr = "install " + optAssem.blackPaperType;
            } else {
                  addOrDeduct = "DEDUCT";
                  optionalStr = "Remove " + regAssem.blackPaperType;
            }
      
      } else {
            compareRegToOptGyp.option = "option is not different"
            return compareRegToOptGyp;
      }
      
      optionalStr = optionalStr + " at " + regAssem.section.toLowerCase();
      compareRegToOptGyp.option = optionalStr;
      compareRegToOptGyp.cost = totalCost;
      return compareRegToOptGyp;
}
var compareRegToOptConc = function(regAssem, optAssem, margin) {
      compareRegToOptConc = {};
      var totalCost = optAssem.difference; //i think this is different from gyp because each has its own margin. so the difference already includes the difference in margin
      var optionalStr;
      var addOrDeduct;
      var arrSM1;
      var arrSM2;
      var sm1;
      var sm2;
      
      //IF concThicks ARE DIFFERENT
      if (regAssem.concThick !== optAssem.concThick) {
            if (optAssem.difference > 0) {
                  addOrDeduct = "ADD";
                  optionalStr = "Upgrade from " + doubleToFraction(regAssem.concThick) + " " + regAssem.concType + " to " + doubleToFraction(optAssem.concThick) + " " + optAssem.concType;
            } else {
                  addOrDeduct = "DEDUCT";
                  optionalStr = "Downgrade from " + doubleToFraction(regAssem.concThick) + " " + regAssem.concType + " to " + doubleToFraction(optAssem.concThick) + " " + optAssem.concType;
            }
            
      //IF concTypes ARE DIFFERENT
      } else if (regAssem.concType !== optAssem.concType) {
             if (optAssem.difference > 0) {
                  addOrDeduct = "ADD";
                  optionalStr = "Upgrade from " + regAssem.concType + " to " + optAssem.concType;
            } else {
                  addOrDeduct = "DEDUCT";
                  optionalStr = "Downgrade from " + regAssem.concType + " to " + optAssem.concType;
            }
            
      //IF psi//s ARE DIFFERENT
      } else if (regAssem.psi !== optAssem.psi) {
            if (optAssem.difference > 0) {
                  addOrDeduct = "ADD";
                  optionalStr = "Upgrade " + regAssem.concType + " from " + regAssem.psi + " to " + optAssem.psi;
            } else {
                  addOrDeduct = "DEDUCT";
                  optionalStr = "Downgrade " + regAssem.concType + " from " + regAssem.psi + " to " + optAssem.psi;
            }
            
      //IF blackPaperTypes ARE DIFFERENT
      } else if (regAssem.blackPaperType !== optAssem.blackPaperType) {
            if (optAssem.difference > 0) {
                  addOrDeduct = "ADD";
                  optionalStr = "install " + optAssem.blackPaperType;
            } else {
                  addOrDeduct = "DEDUCT";
                  optionalStr = "Remove " + regAssem.blackPaperType;
            }
            
      //IF wireTypes ARE DIFFERENT
      } else if (regAssem.wireType !== optAssem.wireType) {
            if (optAssem.difference > 0) {
                  addOrDeduct = "ADD";
                  if (regAssem.wireType === "") {
                        optionalStr = "install " + optAssem.wireType;
                  } else {
                        optionalStr = "Upgrade from " + regAssem.wireType + " to " + optAssem.wireType;
                  }
            } else {
                  addOrDeduct = "DEDUCT";
                  if (optAssem.wireType === "") {
                        optionalStr = "Remove " + regAssem.wireType;
                  } else {
                        optionalStr = "Downgrade from " + regAssem.wireType + " to " + optAssem.wireType;
                  }
            }
            
      //IF soundMatTypes ARE DIFFERENT
      } else if (regAssem.soundMatType !== optAssem.soundMatType) {
            arrSM1 = regAssem.soundMatType.split(" ");
            arrSM2 = optAssem.soundMatType.split(" ");
            sm1 = arrSM1[0] + " Mat " + "(" + arrSM1[1] + "-" + arrSM1[2] + "\xAE" + ")";
            sm2 = arrSM2[0] + " Mat " + "(" + arrSM2[1] + "-" + arrSM2[2] + "\xAE" + ")";
            
            if (optAssem.difference > 0) {
                  addOrDeduct = "ADD";
                  if (regAssem.soundMatType === "") {
                        optionalStr = "install " + sm2;
                  } else {
                        optionalStr = "Upgrade from " + sm1 + " to " + sm2;
                  }
            } else {
                  addOrDeduct = "DEDUCT";
                  if (optAssem.soundMatType === "") {
                        optionalStr = "Downgrade from " + sm1 + " to no sound mat";
                  } else {
                        optionalStr = "Downgrade from " + sm1 + " to " + sm2;
                  }
            }
      
      //IF ADD MOBILIZATIONS ARE DIFFERENT
      } else if (regAssem.addMobils !== optAssem.addMobils) {
            if (optAssem.difference > 0) {
                  addOrDeduct = "ADD";
                  if (optAssem.addMobils === 1) {
                        optionalStr = "Add " + optAssem.addMobils + " mobilization";
                  } else {
                        optionalStr = "Add " + optAssem.addMobils + " mobilizations";
                  }
            } else {
                  optionalStr = "Reduce " + optAssem.addMobils + " mobilizations";
            }
      } else {
            compareRegToOptConc.option = "option is not different"
            return compareRegToOptConc;
      }
      
      optionalStr = optionalStr + " at " + regAssem.section.toLowerCase();
      compareRegToOptConc.option = optionalStr;
      
      compareRegToOptConc.cost = totalCost;
      return compareRegToOptConc;
}
var exteriorScopeStr = function(concAssem) {
      //THIS FN IS CALLED BY EITHER,
      //1. THE diplay_proposalExteriorScope subroutine
      //2. THE diplay_proposalOptionalScope subroutine
      var concType;
      if (concAssem.concType.includes("Hydrolite")) {
            concType = "Lightweight";
      } else if (concAssem.concType.includes("Pea Gravel")) {
            concType = "Pea Gravel";
      } else if (concAssem.concType.includes("Hardrock")) {
            concType = "Hardrock";
      }
      
      exteriorScopeStr = "Pour " + _
                                   concAssem.SF.toLocaleString('en') + " SqF of " + _
                                   doubleToFraction(concAssem.concThick) + " " + _
                                   concType + " concrete" + _
                                   " (" + concAssem.psi + " PSI)" + _
                                   " over ";
            
      if (concAssem.soundMatType !== "") {
            var arr = concAssem.soundMatType.split(' ');
            exteriorScopeStr = exteriorScopeStr + arr[0] + " Sound Mat " + "(" + arr[1] + "-" + arr[2] + "\xAE" + ")" + " over "
      }
            
      if (concAssem.wireType !== "") {
            exteriorScopeStr = exteriorScopeStr + concAssem.wireType + " over "
      }
            
      if (concAssem.blackPaperType !== "") {
            exteriorScopeStr = exteriorScopeStr + "black paper"
      }
      
      var mobilizationStr;
      if (concAssem.labor.concMobilizations + concAssem.addMobils === 1) {
            mobilizationStr = concAssem.labor.concMobilizations + concAssem.addMobils + " mobilization"
      } else {
            mobilizationStr = concAssem.labor.concMobilizations + concAssem.addMobils + " mobilizations"
      }
      
      exteriorScopeStr = exteriorScopeStr + " at " + LCase(concAssem.section) + " - " + mobilizationStr
      
      return exteriorScopeStr;
}

