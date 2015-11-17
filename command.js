#!/usr/bin/env node

const fs = require('fs')
const process = require('process')
const jsonjs = require('js-on-js')


function xmain() {
  // FIXME add help!
  console.log('Invoking jsonjs')

  // NOTE it's argv[2] because invocation is /usr/bin/env node FILENAME
  const filename = process.argv[2]
  console.log("Parsing", filename)
  const code = fs.readFileSync(filename, 'utf8')

  const env = Object.create(jsonjs.BindingEnvironment)
  const expr = esprima.parse(code).body[0]  // be able to eval sequence of statements!
  console.log('Evaluating', JSON.stringify(expr), null, '  ')

  console.log(jsonjs.myeval(env, expr))
}

function main() {
    console.log('logging version of jsonjs')
}

main()

