var calculateOptionals = function(projData, estimateVersion) {
      calculateOptionals = {}
      var optionalDict
      var gypAssem
      var concAssem
      var optAssem
      var comparison
      var margin
      var opt = 1
      var estimate: estimate = projData.estimates("estimate" & estimateVersion)
      
      //GYPCRETE
      if (estimate.structures.structure1.gypAssemblies.count > 0) {
            //1. ESTABLISH MARGIN
            margin = estimate.totals.gypMargin
            
            //STRING LINE
            if (estimate.gyp.slgs === "Yes - Option") {
                  optionalStr = "Survey floor && install SLGS(String-Line Grid System) to control && enhance the floor leveling application"
                  optionalDict = {}
                  optionalDict.option = optionalStr
                  optionalDict.cost = costAfterMargin(estimate.totals.costOfStringLineInstallation, margin)
                  calculateOptionals.Add ("option" & opt), optionalDict
                  opt = opt + 1
            }

            //ADDITIONAL MOBILIZATION
            optionalStr = "Additional day for production pour"
            optionalDict = {}
            optionalDict.option = optionalStr
            optionalDict.cost = estimate.gyp.labor.addMobils.mobilCost //this is just for one day
            calculateOptionals.Add ("option" & opt), optionalDict
            opt = opt + 1

             //PERIMETER FOAM
             if (estimate.gyp.perFoamCutting === "Yes - Option") {
                  optionalStr = "Return to cut && remove excess perimeter foam"
                  optionalDict = {}
                  optionalDict.option = optionalStr
                  optionalDict.cost = costAfterMargin(estimate.totals.gypCostPerFoamCutting, margin)
                  calculateOptionals.Add ("option" & opt), optionalDict
                  opt = opt + 1
            }
            
            //FLAGMEN
            if (estimate.gyp.flagmen === "Yes - Option") {
                  optionalStr = "Provide flagman to control street traffic"
                  optionalDict = {}
                  optionalDict.option = optionalStr
                  optionalDict.cost = costAfterMargin(estimate.gyp.labor.costOfGypFlagmenLabor, margin)
                  calculateOptionals.Add ("option" & opt), optionalDict
                  opt = opt + 1
            }
      
            //ADU REGULATION
            if (projData.projectInfo.projectType === "Building" && estimate.totals.ADURegCostMaterialAndLabor !== 0) {
                  optionalStr = "Install string lines at all kitchen cabinet areas to achieve ADU height regulation"
                  optionalDict = {}
                  optionalDict.option = optionalStr
                  optionalDict.cost = costAfterMargin(estimate.totals.ADURegCostMaterialAndLabor, margin)
                  calculateOptionals.Add ("option" & opt), optionalDict
                  opt = opt + 1
            }
            
            //GYP SATURDAY OPTION
            if (estimate.totals.gypCostSaturdayOption !== 0) {
                  optionalStr = "Pour gypcrete on Saturday"
                  optionalDict = {}
                  optionalDict.option = optionalStr
                  optionalDict.cost = costAfterMargin(estimate.totals.gypCostSaturdayOption, margin)
                  calculateOptionals.Add ("option" & opt), optionalDict
                  opt = opt + 1
            }
            
            //MOIST STOP
            if (estimate.gyp.moistStop === "Yes - Option") {
                  optionalStr = "Install moist stop at all floor to wall transitions receiving Gypsum Concrete"
                  optionalDict = {}
                  optionalDict.option = optionalStr
                  optionalDict.cost = costAfterMargin(estimate.totals.costOfMoistStop, margin)
                  calculateOptionals.Add ("option" & opt), optionalDict
                  opt = opt + 1
            }
            
            //SEALER
            if (estimate.gyp.sealer === "Yes - Option") {
                  optionalStr = "Apply " & Format((estimate.totals.gypSF), "#,###") & " SF of Hacker sealer at all newly poured areas"
                  optionalDict = {}
                  optionalDict.option = optionalStr
                  optionalDict.cost = costAfterMargin(estimate.totals.costOfSealerGallons, margin)
                  calculateOptionals.Add ("option" & opt), optionalDict
                  opt = opt + 1
            }
            
            //RAMBOARD
            if (estimate.gyp.ramboard === "Yes - Option") {
                  optionalStr = "Install " & Format((estimate.totals.gypSF), "#,###") & " SF of ramboard at all newly poured areas"
                  optionalDict = {}
                  optionalDict.option = optionalStr
                  optionalDict.cost = costAfterMargin(estimate.totals.costOfRamBoard, margin)
                  calculateOptionals.Add ("option" & opt), optionalDict
                  opt = opt + 1
            }
            
            //5. LOOP THRU GYP ASSEMBLIES
            For Each gypAssemKey In estimate.structures.structure1.gypAssemblies
                  //1. SET VARIABLE
                  gypAssem = estimate.structures.structure1.gypAssemblies(gypAssemKey)
                  
                  //2. LOOP THRU OPTIONS
                  For Each optAssemKey In gypAssem.options
                        optAssem = gypAssem.options(optAssemKey)
                        
                        //1. PASS THE OBJECTS TO THE var && = function GET STRING {
                        optionalDict = compareRegToOptGyp(gypAssem, optAssem, margin)
                        if (optionalDict.option !== "option is not different") {
                              calculateOptionals.Add ("option" & opt), optionalDict
                              opt = opt + 1
                        }
                  }
            }
      }
     
      //CONCRETE
      //5. LOOP THRU CONC ASSEMBLIES
      
      //5. CONC SATURDAY OPTION
      if (estimate.totals.concCostSaturdayOption !== 0) {
            optionalStr = "Pour concrete on Saturday"
            optionalDict = {}
            optionalDict.option = optionalStr
            optionalDict.cost = costAfterMargin((estimate.totals.concCostSaturdayOption), margin)
            calculateOptionals.Add ("option" & opt), optionalDict
            opt = opt + 1
      }

      For Each concAssemKey In estimate.structures.structure1.concAssemblies
            //1. SET VARIABLE
            concAssem = estimate.structures.structure1.concAssemblies(concAssemKey)
            
            //2. IF CONC ASSEMBLY IS AN OPTION
            if (concAssem.contractOrOption === "Optional") {
                  optionalStr = exteriorScopeStr(concAssem)
                  optionalDict = {}
                  optionalDict.option = optionalStr
                  optionalDict.cost = concAssem.costTotal
                  calculateOptionals.Add ("option" & opt), optionalDict
                  opt = opt + 1
            }
                  
            //1. LOOP THRU OPTIONS
            For Each optAssemKey In concAssem.options
                  optAssem = concAssem.options(optAssemKey)
                        
                  //1. PASS THE OBJECTS TO THE var && = function GET STRING {
                  optionalDict = compareRegToOptConc(concAssem, optAssem, concAssem.margin)
                  if (optionalDict.option !== "option is not different") {
                        calculateOptionals.Add ("option" & opt), optionalDict
                        opt = opt + 1
                  }
            }
                                    
      }
      
}
var compareRegToOptGyp = function(regAssem, optAssem, margin) {
      compareRegToOptGyp = {}
      var totalCost = (optAssem.difference / (100 - (margin))) * 100
      var optionalStr
      var addOrDeduct
      var arrSM1()
      var arrSM2()
      var sm1
      var sm2
      
      //IF gypTypes ARE DIFFERENT
      if (regAssem.gypType !== optAssem.gypType) {
            
            //COMPARE gypThick
            if (regAssem.gypThick !== optAssem.gypThick) {
                  //WHEN gypType && gypThick ARE DIFFERENT
                  if (optAssem.difference > 0) {
                        addOrDeduct = "ADD"
                        optionalStr = "Upgrade from " & doubleToFraction(regAssem.gypThick) & " Gypsum Concrete (Firm-Fill " & regAssem.gypType & ") to " & doubleToFraction(optAssem.gypThick) & " Gypsum Concrete (Firm-Fill " & optAssem.gypType & ")"
                  } else {
                        addOrDeduct = "DEDUCT"
                        optionalStr = "Downgrade from " & doubleToFraction(regAssem.gypThick) & " Gypsum Concrete (Firm-Fill " & regAssem.gypType & ") to " & doubleToFraction(optAssem.gypThick) & " Gypsum Concrete (Firm-Fill " & optAssem.gypType & ")"
                  }
            } else {
                  //WHEN ONLY gypType IS DIFFERENT
                  if (optAssem.difference > 0) {
                        addOrDeduct = "ADD"
                        optionalStr = "Upgrade from Firm-Fill" & Chr(174) & " " & regAssem.gypType & " / " & regAssem.PSI & " PSI" & " to " & " Firm-Fill" & Chr(174) & " " & optAssem.gypType & " / " & optAssem.PSI & " PSI"
                  } else {
                        addOrDeduct = "DEDUCT"
                        optionalStr = "Downgrade from Firm-Fill" & Chr(174) & " " & regAssem.gypType & " / " & regAssem.PSI & " PSI" & " to " & " Firm-Fill" & Chr(174) & " " & optAssem.gypType & " / " & optAssem.PSI & " PSI"
                  }
                  
            }
      
      //IF GYP THICKNESSES ARE DIFFERENT
      } else {if (regAssem.gypThick !== optAssem.gypThick) {
            
            //AND SOUND MAT TYPES ARE ALSO DIFFERENT
            if (regAssem.soundMatType !== optAssem.soundMatType) {
                  if (regAssem.soundMatType !== "") {
                        arrSM1 = Split(regAssem.soundMatType)
                        sm1 = arrSM1(0) & " Mat" & "(" & arrSM1(1) & "-" & arrSM1(2) & Chr(174) & ")"
                  }
                  
                  if (optAssem.soundMatType !== "") {
                        arrSM2 = Split(optAssem.soundMatType)
                        sm2 = arrSM2(0) & " Mat" & "(" & arrSM2(1) & "-" & arrSM2(2) & Chr(174) & ")"
                  }

                  if (optAssem.difference > 0) {
                        addOrDeduct = "ADD"
                        if (regAssem.soundMatType === "") {
                              optionalStr = "Upgrade from " & doubleToFraction(regAssem.gypThick) & " Gypsum Concrete to " & doubleToFraction(optAssem.gypThick) & " Gypsum Concrete over " & sm2
                        } else {
                              optionalStr = "Upgrade from " & doubleToFraction(regAssem.gypThick) & " Gypsum Concrete over " & sm1 & " to " & doubleToFraction(optAssem.gypThick) & " Gypsum Concrete over " & sm2
                        }
                        
                  } else {
                        addOrDeduct = "DEDUCT"
                        if (optAssem.soundMatType === "") {
                              optionalStr = "Downgrade from " & doubleToFraction(regAssem.gypThick) & " Gypsum Concrete over " & sm1 & " to " & doubleToFraction(optAssem.gypThick) & " Gypsum Concrete"
                        } else {
                              optionalStr = "Downgrade from " & doubleToFraction(regAssem.gypThick) & " Gypsum Concrete over " & sm1 & " to " & doubleToFraction(optAssem.gypThick) & " Gypsum Concrete over " & sm2
                        }
                  }
                  
            //IF ONLY GYP THICKNESS IS DIFFERENT
            } else {
                  if (optAssem.difference > 0) {
                        addOrDeduct = "ADD"
                        optionalStr = "Upgrade from " & doubleToFraction(regAssem.gypThick) & " Gypsum Concrete to " & doubleToFraction(optAssem.gypThick) & " Gypsum Concrete"
                  } else {
                        addOrDeduct = "DEDUCT"
                        optionalStr = "Downgrade from " & doubleToFraction(regAssem.gypThick) & " Gypsum Concrete to " & doubleToFraction(optAssem.gypThick) & " Gypsum Concrete"
                  }
            }
      
      //IF SOUNDMAT TYPES DIFFERENT
      } else {if (regAssem.soundMatType !== optAssem.soundMatType) {
            arrSM1 = Split(regAssem.soundMatType)
            arrSM2 = Split(optAssem.soundMatType)
            sm1 = arrSM1(0) & " Mat " & "(" & arrSM1(1) & "-" & arrSM1(2) & Chr(174) & ")"
            sm2 = arrSM2(0) & " Mat " & "(" & arrSM2(1) & "-" & arrSM2(2) & Chr(174) & ")"
            
            if (optAssem.difference > 0) {
                  addOrDeduct = "ADD"
                  if (regAssem.soundMatType === "") {
                        optionalStr = "Upgrade from no sound mat to " & sm2
                  } else {
                        optionalStr = "Upgrade from " & sm1 & " to " & sm2
                  }
            } else {
                  addOrDeduct = "DEDUCT"
                  if (optAssem.soundMatType === "") {
                        optionalStr = "Downgrade from " & sm1 & " to no sound mat"
                  } else {
                        optionalStr = "Downgrade from " & sm1 & " to " & sm2
                  }
            }
            
      //IF WIRE TYPES ARE DIFFERENT
      } else {if (regAssem.wireType !== optAssem.wireType) {
             if (optAssem.difference > 0) {
                  addOrDeduct = "ADD"
                  if (regAssem.wireType === "") {
                        if ((regAssem.SF !== optAssem.SF)) {
                              optionalStr = "Install " & optAssem.SF & " SF of " & optAssem.wireType
                        } else {
                              optionalStr = "Install " & optAssem.wireType
                        }
                  } else {
                        optionalStr = "Upgrade from " & regAssem.wireType & " to " & optAssem.wireType
                  }
            } else {
                  addOrDeduct = "DEDUCT"
                  if (optAssem.wireType === "") {
                        optionalStr = "Remove " & regAssem.wireType
                  } else {
                        optionalStr = "Downgrade from " & regAssem.wireType & " to " & optAssem.wireType
                  }
            }
                
      //IF BLACK PAPER TYPES ARE DIFFERENT
      } else {if (regAssem.blackPaperType !== optAssem.blackPaperType) {
             if (optAssem.difference > 0) {
                  addOrDeduct = "ADD"
                  optionalStr = "Install " & optAssem.blackPaperType
            } else {
                  addOrDeduct = "DEDUCT"
                  optionalStr = "Remove " & regAssem.blackPaperType
            }
      
      } else {
            compareRegToOptGyp.option = "option is not different"
            Exit Function
      }
      
      optionalStr = optionalStr & " at " & LCase(regAssem.section)
      compareRegToOptGyp.option = optionalStr
      compareRegToOptGyp.cost = totalCost
      
}
var compareRegToOptConc = function(regAssem, optAssem, margin) {
      compareRegToOptConc = {}
      var totalCost = optAssem.difference //i think this is different from gyp because each has its own margin. so the difference already includes the difference in margin
      var optionalStr
      var addOrDeduct
      var arrSM1()
      var arrSM2()
      var sm1
      var sm2
      
      //IF concThicks ARE DIFFERENT
      if (regAssem.concThick !== optAssem.concThick) {
            if (optAssem.difference > 0) {
                  addOrDeduct = "ADD"
                  optionalStr = "Upgrade from " & doubleToFraction(regAssem.concThick) & " " & regAssem.concType & " to " & doubleToFraction(optAssem.concThick) & " " & optAssem.concType
            } else {
                  addOrDeduct = "DEDUCT"
                  optionalStr = "Downgrade from " & doubleToFraction(regAssem.concThick) & " " & regAssem.concType & " to " & doubleToFraction(optAssem.concThick) & " " & optAssem.concType
            }
            
      //IF concTypes ARE DIFFERENT
      } else {if (regAssem.concType !== optAssem.concType) {
             if (optAssem.difference > 0) {
                  addOrDeduct = "ADD"
                  optionalStr = "Upgrade from " & regAssem.concType & " to " & optAssem.concType
            } else {
                  addOrDeduct = "DEDUCT"
                  optionalStr = "Downgrade from " & regAssem.concType & " to " & optAssem.concType
            }
            
      //IF psi//s ARE DIFFERENT
      } else {if (regAssem.psi !== optAssem.psi) {
            if (optAssem.difference > 0) {
                  addOrDeduct = "ADD"
                  optionalStr = "Upgrade " & regAssem.concType & " from " & regAssem.psi & " to " & optAssem.psi
            } else {
                  addOrDeduct = "DEDUCT"
                  optionalStr = "Downgrade " & regAssem.concType & " from " & regAssem.psi & " to " & optAssem.psi
            }
            
      //IF blackPaperTypes ARE DIFFERENT
      } else {if (regAssem.blackPaperType !== optAssem.blackPaperType) {
            if (optAssem.difference > 0) {
                  addOrDeduct = "ADD"
                  optionalStr = "Install " & optAssem.blackPaperType
            } else {
                  addOrDeduct = "DEDUCT"
                  optionalStr = "Remove " & regAssem.blackPaperType
            }
            
      //IF wireTypes ARE DIFFERENT
      } else {if (regAssem.wireType !== optAssem.wireType) {
            if (optAssem.difference > 0) {
                  addOrDeduct = "ADD"
                  if (regAssem.wireType === "") {
                        optionalStr = "Install " & optAssem.wireType
                  } else {
                        optionalStr = "Upgrade from " & regAssem.wireType & " to " & optAssem.wireType
                  }
            } else {
                  addOrDeduct = "DEDUCT"
                  if (optAssem.wireType === "") {
                        optionalStr = "Remove " & regAssem.wireType
                  } else {
                        optionalStr = "Downgrade from " & regAssem.wireType & " to " & optAssem.wireType
                  }
            }
            
      //IF soundMatTypes ARE DIFFERENT
      } else {if (regAssem.soundMatType !== optAssem.soundMatType) {
            arrSM1 = Split(regAssem.soundMatType)
            arrSM2 = Split(optAssem.soundMatType)
            sm1 = arrSM1(0) & " Mat " & "(" & arrSM1(1) & "-" & arrSM1(2) & Chr(174) & ")"
            sm2 = arrSM2(0) & " Mat " & "(" & arrSM2(1) & "-" & arrSM2(2) & Chr(174) & ")"
            
            if (optAssem.difference > 0) {
                  addOrDeduct = "ADD"
                  if (regAssem.soundMatType === "") {
                        optionalStr = "Install " & sm2
                  } else {
                        optionalStr = "Upgrade from " & sm1 & " to " & sm2
                  }
            } else {
                  addOrDeduct = "DEDUCT"
                  if (optAssem.soundMatType === "") {
                        optionalStr = "Downgrade from " & sm1 & " to no sound mat"
                  } else {
                        optionalStr = "Downgrade from " & sm1 & " to " & sm2
                  }
            }
      
      //IF ADD MOBILIZATIONS ARE DIFFERENT
      } else {if (regAssem.addMobils !== optAssem.addMobils) {
            if (optAssem.difference > 0) {
                  addOrDeduct = "ADD"
                  if (optAssem.addMobils === 1) {
                        optionalStr = "Add " & optAssem.addMobils & " mobilization"
                  } else {
                        optionalStr = "Add " & optAssem.addMobils & " mobilizations"
                  }
            } else {
                  optionalStr = "Reduce " & optAssem.addMobils & " mobilizations"
            }
      } else {
            compareRegToOptConc.option = "option is not different"
            Exit Function
      }
      
      optionalStr = optionalStr & " at " & LCase(regAssem.section)
      compareRegToOptConc.option = optionalStr
      
      compareRegToOptConc.cost = totalCost

      
}
var exteriorScopeStr = function(concAssem) {
      //THIS FN IS CALLED BY EITHER:
      //1. THE diplay_proposalExteriorScope subroutine
      //2. THE diplay_proposalOptionalScope subroutine
      
      var concType
      
      if (contains(concAssem.concType, "Hydrolite") === True) {
            concType = "Lightweight"
      } else {if (contains(concAssem.concType, "Pea Gravel") === True) {
            concType = "Pea Gravel"
      } else {if (contains(concAssem.concType, "Hardrock") === True) {
            concType = "Hardrock"
      }
      
      exteriorScopeStr = "Pour " & _
                                   Format((concAssem.SF), "#,###") & " SqF of " & _
                                   doubleToFraction((concAssem.concThick)) & " " & _
                                   concType & _
                                   " (" & concAssem.psi & " PSI)" & _
                                   " concrete over "
            
      if (concAssem.soundMatType !== "") {
            var arr(): arr = Split((concAssem.soundMatType))
            exteriorScopeStr = exteriorScopeStr & arr(0) & " Sound Mat " & "(" & arr(1) & "-" & arr(2) & Chr(174) & ")" & " over "
      }
            
      if (concAssem.wireType !== "") {
            exteriorScopeStr = exteriorScopeStr & concAssem.wireType & " over "
      }
            
      if (concAssem.blackPaperType !== "") {
            exteriorScopeStr = exteriorScopeStr & "black paper"
      }
      
      var mobilizationStr
      if (concAssem.labor.concMobilizations === 1) {
            mobilizationStr = concAssem.labor.concMobilizations & " mobilization"
      } else {
            mobilizationStr = concAssem.labor.concMobilizations & " mobilizations"
      }
      
      exteriorScopeStr = exteriorScopeStr & " at " & LCase(concAssem.section) & " - " & mobilizationStr

}

