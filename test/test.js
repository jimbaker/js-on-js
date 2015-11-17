const assert = require('assert'),
      esprima = require('esprima'),
      jsonjs = require('../lib')

function parse_expr(text) {
  var expr = esprima.parse(text)
  // console.log("expr", JSON.stringify(expr, null, '  '))
  return expr
}

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
  })

})
