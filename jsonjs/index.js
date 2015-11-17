#!/usr/bin/env node

const esprima = require('esprima')
const fs = require('fs')
const process = require('process')

// FIXME will also need a copy when we are passing into a function
// so we don't see it clobbered on the way back!
const BindingEnvironment = {
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

function main() {
  // FIXME add help!
  console.log('Invoking jsonjs')

  // NOTE it's argv[2] because invocation is /usr/bin/env node FILENAME
  const filename = process.argv[2]
  console.log("Parsing", filename)
  const code = fs.readFileSync(filename, 'utf8')

  const env = Object.create(BindingEnvironment)
  const expr = esprima.parse(code).body[0]  // be able to eval sequence of statements!
  console.log('Evaluating', JSON.stringify(expr), null, '  ')

  console.log(myeval(env, expr))
}

main()

