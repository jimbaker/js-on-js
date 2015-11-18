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

  // FIXME switch on expr.type? or dispatch?

  if (expr === null) {
    return undefined
  }
  else if (expr.type === 'Literal') {
    return expr.value
  }
  else if (expr.type === 'Identifier') {
    return env.get(expr.name)
  }
  else if (expr.type === 'EmptyStatement') {
    return undefined
  }
  else if (expr.type === 'FunctionExpression') {
    return expr
    // FIXME perhaps make this function expression opaque?
    // but keeping as JSON makes things easier for application
  }

  else if (expr.type === 'ExpressionStatement') {
    return myeval(env, expr.expression)
  }
  else if (expr.type === 'Program') {
    return eval_sequence(env, expr.body)
  }
  else if (expr.type === 'SequenceExpression') {
    return eval_sequence(env, expr.expressions)
  }

  // handle block scope by copying the environment
  // and manage *dynamically* in the interpreter's own stack
  else if (expr.type === 'BlockStatement') {
    const new_env = Object.create(env)
    var last_value = undefined
    for (let expr2 of expr.body) {
      if (expr2.type === 'ReturnStatement') {
	return myeval(new_env, expr2.argument)
      } else {
	//return myeval(new_env, expr2)
	last_value = myeval(new_env, expr2)
      }
    }
    return last_value
  }

  else if (expr.type === 'VariableDeclaration' && expr.kind === 'const') {
    // FIXME should test if attempting to rebind!
    expr.declarations.forEach(
      function(decl) {
	env[decl.id.name] = myeval(env, decl.init)
      }
    )
    return undefined
  }

  // function definitions bind with the name;
  // function calls replace with that function
  else if (expr.type === 'BinaryExpression') {
    if (expr.operator === '*') {
      return myeval(env, expr.left) * myeval(env, expr.right)
    }
    else if (expr.operator === '+') {
      return myeval(env, expr.left) + myeval(env, expr.right)
    }
    else if (expr.operator === '-') {
      return myeval(env, expr.left) - myeval(env, expr.right)
    }
    else if (expr.operator === '===') {
      return myeval(env, expr.left) === myeval(env, expr.right)
    }

    throw new Error("unknown operator: '" + expr.operator + "'")
  }

  else if (expr.type === 'ConditionalExpression' || expr.type === 'IfStatement') {
    return myeval(env, expr.test) ?
      myeval(env, expr.consequent) :
      myeval(env, expr.alternate)
  }

  else if (expr.type === 'CallExpression') {
    const callee = myeval(env, expr.callee)
    const bound_env = Object.create(env)
    // bind params in callee with args in the downcall
    callee.params.forEach(function(param, index) {
      bound_env[param.name] = myeval(env, expr.arguments[index])
    })
    // then evaluate body with respect to this bound env
    return myeval(bound_env, callee.body)
  }
  else {
    // FIXME throw an error instead
    console.log("unknown expression", env, JSON.stringify(expr, null, '  '))
    throw new Error("unknown AST expression type: '" + expr.type + "'")
  }
}

// FIXME need to take in account return statements!
function eval_sequence(env, seq) {
  const values = seq.map(
    function(arg) { return myeval(env, arg) })
  return values[values.length - 1]
}

exports.eval = function(expr) {
  return myeval(Object.create(Bindings), expr)
}
