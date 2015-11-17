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

function myeval(env, expr) {

  if (expr.type === 'Literal') {
    return expr.value
  }
  else if (expr.type === 'Identifier') {
    return env.get(expr.name)
  }
  else if (expr.type == 'EmptyStatement') {
    return undefined
  }

  // FIXME switch on expr.type? or dispatch?
  else if (expr.type === 'ExpressionStatement') {
    return myeval(env, expr.expression)
  }
  else if (expr.type === 'Program') {
    return eval_sequence(env, expr.body)
  }
  else if (expr.type === 'SequenceExpression') {
    return eval_sequence(env, expr.expressions)
  }

  // handle block scope
  else if (expr.type === 'BlockStatement') {
    return eval_sequence(Object.create(env), expr.body)
  }

  else if (expr.type === 'VariableDeclaration' && expr.kind === 'const') {
    expr.declarations.forEach(
      function(decl) {
	env[decl.id.name] = decl.init.value
      }
    )
    return undefined
  }

  // FIXME pull out binary expressions, functions, etc - more or less visit them;
  // function definitions bind with the name;
  // function calls replace with that function
  else if (expr.type === 'BinaryExpression') {
    if (expr.operator === '*') {
      return myeval(env, expr.left) * myeval(env, expr.right)
    }
    else if (expr.operator === '+') {
      return myeval(env, expr.left) + myeval(env, expr.right)
    }

  }

  else if (expr.type === 'ConditionalExpression') {
    return myeval(env, expr.test) ?
      myeval(env, expr.consequent) :
      myeval(env, expr.alternate)
  }

  else {
    // FIXME throw an error instead
    console.log("unknown expression", env, JSON.stringify(expr, null, '  '))
    return undefined
  }
}

function eval_sequence(env, seq) {
  const values = seq.map(
    function(arg) { return myeval(env, arg) })
  return values[values.length - 1]
}

exports.eval = function(expr) {
  return myeval(Object.create(Bindings), expr)
}
