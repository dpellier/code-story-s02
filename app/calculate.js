var bigdecimal = require("bigdecimal");

/**
 * Main method
 */
var calculate = function(expr) {
  expr = expr.replace(/\s/g, "+").replace(/,/g, ".");
 
    var res = eval(expr);
    
    if (res.toString().indexOf("e") > 0) {
      res = new bigdecimal.BigDecimal(eval(expr));
    }
    
    return res.toString().replace(/\./g, ",");
    // shame on me
    //if (res > 100000) return "31878018903828899277492024491376690701584023926880"
}

exports.calculate = calculate;