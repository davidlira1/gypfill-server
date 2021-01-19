var primerGallons = function(gypOrConc, primerType, SF) {

    var dict = getValues("Prices_" + gypOrConc + "_Primer", Array.Manufacturer, Array[primerType], Array("SF/Diluted Gal"))
    primerGallons = Round((SF / dict("SF/Diluted Gal")) + 0.49)
    
}
var costOfPrimerGallons = function(gypOrConc, primerType, SF) {

    var dict = getValues("Prices_" + gypOrConc + "_Primer", Array.Manufacturer, Array[primerType], Array("Total Price/SF"))
    costOfPrimerGallons = Round((SF * dict("Total Price/SF")) + 0.49)
    
}
var sealerGallons = function(gypOrConc, sealerType, SF) {

    var dict = getValues("Prices_" + gypOrConc + "_Sealer", Array.Manufacturer, Array[sealerType], Array("SF/Diluted Gal"))
    sealerGallons = Round((SF / dict("SF/Diluted Gal")) + 0.49)
    
}
var costOfSealerGallons = function(gypOrConc, sealerType, SF) {

    var dict = getValues("Prices_" + gypOrConc + "_Sealer", Array.Manufacturer, Array[sealerType], Array("Total Price/SF"))
    costOfSealerGallons = Round((SF * dict("Total Price/SF")) + 0.49)
    
}
