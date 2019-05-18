function isOperator(value) {
  var operatorString = '+-*/()×÷';
  return operatorString.indexOf(value) > -1;
}

function getPrioraty(value) {
  if(value == '-' || value == '+') {
    return 1;
  } else if(value == '*' || value == '/' || value == '×' || value == '÷' ) {
    return 2;
  } else{
    return 0;
  }
}

function prioraty(v1, v2) {
  return getPrioraty(v1) <= getPrioraty(v2);
}

function outputRpn(exp) {
  var inputStack = [];
  var outputStack = [];
  var outputQueue = [];
  exp.replace(/\s/g,'');
  for(var i = 0, max = exp.length; i < max; i++) {
    if(!isOperator(exp[i]) && !isOperator(exp[i-1]) && (i != 0)) {
      inputStack[inputStack.length-1] = inputStack[inputStack.length-1] + exp[i] + '';
    } else {
      inputStack.push(exp[i]);
    }
  }
  while(inputStack.length > 0) {
    var cur = inputStack.shift();
    if(isOperator(cur)) {
      if (cur == '(') {
        outputStack.push(cur);
      } else if (cur == ')') {
        var po = outputStack.pop();
        while(po != '(' && outputStack.length > 0) {
          outputQueue.push(po);
          po = outputStack.pop();
        }
      } else {
        while(prioraty(cur,outputStack[outputStack.length - 1]) && outputStack.length > 0) {
          outputQueue.push(outputStack.pop());
        }
        outputStack.push(cur)
      }
    } else {
      outputQueue.push(Number(cur));
    }
  }
  if(outputStack.length > 0){
    while (outputStack.length > 0) {
      outputQueue.push(outputStack.pop());
    }
  }
  return outputQueue;
}

function calRpnExp(rpnArr) {
  var stack = [];
  for(var i = 0, max = rpnArr.length; i < max; i++) {
    if(!isOperator(rpnArr[i])) {
      stack.push(rpnArr[i]);
    } else {
      var num1 = stack.pop();
      var num2 = stack.pop();
      if(dianNum(num1)>1 || dianNum(num2)>1){
        return false
      }
      if(rpnArr[i] == '-') {
        var num = num2 - num1;
      } else if(rpnArr[i] == '+') {
        var num = num2 + num1;
      } else if(rpnArr[i] == '*' || rpnArr[i] == '×') {
        var num = num2 * num1;
      } else if(rpnArr[i] == '/' || rpnArr[i] == '÷') {
        var num = num2/num1;
      }
      stack.push(num);
    }
  }
  return stack[0];
}

function calCommonExp(exp) {
  var rpnArr = outputRpn(exp);
  return calRpnExp(rpnArr)
}

function dianNum(str){
  let num = 0
  for(var i=0;str.length;i++){
    if(str[i]=='.'){
      num++
    }
  }
  return num
}

//已经添加完export，在外面直接调用
module.exports = {
  calCommonExp: calCommonExp
}