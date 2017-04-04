function draculaSoftmax(values) {

  // TODO: need to check if this U is the same as the one exported
//  var act = numeric.dot(values, draculaParams_U);
  var act = [];
  for (var i = 0; i < values.length; i++) {
    var tmp = numeric.dot(values[i], draculaParams_U);
    tmp = numeric.add(tmp, draculaParams_b);
    act.push(tmp);
  }

  //var exp = numeric.exp(act);
  var exp = [];
  for (var i = 0; i < act.length; i++) {
    //var ex = numeric.exp(act[i] - Math.max(...act[i]))
    var ex = numeric.exp(act[i]);
    ex = numeric.div(ex, numeric.sum(ex))
    exp.push(ex);
//    exp[i] = numeric.div(exp[i], numeric.sum(exp[i]));
  }
  return exp;
}

function determineLabels(exp) {

  // Compute the argmax
  var ret = [];
  for (var i = 0; i < exp.length; i++) {
    var argMax = 0;
    var argMaxVal = 0;
    for (var j = 0; j < exp[i].length; j++) {
      var v = exp[i][j];
      if (v > argMaxVal) {
        argMax = j;
        argMaxVal = v;
      }
    }
    if (argMax in draculaParams_inv_pos_dict) {
      ret.push(draculaParams_inv_pos_dict[argMax]);
    } else {
      ret.push('UNK');
    }
  }

  return ret;
}
