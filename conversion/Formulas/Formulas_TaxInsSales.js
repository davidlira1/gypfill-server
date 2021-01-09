Function taxInsSalesCost(productionCost As Long, margin As Double, typeOfCost As String) As Long
      '1. GET THE PERCENTAGE FROM TABLE
      Dim dict As Dictionary: Set dict = getValues("Percents_TaxesAndIns", Array("Type"), Array(typeOfCost), Array("Percent"))
    
      '2. CALCULATE TOTAL COST AFTER MARGIN
      Dim totalCostAfterMargin As Long: totalCostAfterMargin = (productionCost / (100 - margin)) * 100
    
      '3. CALCULATE BUSINESS TAX COST
      taxInsSalesCost = totalCostAfterMargin * dict("Percent")
End Function
Function payrollTaxCost(laborCost As Long) As Long
    '1. GET THE PERCENTAGE FROM TABLE
    Dim dict As Dictionary: Set dict = getValues("Percents_TaxesAndIns", Array("Type"), Array("Payroll Tax"), Array("Percent"))
    
    '2. CALCULATE PAYROLL TAX
    payrollTaxCost = laborCost * dict("Percent")
End Function
