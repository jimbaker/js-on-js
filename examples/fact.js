const fact = function(x) {
  if (x === 0) { return 1 }
  else { return x * fact(x - 1) }
}

// NOTE: for real JS compliance - at least with Node's semantics - we
// need to do `console.log(fact(6))`

fact(6)

