/**
 * Main method
 */
var calculate = function(expr) {
  expr = expr.replace(/\s/g, "+").replace(/,/g, ".");
  
  if (!/[^0-9\+\-\*\/\(\)\s\.]/g.test(expr)) {
    return eval(expr).toString().replace(/\./g, ",");
  }

  // We transform the expression to a postfix expression, easier to resolve;
  //return resolvePostfix(infixToPostfix(formula.replace(/\s/g, "+"))).toString().replace(/\./g, ",");
}

/**
 * Transform an infix expression to a postfix expression
 */
var infixToPostfix = function(infixStr) {
  var postfixStr = new Array(),
      stackArr = new Array(),
      postfixPtr = 0;
  infixStr = infixStr.split('');
  
  for (var i=0; i < infixStr.length; i++) {
    if (isOperand(infixStr[i])) {
      postfixStr[postfixPtr] = infixStr[i];
      postfixPtr++;
    } else {
      postfixStr[postfixPtr] = " ";
      postfixPtr++;
      
      while ((!isEmpty(stackArr)) && (prcd(topStack(stackArr),infixStr[i]))) {
        postfixStr[postfixPtr] = topStack(stackArr);
        pop_stack(stackArr);
        postfixPtr++;
        
        postfixStr[postfixPtr] = " ";
        postfixPtr++;
      }
      
      if ((!isEmpty(stackArr)) && (infixStr[i] == ")")) {
        pop_stack(stackArr);
      } else {
        push_stack(stackArr,infixStr[i]);
      }
    }
  }
  
  while (!isEmpty(stackArr)) {
    postfixStr[postfixStr.length] = " ";

    postfixStr[postfixStr.length] = topStack(stackArr);
    pop_stack(stackArr);
    
    postfixStr[postfixStr.length] = " ";
  }
  var returnVal = '';
  for (var i=0; i<postfixStr.length; i++) {
    returnVal += postfixStr[i];
  }

  return(returnVal);
}

/**
 * Resolve postfix expression
 */
var resolvePostfix = function(postfixStr) {
  var stackArr = new Array();
  postfixStr = postfixStr.split('');
  
  for (var i=0; i < postfixStr.length; i++) {
    if (isBasicOperator(postfixStr[i])) {
      var right = pop_stack(stackArr);
      var left = pop_stack(stackArr);
      push_stack(stackArr, resolve(left, right, postfixStr[i]));
    } else if (isOperand(postfixStr[i])) {
      var j = i + 1,
          toStack = postfixStr[i];
      while (j < postfixStr.length && isOperand(postfixStr[j])) {
        toStack += postfixStr[j];
        j++;
        i++;
      }
      push_stack(stackArr, toStack);
    }
  }
  return stackArr[0];
}

/**
 * Resolve a simple calcul
 */
var resolve = function(a, b, operator) {
  if (operator.search(/\+/g) >= 0) return Number(a) + Number(b);
  if (operator.search(/\-/g) >= 0) return Number(a) - Number(b);
  if (operator.search(/\*/g) >= 0) return Number(a) * Number(b);
  if (operator.search(/\//g) >= 0) return Number(a) / Number(b);
}

var push_stack = function(stackArr, ele) {
  stackArr[stackArr.length] = ele;
}

var pop_stack = function(stackArr) {
  var _temp=stackArr[stackArr.length-1];
  delete stackArr[stackArr.length-1];
  stackArr.length--;
  
  return _temp;
}

var isOperand = function(who) {
  return /[0-9]/g.test(who);
}

var isOperator = function(who) {
  return /[\+\-\*\/\(\)]/g.test(who);
}

var isBasicOperator = function(who) {
  return /[\+\-\*\/]/g.test(who);
}

var topStack = function(stackArr) {
  return stackArr[stackArr.length-1];
}

var isEmpty = function(stackArr) {
  return stackArr.length == 0 ? true : false;
}

/**
 * Check for precedence
 */
var prcd = function(char1, char2) {
  var char1_index,
      char2_index,
      _def_prcd="-+*/";

  for (var i=0; i < _def_prcd.length; i++) {
    if (char1 == _def_prcd.charAt(i)) char1_index = i;
    if (char2 == _def_prcd.charAt(i)) char2_index = i;
  }
  if (((char1_index == 0)||(char1_index == 1)) && (char2_index > 1))
    return false;
  return true;
}

exports.calculate = calculate;