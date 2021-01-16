Sub laborAndCostsConc(assem As Dictionary, drivingTimeHrs As Double, wageType As String, miles As Integer, saturdayConc As String, numOfFloors As Byte)
      Dim dict As Dictionary
      assem.Add "labor", New Dictionary
      If assem("concYds") <= 2.37 Then
            'MAXIMIZER LABOR
            assem("labor").Add "concMobilizations", 1
            assem("labor").Add "concLaborers", maximizerLaborers(assem("concYds"), assem("addMobils"))
            Set dict = costOfMaximizerLaborers(wageType, (assem("labor")("concLaborers")("totalCrew")("Total")), miles, saturdayConc)
            assem("labor").Add "costOfConcLaborers", dict("cost")
            assem("labor").Add "costOfConcLaborersOption", dict("costOption")
            assem("labor").Add "costOfOverTimeConcLabor", costOfOvertimeConcLaborers(wageType, drivingTimeHrs, (assem("labor")("concMobilizations")))
      Else
            'PUMP LABOR
            '1. DETERMINE COUNT (WHETHER IT'S BALCONY OR STAIR COUNT)
            Dim count As Long
            If assem("section") = "Stairs" Or assem("section") = "Stair Landings" Then
                  count = assem("stairCount")
            Else
                  count = 0
            End If
                        
            assem("labor").Add "concMobilizations", concMobilizations(assem("section"), assem("SF"), count)
            assem("labor").Add "concLaborers", concLaborers(assem("section"), assem("concType"), assem("SF"), assem("stairNosing"), numOfFloors, (assem("labor")("concMobilizations")), assem("addMobils"))
            Set dict = costOfConcLaborers((assem("labor")("concLaborers")("totalCrew")("Total")), wageType, miles, saturdayConc)
            assem("labor").Add "costOfConcLaborers", dict("cost")
            assem("labor").Add "costOfConcLaborersOption", dict("costOption")
            assem("labor").Add "costOfConcLaborersOptAddMobils", dict("costOptAddMobils")
            assem("labor").Add "costOfOverTimeConcLabor", costOfOvertimeConcLaborers(wageType, drivingTimeHrs, (assem("labor")("concMobilizations")) + assem("addMobils"))

            'WIRE LABORERS
            If assem("wireType") <> "" Then
                  assem("labor").Add "wireLaborers", wireLaborers(assem("wireType"), assem("SF"))
                  assem("labor").Add "costOfWireLaborers", costOfWireLaborers(wageType, (assem("labor")("wireLaborers")))
            End If
                      
            'BLACK PAPER LABORERS
            If assem("blackPaperType") <> "" Then
                  assem("labor").Add "blackPaperLaborers", blackPaperLaborers(assem("blackPaperType"), assem("SF"))
                  assem("labor").Add "costOfBlackPaperLaborers", costOfBlackPaperLaborers(wageType, (assem("labor")("blackPaperLaborers")))
            End If
                        
            'SOUND MAT LABORERS
            If assem("soundMatType") <> "" Then
                  '1. LABORERS
                  assem("labor").Add "soundMatLaborers", soundMatLaborers(assem("SF"), False, 0, assem("soundMatType"))
                  '2. LABOR COST
                  assem("labor").Add "costOfSoundMatLabor", costOfSoundMatLabor((assem("labor")("soundMatLaborers")), wageType)
                  '3. OVERTIME LABOR COST
                  assem("labor").Add "costOfOverTimeSoundMatLabor", costOfOverTimeSoundMatLabor(wageType, (assem("labor")("concMobilizations")), drivingTimeHrs, False)
            End If
                        
      End If
      
      Set dict = getValues("Prices_AfterMileThreshold", Array("Description"), Array("Threshold"), Array("Miles", "Price/Day"))
      If miles > dict("Miles") Then
            assem.Add "costAfterMilesThreshold", ((assem("labor")("concLaborers")("totalCrew")("Total")) - (assem("labor")("concMobilizations"))) * dict("Price/Day")
      End If
End Sub
