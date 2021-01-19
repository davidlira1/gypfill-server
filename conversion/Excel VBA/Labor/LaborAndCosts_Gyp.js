Sub laborAndCostsGyp(inputs As Dictionary, assem As Dictionary, wageType As String, sameDay As String, overnight As Boolean, miles As Integer, gypMobilizations As Integer, soundMatMobilizations As Integer, projectType As String)
      '1. CALCULATE COST OF GYP LABOR
      assem.Add "costOfGypLabor", Round(inputs("gyp")("labor")("costOfGypLabor") * (assem("SF") / (inputs("totals")("gypSF"))) + 0.49)
      
      '2. CALCULATE COST OF SOUND MAT
      If sameDay = "No" And assem("soundMatType") <> "" Then
            assem.Add "soundMatLaborers", soundMatLaborers(assem("SF"), overnight, soundMatMobilizations, assem("soundMatType"))
            assem.Add "costOfSoundMatLabor", costOfSoundMatLabor(assem("soundMatLaborers"), wageType)
            
            Dim dict As Dictionary
            'PER DIEM COST
            If overnight = True Then
                  Set dict = getValues("Prices_PerDiem", Array("Per Diem"), Array("Default"), Array("Price/Day"))
                  assem.Add "costOfPerDiem", assem("soundMatLaborers") * dict("Price/Day")
            End If

            'IF MILES IS MORE THAN 90, GIVE GUYS, EXCEPT FOR DRIVER, 50 BUCKS
            'WE DETERMINE THIS BY ALLOCATING ONE DRIVER FOR EACH MOBILIZATION. THE REST WILL NOT BE DRIVERS
            If overnight <> True Then
                  Set dict = getValues("Prices_AfterMileThreshold", Array("Description"), Array("Threshold"), Array("Miles", "Price/Day"))
                  If miles > dict("Miles") Then
                        'subtract the num of mobilizations, since that's the number of drivers
                        assem.Add "costAfterMilesThresholdSoundMat", ((assem("soundMatLaborers") - soundMatMobilizations) * dict("Price/Day"))
                  End If
            End If
      End If
            
      '3. IF WIRE, CALCULATE LABOR
      If assem("wireType") <> "" Then
            assem.Add "wireLaborers", wireLaborers(assem("wireType"), assem("SF"))
            assem.Add "costOfWireLaborers", costOfWireLaborers(wageType, (assem("wireLaborers")))
      End If
      
      '4. IF BLACK PAPER, CALCULATE LABOR
      If assem("blackPaperType") <> "" Then
            assem.Add "blackPaperLaborers", blackPaperLaborers(assem("blackPaperType"), assem("SF"))
            assem.Add "costOfBlackPaperLaborers", costOfBlackPaperLaborers(wageType, (assem("blackPaperLaborers")))
      End If
      
End Sub
