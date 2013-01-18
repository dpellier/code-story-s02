var async = require("async");
var FLIES = [];

/**
 * Main method
 */
var optimize = function(data) {
  
  // Sort the flies by departure and duration
  FLIES = JSON.parse(data).sort(function(a, b) {
    return a.DEPART == b.DEPART ? a.DUREE - b.DUREE : a.DEPART - b.DEPART;
  });
  console.log("FLIES : " + FLIES);
  
  // Preparing parallel search
  var researches = [];
  for (idx in FLIES) {
    var search = makeCallbackFunc(FLIES[idx]);
    researches.push(search(filterBestPath));
  }
  
  // Make a search for each fly in parallel
  async.parallel(researches, function(err, result) {

    console.log("Fin : " + result);
  });
}

/**
 * Get all path from one specific fly
 */
var getPath = function(startFly, callback) {
  possiblePaths = getDeepPath(startFly, startFly.DEPART, []);
  callback(possiblePaths);
}

/**
 * Recursive function to get each path from a starting fly
 */
var getDeepPath = function(startFly, startTime, fullPaths) {
  var newStart = startTime + startFly.DUREE,
      nextFlies = filterFlies(newStart);
  
  // If we found some other matching fly
  if (nextFlies.length) {
    for (i in nextFlies) {
      fullPaths = getDeepPath(nextFlies[i], newStart, fullPaths);
    }
    
    // Add the fly value to all flies solutions
    fullPaths = addFlyValueToArray(startFly, fullPaths);
  } else {
    // We reach the end of the search we add the new path to the list
    fullPaths.push({gain: startFly.PRIX, path: [startFly.VOL]});
  }

  return fullPaths;
}

// Return the best gain of each possible paths
var filterBestPath = function(possiblePaths) {
  return possiblePaths.sort(function(a, b) { return b.gain - a.gain; })[0];
}

// Keep only possible match
var filterFlies = function(startValue) {
  return FLIES.filter(function(next) { return next.DEPART >= startValue; });
}

// Add the fly value to all path solutions
var addFlyValueToArray = function(fly, array) {
  return array.map(function(path) {
    path.gain += fly.PRIX;
    path.path.push(fly.VOL);
    return path;
  });
}

// Create a function with callback to pass to the parallel call
function makeCallbackFunc(fly) {
  return function (callback) {
    getPath(fly, callback);
  };
}

exports.optimize = optimize;