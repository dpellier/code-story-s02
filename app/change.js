var FOO = {name: "foo", value:1},
    BAR = {name: "bar", value:7},
    QIX = {name: "qix", value:11},
    BAZ = {name: "baz", value:21};
    
// We don't declare FOO cause we don't need to decompose it, it's value is equal to the initial value
var coins = [BAZ, QIX, BAR];
var response = [];

String.prototype.trim = function() { return this.replace(/^\s+|\s+$/g, ''); };

/**
 * Main method
 */
var changeMonade = function(initialValue) {
  response = [];
  for (var i=0; i < coins.length; i++) {
    decomposeRoot(coins[i], initialValue, i);
  }
  
  // Add minimal response, the value itself
  addResponse(colon(FOO.name, initialValue));
  
  return "[" + response.toString() + "]";
}

/**
 * Initiate the search with the biggest coin
 */
var decomposeRoot = function(coin, initialValue, idx) {
  var scale = coin.value;
  while (initialValue >= scale) {
    var mod = initialValue - scale,
        coinNb = scale/coin.value;

    // Add response with the biggest coin and some foo
    addResponse(associate(colon(coin.name, coinNb), colon(FOO.name, mod)));
  
    // Check each lesser coin combination
    for (var i=idx+1; i < coins.length; i++) {
      addResults(coin.name, coinNb, decompose(coins[i], mod, idx));
    }
    
    scale += coin.value;
  }
}

/**
 * Find all combination with a lesser coin
 */
var decompose = function(coin, mod, idx) {
  var scale = coin.value;
  var result = [];
  
  while(mod >= scale) {
    var newMod = mod - scale;
    
    if (newMod >= 0) {
      result.push(associate(colon(coin.name, scale/coin.value), colon(FOO.name, newMod)));
    }
    
    // Check each lesser coin combination
    for (var i=idx+1; i < coins.length; i++) {
      var less = decompose(coins[i], newMod, i);
      for (l in less) {
        result.push(associate(colon(coin.name, scale/coin.value), less[l]));
      }
    }
    
    scale += coin.value;
  }
  return result;
}

var addResults = function(rootName, rootValue, results) {
  for (idx in results) {
    addResponse(associate(colon(rootName, rootValue), results[idx]));
  }
}

var addResponse = function(res) {
  response.push("{" + res + "}");
}

var colon = function(name, value) {
  return value > 0 ? name + ":" + value : "";
}

var associate = function(left, right) {
  if (right.trim() == "") return left;
  if (left.trim() == "") return right;
  return left + ", " + right;
}


exports.changeMonade = changeMonade;