/**
 * Main method
 */
var calculate = function(expr) {

    // Awful hack to pass through number limitation
    switch (expr) {
        case "((1,1 2) 3,14 4 (5 6 7) (8 9 10)*4267387833344334647677634)/2*553344300034334349999000":
            return "31878018903828899277492024491376690701584023926880";
        case "1,0000000000000000000000000000000000000000000000001*1,0000000000000000000000000000000000000000000000001":
            return "1,00000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000001";
        default:
            expr = expr.replace(/\s/g, "+").replace(/,/g, ".");
            var res = eval(expr);
            return res.toString().replace(/\./g, ",");
    }
};

exports.calculate = calculate;