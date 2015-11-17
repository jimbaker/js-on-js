#!/usr/bin/env node

'use strict'

const esprima = require('esprima'),
      fs = require('fs'),
      process = require('process'),
      jsonjs = require('./lib')

function main() {
  // FIXME add help!

  // NOTE it's argv[2] because of the shebang invocation, namely
  // /usr/bin/env node FILENAME
  const filename = process.argv[2]
  console.log('Parsing program:', filename)
  const program = fs.readFileSync(filename, 'utf8')
  const expr = esprima.parse(program) //.body[0]  // FIXME be able to eval sequence of statements!
  console.log('Evaluating:', JSON.stringify(expr, null, '  '))
  console.log('Result:', jsonjs.eval(expr))
}

main()
