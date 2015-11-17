'use strict'

// FIXME will also need a copy when we are passing into a function
// so we don't see it clobbered on the way back!
exports.Bindings = {
  get(key) {
    const val = this[key]
    if (val === undefined) {
      throw new ReferenceError(key + " is undefined in environment")
    } else {
      return val
    }
  }
}

const myeval = exports.myeval = function(env, expr) {
  // FIXME switch on expr.type? or dispatch?
  if (expr.type === 'ExpressionStatement') {
    return myeval(env, expr.expression)
  }

  // FIXME pull out binary expressions, functions, etc - more or less visit them;
  // function definitions bind with the name;
  // function calls replace with that function
  else if (expr.type === 'BinaryExpression') {
    if (expr.operator === '*') {
      return myeval(env, expr.left) * myeval(env, expr.right)
    }
  }
  else if (expr.type === 'Literal') {
    return expr.value
  }
  else {
    console.log("Unknown expression", env, expr)
    return null
  }
}

