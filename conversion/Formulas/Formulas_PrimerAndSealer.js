Function primerGallons(gypOrConc As String, primerType As String, SF As Long) As Integer

    Dim dict As Dictionary: Set dict = getValues("Prices_" & gypOrConc & "_Primer", Array("Manufacturer"), Array(primerType), Array("SF/Diluted Gal"))
    primerGallons = Round((SF / dict("SF/Diluted Gal")) + 0.49)
    
End Function
Function costOfPrimerGallons(gypOrConc As String, primerType As String, SF As Long) As Integer

    Dim dict As Dictionary: Set dict = getValues("Prices_" & gypOrConc & "_Primer", Array("Manufacturer"), Array(primerType), Array("Total Price/SF"))
    costOfPrimerGallons = Round((SF * dict("Total Price/SF")) + 0.49)
    
End Function
Function sealerGallons(gypOrConc As String, sealerType As String, SF As Long) As Integer

    Dim dict As Dictionary: Set dict = getValues("Prices_" & gypOrConc & "_Sealer", Array("Manufacturer"), Array(sealerType), Array("SF/Diluted Gal"))
    sealerGallons = Round((SF / dict("SF/Diluted Gal")) + 0.49)
    
End Function
Function costOfSealerGallons(gypOrConc As String, sealerType As String, SF As Long) As Integer

    Dim dict As Dictionary: Set dict = getValues("Prices_" & gypOrConc & "_Sealer", Array("Manufacturer"), Array(sealerType), Array("Total Price/SF"))
    costOfSealerGallons = Round((SF * dict("Total Price/SF")) + 0.49)
    
End Function
