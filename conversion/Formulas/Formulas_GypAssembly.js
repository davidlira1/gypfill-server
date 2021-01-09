Function gypBags(SF As Long, gypType As String, thickness As Double, mixDesign As Double) As Long
      Dim cuYdPerBag As Double
      If mixDesign = 0 Then
            If gypType = "Regular" Or gypType = "2010+" Or gypType = "3310" Or gypType = "Radiant" Then
                  cuYdPerBag = 2.5 '1.9 mix
            ElseIf gypType = "3310+" Or gypType = "High Strength" Or gypType = "4010+" Or gypType = "True Screed" Or gypType = "CMD" Then
                  cuYdPerBag = 2 'so now will be 1.52 mix => before '2 '1.4 mix
            End If
      Else
            If mixDesign = 1.4 Then
                  cuYdPerBag = 2 '1.4 mix
            ElseIf mixDesign = 1 Then
                  cuYdPerBag = 1.75 '1.0 mix
            End If
      End If
    
      gypBags = Round((SF * (thickness / 12) / cuYdPerBag) + 0.49)
End Function
Function costOfGypBags(gypType As String, gypBags As Long) As Long
    
    Dim dict As Dictionary: Set dict = getValues("Prices_GypBag", Array("Gyp Type"), Array(gypType), Array("Price/Bag"))
    costOfGypBags = Round((gypBags * dict("Price/Bag")) + 0.49)
    
End Function
Function tons(gypType As String, gypBags As Long, mixDesign As Double) As Long
      Dim poundsOfSand As Integer
      If mixDesign = 0 Then
            If gypType = "Regular" Or gypType = "2010+" Or gypType = "3310" Or gypType = "Radiant" Then
                  poundsOfSand = 190 '1.9 mix - 190 lbs per bag, times 4 is 760 lbs
            ElseIf gypType = "3310+" Or gypType = "High Strength" Or gypType = "4010+" Or gypType = "True Screed" Or gypType = "CMD" Then
                  poundsOfSand = 152 'tamir wanted to do 152  => 'before '1.4 mix - would be 140, but Tamir wanted to do it as 152lbs per bag
            End If
      Else
            If mixDesign = 1.4 Then
                  poundsOfSand = 152 '1.4 mix
            ElseIf mixDesign = 1 Then
                  poundsOfSand = 108 '1.0 mix
            End If
      End If
     
     tons = Round(gypBags * (poundsOfSand / 2000) + 0.49)
    
End Function
Function costOfTons(tons As Long, saturday As String) As Dictionary
      
      Dim dict As Dictionary: Set dict = getValues("Prices_Sand", Array("Type"), Array("Regular"), Array("Price/Ton", "Freight Cost", "Saturday Extra"))
      
      Dim numOfTrucks As Long: numOfTrucks = Round(tons / 25 + 0.49)
      
      Dim d As Dictionary: Set d = New Dictionary
      'COST
      If saturday = "No" Or saturday = "Yes - Option" Then
            d.Add "cost", (tons * dict("Price/Ton")) + (dict("Freight Cost") * numOfTrucks)
      ElseIf saturday = "Yes" Then
            d.Add "cost", ((tons * dict("Price/Ton")) + (dict("Freight Cost") * numOfTrucks)) * (1 + dict("Saturday Extra"))
      End If
      
      'OPTION COST
      If saturday = "Yes - Option" Then
            d.Add "costOption", d("cost") * dict("Saturday Extra")
      Else
            d.Add "costOption", 0
      End If
    
      Set costOfTons = d
End Function
Function rotoStater(bags As Long) As Long
    rotoStater = bags / 3600 + 0.001
End Function
Function costOfRotoStater() As Long
    costOfRotoStater = getValue("RotoStater", "Roto Stater", "Price")
End Function
Function soundMatRolls(SF As Long, soundMatType As String) As Integer

    Dim dict As Dictionary: Set dict = getValues("Prices_SoundMat", Array("SM Type"), Array(soundMatType), Array("SF/Roll"))
    soundMatRolls = Round((SF / dict("SF/Roll")) + 0.49)
    
End Function
Function costOfSoundMat(SF As Long, soundMatType As String) As Long

    Dim dict As Dictionary: Set dict = getValues("Prices_SoundMat", Array("SM Type"), Array(soundMatType), Array("Price/SF"))
    costOfSoundMat = Round((SF * dict("Price/SF")) + 0.49)
    
End Function
Function soundMatLaborers(SF As Long, overnight As Boolean, soundMatMobilizations As Integer, soundMatType As String) As Integer
      Dim dict As Dictionary
      'CHECK IF SOUND MAT SF IS LESS THAN MINIMUM IN TABLE. IF SO, GET FROM THE SMALL TABLE
      Set dict = getValues("Labor_SoundMat_Minimum", Array("Type"), Array("Minimum"), Array("SF"))
      If SF <= dict("SF") Then
            'GET FROM MINIMUM TABLE
            Set dict = getValuesBasedOnNum("Labor_SoundMat_Small", SF, Array("Laborers"))
            soundMatLaborers = dict("Laborers")
      Else
            'IF OVERNIGHT, SOUND MAT LABORERS WILL DEPEND ON THE OVERNIGHT TABLE INSTEAD
            If overnight = True Then
                  Dim smSFPerDay As Long: smSFPerDay = SF / soundMatMobilizations
                  Set dict = getValuesBasedOnNum("Labor_Overnight", smSFPerDay, Array("1st Day SM"))
                  soundMatLaborers = dict("1st Day SM") * soundMatMobilizations
            Else
                  Set dict = getValues("Prices_SoundMat", Array("SM Type"), Array(soundMatType), Array("SF/Roll"))
                  
                  If dict("SF/Roll") <= 260 Then
                         Set dict = getValues("Labor_SoundMat", Array("Per Day"), Array("Smaller Rolls"), Array("SF"))
                  Else
                        Set dict = getValues("Labor_SoundMat", Array("Per Day"), Array("Regular Rolls"), Array("SF"))
                  End If
                  
                  Dim laborers As Double: laborers = SF / dict("SF")
                  Dim remainder As Double: remainder = laborers - Round((laborers / 1) - 0.49)
                  
                  If remainder <= 0.38 Then
                        soundMatLaborers = Round(laborers)
                  Else
                        soundMatLaborers = Round(laborers + 0.49)
                  End If
            End If
      End If
      
End Function
Function costOfSoundMatLabor(laborers As Integer, wageType As String) As Long
      '1. GET PRICE/DAY FOR SOUND MAT LABOR
      Dim dict As Dictionary: Set dict = getValues("Wage_" & wageType & "_SM", Array("Laborer"), Array("Average"), Array("Price/Day"))
    
      '2. CALCULATE SOUND MAT LABOR
      costOfSoundMatLabor = Round((dict("Price/Day") * laborers) + 0.49)
End Function
Function lFt(SF As Long) As Long
      lFt = Round((SF * 0.31) + 0.49)
End Function

