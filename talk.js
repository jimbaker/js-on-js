// helper functions for working with the console
// in node load as follows
// > .load ./talk.js

const esprima = require('esprima'),
      jsonjs = require('./lib')

function log(expr) { console.log(JSON.stringify(expr, null, '  ')) }


