var materialsAndCostsGyp = function(assem, dict, mixDesign, wageType, projectType, saturday) {
      var temp;
      //==========================================================================================
      //PERIMETER FOAM
      //==========================================================================================
      assem.perFoamRollType = perFoamRollType(dict.soundMatType)
      assem.perFoamRolls = perFoamRolls(assem.SF, dict.soundMatType)
      assem.costOfPerFoamRolls = costOfPerFoamRolls(assem.perFoamRolls, dict.soundMatType)
      //==========================================================================================
      //STAPLES
      //==========================================================================================
      assem.stapleBoxes = stapleBoxes(assem.SF)
      assem.costOfStapleBoxes = costOfStapleBoxes(assem.stapleBoxes)
      //==========================================================================================
      //WHEN NO SOUND MAT
      //==========================================================================================
      if (dict.soundMatType === "") {
            //==========================================================================================
            //SPRAY GLUE
            //==========================================================================================
            materialsAndCostsSprayGlue(assem);
            //==========================================================================================
            //DUCT TAPE WHEN NO SOUND MAT
            //==========================================================================================
            materialsAndCostsDuctTapeRollsWhenNoSM(assem);
      }
      //==========================================================================================
      //GYPCRETE
      //==========================================================================================
      if (dict.gypType === "CMD") {
            //==========================================================================================
            //CMD BAGS
            //==========================================================================================
            assem.gypBagsFlutes = gypBags(assem.SF, dict.gypType, dict.gypThickFlutes, mixDesign) / 2;
            if (dict.soundMatType !== "") {
                  //==========================================================================================
                  //IF SM, USE GYP SPECIFIED FOR ABOVE FLUTES
                  //==========================================================================================
                  assem.gypBagsAboveFlutes = gypBags(assem.SF, dict.gypTypeAboveFlutes, dict.gypThick, mixDesign);
            } else {
                  //==========================================================================================
                  //IF NO SM, MUST USE CMD
                  //==========================================================================================
                  assem.gypBagsAboveFlutes = gypBags(assem.SF, dict.gypType, dict.gypThick, mixDesign);
            }
            assem.gypBags = assem.gypBagsFlutes + assem.gypBagsAboveFlutes;
            assem.costOfGypBags = costOfGypBags(dict.gypType, assem.gypBagsFlutes) + costOfGypBags(dict.gypType, assem.gypBagsAboveFlutes);
            //==========================================================================================
            //CMD PRIMER
            //==========================================================================================
            assem.CMDPrimerGallons = primerGallons("gyp", "CMD Primer", assem.SF);
            assem.costOfCMDPrimerGallons = costOfPrimerGallons("gyp", "CMD Primer", assem.SF);
      } else {
            //==========================================================================================
            //NOT CMD
            //==========================================================================================
            assem.gypBags = gypBags(assem.SF, dict.gypType, dict.gypThick, mixDesign);
            assem.costOfGypBags = costOfGypBags(dict.gypType, assem.gypBags);
      }
      //==========================================================================================
      //TONS
      //==========================================================================================
      if (dict.gypType === "CMD") {
            assem.tonsFlutes = tons(dict.gypType, assem.gypBagsFlutes, mixDesign);
            assem.tonsAboveFlutes = tons(dict.gypType, assem.gypBagsAboveFlutes, mixDesign);
            assem.tons = assem.tonsFlutes + assem.tonsAboveFlutes;
      } else {
            assem.tons = tons(dict.gypType, assem.gypBags, mixDesign);
      }
      temp = costOfTons(assem.tons, saturday);
      assem.costOfTons = temp.cost;
      assem.costOfTonsOption = temp.costOption;
      //==========================================================================================
      //SOUND MAT
      //==========================================================================================
      if (dict.soundMatType !== "") {
            assem.soundMatRolls = soundMatRolls(assem.SF, dict.soundMatType);
            assem.costOfSoundMat = costOfSoundMat(assem.SF, dict.soundMatType);

            //==========================================================================================
            //DUCT TAPE
            //==========================================================================================
            assem.ductTapeRolls = ductTapeRolls(assem.SF);
            assem.costOfDuctTapeRolls = costOfDuctTapeRolls(assem.ductTapeRolls);
      }
      //==========================================================================================
      //GYPRETE PRIMER IF NO SM && NO BP && NOT CMD
      //==========================================================================================
      if (dict.soundMatType = "" && dict.blackPaperType === "" && dict.gypType !== "CMD") {
            materialsAndCostsPrimer("Gyp", assem, dict);
      }
      //==========================================================================================
      //WIRE
      //==========================================================================================
      if (dict.wireType !== "") {
            materialsAndCostsWire(assem, dict, wageType);
      }
      //==========================================================================================
      //BLACK PAPER
      //==========================================================================================
      if (dict.blackPaperType !== "") {
            materialsAndCostsBlackPaper(assem, dict);
      }

}
