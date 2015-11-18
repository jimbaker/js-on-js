const assert = require('chai').assert,
      esprima = require('esprima'),
      jsonjs = require('../lib')

function parseExpr(text, logExpr) {
  var expr = esprima.parse(text)
  if (logExpr) {
    console.log("expr", JSON.stringify(expr, null, '  '))
  } 
  return expr
}

describe('nonexistence', function () {
  it('an empty program is undefined', function () {
    assert.equal(jsonjs.eval(parseExpr('')), undefined)
  }),
  it('an empty statement is undefined', function () {
    assert.equal(jsonjs.eval(parseExpr(';')), undefined)
  }),
  it('an empty block is undefined', function () {
    assert.equal(jsonjs.eval(parseExpr('{}')), undefined)
  })
})

describe('literals', function () {
  it('a numeric literal returns itself', function () {
    assert.equal(jsonjs.eval(parseExpr('123')), 123)
  })
})

describe('binary expressions', function () {
  it('multiplication on numbers', function () {
    assert.equal(jsonjs.eval(parseExpr('6 * 9')), 54)
  }),
  it('addition on numbers', function () {
    assert.equal(jsonjs.eval(parseExpr('11 + 22')), 33)
  }),
  it('subtraction on numbers', function () {
    assert.equal(jsonjs.eval(parseExpr('25 - 16')), 9)
  }),
  it('strict equality on numbers, when equal', function () {
    assert.equal(jsonjs.eval(parseExpr('47 === 47')), true)
  }),
  it('strict equality on numbers, when unequal', function () {
    assert.equal(jsonjs.eval(parseExpr('47 === 42')), false)
  })
  // FIXME etc
})

describe('sequence of expressions', function () {
  it('sequence of expressions returns the last value', function () {
    assert.equal(jsonjs.eval(parseExpr('1,1,2,3,5,8')), 8)
  })
})

describe('bindings', function () {
  it('const assignment creates a binding', function () {
    assert.equal(jsonjs.eval(parseExpr('const x = 47; x')), 47)
  }),
  it('const assignment results in undefined', function () {
    assert.equal(jsonjs.eval(parseExpr('const x = 47')), undefined)
  }),
  it('unbound names throw a ReferenceError', function () {
    assert.throws(
      function () { jsonjs.eval(parseExpr('x')) },
      ReferenceError)
  }),
  it('const assignments are not visible outside a block scope', function () {
    assert.throws(
      function () { jsonjs.eval(parseExpr('{ const x = 47 }; x')) },
      ReferenceError)
  })
})

describe('functions', function () {
  it('function definition creates a binding', function () {
    const func = jsonjs.eval(parseExpr('const x = function () {}; x'))
    assert.equal(func.type, 'FunctionExpression')
    assert.equal(func.body.body.length, 0)  // empty body for this function
  }),
  it('calling an empty function returns undefined', function () {
    assert.equal(jsonjs.eval(parseExpr('const x = function () {}; x()')), undefined)
  }),
  it('calling a no-arg function', function () {
    assert.equal(jsonjs.eval(parseExpr('const x = function () { return 47 }; x()')), 47)
  }),
  it('calling a single arg function', function () {
    assert.equal(jsonjs.eval(parseExpr('const add1 = function(x) { return x + 1 }; add1(41)')), 42)
  }),
  it('calling a single arg function immediately', function () {
    assert.equal(jsonjs.eval(parseExpr('(function(x) { return x + 1 })(41)')), 42)
  }),
  it('recursive functions work', function () {
    const expr = parseExpr(
      'const fact = function(x) {' +
      '  if (x === 0) { return 1 }' +
      '  else { return x * fact(x - 1) }' +
      '};' +
      'fact(6)')
    assert.equal(jsonjs.eval(expr), 720)
  })  
})

describe('conditional expressions and if statements', function () {
  it('true conditional only specifies consequent', function ()  {
    assert.equal(jsonjs.eval(parseExpr('if (true) { 47 }')), 47)
  }),
  it('false conditional only specifies consequent returns undefined', function ()  {
    assert.equal(jsonjs.eval(parseExpr('if (false) { 47 }')), undefined)
  }),
  it('false conditional short circuit on consequent', function ()  {
    // ReferenceError would be raised if no short circuiting
    assert.equal(jsonjs.eval(parseExpr('false ? x : 47')), 47)
  }),
  it('true conditional short circuit on alternate', function ()  {
    // ReferenceError would be raised if no short circuiting
    assert.equal(jsonjs.eval(parseExpr('true ? 47 : x')), 47)
  })
})

describe('unknown expressions', function () {
  it('unsupported expression types raise an interpreter error', function ()  {
    assert.throws(
      function () { jsonjs.eval(parseExpr('class Shape {}')) },
      jsonjs.InterpreterError)
  }),
  it('unsupported binary operators raise an interpreter error', function ()  {
    assert.throws(
      function () { jsonjs.eval(parseExpr('99 % 2')) },
      jsonjs.InterpreterError)
  })

})


