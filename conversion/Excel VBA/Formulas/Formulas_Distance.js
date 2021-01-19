Function distance(zipCode As Variant, city As String) As Dictionary
      Set distance = New Dictionary
      
      distance.Add "Van Nuys", milesToLocation("Van Nuys", zipCode, city)
      distance.Add "Irvine", 0
      distance.Add "San Diego", 0
End Function
Function milesToLocation(origin As String, zipCode As Variant, city As String) As Variant
      Dim dict As Dictionary
      
      zipCode = CLng(zipCode)
      
      If zipCode <> "" Then
            Set dict = getValues("Miles_ZipCodes_VanNuys", Array("Zip Code"), Array(zipCode), Array("Miles"))
          
            If dict("Miles") = "" Then
                  Set dict = getValues("Miles_Cities_VanNuys", Array("City"), Array(city), Array("Miles"))
                  milesToLocation = dict("Miles")
            Else
                  milesToLocation = dict("Miles")
            End If
          
      ElseIf city <> "" Then
      
          Set dict = getValues("Miles_Cities_VanNuys", Array("City"), Array(city), Array("Miles"))
          milesToLocation = dict("Miles")
      End If
      
      If milesToLocation = "" Then
          milesToLocation = 0
      End If
End Function
