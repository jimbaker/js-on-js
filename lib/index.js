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
  // logging like this in construction is unorthodox, but very handy
  // console.log('could not interpret expression',
  //   env, JSON.stringify(expr, null, '  '))
  this.name = 'InterpreterError'
  this.message = (message || 'Interpreter error') + ": '" + functionality + "'"
  this.stack = (new Error()).stack
}
InterpreterError.prototype = Object.create(Error.prototype)
InterpreterError.prototype.constructor = InterpreterError
exports.InterpreterError = InterpreterError

function evaluate(env, expr) {
  // base cases
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
  }

  // recursive cases
  else if (expr.type === 'ExpressionStatement') {
    return evaluate(env, expr.expression)
  }
  else if (expr.type === 'Program') {
    return evalSequence(env, expr.body)
  }
  else if (expr.type === 'SequenceExpression') {
    return evalSequence(env, expr.expressions)
  }

  // Handle block scope by copying the environment
  // and manage *dynamically* in the interpreter's own stack.
  // Problem left to the reader: rework to use lexical scoping,
  // via some substitution scheme like alpha renaming.
  else if (expr.type === 'BlockStatement') {
    const newEnv = Object.create(env)
    var lastValue = undefined
    for (let expr2 of expr.body) {
      if (expr2.type === 'ReturnStatement') {
	return evaluate(newEnv, expr2.argument)
      } else {
	lastValue = evaluate(newEnv, expr2)
      }
    }
    return lastValue
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

    throw new InterpreterError('unsupported binary operator',
      expr.operator, env, expr)
  }

  else if (expr.type === 'ConditionalExpression' ||
           expr.type === 'IfStatement') {
    return evaluate(env, expr.test) ?
      evaluate(env, expr.consequent) :
      evaluate(env, expr.alternate)
  }

  else if (expr.type === 'CallExpression') {
    const callee = evaluate(env, expr.callee)

    // make available param to arg binding in called function body
    const argEnv = Object.create(env)
    callee.params.forEach(function(param, index) {
      argEnv[param.name] = evaluate(env, expr.arguments[index])
    })
    // and evaluate body with respect to these bound arguments
    return evaluate(argEnv, callee.body)
  }
  else {
    throw new InterpreterError('unknown AST expression type',
      expr.type, env, expr)
  }
}

function evalSequence(env, seq) {
  const values = seq.map(
    function(arg) { return evaluate(env, arg) })
  return values[values.length - 1]
}

// Top-level evaluation - give it a short name similar to the builtin
// eval, although technically it takes an AST, not a string.
// FIXME support taking a string or expr
exports.eval = function(expr) {
  return evaluate(Object.create(Bindings), expr)
}
