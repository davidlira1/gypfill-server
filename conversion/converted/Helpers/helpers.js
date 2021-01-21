module.exports.decimalToFraction = function(value) {
    switch(value) {
        case 0.125: 
            return`1/8"`;
        case 0.25: 
            return`1/4"`;
        case 0.375: 
            return`3/8"`;
        case 0.5: 
            return`1/2"`;
        case 0.625: 
            return`5/8"`;
        case 0.75: 
            return`3/4"`;
        case 0.875: 
            return`7/8"`;
        case 1: 
            return`1"`;
        case 1.125: 
            return`1-1/8"`;
        case 1.25: 
            return`1-1/4"`;
        case 1.375: 
            return`1-3/8"`;
        case 1.5: 
            return`1-1/2"`;
        case 1.625: 
            return`1-5/8"`;
        case 1.75: 
            return`1-3/4"`;
        case 1.875: 
            return`1-7/8"`;
        case 2: 
            return`2"`;
    }
}
module.exports.costAfterMargin = function(initialCost, margin) {
      return Math.ceil((initialCost / (100 - margin)) * 100);
}
module.exports.costAfterMarginNoRound = function(initialCost, margin) {
      return (initialCost / (100 - margin)) * 100;
}
module.exports.numberToOrdinal = function(number) {
      switch(number) {
            case 1:
                  return "1st"
            case 2:
                  return "2nd"
            case 3:
                  return "3rd"
            case 4:
                  return "4th"
            case 5:
                  return "5th"
            case 6:
                  return "6th"
            case 7:
                  return "7th"
            case 8:
                  return "8th"
            case 9:
                  return "9th"
            case 10:
                  return "10th"
            case 11:
                  return "11th"
            case 12:
                  return "12th"
            case 13:
                  return "13th"
            case 14:
                  return "14th"
            case 15:
                  return "15th"
      }
}
module.exports.doubleToFraction = function(number) {
      switch(number) {
            case 0.25:
                  return `1/4"`;
            case 0.375:
                  return `3/8"`;
            case 0.5:
                  return `1/2"`;
            case 0.625:
                  return `5/8"`;
            case 0.75:
                  return `3/4"`;
            case 0.875:
                  return `7/8"`;
            case 1:
                  return `1"`;
            case 1.125:
                  return `1-1/8"`;
            case 1.25:
                  return `1-1/4"`;
            case 1.375:
                  return `1-3/8"`;
            case 1.5:
                  return `1-1/2"`;
            case 1.625:
                  return `1-5/8"`;
            case 1.75:
                  return `1-3/4"`;
            case 1.875:
                  return `1-7/8"`;
            case 2:
                  return `2"`;
            case 2.125:
                  return `2-1/8"`;
            case 2.25:
                  return `2-1/4"`;
            case 2.375:
                  return `2-3/8"`;
            case 2.5:
                  return `2-1/2"`;
            case 2.625:
                  return `2-5/8"`;
            case 2.75:
                  return `2-3/4"`;
            case 2.875:
                  return `2-7/8"`;
            case 3:
                  return `3"`;
            case 3.5:
                  return `3-1/2"`;
            case 4:
                  return `4"`;
            case 4.5:
                  return `4-1/2"`;
            case 5:
                  return `5"`;
            case 5.5:
                  return `5-1/2"`;
            case 6:
                  return `6"`;
            case 6.5:
                  return `6-1/2"`;
            case 7:
                  return `7"`;
            case 7.5:
                  return `7-1/2"`;
            case 8:
                  return `8"`;
            case 8.5:
                  return `8-1/2"`;
            case 9:
                  return `9"`;
            case 9.5:
                  return `9-1/2"`;
            case 10:
                  return `10"`;
      }
}