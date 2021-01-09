module.exports = 
`
Sub calculateTrucks(estimate As Dictionary, gypExists As Boolean, concExists As Boolean, overnight As Boolean, sameDay As String)
      If gypExists Then
            '==========================================================================================
            'TRUCKS DRIVING - GYPCRETE, PREPOURS, AND SOUNDMAT
            '==========================================================================================
            'TRUCKS DRIVING FUEL COST
            estimate("trucks").Add "gypDrivingFuelCost", drivingFuelsCost("Gyp", (estimate("distance")("Van Nuys")), (estimate("gyp")("labor")("mobilizations")))
            estimate("trucks").Add "prePoursDrivingFuelCost", drivingFuelsCost("", (estimate("distance")("Van Nuys")), (estimate("gyp")("labor")("mobilizationsPrePours")))
            If overnight <> True And sameDay <> "Yes" Then
                  estimate("trucks").Add "soundMatDrivingFuelCost", drivingFuelsCost("", (estimate("distance")("Van Nuys")), (estimate("gyp")("labor")("mobilizationsSoundMat")))
            End If
            
            'TRUCKS MAINTENANCE COST
            estimate("trucks").Add "gypMaintenanceCost", trucksMaintCost("Gyp", (estimate("distance")("Van Nuys")), (estimate("gyp")("labor")("mobilizations")), overnight)
            estimate("trucks").Add "prePoursMaintenanceCost", trucksMaintCost("", (estimate("distance")("Van Nuys")), (estimate("gyp")("labor")("mobilizationsPrePours")), False)
            If overnight <> True And sameDay <> "Yes" Then
                  estimate("trucks").Add "soundMatMaintenanceCost", trucksMaintCost("", (estimate("distance")("Van Nuys")), (estimate("gyp")("labor")("mobilizationsSoundMat")), overnight)
            End If
            '==========================================================================================
            estimate("totals").Add "gypCostTrucksFuelMaint", _
                                            estimate("trucks")("gypDrivingFuelCost") + _
                                            estimate("trucks")("prePoursDrivingFuelCost") + _
                                            estimate("trucks")("soundMatDrivingFuelCost") + _
                                            estimate("trucks")("gypMaintenanceCost") + _
                                            estimate("trucks")("prePoursMaintenanceCost") + _
                                            estimate("trucks")("soundMatMaintenanceCost")
      End If
End Sub
Sub calculateTrucksConc(assem As Dictionary, miles As Integer)
      'ADD A TRUCKS OBJECT TO THE ASSEMBLY
      assem.Add "trucks", New Dictionary
      
      'FUEL COST
      assem("trucks").Add "costFuel", drivingFuelsCost("Conc", miles, (assem("labor")("concMobilizations")) + assem("addMobils"))
            
      'MAINTENANCE COST
      assem("trucks").Add "costMaintenance", trucksMaintCost("Conc", miles, (assem("labor")("concMobilizations")) + assem("addMobils"), False)
      
      'we will not calculate the insurance, registration, or dot costs since those get paid regardless if there is work or not
      'tamir said these will be part of overhead
End Sub
`;