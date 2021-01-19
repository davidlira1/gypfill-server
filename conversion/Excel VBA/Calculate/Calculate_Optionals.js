Function calculateOptionals(projData As Dictionary, estimateVersion As Byte) As Dictionary
      Set calculateOptionals = New Dictionary
      Dim optionalDict As Dictionary
      Dim gypAssem As Dictionary
      Dim concAssem As Dictionary
      Dim optAssem As Dictionary
      Dim comparison As Dictionary
      Dim margin As Double
      Dim opt As Byte: opt = 1
      Dim estimate As Dictionary: Set estimate = projData("estimates")("estimate" & estimateVersion)
      
      'GYPCRETE
      If estimate("structures")("structure1")("gypAssemblies").count > 0 Then
            '1. ESTABLISH MARGIN
            margin = estimate("totals")("gypMargin")
            
            'STRING LINE
            If estimate("gyp")("slgs") = "Yes - Option" Then
                  optionalStr = "Survey floor and install SLGS(String-Line Grid System) to control and enhance the floor leveling application"
                  Set optionalDict = New Dictionary
                  optionalDict.Add "option", optionalStr
                  optionalDict.Add "cost", costAfterMargin((estimate("totals")("costOfStringLineInstallation")), margin)
                  calculateOptionals.Add ("option" & opt), optionalDict
                  opt = opt + 1
            End If
            
            'FLAGMEN
            If estimate("gyp")("flagmen") = "Yes - Option" Then
                  optionalStr = "Provide flagman to control street traffic"
                  Set optionalDict = New Dictionary
                  optionalDict.Add "option", optionalStr
                  optionalDict.Add "cost", costAfterMargin((estimate("gyp")("labor")("costOfGypFlagmenLabor")), margin)
                  calculateOptionals.Add ("option" & opt), optionalDict
                  opt = opt + 1
            End If
      
            'PERIMETER FOAM
            If estimate("gyp")("perFoamCutting") = "Yes - Option" Then
                  optionalStr = "Return to cut and remove excess perimeter foam"
                  Set optionalDict = New Dictionary
                  optionalDict.Add "option", optionalStr
                  optionalDict.Add "cost", costAfterMargin((estimate("totals")("gypCostPerFoamCutting")), margin)
                  calculateOptionals.Add ("option" & opt), optionalDict
                  opt = opt + 1
            End If

            'ADDITIONAL MOBILIZATION
            optionalStr = "Additional day for production pour"
            Set optionalDict = New Dictionary
            optionalDict.Add "option", optionalStr
            optionalDict.Add "cost", estimate("gyp")("labor")("addMobils")("mobilCost") 'this is just for one day
            calculateOptionals.Add ("option" & opt), optionalDict
            opt = opt + 1
            
            'PREPOURS
            If estimate("structures")("structure1")("prePours")("contractOrOption") = "Optional" Then
                  Dim mobilizationsPrePours As Byte:  mobilizationsPrePours = estimate("gyp")("labor")("mobilizationsPrePours")
                  Dim numOfPrePours As Integer: numOfPrePours = estimate("structures")("structure1")("prePours")("tubs")
                  If mobilizationsPrePours <> 0 Then
                        optionalStr = "Pre Pour " & numOfPrePours & " tubs/dead spaces. To be done in " & mobilizationsPrePours
                        If mobilizationsPrePours = 1 Then
                              optionalStr = optionalStr + " mobilization"
                        Else
                              optionalStr = optionalStr + " mobilizations"
                        End If
                  End If
                  Set optionalDict = New Dictionary
                  optionalDict.Add "option", optionalStr
                  optionalDict.Add "cost", costAfterMargin((estimate("totals")("prePoursCostMaterialAndLabor")) + (estimate("totals")("prePoursCostTravel")) + (estimate("totals")("prePoursCostAfterMilesThreshold")), margin)
                  calculateOptionals.Add ("option" & opt), optionalDict
                  opt = opt + 1
            End If

            'ADU REGULATION
            If projData("projectInfo")("projectType") = "Building" And estimate("totals")("ADURegCostMaterialAndLabor") <> 0 And estimate("structures")("structure1")("aduRegulation")("contractOrOption") = "Optional" Then
                  optionalStr = "Install string lines at all kitchen cabinet areas to achieve ADU height regulation"
                  Set optionalDict = New Dictionary
                  optionalDict.Add "option", optionalStr
                  optionalDict.Add "cost", costAfterMargin((estimate("totals")("ADURegCostMaterialAndLabor")), margin)
                  calculateOptionals.Add ("option" & opt), optionalDict
                  opt = opt + 1
            End If
            
            'GYP SATURDAY OPTION
            If estimate("totals")("gypCostSaturdayOption") <> 0 Then
                  optionalStr = "Pour gypcrete on Saturday"
                  Set optionalDict = New Dictionary
                  optionalDict.Add "option", optionalStr
                  optionalDict.Add "cost", costAfterMargin((estimate("totals")("gypCostSaturdayOption")), margin)
                  calculateOptionals.Add ("option" & opt), optionalDict
                  opt = opt + 1
            End If
            
            'MOIST STOP
            If estimate("gyp")("moistStop") = "Yes - Option" Then
                  optionalStr = "Install moist stop at all floor to wall transitions receiving Gypsum Concrete"
                  Set optionalDict = New Dictionary
                  optionalDict.Add "option", optionalStr
                  optionalDict.Add "cost", costAfterMargin((estimate("totals")("costOfMoistStop")), margin)
                  calculateOptionals.Add ("option" & opt), optionalDict
                  opt = opt + 1
            End If
            
            'SEALER
            If estimate("gyp")("sealer") = "Yes - Option" Then
                  optionalStr = "Apply " & Format((estimate("totals")("gypSF")), "#,###") & " SF of Hacker sealer at all newly poured areas"
                  Set optionalDict = New Dictionary
                  optionalDict.Add "option", optionalStr
                  optionalDict.Add "cost", costAfterMargin((estimate("totals")("costOfSealerGallons")), margin)
                  calculateOptionals.Add ("option" & opt), optionalDict
                  opt = opt + 1
            End If
            
            'RAMBOARD
            If estimate("gyp")("ramboard") = "Yes - Option" Then
                  optionalStr = "Install " & Format((estimate("totals")("gypSF")), "#,###") & " SF of ramboard at all newly poured areas"
                  Set optionalDict = New Dictionary
                  optionalDict.Add "option", optionalStr
                  optionalDict.Add "cost", costAfterMargin((estimate("totals")("costOfRamBoard")), margin)
                  calculateOptionals.Add ("option" & opt), optionalDict
                  opt = opt + 1
            End If
            
            '5. LOOP THRU GYP ASSEMBLIES
            For Each gypAssemKey In estimate("structures")("structure1")("gypAssemblies")
                  '1. SET VARIABLE
                  Set gypAssem = estimate("structures")("structure1")("gypAssemblies")(gypAssemKey)
                  
                  '2. LOOP THRU OPTIONS
                  For Each optAssemKey In gypAssem("options")
                        Set optAssem = gypAssem("options")(optAssemKey)
                        
                        '1. PASS THE OBJECTS TO THE FUNCTION AND GET STRING
                        Set optionalDict = compareRegToOptGyp(gypAssem, optAssem, margin)
                        If optionalDict("option") <> "option is not different" Then
                              calculateOptionals.Add ("option" & opt), optionalDict
                              opt = opt + 1
                        End If
                  Next optAssemKey
                  
            Next gypAssemKey
      End If
     
      'CONCRETE
      '5. LOOP THRU CONC ASSEMBLIES
      
      '5. CONC SATURDAY OPTION
      If estimate("totals")("concCostSaturdayOption") <> 0 Then
            optionalStr = "Pour concrete on Saturday"
            Set optionalDict = New Dictionary
            optionalDict.Add "option", optionalStr
            optionalDict.Add "cost", costAfterMargin((estimate("totals")("concCostSaturdayOption")), margin)
            calculateOptionals.Add ("option" & opt), optionalDict
            opt = opt + 1
      End If

      For Each concAssemKey In estimate("structures")("structure1")("concAssemblies")
            '1. SET VARIABLE
            Set concAssem = estimate("structures")("structure1")("concAssemblies")(concAssemKey)
            
            '2. IF CONC ASSEMBLY IS AN OPTION
            If concAssem("contractOrOption") = "Optional" Then
                  optionalStr = exteriorScopeStr(concAssem)
                  Set optionalDict = New Dictionary
                  optionalDict.Add "option", optionalStr
                  optionalDict.Add "cost", concAssem("costTotal")
                  calculateOptionals.Add ("option" & opt), optionalDict
                  opt = opt + 1
            End If
                  
            '1. LOOP THRU OPTIONS
            For Each optAssemKey In concAssem("options")
                  Set optAssem = concAssem("options")(optAssemKey)
                        
                  '1. PASS THE OBJECTS TO THE FUNCTION AND GET STRING
                  Set optionalDict = compareRegToOptConc(concAssem, optAssem, concAssem("margin"))
                  If optionalDict("option") <> "option is not different" Then
                        calculateOptionals.Add ("option" & opt), optionalDict
                        opt = opt + 1
                  End If
            Next optAssemKey
                                    
      Next concAssemKey
      
End Function
Function compareRegToOptGyp(regAssem As Dictionary, optAssem As Dictionary, margin As Double) As Dictionary
      Set compareRegToOptGyp = New Dictionary
      Dim totalCost As Long: totalCost = (optAssem("difference") / (100 - (margin))) * 100
      Dim optionalStr As String
      Dim addOrDeduct As String
      Dim arrSM1() As String
      Dim arrSM2() As String
      Dim sm1 As String
      Dim sm2 As String
      
      'IF gypTypes ARE DIFFERENT
      If regAssem("gypType") <> optAssem("gypType") Then
            
            'COMPARE gypThick
            If regAssem("gypThick") <> optAssem("gypThick") Then
                  'WHEN gypType AND gypThick ARE DIFFERENT
                  If optAssem("difference") > 0 Then
                        addOrDeduct = "ADD"
                        optionalStr = "Upgrade from " & doubleToFraction(regAssem("gypThick")) & " Gypsum Concrete (Firm-Fill " & regAssem("gypType") & ") to " & doubleToFraction(optAssem("gypThick")) & " Gypsum Concrete (Firm-Fill " & optAssem("gypType") & ")"
                  Else
                        addOrDeduct = "DEDUCT"
                        optionalStr = "Downgrade from " & doubleToFraction(regAssem("gypThick")) & " Gypsum Concrete (Firm-Fill " & regAssem("gypType") & ") to " & doubleToFraction(optAssem("gypThick")) & " Gypsum Concrete (Firm-Fill " & optAssem("gypType") & ")"
                  End If
            Else
                  'WHEN ONLY gypType IS DIFFERENT
                  If optAssem("difference") > 0 Then
                        addOrDeduct = "ADD"
                        optionalStr = "Upgrade from Firm-Fill" & Chr(174) & " " & regAssem("gypType") & " / " & regAssem("PSI") & " PSI" & " to " & " Firm-Fill" & Chr(174) & " " & optAssem("gypType") & " / " & optAssem("PSI") & " PSI"
                  Else
                        addOrDeduct = "DEDUCT"
                        optionalStr = "Downgrade from Firm-Fill" & Chr(174) & " " & regAssem("gypType") & " / " & regAssem("PSI") & " PSI" & " to " & " Firm-Fill" & Chr(174) & " " & optAssem("gypType") & " / " & optAssem("PSI") & " PSI"
                  End If
                  
            End If
      
      'IF GYP THICKNESSES ARE DIFFERENT
      ElseIf regAssem("gypThick") <> optAssem("gypThick") Then
            
            'AND SOUND MAT TYPES ARE ALSO DIFFERENT
            If regAssem("soundMatType") <> optAssem("soundMatType") Then
                  If regAssem("soundMatType") <> "" Then
                        arrSM1 = Split(regAssem("soundMatType"))
                        sm1 = arrSM1(0) & " Mat" & "(" & arrSM1(1) & "-" & arrSM1(2) & Chr(174) & ")"
                  End If
                  
                  If optAssem("soundMatType") <> "" Then
                        arrSM2 = Split(optAssem("soundMatType"))
                        sm2 = arrSM2(0) & " Mat" & "(" & arrSM2(1) & "-" & arrSM2(2) & Chr(174) & ")"
                  End If

                  If optAssem("difference") > 0 Then
                        addOrDeduct = "ADD"
                        If regAssem("soundMatType") = "" Then
                              optionalStr = "Upgrade from " & doubleToFraction(regAssem("gypThick")) & " Gypsum Concrete to " & doubleToFraction(optAssem("gypThick")) & " Gypsum Concrete over " & sm2
                        Else
                              optionalStr = "Upgrade from " & doubleToFraction(regAssem("gypThick")) & " Gypsum Concrete over " & sm1 & " to " & doubleToFraction(optAssem("gypThick")) & " Gypsum Concrete over " & sm2
                        End If
                        
                  Else
                        addOrDeduct = "DEDUCT"
                        If optAssem("soundMatType") = "" Then
                              optionalStr = "Downgrade from " & doubleToFraction(regAssem("gypThick")) & " Gypsum Concrete over " & sm1 & " to " & doubleToFraction(optAssem("gypThick")) & " Gypsum Concrete"
                        Else
                              optionalStr = "Downgrade from " & doubleToFraction(regAssem("gypThick")) & " Gypsum Concrete over " & sm1 & " to " & doubleToFraction(optAssem("gypThick")) & " Gypsum Concrete over " & sm2
                        End If
                  End If
                  
            'IF ONLY GYP THICKNESS IS DIFFERENT
            Else
                  If optAssem("difference") > 0 Then
                        addOrDeduct = "ADD"
                        optionalStr = "Upgrade from " & doubleToFraction(regAssem("gypThick")) & " Gypsum Concrete to " & doubleToFraction(optAssem("gypThick")) & " Gypsum Concrete"
                  Else
                        addOrDeduct = "DEDUCT"
                        optionalStr = "Downgrade from " & doubleToFraction(regAssem("gypThick")) & " Gypsum Concrete to " & doubleToFraction(optAssem("gypThick")) & " Gypsum Concrete"
                  End If
            End If
      
      'IF SOUNDMAT TYPES DIFFERENT
      ElseIf regAssem("soundMatType") <> optAssem("soundMatType") Then
            arrSM1 = Split(regAssem("soundMatType"))
            arrSM2 = Split(optAssem("soundMatType"))
            sm1 = arrSM1(0) & " Mat " & "(" & arrSM1(1) & "-" & arrSM1(2) & Chr(174) & ")"
            sm2 = arrSM2(0) & " Mat " & "(" & arrSM2(1) & "-" & arrSM2(2) & Chr(174) & ")"
            
            If optAssem("difference") > 0 Then
                  addOrDeduct = "ADD"
                  If regAssem("soundMatType") = "" Then
                        optionalStr = "Upgrade from no sound mat to " & sm2
                  Else
                        optionalStr = "Upgrade from " & sm1 & " to " & sm2
                  End If
            Else
                  addOrDeduct = "DEDUCT"
                  If optAssem("soundMatType") = "" Then
                        optionalStr = "Downgrade from " & sm1 & " to no sound mat"
                  Else
                        optionalStr = "Downgrade from " & sm1 & " to " & sm2
                  End If
            End If
            
      'IF WIRE TYPES ARE DIFFERENT
      ElseIf regAssem("wireType") <> optAssem("wireType") Then
             If optAssem("difference") > 0 Then
                  addOrDeduct = "ADD"
                  If regAssem("wireType") = "" Then
                        If (regAssem("SF") <> optAssem("SF")) Then
                              optionalStr = "Install " & optAssem("SF") & " SF of " & optAssem("wireType")
                        Else
                              optionalStr = "Install " & optAssem("wireType")
                        End If
                  Else
                        optionalStr = "Upgrade from " & regAssem("wireType") & " to " & optAssem("wireType")
                  End If
            Else
                  addOrDeduct = "DEDUCT"
                  If optAssem("wireType") = "" Then
                        optionalStr = "Remove " & regAssem("wireType")
                  Else
                        optionalStr = "Downgrade from " & regAssem("wireType") & " to " & optAssem("wireType")
                  End If
            End If
                
      'IF BLACK PAPER TYPES ARE DIFFERENT
      ElseIf regAssem("blackPaperType") <> optAssem("blackPaperType") Then
             If optAssem("difference") > 0 Then
                  addOrDeduct = "ADD"
                  optionalStr = "Install " & optAssem("blackPaperType")
            Else
                  addOrDeduct = "DEDUCT"
                  optionalStr = "Remove " & regAssem("blackPaperType")
            End If
      
      Else
            compareRegToOptGyp.Add "option", "option is not different"
            Exit Function
      End If
      
      optionalStr = optionalStr & " at " & LCase(regAssem("section"))
      compareRegToOptGyp.Add "option", optionalStr
      compareRegToOptGyp.Add "cost", totalCost
      
End Function
Function compareRegToOptConc(regAssem As Dictionary, optAssem As Dictionary, margin As Double) As Dictionary
      Set compareRegToOptConc = New Dictionary
      Dim totalCost As Long: totalCost = optAssem("difference") 'i think this is different from gyp because each has its own margin. so the difference already includes the difference in margin
      Dim optionalStr As String
      Dim addOrDeduct As String
      Dim arrSM1() As String
      Dim arrSM2() As String
      Dim sm1 As String
      Dim sm2 As String
      
      'IF concThicks ARE DIFFERENT
      If regAssem("concThick") <> optAssem("concThick") Then
            If optAssem("difference") > 0 Then
                  addOrDeduct = "ADD"
                  optionalStr = "Upgrade from " & doubleToFraction(regAssem("concThick")) & " " & regAssem("concType") & " to " & doubleToFraction(optAssem("concThick")) & " " & optAssem("concType")
            Else
                  addOrDeduct = "DEDUCT"
                  optionalStr = "Downgrade from " & doubleToFraction(regAssem("concThick")) & " " & regAssem("concType") & " to " & doubleToFraction(optAssem("concThick")) & " " & optAssem("concType")
            End If
            
      'IF concTypes ARE DIFFERENT
      ElseIf regAssem("concType") <> optAssem("concType") Then
             If optAssem("difference") > 0 Then
                  addOrDeduct = "ADD"
                  optionalStr = "Upgrade from " & regAssem("concType") & " to " & optAssem("concType")
            Else
                  addOrDeduct = "DEDUCT"
                  optionalStr = "Downgrade from " & regAssem("concType") & " to " & optAssem("concType")
            End If
            
      'IF psi's ARE DIFFERENT
      ElseIf regAssem("psi") <> optAssem("psi") Then
            If optAssem("difference") > 0 Then
                  addOrDeduct = "ADD"
                  optionalStr = "Upgrade " & regAssem("concType") & " from " & regAssem("psi") & " to " & optAssem("psi")
            Else
                  addOrDeduct = "DEDUCT"
                  optionalStr = "Downgrade " & regAssem("concType") & " from " & regAssem("psi") & " to " & optAssem("psi")
            End If
            
      'IF blackPaperTypes ARE DIFFERENT
      ElseIf regAssem("blackPaperType") <> optAssem("blackPaperType") Then
            If optAssem("difference") > 0 Then
                  addOrDeduct = "ADD"
                  optionalStr = "Install " & optAssem("blackPaperType")
            Else
                  addOrDeduct = "DEDUCT"
                  optionalStr = "Remove " & regAssem("blackPaperType")
            End If
            
      'IF wireTypes ARE DIFFERENT
      ElseIf regAssem("wireType") <> optAssem("wireType") Then
            If optAssem("difference") > 0 Then
                  addOrDeduct = "ADD"
                  If regAssem("wireType") = "" Then
                        optionalStr = "Install " & optAssem("wireType")
                  Else
                        optionalStr = "Upgrade from " & regAssem("wireType") & " to " & optAssem("wireType")
                  End If
            Else
                  addOrDeduct = "DEDUCT"
                  If optAssem("wireType") = "" Then
                        optionalStr = "Remove " & regAssem("wireType")
                  Else
                        optionalStr = "Downgrade from " & regAssem("wireType") & " to " & optAssem("wireType")
                  End If
            End If
            
      'IF soundMatTypes ARE DIFFERENT
      ElseIf regAssem("soundMatType") <> optAssem("soundMatType") Then
            arrSM1 = Split(regAssem("soundMatType"))
            arrSM2 = Split(optAssem("soundMatType"))
            sm1 = arrSM1(0) & " Mat " & "(" & arrSM1(1) & "-" & arrSM1(2) & Chr(174) & ")"
            sm2 = arrSM2(0) & " Mat " & "(" & arrSM2(1) & "-" & arrSM2(2) & Chr(174) & ")"
            
            If optAssem("difference") > 0 Then
                  addOrDeduct = "ADD"
                  If regAssem("soundMatType") = "" Then
                        optionalStr = "Install " & sm2
                  Else
                        optionalStr = "Upgrade from " & sm1 & " to " & sm2
                  End If
            Else
                  addOrDeduct = "DEDUCT"
                  If optAssem("soundMatType") = "" Then
                        optionalStr = "Downgrade from " & sm1 & " to no sound mat"
                  Else
                        optionalStr = "Downgrade from " & sm1 & " to " & sm2
                  End If
            End If
      
      'IF ADD MOBILIZATIONS ARE DIFFERENT
      ElseIf regAssem("addMobils") <> optAssem("addMobils") Then
            If optAssem("difference") > 0 Then
                  addOrDeduct = "ADD"
                  If optAssem("addMobils") = 1 Then
                        optionalStr = "Add " & optAssem("addMobils") & " mobilization"
                  Else
                        optionalStr = "Add " & optAssem("addMobils") & " mobilizations"
                  End If
            Else
                  optionalStr = "Reduce " & optAssem("addMobils") & " mobilizations"
            End If
      Else
            compareRegToOptConc.Add "option", "option is not different"
            Exit Function
      End If
      
      optionalStr = optionalStr & " at " & LCase(regAssem("section"))
      compareRegToOptConc.Add "option", optionalStr
      
      compareRegToOptConc.Add "cost", totalCost

      
End Function
Function exteriorScopeStr(concAssem As Dictionary) As String
      'THIS FN IS CALLED BY EITHER:
      '1. THE diplay_proposalExteriorScope subroutine
      '2. THE diplay_proposalOptionalScope subroutine
      
      Dim concType As String
      
      If contains(concAssem("concType"), "Hydrolite") = True Then
            concType = "Lightweight"
      ElseIf contains(concAssem("concType"), "Pea Gravel") = True Then
            concType = "Pea Gravel"
      ElseIf contains(concAssem("concType"), "Hardrock") = True Then
            concType = "Hardrock"
      End If
      
      exteriorScopeStr = "Pour " & _
                                   Format((concAssem("SF")), "#,###") & " SqF of " & _
                                   doubleToFraction((concAssem("concThick"))) & " " & _
                                   concType & " concrete" & _
                                   " (" & concAssem("psi") & " PSI)" & _
                                   " over "
            
      If concAssem("soundMatType") <> "" Then
            Dim arr() As String: arr = Split((concAssem("soundMatType")))
            exteriorScopeStr = exteriorScopeStr & arr(0) & " Sound Mat " & "(" & arr(1) & "-" & arr(2) & Chr(174) & ")" & " over "
      End If
            
      If concAssem("wireType") <> "" Then
            exteriorScopeStr = exteriorScopeStr & concAssem("wireType") & " over "
      End If
            
      If concAssem("blackPaperType") <> "" Then
            exteriorScopeStr = exteriorScopeStr & "black paper"
      End If
      
      Dim mobilizationStr As String
      If concAssem("labor")("concMobilizations") + concAssem("addMobils") = 1 Then
            mobilizationStr = concAssem("labor")("concMobilizations") + concAssem("addMobils") & " mobilization"
      Else
            mobilizationStr = concAssem("labor")("concMobilizations") + concAssem("addMobils") & " mobilizations"
      End If
      
      exteriorScopeStr = exteriorScopeStr & " at " & LCase(concAssem("section")) & " - " & mobilizationStr

End Function

