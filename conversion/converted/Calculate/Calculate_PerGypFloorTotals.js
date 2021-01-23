const lb = require('../library.js');

module.exports.calculatePerGypFloorTotals = function(estimate) {
      //1. SETTinG THE DICTIONARY
      var totalsPerGypFloor = {};
      
      //2. SETTinG THE GYP ASSEMBLIES DICTIONARY
      var gypAssemblies = estimate.structures.structure1.gypAssemblies;
      
      
      for (var gypAssem in gypAssemblies) {
            for (var Floor in gypAssemblies[gypAssem].floors) {
                  //1. IF THE FLOOR ISN//T in THE TOTALS_BY_GYP_FLOOR DICT
                  if (totalsPerGypFloor[Floor] === undefined) {
                        totalsPerGypFloor[Floor] = {};
                  }
                  
                  //2. ADD THE COST OF GYP BAGS AT THIS ASSEMBLY AT THIS FLOOR
                  totalsPerGypFloor[Floor].costOfGypBags = lb.sum([totalsPerGypFloor[Floor].costOfGypBags, gypAssemblies[gypAssem].floors[Floor].costOfGypBags]);
                  
                  //3. ADD THE COST OF TONS  AT THIS ASSEMBLY AT THIS FLOOR
                  totalsPerGypFloor[Floor].costOfTons = lb.sum([totalsPerGypFloor[Floor].costOfTons ,gypAssemblies[gypAssem].floors[Floor].costOfTons]);
            }
      }
      return totalsPerGypFloor;
}

