#!/usr/bin/env node

'use strict'

const esprima = require('esprima'),
      fs = require('fs'),
      process = require('process'),
      jsonjs = require('./lib')

console.log(jsonjs)

function main() {
  // FIXME add help!
  console.log('Invoking jsonjs')

  // NOTE it's argv[2] because of the shebang invocation, namely
  // /usr/bin/env node FILENAME
  const filename = process.argv[2]
  console.log("Parsing", filename)
  const code = fs.readFileSync(filename, 'utf8')

  const env = Object.create(jsonjs.BindingEnvironment)
  const expr = esprima.parse(code).body[0]  // FIXME be able to eval sequence of statements!
  console.log('Evaluating', JSON.stringify(expr), null, '  ')

  console.log(jsonjs.myeval(env, expr))
}

main()

