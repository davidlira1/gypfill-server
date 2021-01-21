var drivingTime = function(miles) {
    //ROUND TRIP TIME
    //AT 55mph
    return (miles / 55) * 2;
}
var setupTime = function(structureType) {
    var key = structureType === "House" ? "House Setup Time" : "Building Setup Time";

    var dict = getValues("Time_Gyp", {"Type Of Time": key}, ["Hr"]);
    return dict.Hr;
}
var lunchTime = function() {
      var dict = getValues("Time_Gyp", {"Type Of Time": "Lunch Time"}, ["Hr"]);
      return dict.Hr
}
var cleanupTime = function() {
    var dict = getValues("Time_Gyp", {"Type Of Time": "Cleanup Time"}, ["Hr"]);
    return dict.Hr;
}
var pumpTime = function(bags) {

    var dict = getValues("Equip_Gyp_Pumps", {"Model-Num": "D6528"}, ["Bags/Hr"]);
    var blastcreteHrs = bags / dict["Bags/Hr"];
    
    dict = getValues("Equip_Gyp_Pumps", {"Model-Num": "Super-80"}, ["Bags/Hr"]);
    var super80Hrs = bags / dict["Bags/Hr"];
    
    dict = getValues("Equip_Gyp_Pumps", {"Model-Num": "Placer"}, ["Bags/Hr"]);
    var placerHrs = bags / dict["Bags/Hr"];
    
    return {
        "D6528": blastcreteHrs,
        "Super-80": super80Hrs,
        "Placer": placerHrs
    }  
}
var concPumpTime = function(yds, section) {
      var dict = getValues("Conc_YdsPerHr", {"Section": section}, ["Yds/Hr"]);
      return yds / dict["Yds/Hr"];
}
var totalGypTime = function(setupTime, pumpTime, cleanupTime) {
    return setupTime + pumpTime + cleanupTime;
}
var overTimeGyp = function(totalGypTime) {
      return totalGypTime - 7.5 < 0 ? 0 : totalGypTime - 7.5;
}
var hoursToPhrase = function(totalHrs) {
      var hrs = Math.floor(totalHrs / 1);
      var mins = Math.ceil(((totalHrs - hrs) * 60));
    
      return hrs + "h," + mins + "m";
}



