var calculateTaxAndIns = function(estimate) {
    //==========================================================================================
    //TAX AND INSURANCE
    //==========================================================================================
    //1. GENERAL LIABILITY INSURANCE
    estimate.taxAndIns.gypGenLiabInsMarket = genLiabInsCost((estimate.totals.totalGypProductionCost), (estimate.finalPrices.gypMarginMarket))
    estimate.taxAndIns.gypGenLiabIns = genLiabInsCost((estimate.totals.totalGypProductionCost), (estimate.finalPrices.gypMargin))
    
    
    //2. CITY BUSINESS TAX
    estimate.taxAndIns.gypCityBusTaxMarket = cityBusTaxCost((estimate.totals.totalGypProductionCost), (estimate.finalPrices.gypMarginMarket))
    estimate.taxAndIns.gypCityBusTax = cityBusTaxCost((estimate.totals.totalGypProductionCost), (estimate.finalPrices.gypMargin))
    
    
    //3. TOTALS FOR GYPCRETE AND CONCRETE
    estimate.totals.totalGypTaxAndInsMarket = estimate.taxAndIns.gypGenLiabInsMarket + estimate.taxAndIns.gypCityBusTaxMarket
    estimate.totals.totalGypTaxAndIns = estimate.taxAndIns.gypGenLiabIns + estimate.taxAndIns.gypCityBusTax
    estimate.totals.totalConcTaxAndInsMarket = estimate.taxAndIns.concGenLiabInsMarket + estimate.taxAndIns.concCityBusTaxMarket
    estimate.totals.totalConcTaxAndIns = estimate.taxAndIns.concGenLiabIns + estimate.taxAndIns.concCityBusTax
    }
    var calculateTaxInsSalesConc = function(assem) {
    //1. MAKE "TAX AND INS" OBJECT INSIDE OF ASSEM
    assem.taxInsSales = {}
    
    //2. CITY BUSINESS TAX
    assem.taxInsSales.cityBusTaxCost = taxInsSalesCost(assem.productionCost, assem.margin, "City Business Tax")
    
    //3. GENERAL LIABILITY INSURANCE
    assem.taxInsSales.genLiabInsCost = taxInsSalesCost(assem.productionCost, assem.margin, "General Liability Insurance")
    
    //4. SALES COST
    assem.taxInsSales.salesCost = taxInsSalesCost(assem.productionCost, assem.margin, "Sales Commission")
    
    //6. TOTALS FOR GYPCRETE AND CONCRETE
    //estimate.totals.totalConcTaxAndIns = estimate.taxAndIns.concGenLiabIns + estimate.taxAndIns.concCityBusTax
    }
    