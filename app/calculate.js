var bigdecimal = require("bigdecimal");

/**
 * Main method
 */
var calculate = function(expr) {
  expr = expr.replace(/\s/g, "+").replace(/,/g, ".");
 
    var res = new bigdecimal.BigDecimal(eval(expr));
    // shame on me
    //if (res > 100000) return "31878018903828899277492024491376690701584023926880"
    return res.toString().replace(/\./g, ",");
}

exports.calculate = calculate;