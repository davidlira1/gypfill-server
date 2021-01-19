var distance = function(zipCode, city) {
      return {
            "Van Nuys" : milesToLocation("Van Nuys", zipCode, city),
            "Irvine": 0,
            "San Diego": 0
      }
}

var milesToLocation = function(origin, zipCode, city) {
      var dict
      
      zipCode = CLng[zipCode]
      
      if (zipCode !== "") {
            dict = getValues("Miles_ZipCodes_VanNuys", Array("Zip Code"), Array[zipCode], Array.Miles)
          
            if (dict.Miles === "") {
                  dict = getValues("Miles_Cities_VanNuys", Array.City, Array[city], Array.Miles)
                  milesToLocation = dict.Miles
            } else {
                  milesToLocation = dict.Miles
            }
          
      } else if (city !== "") {
      
          dict = getValues("Miles_Cities_VanNuys", Array.City, Array[city], Array.Miles)
          milesToLocation = dict.Miles
      }
      
      if (milesToLocation === "") {
          milesToLocation = 0
      }
}
