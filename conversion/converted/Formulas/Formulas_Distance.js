var distance = function(zipCode, city) {
      return {
            "Van Nuys" : milesToLocation("Van Nuys", zipCode, city),
            "Irvine": 0,
            "San Diego": 0
      }
}

var milesToLocation = function(origin, zipCode, city) {
      var dict;
          
      if (zipCode !== "") {
            dict = getValues("Miles_ZipCodes_VanNuys", {"Zip Code": zipCode}, ["Miles"])
          
            if (dict.Miles === "") {
                  dict = getValues("Miles_Cities_VanNuys", {"City": city}, ["Miles"])
                  return dict.Miles;
            } else {
                  return dict.Miles;
            }
          
      } else if (city !== "") {
      
          dict = getValues("Miles_Cities_VanNuys", {"City": city}, ["Miles"])
          return dict.Miles
      }
      
      if (milesToLocation === "") {
          return 0;
      }
}
