Function drivingTime(miles As Integer) As Double
    'ROUND TRIP TIME
    'AT 55mph
    drivingTime = (miles / 55) * 2
End Function
Function setupTime(structureType As String) As Double
    Dim key As String
    If structureType = "House" Then
        key = "House Setup Time"
    Else
        key = "Building Setup Time"
    End If
    
    Dim dict As Dictionary: Set dict = getValues("Time_Gyp", Array("Type Of Time"), Array(key), Array("Hr"))
    setupTime = dict("Hr")
End Function
Function lunchTime() As Double
      Dim dict As Dictionary: Set dict = getValues("Time_Gyp", Array("Type Of Time"), Array("Lunch Time"), Array("Hr"))
      lunchTime = dict("Hr")
End Function
Function cleanupTime() As Double
    Dim dict As Dictionary: Set dict = getValues("Time_Gyp", Array("Type Of Time"), Array("Cleanup Time"), Array("Hr"))
    cleanupTime = dict("Hr")
End Function
Function pumpTime(bags As Long) As Dictionary
    Set pumpTime = New Dictionary
    
    Dim blastcreteHrs As Double
    Dim super80Hrs As Double
    Dim placerHrs As Double
    
    Dim blastcreteMins As Integer
    Dim superMins As Integer
    Dim placerMins As Integer
    
    Dim dict As Dictionary
    
    Set dict = getValues("Equip_Gyp_Pumps", Array("Model-Num"), Array("D6528"), Array("Bags/Hr"))
    'this will need to first divide total bags by mobilizations i think
    blastcreteHrs = bags / dict("Bags/Hr")
    
    Set dict = getValues("Equip_Gyp_Pumps", Array("Model-Num"), Array("Super-80"), Array("Bags/Hr"))
    super80Hrs = bags / dict("Bags/Hr")
    
    Set dict = getValues("Equip_Gyp_Pumps", Array("Model-Num"), Array("Placer"), Array("Bags/Hr"))
    placerHrs = bags / dict("Bags/Hr")
    
    pumpTime.Add "D6528", blastcreteHrs
    pumpTime.Add "Super-80", super80Hrs
    pumpTime.Add "Placer", placerHrs
    
End Function
Function concPumpTime(yds As Double, section As String) As Double
      Dim dict As Dictionary: Set dict = getValues("Conc_YdsPerHr", Array("Section"), Array(section), Array("Yds/Hr"))
      concPumpTime = yds / dict("Yds/Hr")
End Function

Function totalGypTime(setupTime As Double, pumpTime As Double, cleanupTime As Double) As Double
    totalGypTime = setupTime + pumpTime + cleanupTime
End Function
Function overTimeGyp(totalGypTime As Double) As Double
      If totalGypTime - 7.5 < 0 Then
            overTimeGyp = 0
      Else
            overTimeGyp = totalGypTime - 7.5
      End If
End Function
Function hoursToPhrase(totalHrs As Variant) As String
      Dim hrs As Integer
      Dim mins As Double
      hrs = Round((totalHrs / 1) - 0.49)
      mins = Round(((totalHrs - hrs) * 60) + 0.49)
    
      hoursToPhrase = hrs & "h:" & mins & "m"
End Function



