var FINAL = {};

/**
 * Main method
 */
var optimize = function(data) {
  FINAL = {gain: 0, path: []};
  var flies = JSON.parse(data);
  
  // Array of object {gain: x, path: [a, b], pathValues: [[0, 2], [3, 6]]}
  var previous = [];
  
  for (i in flies) {
    var fly = flies[i];
    
    // Check compatibility with all previous combination
    previous.forEach(function(prev) {
      // We check if the path is correct
      if (!fitInPath(fly, prev)) {
        return;
      }

      // Still okay, so we create a new combination
      var newComb = {gain: prev.gain + fly.PRIX, path: prev.path.clone(), pathValues: prev.pathValues.clone()};
      newComb.path.push(fly.VOL);
      newComb.pathValues.push([fly.DEPART, fly.DEPART + fly.DUREE]);
      previous.push(newComb);

      // We check if the new solution is the new best
      checkFinal(newComb);
    });
    
    // We add the new possibility with this fly alone
    var alone = {gain: fly.PRIX, path: [fly.VOL], pathValues: [[fly.DEPART, fly.DEPART + fly.DUREE]]};
    previous.push(alone);
    checkFinal(alone);
  }

  return JSON.stringify(FINAL);
}

/**
 * Check if the fly can be inserted in the current combination
 */
var fitInPath = function(fly, prev) {
  var duration = [fly.DEPART, fly.DEPART + fly.DUREE];

  // Return false if we find a value that is already in the fly interval
  return !prev.pathValues.some(function(interval) {
    return intersection(duration, interval);
  });
}

/**
 * Check and update the best combination
 */
var checkFinal = function(comb) {
  if (comb.gain > FINAL.gain) {
    FINAL.gain = comb.gain;
    FINAL.path = comb.path;
  }
}

/**
 * Find if two array have an intersection
 */
var intersection = function(a, b) {
  return (a[0] >= b[0] && a[0] < b[1]) ||	(a[1] > b[0] && a[1] <= b[1]) || (a[0] <= b[0] && a[1] >= b[1]);
}

Object.prototype.clone = function() {
  var newObj = (this instanceof Array) ? [] : {};
  for (i in this) {
    if (i == 'clone') continue;
    if (this[i] && typeof this[i] == "object") {
      newObj[i] = this[i].clone();
    } else newObj[i] = this[i]
  }
  return newObj;
};

exports.optimize = optimize;