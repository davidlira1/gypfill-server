module.exports.calcGyp = require('./Calculate/Calculate.js').calcGyp;
module.exports.materialsAndCostsPrimer = require('./Calculate/Calculate.js').materialsAndCostsPrimer;
module.exports.materialsAndCostsWire = require('./Calculate/Calculate.js').materialsAndCostsWire;
module.exports.laborAndCostsWire = require('./Calculate/Calculate.js').laborAndCostsWire;
module.exports.materialsAndCostsBlackPaper = require('./Calculate/Calculate.js').materialsAndCostsBlackPaper;
module.exports.materialsAndCostsBlackPaperMoistStop = require('./Calculate/Calculate.js').materialsAndCostsBlackPaperMoistStop;
module.exports.materialsAndCostsSprayGlue = require('./Calculate/Calculate.js').materialsAndCostsSprayGlue;
module.exports.materialsAndCostsDuctTapeRollsWhenNoSM = require('./Calculate/Calculate.js').materialsAndCostsDuctTapeRollsWhenNoSM;
module.exports.materialsAndCostsSealer = require('./Calculate/Calculate.js').materialsAndCostsSealer;
module.exports.materialsAndCostsRamboard = require('./Calculate/Calculate.js').materialsAndCostsRamboard;
module.exports.calculateConcAssembly = require('./Calculate/Calculate_ConcAssembly.js').calculateConcAssembly;
module.exports.calculateEquip = require('./Calculate/Calculate_Equip.js').calculateEquip;
module.exports.equipCostsConc = require('./Calculate/Calculate_Equip.js').equipCostsConc;
module.exports.concPumpCost = require('./Calculate/Calculate_Equip.js').concPumpCost;
module.exports.calculateGypAssembly = require('./Calculate/Calculate_GypAssembly.js').calculateGypAssembly;
module.exports.calculateOptionals = require('./Calculate/Calculate_Optionals.js').calculateOptionals;
module.exports.compareRegToOptGyp = require('./Calculate/Calculate_Optionals.js').compareRegToOptGyp;
module.exports.compareRegToOptConc = require('./Calculate/Calculate_Optionals.js').compareRegToOptConc;
module.exports.exteriorScopeStr = require('./Calculate/Calculate_Optionals.js').exteriorScopeStr;
module.exports.calculatePerGypFloorTotals = require('./Calculate/Calculate_PerGypFloorTotals.js').calculatePerGypFloorTotals;
module.exports.calculateSOV = require('./Calculate/Calculate_SOV.js').calculateSOV;
module.exports.calculateSOVMulti = require('./Calculate/Calculate_SOV.js').calculateSOVMulti;
module.exports.calculateTrucks = require('./Calculate/Calculate_Trucks.js').calculateTrucks;
module.exports.calculateTrucksConc = require('./Calculate/Calculate_Trucks.js').calculateTrucksConc;
module.exports.costOfADURegLabor = require('./Formulas/Formulas_ADURegulation.js').costOfADURegLabor;
module.exports.blackPaperRolls = require('./Formulas/Formulas_BlackPaperAndMoistStop.js').blackPaperRolls;
module.exports.blackPaperRollsMoistStop = require('./Formulas/Formulas_BlackPaperAndMoistStop.js').blackPaperRollsMoistStop;
module.exports.costOfBlackPaperRolls = require('./Formulas/Formulas_BlackPaperAndMoistStop.js').costOfBlackPaperRolls;
module.exports.blackPaperLaborers = require('./Formulas/Formulas_BlackPaperAndMoistStop.js').blackPaperLaborers;
module.exports.costOfBlackPaperLaborers = require('./Formulas/Formulas_BlackPaperAndMoistStop.js').costOfBlackPaperLaborers;
module.exports.blackPaperMoistStopLaborers = require('./Formulas/Formulas_BlackPaperAndMoistStop.js').blackPaperMoistStopLaborers;
module.exports.concYds = require('./Formulas/Formulas_Concrete.js').concYds;
module.exports.costOfConcYds = require('./Formulas/Formulas_Concrete.js').costOfConcYds;
module.exports.concShortLoad = require('./Formulas/Formulas_Concrete.js').concShortLoad;
module.exports.costOfConcShortLoad = require('./Formulas/Formulas_Concrete.js').costOfConcShortLoad;
module.exports.concTrucks = require('./Formulas/Formulas_Concrete.js').concTrucks;
module.exports.costOfEnvironmental = require('./Formulas/Formulas_Concrete.js').costOfEnvironmental;
module.exports.costOfEnergy = require('./Formulas/Formulas_Concrete.js').costOfEnergy;
module.exports.costOfWashOut = require('./Formulas/Formulas_Concrete.js').costOfWashOut;
module.exports.costOfDownTime = require('./Formulas/Formulas_Concrete.js').costOfDownTime;
module.exports.costOfTracker = require('./Formulas/Formulas_Concrete.js').costOfTracker;
module.exports.concMobilizations = require('./Formulas/Formulas_Concrete.js').concMobilizations;
module.exports.concLaborers = require('./Formulas/Formulas_Concrete.js').concLaborers;
module.exports.costOfConcLaborers = require('./Formulas/Formulas_Concrete.js').costOfConcLaborers;
module.exports.costOfOvertimeConcLaborers = require('./Formulas/Formulas_Concrete.js').costOfOvertimeConcLaborers;
module.exports.distance = require('./Formulas/Formulas_Distance.js').distance;
module.exports.milesToLocation = require('./Formulas/Formulas_Distance.js').milesToLocation;
module.exports.ductTapeRolls = require('./Formulas/Formulas_DuctTape.js').ductTapeRolls;
module.exports.ductTapeRollsWhenNoSM = require('./Formulas/Formulas_DuctTape.js').ductTapeRollsWhenNoSM;
module.exports.costOfDuctTapeRolls = require('./Formulas/Formulas_DuctTape.js').costOfDuctTapeRolls;
module.exports.drivingFuelsCost = require('./Formulas/Formulas_Fuel.js').drivingFuelsCost;
module.exports.drivingFuelCost = require('./Formulas/Formulas_Fuel.js').drivingFuelCost;
module.exports.machinesFuelCost = require('./Formulas/Formulas_Fuel.js').machinesFuelCost;
module.exports.machineFuelCost = require('./Formulas/Formulas_Fuel.js').machineFuelCost;
module.exports.gypBags = require('./Formulas/Formulas_GypAssembly.js').gypBags;
module.exports.costOfGypBags = require('./Formulas/Formulas_GypAssembly.js').costOfGypBags;
module.exports.tons = require('./Formulas/Formulas_GypAssembly.js').tons;
module.exports.costOfTons = require('./Formulas/Formulas_GypAssembly.js').costOfTons;
module.exports.rotoStater = require('./Formulas/Formulas_GypAssembly.js').rotoStater;
module.exports.costOfRotoStater = require('./Formulas/Formulas_GypAssembly.js').costOfRotoStater;
module.exports.soundMatRolls = require('./Formulas/Formulas_GypAssembly.js').soundMatRolls;
module.exports.costOfSoundMat = require('./Formulas/Formulas_GypAssembly.js').costOfSoundMat;
module.exports.soundMatLaborers = require('./Formulas/Formulas_GypAssembly.js').soundMatLaborers;
module.exports.costOfSoundMatLabor = require('./Formulas/Formulas_GypAssembly.js').costOfSoundMatLabor;
module.exports.lFt = require('./Formulas/Formulas_GypAssembly.js').lFt;
module.exports.gypLabor = require('./Formulas/Formulas_Labor.js').gypLabor;
module.exports.gypMobilizations = require('./Formulas/Formulas_Labor.js').gypMobilizations;
module.exports.addMobilsCost = require('./Formulas/Formulas_Labor.js').addMobilsCost;
module.exports.costOfGypLabor = require('./Formulas/Formulas_Labor.js').costOfGypLabor;
module.exports.overTimeGypLabor = require('./Formulas/Formulas_Labor.js').overTimeGypLabor;
module.exports.costOfOverTimeGypLaborHelper = require('./Formulas/Formulas_Labor.js').costOfOverTimeGypLaborHelper;
module.exports.costOfOverTimeSoundMatLabor = require('./Formulas/Formulas_Labor.js').costOfOverTimeSoundMatLabor;
module.exports.overTimeRate = require('./Formulas/Formulas_Labor.js').overTimeRate;
module.exports.trucksMaintCost = require('./Formulas/Formulas_Maint.js').trucksMaintCost;
module.exports.machinesMaintCost = require('./Formulas/Formulas_Maint.js').machinesMaintCost;
module.exports.machineMaintCost = require('./Formulas/Formulas_Maint.js').machineMaintCost;
module.exports.maximizerBags = require('./Formulas/Formulas_Maximizer.js').maximizerBags;
module.exports.costOfMaximizerBags = require('./Formulas/Formulas_Maximizer.js').costOfMaximizerBags;
module.exports.maximizerLaborers = require('./Formulas/Formulas_Maximizer.js').maximizerLaborers;
module.exports.costOfMaximizerLaborers = require('./Formulas/Formulas_Maximizer.js').costOfMaximizerLaborers;
module.exports.perFoamRollType = require('./Formulas/Formulas_Prep.js').perFoamRollType;
module.exports.perFoamRolls = require('./Formulas/Formulas_Prep.js').perFoamRolls;
module.exports.costOfPerFoamRolls = require('./Formulas/Formulas_Prep.js').costOfPerFoamRolls;
module.exports.perFoamCuttingLaborers = require('./Formulas/Formulas_Prep.js').perFoamCuttingLaborers;
module.exports.costOfPerFoamCutting = require('./Formulas/Formulas_Prep.js').costOfPerFoamCutting;
module.exports.stapleBoxes = require('./Formulas/Formulas_Prep.js').stapleBoxes;
module.exports.costOfStapleBoxes = require('./Formulas/Formulas_Prep.js').costOfStapleBoxes;
module.exports.cansOfSprayGlue = require('./Formulas/Formulas_Prep.js').cansOfSprayGlue;
module.exports.costOfCansOfSprayGlue = require('./Formulas/Formulas_Prep.js').costOfCansOfSprayGlue;
module.exports.prePourMobilizations = require('./Formulas/Formulas_PrePours.js').prePourMobilizations;
module.exports.prePourLaborCrew = require('./Formulas/Formulas_PrePours.js').prePourLaborCrew;
module.exports.costOfPrePoursLabor = require('./Formulas/Formulas_PrePours.js').costOfPrePoursLabor;
module.exports.costOfOverTimePrePours = require('./Formulas/Formulas_PrePours.js').costOfOverTimePrePours;
module.exports.primerGallons = require('./Formulas/Formulas_PrimerAndSealer.js').primerGallons;
module.exports.costOfPrimerGallons = require('./Formulas/Formulas_PrimerAndSealer.js').costOfPrimerGallons;
module.exports.sealerGallons = require('./Formulas/Formulas_PrimerAndSealer.js').sealerGallons;
module.exports.costOfSealerGallons = require('./Formulas/Formulas_PrimerAndSealer.js').costOfSealerGallons;
module.exports.ramBoardRolls = require('./Formulas/Formulas_Ramboard.js').ramBoardRolls;
module.exports.costOfRamBoardRolls = require('./Formulas/Formulas_Ramboard.js').costOfRamBoardRolls;
module.exports.ductTapeRollsForRamBoard = require('./Formulas/Formulas_Ramboard.js').ductTapeRollsForRamBoard;
module.exports.rotoStaterCost = require('./Formulas/Formulas_RotoStater.js').rotoStaterCost;
module.exports.stringLineRolls = require('./Formulas/Formulas_StringLine.js').stringLineRolls;
module.exports.costOfStringLineRolls = require('./Formulas/Formulas_StringLine.js').costOfStringLineRolls;
module.exports.drivingTime = require('./Formulas/Formulas_Time.js').drivingTime;
module.exports.setupTime = require('./Formulas/Formulas_Time.js').setupTime;
module.exports.lunchTime = require('./Formulas/Formulas_Time.js').lunchTime;
module.exports.cleanupTime = require('./Formulas/Formulas_Time.js').cleanupTime;
module.exports.pumpTime = require('./Formulas/Formulas_Time.js').pumpTime;
module.exports.concPumpTime = require('./Formulas/Formulas_Time.js').concPumpTime;
module.exports.totalGypTime = require('./Formulas/Formulas_Time.js').totalGypTime;
module.exports.overTimeGyp = require('./Formulas/Formulas_Time.js').overTimeGyp;
module.exports.hoursToPhrase = require('./Formulas/Formulas_Time.js').hoursToPhrase;
module.exports.wireUnits = require('./Formulas/Formulas_Wire.js').wireUnits;
module.exports.costOfWireUnits = require('./Formulas/Formulas_Wire.js').costOfWireUnits;
module.exports.pinBoxes = require('./Formulas/Formulas_Wire.js').pinBoxes;
module.exports.costOfPinBoxes = require('./Formulas/Formulas_Wire.js').costOfPinBoxes;
module.exports.washerBoxes = require('./Formulas/Formulas_Wire.js').washerBoxes;
module.exports.costOfWasherBoxes = require('./Formulas/Formulas_Wire.js').costOfWasherBoxes;
module.exports.wireLaborers = require('./Formulas/Formulas_Wire.js').wireLaborers;
module.exports.costOfWireLaborers = require('./Formulas/Formulas_Wire.js').costOfWireLaborers;
module.exports.decimalToFraction = require('./Helpers/helpers.js').decimalToFraction;
module.exports.costAfterMargin = require('./Helpers/helpers.js').costAfterMargin;
module.exports.costAfterMarginNoRound = require('./Helpers/helpers.js').costAfterMarginNoRound;
module.exports.numberToOrdinal = require('./Helpers/helpers.js').numberToOrdinal;
module.exports.doubleToFraction = require('./Helpers/helpers.js').doubleToFraction;
module.exports.sum = require('./Helpers/helpers.js').sum;
module.exports.rndDec = require('./Helpers/helpers.js').rndDec;
module.exports.laborAndCostsConc = require('./Labor/LaborAndCosts_Conc.js').laborAndCostsConc;
module.exports.laborAndCostsGyp = require('./Labor/LaborAndCosts_Gyp.js').laborAndCostsGyp;
module.exports.materialsAndCostsConc = require('./MaterialsAndCosts/MaterialsAndCosts_Conc.js').materialsAndCostsConc;
module.exports.materialsAndCostsGyp = require('./MaterialsAndCosts/MaterialsAndCosts_Gyp.js').materialsAndCostsGyp;
module.exports.getFormulaTables = require('./formulaTables.js').getFormulaTables;
module.exports.getValues = require('./formulaTables.js').getValues;
module.exports.getValuesBasedOnNum = require('./formulaTables.js').getValuesBasedOnNum;

// const fs = require('fs');

// fs.readdirSync('./conversion/converted').forEach(dir => {
//     try {
//         //loop thru each file in specific directory
//         fs.readdirSync(`./conversion/converted/${dir}`).forEach(file => {
//             //1. read file, 
//             var fileData = fs.readFileSync(`./conversion/converted/${dir}/${file}`, 'utf8')
//             fileData = fileData.replace(/getValues/g, "lb.getValues");
//             fileData = fileData.replace(/getValuesBasedOnNum/g, "lb.getValuesBasedOnNum");
//             fs.writeFileSync(`./conversion/converted/${dir}/${file}`, fileData);
//         })
//     } catch(error) {

//     }
// })

