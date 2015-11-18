const assert = require('chai').assert,
      esprima = require('esprima'),
      jsonjs = require('../lib')

function parse_expr(text, logExpr) {
  var expr = esprima.parse(text)
  if (logExpr) {
    console.log("expr", JSON.stringify(expr, null, '  '))
  } 
  return expr
}

describe('nonexistence', function() {
  it('an empty program is undefined', function() {
    assert.equal(jsonjs.eval(parse_expr('')), undefined)
  }),
  it('an empty statement is undefined', function() {
    assert.equal(jsonjs.eval(parse_expr(';')), undefined)
  }),
  it('an empty block is undefined', function() {
    assert.equal(jsonjs.eval(parse_expr('{}')), undefined)
  })
})

describe('literals', function() {
  it('a numeric literal should return itself', function() {
    assert.equal(jsonjs.eval(parse_expr('123')), 123)
  })
})

describe('binary expressions', function() {
  it('multiplication should work on numbers', function () {
    assert.equal(jsonjs.eval(parse_expr('6 * 9')), 54)
  }),
  it('addition should work on numbers', function () {
    assert.equal(jsonjs.eval(parse_expr('11 + 22')), 33)
  })
  // FIXME etc
})

describe('sequence of expressions', function() {
  it('sequence of expressions should return the last value', function () {
    assert.equal(jsonjs.eval(parse_expr('1,1,2,3,5,8')), 8)
  })
})

describe('bindings', function() {
  it('const assignment should create a binding', function () {
    assert.equal(jsonjs.eval(parse_expr('const x = 47; x')), 47)
  }),
  it('const assignment results in undefined', function () {
    assert.equal(jsonjs.eval(parse_expr('const x = 47')), undefined)
  }),
  it('unbound name should throw a ReferenceError', function () {
    assert.throws(
      function () { jsonjs.eval(parse_expr('x')) }, ReferenceError)
  }),
  it('const assignments are not visible outside a block scope', function () {
    assert.throws(
      function () { jsonjs.eval(parse_expr('{ const x = 47 }; x')) }, ReferenceError)
  })
})

describe('functions', function() {
  it('function definition should create a binding', function () {
    const func = jsonjs.eval(parse_expr('const x = function() {}; x', true))
    assert.equal(func.type, 'FunctionExpression')
    assert.equal(func.body.body.length, 0)  // empty body for this function
  }),
  it('calling an empty function should return undefined', function () {
    assert.equal(jsonjs.eval(parse_expr('const x = function() {}; x()')), undefined)
  }),
  it('calling a no-arg function', function () {
    assert.equal(jsonjs.eval(parse_expr('const x = function() { return 47 }; x()')), 47)
  }),
  it('calling a single arg function', function () {
    assert.equal(jsonjs.eval(parse_expr('const add1 = function(x) { return x + 1 }; add1(41)')), 42)
  })
  // FIXME recursion; arity > 1
  // FIXME obvious extensions to apply "alpha renaming" and get lexical scope
})

describe('conditional expressions and if statements', function() {
  it('true conditional only specifies consequent', function()  {
    assert.equal(jsonjs.eval(parse_expr('if (true) { 47 }')), 47)
  }),
  it('false conditional only specifies consequent returns undefined', function()  {
    assert.equal(jsonjs.eval(parse_expr('if (false) { 47 }')), undefined)
  }),
  it('false conditional short circuit on consequent', function()  {
    // ReferenceError would be raised if no short circuiting
    assert.equal(jsonjs.eval(parse_expr('false ? x : 47')), 47)
  }),
  it('true conditional short circuit on alternate', function()  {
    // ReferenceError would be raised if no short circuiting
    assert.equal(jsonjs.eval(parse_expr('true ? 47 : x')), 47)
  })
})
