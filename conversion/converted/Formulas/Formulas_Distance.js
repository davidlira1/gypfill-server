const lb = require('../library.js');

module.exports.distance = function(zipCode) {
      return {
            "Van Nuys" : module.exports.milesToLocation(zipCode),
            "Irvine": 0,
            "San Diego": 0
      }
};

module.exports.milesToLocation = function(zipCode) {
      var dict = lb.getValues("Miles_ZipCodes_VanNuys", {"Zip Code": zipCode}, ["Miles"]);

      return dict["Miles"] !== undefined ? dict["Miles"] : 40; //we'll do 40 as a default in case it doesn't find anything for the passed in zip code. that way at least some cost is added
};
