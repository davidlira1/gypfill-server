var drivingTime = function(miles) {
    //ROUND TRIP TIME
    //AT 55mph
    drivingTime = (miles / 55) * 2
}
var setupTime = function(structureType) {
    var key
    if (structureType === "House") {
        key = "House Setup Time"
    } else {
        key = "Building Setup Time"
    }
    
    var dict = getValues("Time_Gyp", Array("Type Of Time"), Array[key], Array.Hr)
    setupTime = dict.Hr
}
var lunchTime = function() {
      var dict = getValues("Time_Gyp", Array("Type Of Time"), Array("Lunch Time"), Array.Hr)
      lunchTime = dict.Hr
}
var cleanupTime = function() {
    var dict = getValues("Time_Gyp", Array("Type Of Time"), Array("Cleanup Time"), Array.Hr)
    cleanupTime = dict.Hr
}
var pumpTime = function(bags) {
    pumpTime = {}
    
    var blastcreteHrs
    var super80Hrs
    var placerHrs
    
    var blastcreteMins
    var superMins
    var placerMins
    
    var dict
    
    dict = getValues("Equip_Gyp_Pumps", Array("Model-Num"), Array.D6528, Array("Bags/Hr"))
    //this will need to first divide total bags by mobilizations i think
    blastcreteHrs = bags / dict("Bags/Hr")
    
    dict = getValues("Equip_Gyp_Pumps", Array("Model-Num"), Array("Super-80"), Array("Bags/Hr"))
    super80Hrs = bags / dict("Bags/Hr")
    
    dict = getValues("Equip_Gyp_Pumps", Array("Model-Num"), Array.Placer, Array("Bags/Hr"))
    placerHrs = bags / dict("Bags/Hr")
    
    pumpTime.D6528 = blastcreteHrs
    pumpTime.Super-80 = super80Hrs
    pumpTime.Placer = placerHrs
    
}
var concPumpTime = function(yds, section) {
      var dict = getValues("Conc_YdsPerHr", Array.Section, Array[section], Array("Yds/Hr"))
      concPumpTime = yds / dict("Yds/Hr")
}

var totalGypTime = function(setupTime, pumpTime, cleanupTime) {
    totalGypTime = setupTime + pumpTime + cleanupTime
}
var overTimeGyp = function(totalGypTime) {
      if (totalGypTime - 7.5 < 0) {
            overTimeGyp = 0
      } else {
            overTimeGyp = totalGypTime - 7.5
      }
}
var hoursToPhrase = function(totalHrs) {
      var hrs
      var mins
      hrs = Round((totalHrs / 1) - 0.49)
      mins = Round(((totalHrs - hrs) * 60) + 0.49)
    
      hoursToPhrase = hrs + "h," + mins + "m"
}



