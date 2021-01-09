Sub materialsAndCostsConc(assem As Dictionary, dict As Dictionary, wageType As String, city As String, zipCode As Variant, saturdayConc As String)
      Dim temp As Dictionary
      '1. CALCULATE CONCRETE YARDS
      assem.Add "concYds", concYds(assem("SF"), dict("concThick"))
    
      '2. ROUND CONCRETE YARDS
      Dim roundConcYds As Integer: roundConcYds = Round(assem("concYds") + 0.49, 2) 'this is rounded for when it's for pump
    
      '3. CALCULATE CONCRETE MATERIALS
      If assem("concYds") <= 2.37 Then '2.37 is about 64 cuft, which is also 64 maximizer bags
          'USE BAGS
          assem.Add "maximizerBags", maximizerBags(assem("concYds"))
          assem.Add "costOfMaximizerBags", costOfMaximizerBags(assem("maximizerBags"))
      Else
          'USE PUMP
          assem("concYds") = roundConcYds
          Set temp = costOfConcYds(dict("concType"), dict("psi"), roundConcYds, (CLng(zipCode)), saturdayConc)
          assem.Add "costOfConcYds", temp("cost")
          assem.Add "costOfConcYdsOption", temp("costOption")
          assem.Add "concShortLoad", concShortLoad(roundConcYds)
          assem.Add "costOfConcShortLoad", costOfConcShortLoad(assem("concShortLoad"))
          assem.Add "concTrucks", concTrucks(roundConcYds, dict("delivDiff"), city)
          assem.Add "costOfEnvironmental", costOfEnvironmental((assem("concTrucks")("trucks")))
          assem.Add "costOfEnergy", costOfEnergy((assem("concTrucks")("trucks")))
          assem.Add "costOfWashOut", costOfWashOut((assem("concTrucks")("trucks")))
          assem.Add "costOfDownTime", costOfDownTime(wageType, assem("concYds"), assem("section"), (assem("concTrucks")("trucks")))
          If wageType = "Prevailing" Then
            assem.Add "costOfTracker", costOfTracker()
          End If
      End If

      'DEPENDING ON FLOOR SURFACE
      If dict("floor") = "Plywood" Then
            'CALCULATE BLACK PAPER
            materialsAndCostsBlackPaper assem, dict
      Else
            'CALCULATE PRIMER
            materialsAndCostsPrimer "Conc", assem, dict
      End If
    
      If dict("wireType") <> "" Then
            materialsAndCostsWire assem, dict, wageType
      End If
      
      '==========================================================================================
      'SOUND MAT
      '==========================================================================================
      If dict("soundMatType") <> "" Then
            assem.Add "soundMatRolls", soundMatRolls(assem("SF"), dict("soundMatType"))
            assem.Add "costOfSoundMat", costOfSoundMat(assem("SF"), dict("soundMatType"))
      Else
            '==========================================================================================
            'SPRAY GLUE (IF NO SOUND MAT)
            '==========================================================================================
            materialsAndCostsSprayGlue assem
            '==========================================================================================
            'DUCT TAPE (IF NO SOUND MAT)
            '==========================================================================================
            materialsAndCostsDuctTapeRollsWhenNoSM assem
      End If
      
End Sub
