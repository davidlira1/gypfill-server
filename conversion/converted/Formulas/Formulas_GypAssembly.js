module.exports.gypBags = function(SF, gypType, thickness, mixDesign) {
      var cuYdPerBag;
      if (mixDesign === 0) {
            if (gypType === "Regular" || gypType === "2010+" || gypType === "3310" || gypType === "Radiant") {
                  cuYdPerBag = 2.5; //1.9 mix
            } else if (gypType === "3310+" || gypType === "High Strength" || gypType === "4010+" || gypType === "true Screed" || gypType === "CMD") {
                  cuYdPerBag = 2; //so now will be 1.52 mix => bef||e //2 //1.4 mix
            }
      } else {
            if (mixDesign === 1.4) {
                  cuYdPerBag = 2; //1.4 mix
            } else if (mixDesign === 1) {
                  cuYdPerBag = 1.75; //1.0 mix
            }
      }
    
      return Math.ceil(SF * (thickness / 12) / cuYdPerBag);
}
module.exports.costOfGypBags = function(gypType, gypBags) {
    var dict = getValues("Prices_GypBag", {"Gyp Type": gypType}, ["Price/Bag"]);
    return Math.ceil(gypBags * dict["Price/Bag"]);
}
module.exports.tons = function(gypType, gypBags, mixDesign) {
      var poundsOfSand;
      if (mixDesign === 0) {
            if (gypType === "Regular" || gypType === "2010+" || gypType === "3310" || gypType === "Radiant") {
                  poundsOfSand = 190; //1.9 mix - 190 lbs per bag, times 4 is 760 lbs
            } else if (gypType === "3310+" || gypType === "High Strength" || gypType === "4010+" || gypType === "true Screed" || gypType === "CMD") {
                  poundsOfSand = 152; //tamir wanted to do 152  => //bef||e //1.4 mix - would be 140, but Tamir wanted to do it as 152lbs per bag
            }
      } else {
            if (mixDesign === 1.4) {
                  poundsOfSand = 152; //1.4 mix
            } else if (mixDesign === 1) {
                  poundsOfSand = 108; //1.0 mix
            }
      }
     return Math.ceil(gypBags * (poundsOfSand / 2000));
}
module.exports.costOfTons = function(tons, saturday) {
      var dict = getValues("Prices_Sand", {"Type": "Regular"}, ["Price/Ton", "Freight Cost", "Saturday Extra"]);
      
      var numOfTrucks = Math.ceil(tons / 25);
      
      var d = {}
      //COST
      if (saturday === "No" || saturday === "Yes - Option") {
            d.cost = (tons * dict["Price/Ton"]) + (dict["Freight Cost"] * numOfTrucks);
      } else if (saturday === "Yes") {
            d.cost = ((tons * dict["Price/Ton"]) + (dict["Freight Cost"] * numOfTrucks)) * (1 + dict["Saturday Extra"]);
      }
      
      //OPTION COST
      if (saturday === "Yes - Option") {
            d.costOption = d.cost * dict["Saturday Extra"];
      } else {
            d.costOption = 0;
      }
      return d;
}
module.exports.rotoStater = function(bags) {
    return bags / 3600 + 0.001;
}
module.exports.costOfRotoStater = function() {
    costOfRotoStater = getValue("RotoStater", "Roto Stater", "Price")
}
module.exports.soundMatRolls = function(SF, soundMatType) {
    var dict = getValues("Prices_SoundMat", {"SM Type": soundMatType}, ["SF/Roll"]);
    return Math.ceil(SF / dict["SF/Roll"]);
}
module.exports.costOfSoundMat = function(SF, soundMatType) {
    var dict = getValues("Prices_SoundMat", {"SM Type": soundMatType}, ["Price/SF"]);
    return Math.ceil(SF * dict["Price/SF"]);
}
module.exports.soundMatLaborers = function(SF, overnight, soundMatMobilizations, soundMatType) {
      var dict;
      //CHECK IF SOUND MAT SF IS LESS THAN MINIMUM IN TABLE. IF SO, GET FROM THE SMALL TABLE
      dict = getValues("Labor_SoundMat_Minimum", {"Type": "Minimum"}, ["SF"]);
      if (SF <= dict.SF) {
            //GET FROM MINIMUM TABLE
            dict = getValuesBasedOnNum("Labor_SoundMat_Small", SF, ["Laborers"]);
            return dict.Laborers;
      } else {
            //IF OVERNIGHT, SOUND MAT LAB||ERS WILL DEPEND ON THE OVERNIGHT TABLE INSTEAD
            if (overnight === true) {
                  var smSFPerDay = SF / soundMatMobilizations;
                  dict = getValuesBasedOnNum("Labor_Overnight", smSFPerDay, ["1st Day SM"]);
                  return dict["1st Day SM"] * soundMatMobilizations;
            } else {
                  dict = getValues("Prices_SoundMat", {"SM Type": soundMatType}, ["SF/Roll"]);
                  
                  if (dict["SF/Roll"] <= 260) {
                         dict = getValues("Labor_SoundMat", {"Per Day": "Smaller Rolls"}, ["SF"]);
                  } else {
                        dict = getValues("Labor_SoundMat", {"Per Day": "Regular Rolls"}, ["SF"]);
                  }
                  
                  var laborers = SF / dict.SF;
                  var remainder = laborers - Round((laborers / 1) - 0.49)
                  
                  return remainder <= 0.38 ? Math.round(laborers) : Math.ceil(laborers);
            }
      } 
}
module.exports.costOfSoundMatLabor = function(laborers, wageType) {
      //1. GET PRICE/DAY F|| SOUND MAT LAB||
      var dict = getValues("Wage_" + wageType + "_SM", {"Laborer": "Average"}, ["Price/Day"]);
    
      //2. CALCULATE SOUND MAT LAB||
      return Math.ceil(dict["Price/Day"] * laborers);
}
module.exports.lFt = function(SF) {
      lFt = Math.ceil(SF * 0.31);
}

