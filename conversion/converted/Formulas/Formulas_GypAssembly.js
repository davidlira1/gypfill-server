var gypBags = function(SF, gypType, thickness, mixDesign) {
      var cuYdPerBag
      if (mixDesign === 0) {
            if (gypType = "Regular" Or gypType = "2010+" Or gypType = "3310" Or gypType === "Radiant") {
                  cuYdPerBag = 2.5 //1.9 mix
            } else if (gypType = "3310+" Or gypType = "High Strength" Or gypType = "4010+" Or gypType = "true Screed" Or gypType === "CMD") {
                  cuYdPerBag = 2 //so now will be 1.52 mix => before //2 //1.4 mix
            }
      } else {
            if (mixDesign === 1.4) {
                  cuYdPerBag = 2 //1.4 mix
            } else if (mixDesign === 1) {
                  cuYdPerBag = 1.75 //1.0 mix
            }
      }
    
      gypBags = Round((SF * (thickness / 12) / cuYdPerBag) + 0.49)
}
var costOfGypBags = function(gypType, gypBags) {
    
    var dict = getValues("Prices_GypBag", Array("Gyp Type"), Array[gypType], Array("Price/Bag"))
    costOfGypBags = Round((gypBags * dict("Price/Bag")) + 0.49)
    
}
var tons = function(gypType, gypBags, mixDesign) {
      var poundsOfSand
      if (mixDesign === 0) {
            if (gypType = "Regular" Or gypType = "2010+" Or gypType = "3310" Or gypType === "Radiant") {
                  poundsOfSand = 190 //1.9 mix - 190 lbs per bag, times 4 is 760 lbs
            } else if (gypType = "3310+" Or gypType = "High Strength" Or gypType = "4010+" Or gypType = "true Screed" Or gypType === "CMD") {
                  poundsOfSand = 152 //tamir wanted to do 152  => //before //1.4 mix - would be 140, but Tamir wanted to do it as 152lbs per bag
            }
      } else {
            if (mixDesign === 1.4) {
                  poundsOfSand = 152 //1.4 mix
            } else if (mixDesign === 1) {
                  poundsOfSand = 108 //1.0 mix
            }
      }
     
     tons = Round(gypBags * (poundsOfSand / 2000) + 0.49)
    
}
var costOfTons = function(tons, saturday) {
      
      var dict = getValues("Prices_Sand", Array.Type, Array.Regular, Array("Price/Ton", "Freight Cost", "Saturday Extra"))
      
      var numOfTrucks = Round(tons / 25 + 0.49)
      
      var d = {}
      //COST
      if (saturday = "No" Or saturday === "Yes - Option") {
            d.cost = (tons * dict("Price/Ton")) + (dict("Freight Cost") * numOfTrucks)
      } else if (saturday === "Yes") {
            d.cost = ((tons * dict("Price/Ton")) + (dict("Freight Cost") * numOfTrucks)) * (1 + dict("Saturday Extra"))
      }
      
      //OPTION COST
      if (saturday === "Yes - Option") {
            d.costOption = d.cost * dict("Saturday Extra")
      } else {
            d.costOption = 0
      }
    
      costOfTons = d
}
var rotoStater = function(bags) {
    rotoStater = bags / 3600 + 0.001
}
var costOfRotoStater = function() {
    costOfRotoStater = getValue("RotoStater", "Roto Stater", "Price")
}
var soundMatRolls = function(SF, soundMatType) {

    var dict = getValues("Prices_SoundMat", Array("SM Type"), Array[soundMatType], Array("SF/Roll"))
    soundMatRolls = Round((SF / dict("SF/Roll")) + 0.49)
    
}
var costOfSoundMat = function(SF, soundMatType) {

    var dict = getValues("Prices_SoundMat", Array("SM Type"), Array[soundMatType], Array("Price/SF"))
    costOfSoundMat = Round((SF * dict("Price/SF")) + 0.49)
    
}
var soundMatLaborers = function(SF, overnight, soundMatMobilizations, soundMatType) {
      var dict
      //CHECK IF SOUND MAT SF IS LESS THAN MINIMUM IN TABLE. IF SO, GET FROM THE SMALL TABLE
      dict = getValues("Labor_SoundMat_Minimum", Array.Type, Array.Minimum, Array.SF)
      if (SF <= dict.SF) {
            //GET FROM MINIMUM TABLE
            dict = getValuesBasedOnNum("Labor_SoundMat_Small", SF, Array.Laborers)
            soundMatLaborers = dict.Laborers
      } else {
            //IF OVERNIGHT, SOUND MAT LABORERS WILL DEPEND ON THE OVERNIGHT TABLE INSTEAD
            if (overnight === true) {
                  var smSFPerDay = SF / soundMatMobilizations
                  dict = getValuesBasedOnNum("Labor_Overnight", smSFPerDay, Array("1st Day SM"))
                  soundMatLaborers = dict("1st Day SM") * soundMatMobilizations
            } else {
                  dict = getValues("Prices_SoundMat", Array("SM Type"), Array[soundMatType], Array("SF/Roll"))
                  
                  if (dict("SF/Roll") <= 260) {
                         dict = getValues("Labor_SoundMat", Array("Per Day"), Array("Smaller Rolls"), Array.SF)
                  } else {
                        dict = getValues("Labor_SoundMat", Array("Per Day"), Array("Regular Rolls"), Array.SF)
                  }
                  
                  var laborers = SF / dict.SF
                  var remainder = laborers - Round((laborers / 1) - 0.49)
                  
                  if (remainder <= 0.38) {
                        soundMatLaborers = Round[laborers]
                  } else {
                        soundMatLaborers = Round(laborers + 0.49)
                  }
            }
      }
      
}
var costOfSoundMatLabor = function(laborers, wageType) {
      //1. GET PRICE/DAY FOR SOUND MAT LABOR
      var dict = getValues("Wage_" + wageType + "_SM", Array.Laborer, Array.Average, Array("Price/Day"))
    
      //2. CALCULATE SOUND MAT LABOR
      costOfSoundMatLabor = Round((dict("Price/Day") * laborers) + 0.49)
}
var lFt = function(SF) {
      lFt = Round((SF * 0.31) + 0.49)
}

