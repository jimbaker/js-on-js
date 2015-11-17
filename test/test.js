const assert = require('assert'),
      esprima = require('esprima'),
      jsonjs = require('../lib')

function parse_expr(text) {
  var ast = esprima.parse(text).body[0]
  // console.log("ast", ast)
  return ast
}

describe('literals', function() {
  it('a numeric literal should return itself', function() {
    assert.equal(jsonjs.eval(parse_expr('123')), 123)
  })
})

describe('binary expressions', function() {
  it('multiplication should work on numbers', function () {
    assert.equal(jsonjs.eval(parse_expr('6*9')), 54)
  })
})
