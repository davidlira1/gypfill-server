const lb = require('../library.js');

module.exports.materialsAndCostsGyp = function(assem, dict, mixDesign, wageType, projectType, saturday) {
      var temp;
      //==========================================================================================
      //PERIMETER FOAM
      //==========================================================================================
      assem.perFoamRollType = lb.perFoamRollType(dict.soundMatType);
      assem.perFoamRolls = lb.perFoamRolls(assem.SF, dict.soundMatType);
      assem.costOfPerFoamRolls = lb.costOfPerFoamRolls(assem.perFoamRolls, dict.soundMatType);
      //==========================================================================================
      //STAPLES
      //==========================================================================================
      assem.stapleBoxes = lb.stapleBoxes(assem.SF);
      assem.costOfStapleBoxes = lb.costOfStapleBoxes(assem.stapleBoxes);
      //==========================================================================================
      //WHEN NO SOUND MAT
      //==========================================================================================
      if (dict.soundMatType === "") {
            //==========================================================================================
            //SPRAY GLUE
            //==========================================================================================
            lb.materialsAndCostsSprayGlue(assem);
            //==========================================================================================
            //DUCT TAPE WHEN NO SOUND MAT
            //==========================================================================================
            lb.materialsAndCostsDuctTapeRollsWhenNoSM(assem);
      }
      //==========================================================================================
      //GYPCRETE
      //==========================================================================================
      if (dict.gypType === "CMD") {
            //==========================================================================================
            //CMD BAGS
            //==========================================================================================
            assem.gypBagsFlutes = lb.gypBags(assem.SF, dict.gypType, dict.gypThickFlutes, mixDesign) / 2;
            if (dict.soundMatType !== "") {
                  //==========================================================================================
                  //IF SM, USE GYP SPECIFIED FOR ABOVE FLUTES
                  //==========================================================================================
                  assem.gypBagsAboveFlutes = lb.gypBags(assem.SF, dict.gypTypeAboveFlutes, dict.gypThick, mixDesign);
            } else {
                  //==========================================================================================
                  //IF NO SM, MUST USE CMD
                  //==========================================================================================
                  assem.gypBagsAboveFlutes = lb.gypBags(assem.SF, dict.gypType, dict.gypThick, mixDesign);
            }
            assem.gypBags = assem.gypBagsFlutes + assem.gypBagsAboveFlutes;
            assem.costOfGypBags = lb.costOfGypBags(dict.gypType, assem.gypBagsFlutes) + costOfGypBags(dict.gypType, assem.gypBagsAboveFlutes);
            //==========================================================================================
            //CMD PRIMER
            //==========================================================================================
            assem.CMDPrimerGallons = lb.primerGallons("gyp", "CMD Primer", assem.SF);
            assem.costOfCMDPrimerGallons = lb.costOfPrimerGallons("gyp", "CMD Primer", assem.SF);
      } else {
            //==========================================================================================
            //NOT CMD
            //==========================================================================================
            assem.gypBags = lb.gypBags(assem.SF, dict.gypType, dict.gypThick, mixDesign);
            assem.costOfGypBags = lb.costOfGypBags(dict.gypType, assem.gypBags);
      }
      //==========================================================================================
      //TONS
      //==========================================================================================
      if (dict.gypType === "CMD") {
            assem.tonsFlutes = lb.tons(dict.gypType, assem.gypBagsFlutes, mixDesign);
            assem.tonsAboveFlutes = lb.tons(dict.gypType, assem.gypBagsAboveFlutes, mixDesign);
            assem.tons = assem.tonsFlutes + assem.tonsAboveFlutes;
      } else {
            assem.tons = lb.tons(dict.gypType, assem.gypBags, mixDesign);
      }
      temp = lb.costOfTons(assem.tons, saturday);
      assem.costOfTons = temp.cost;
      assem.costOfTonsOption = temp.costOption;
      //==========================================================================================
      //SOUND MAT
      //==========================================================================================
      if (dict.soundMatType !== "") {
            assem.soundMatRolls = lb.soundMatRolls(assem.SF, dict.soundMatType);
            assem.costOfSoundMat = lb.costOfSoundMat(assem.SF, dict.soundMatType);

            //==========================================================================================
            //DUCT TAPE
            //==========================================================================================
            assem.ductTapeRolls = lb.ductTapeRolls(assem.SF);
            assem.costOfDuctTapeRolls = lb.costOfDuctTapeRolls(assem.ductTapeRolls);
      }
      //==========================================================================================
      //GYPRETE PRIMER IF NO SM && NO BP && NOT CMD
      //==========================================================================================
      if (dict.soundMatType === "" && dict.blackPaperType === "" && dict.gypType !== "CMD") {
            lb.materialsAndCostsPrimer("Gyp", assem, dict);
      }
      //==========================================================================================
      //WIRE
      //==========================================================================================
      if (dict.wireType !== "") {
            lb.materialsAndCostsWire(assem, dict, wageType);
      }
      //==========================================================================================
      //BLACK PAPER
      //==========================================================================================
      if (dict.blackPaperType !== "") {
            lb.materialsAndCostsBlackPaper(assem, dict);
      }

}
