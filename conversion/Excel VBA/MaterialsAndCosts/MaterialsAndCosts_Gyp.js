Sub materialsAndCostsGyp(assem As Dictionary, dict As Dictionary, mixDesign As Double, wageType As String, projectType As String, saturday As String)
      Dim temp As Dictionary
      '==========================================================================================
      'PERIMETER FOAM
      '==========================================================================================
      assem.Add "perFoamRollType", perFoamRollType(dict("soundMatType"))
      assem.Add "perFoamRolls", perFoamRolls(assem("SF"), dict("soundMatType"))
      assem.Add "costOfPerFoamRolls", costOfPerFoamRolls(assem("perFoamRolls"), dict("soundMatType"))
      '==========================================================================================
      'STAPLES
      '==========================================================================================
      assem.Add "stapleBoxes", stapleBoxes(assem("SF"))
      assem.Add "costOfStapleBoxes", costOfStapleBoxes(assem("stapleBoxes"))
      '==========================================================================================
      'WHEN NO SOUND MAT
      '==========================================================================================
      If dict("soundMatType") = "" Then
            '==========================================================================================
            'SPRAY GLUE
            '==========================================================================================
            materialsAndCostsSprayGlue assem
            '==========================================================================================
            'DUCT TAPE WHEN NO SOUND MAT
            '==========================================================================================
            materialsAndCostsDuctTapeRollsWhenNoSM assem
      End If
      '==========================================================================================
      'GYPCRETE
      '==========================================================================================
      If dict("gypType") = "CMD" Then
            '==========================================================================================
            'CMD BAGS
            '==========================================================================================
            assem.Add "gypBagsFlutes", gypBags(assem("SF"), dict("gypType"), dict("gypThickFlutes"), mixDesign) / 2
            If dict("soundMatType") <> "" Then
                  '==========================================================================================
                  'IF SM, USE GYP SPECIFIED FOR ABOVE FLUTES
                  '==========================================================================================
                  assem.Add "gypBagsAboveFlutes", gypBags(assem("SF"), dict("gypTypeAboveFlutes"), dict("gypThick"), mixDesign)
            Else
                  '==========================================================================================
                  'IF NO SM, MUST USE CMD
                  '==========================================================================================
                  assem.Add "gypBagsAboveFlutes", gypBags(assem("SF"), dict("gypType"), dict("gypThick"), mixDesign)
            End If
            assem.Add "gypBags", assem("gypBagsFlutes") + assem("gypBagsAboveFlutes")
            assem.Add "costOfGypBags", costOfGypBags(dict("gypType"), assem("gypBagsFlutes")) + costOfGypBags(dict("gypType"), assem("gypBagsAboveFlutes"))
            '==========================================================================================
            'CMD PRIMER
            '==========================================================================================
            assem.Add "CMDPrimerGallons", primerGallons("gyp", "CMD Primer", assem("SF"))
            assem.Add "costOfCMDPrimerGallons", costOfPrimerGallons("gyp", "CMD Primer", assem("SF"))
      Else
            '==========================================================================================
            'NOT CMD
            '==========================================================================================
            assem.Add "gypBags", gypBags(assem("SF"), dict("gypType"), dict("gypThick"), mixDesign)
            assem.Add "costOfGypBags", costOfGypBags(dict("gypType"), assem("gypBags"))
      End If
      '==========================================================================================
      'TONS
      '==========================================================================================
      If dict("gypType") = "CMD" Then
            assem.Add "tonsFlutes", tons(dict("gypType"), assem("gypBagsFlutes"), mixDesign)
            assem.Add "tonsAboveFlutes", tons(dict("gypType"), assem("gypBagsAboveFlutes"), mixDesign)
            assem.Add "tons", assem("tonsFlutes") + assem("tonsAboveFlutes")
      Else
            assem.Add "tons", tons(dict("gypType"), assem("gypBags"), mixDesign)
      End If
      Set temp = costOfTons(assem("tons"), saturday)
      assem.Add "costOfTons", temp("cost")
      assem.Add "costOfTonsOption", temp("costOption")
      '==========================================================================================
      'SOUND MAT
      '==========================================================================================
      If dict("soundMatType") <> "" Then
            assem.Add "soundMatRolls", soundMatRolls(assem("SF"), dict("soundMatType"))
            assem.Add "costOfSoundMat", costOfSoundMat(assem("SF"), dict("soundMatType"))

            '==========================================================================================
            'DUCT TAPE
            '==========================================================================================
            assem.Add "ductTapeRolls", ductTapeRolls(assem("SF"))
            assem.Add "costOfDuctTapeRolls", costOfDuctTapeRolls(assem("ductTapeRolls"))
      End If
      '==========================================================================================
      'GYPRETE PRIMER IF NO SM && NO BP && NOT CMD
      '==========================================================================================
      If dict("soundMatType") = "" And dict("blackPaperType") = "" And dict("gypType") <> "CMD" Then
            materialsAndCostsPrimer "Gyp", assem, dict
      End If
      '==========================================================================================
      'WIRE
      '==========================================================================================
      If dict("wireType") <> "" Then
            materialsAndCostsWire assem, dict, wageType
      End If
      '==========================================================================================
      'BLACK PAPER
      '==========================================================================================
      If dict("blackPaperType") <> "" Then
            materialsAndCostsBlackPaper assem, dict
      End If

End Sub
