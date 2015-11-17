'use strict'

// FIXME will also need a copy when we are passing into a function
// so we don't see it clobbered on the way back!
const Bindings = {
  get(key) {
    const val = this[key]
    if (val === undefined) {
      throw new ReferenceError(key + " is undefined in environment")
    } else {
      return val
    }
  }
}

const EmptyBindings = Object.create(Bindings)

// FIXME handle a sequence of expression statements for a program

const myeval = function(env, expr) {

  if (expr.type === 'Literal') {
    return expr.value
  }

  // FIXME switch on expr.type? or dispatch?
  else if (expr.type === 'ExpressionStatement') {
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
  else {
    // FIXME throw an error instead
    console.log("unknown expression", env, expr)
    return null
  }
}

exports.eval = function(expr) {
  return myeval(EmptyBindings, expr)
}
