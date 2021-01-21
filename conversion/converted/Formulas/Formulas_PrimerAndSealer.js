module.exports.primerGallons = function(gypOrConc, primerType, SF) {
    var dict = getValues("Prices_" + gypOrConc + "_Primer", {"Manufacturer": primerType}, ["SF/Diluted Gal"]);
    return Math.ceil((SF / dict["SF/Diluted Gal"]));
}
module.exports.costOfPrimerGallons = function(gypOrConc, primerType, SF) {
    var dict = getValues("Prices_" + gypOrConc + "_Primer", {"Manufacturer": primerType}, ["Total Price/SF"]);
    return Math.ceil((SF * dict["Total Price/SF"]));
}
module.exports.sealerGallons = function(gypOrConc, sealerType, SF) {
    var dict = getValues("Prices_" + gypOrConc + "_Sealer", {"Manufacturer": sealerType}, ["SF/Diluted Gal"]);
    return Math.ceil((SF / dict["SF/Diluted Gal"]));
}
module.exports.costOfSealerGallons = function(gypOrConc, sealerType, SF) {
    var dict = getValues("Prices_" + gypOrConc + "_Sealer", {"Manufacturer": sealerType}, ["Total Price/SF"]);
    return Math.ceil((SF * dict["Total Price/SF"]));
}
