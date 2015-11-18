'use strict'

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

function InterpreterError(message, functionality, env, expr) {
  // console.log('could not interpret expression', env, JSON.stringify(expr, null, '  '))
  this.name = 'InterpreterError'
  this.message = (message || 'Interpreter error') + ": '" + functionality + "'"
  this.stack = (new Error()).stack
}
InterpreterError.prototype = Object.create(Error.prototype)
InterpreterError.prototype.constructor = InterpreterError
exports.InterpreterError = InterpreterError

function evaluate(env, expr) {

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
    return evaluate(env, expr.expression)
  }
  else if (expr.type === 'Program') {
    return eval_sequence(env, expr.body)
  }
  else if (expr.type === 'SequenceExpression') {
    return eval_sequence(env, expr.expressions)
  }

  // Handle block scope by copying the environment
  // and manage *dynamically* in the interpreter's own stack.
  // Problem left to the reader: rework to use lexical scoping,
  // via some substitution scheme like alpha renaming.
  else if (expr.type === 'BlockStatement') {
    const new_env = Object.create(env)
    var last_value = undefined
    for (let expr2 of expr.body) {
      if (expr2.type === 'ReturnStatement') {
	return evaluate(new_env, expr2.argument)
      } else {
	//return evaluate(new_env, expr2)
	last_value = evaluate(new_env, expr2)
      }
    }
    return last_value
  }

  else if (expr.type === 'VariableDeclaration' && expr.kind === 'const') {
    // FIXME should test if attempting to rebind!
    expr.declarations.forEach(
      function(decl) {
	env[decl.id.name] = evaluate(env, decl.init)
      }
    )
    return undefined
  }

  // function definitions bind with the name;
  // function calls replace with that function
  else if (expr.type === 'BinaryExpression') {
    if (expr.operator === '*') {
      return evaluate(env, expr.left) * evaluate(env, expr.right)
    }
    else if (expr.operator === '+') {
      return evaluate(env, expr.left) + evaluate(env, expr.right)
    }
    else if (expr.operator === '-') {
      return evaluate(env, expr.left) - evaluate(env, expr.right)
    }
    else if (expr.operator === '===') {
      return evaluate(env, expr.left) === evaluate(env, expr.right)
    }

    throw new InterpreterError('unsupported binary operator', expr.operator, env, expr)
  }

  else if (expr.type === 'ConditionalExpression' || expr.type === 'IfStatement') {
    return evaluate(env, expr.test) ?
      evaluate(env, expr.consequent) :
      evaluate(env, expr.alternate)
  }

  else if (expr.type === 'CallExpression') {
    const callee = evaluate(env, expr.callee)
    const bound_env = Object.create(env)
    // bind params in callee with args in the downcall
    callee.params.forEach(function(param, index) {
      bound_env[param.name] = evaluate(env, expr.arguments[index])
    })
    // then evaluate body with respect to this bound env
    return evaluate(bound_env, callee.body)
  }
  else {
    throw new InterpreterError('unknown AST expression type', expr.type, env, expr)
  }
}

function eval_sequence(env, seq) {
  const values = seq.map(
    function(arg) { return evaluate(env, arg) })
  return values[values.length - 1]
}

exports.eval = function(expr) {
  return evaluate(Object.create(Bindings), expr)
}
