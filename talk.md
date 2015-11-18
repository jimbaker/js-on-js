% JavaScript on JavaScript
% Jim Baker
% jim.baker@{python.org, rackspace.com}

# Overview

* Exploration in the console, using Node 5



# About me

* Architect at Rackspace
* Lecturer in CS, CU Boulder
* Languages I tend to use: Python, Java, Scala, JavaScript
* Core developer of Jython
* Co-author of *Definitive Guide to Jython* from Apress
* Previous jobs include Canonical (worked on Ubuntu Server), Sauce Labs

# JavaScript on JavaScript

* How to parse JavaScript into...
* ... JSON! (but of course)


# Credits

* Some aspects based on Principles of Programming Languages (CSCI 3155) at CU Boulder
* JavaScript interpreter, written for labs developed by Evan Chang at Univ of Colorado, Boulder
  - Judgment forms to define operational semantics
  - Expressed on Scala
* Modified for this talk to be in terms of unit tests and JavaScript

# ECMAScript 6

Will show ECMAScript 6 (aka ECMAScript 2015, JavaScript 6, ...)

* (Mostly) supported by Chrome 46, Firefox , MS Edge, Node 5
* Get to use `let`, `const`, along with other great functionality
* Today's example code may require transpilation, polyfill, or manual changes to use with your needs 


# Related projects

* Sandboxing with [JS in JS](https://sns.cs.princeton.edu/2012/04/javascript-in-javascript-js-js-sandboxing-third-party-scripts/)
* PyPy - Python on Python - used to be 1000x slower, now it can be 20x faster (FIXME check stats)
* Self-hosting compilers - GNU C, javac (but Hotspot JVM uses C++ at its core), ...
* FIXME other similar projects; Ouroboros FIXME maybe a picture element here; maybe this could be good for 



# Syntax

# Node console

Install standard parser package

```bash
$ npm install esprima
```

# Semantics

# Abstract Syntax Trees (ASTs)

FIXME - something simple like math

FIXME ASTs look like the document object model (DOM), but for the program/script itself

# ASTs are just plain old objects

FIXME which means you can create your own ASTs as well! we will see this become important soon

FIXME maybe cover interfaces?



# TDD

# Recursion

* ASTs are made up of ASTs
* Corresponding to expressions
* So evaluate the parts, then the whole
* etc

# Evaluating functions


# ASTs in JavaScript

* How to produce
* What do they mean?

# Use Esprima

```javascript
const esprima = require('esprima')
```

* Note the use of `const` - we are using EcmaScript 6!
* Can still override in the console (FIXME can we require let/const/var?)

# AST of an expression

The body of a program is a sequence of statements:

```
> esprima.parse('6 * 7')
{ type: 'Program',
  body: [ { type: 'ExpressionStatement', expression: [Object] } ],
  sourceType: 'script' }
```

NB: the program is captured! so you have to cut things out

# Use `JSON.stringify`

```
console.log(JSON.stringify(esprima.parse('6*7'), null, '  '))
```

# Complete AST

```
> console.log(JSON.stringify(esprima.parse('6*7'), null, '  '))
{
  "type": "Program",
  "body": [
    {
      "type": "ExpressionStatement",
      "expression": {
        "type": "BinaryExpression",
        "operator": "*",
        "left": {
          "type": "Literal",
          "value": 6,
          "raw": "6"
        },
        "right": {
          "type": "Literal",
          "value": 7,
          "raw": "7"
        }
      }
    }
  ],
  "sourceType": "script"
}
```

# AST of an anonymous function being defined

# Why anonymous functions in JS?

FIXME describe how they rock

# AST combined

A simple function:

```
(function(x) { return x * 7 })(6)
```

# Parsing

Parsed:

```
x = esprima.parse('(function(x) { return x * 7 })(6)')
```

# What are functions anyway?

FIXME (encapsulated code that be executed repeatedly; may be named, or just have a reference)

# Built-in `eval` function

```
> eval('6 * 7')
42
```

# More complex usage

```
> eval('(function(x) { return x * 7 })(6)')
42
```

# Why do we need `eval`?

# When should we not use `eval`?

Cross-site scripting) (XSS) attacks!

# Writing our own `eval` function

> ast.body[0].expression
{ type: 'BinaryExpression',
  operator: '*',
  left: { type: 'Literal', value: 6, raw: '6' },
  right: { type: 'Literal', value: 7, raw: '7' } }
> function myeval(expr) { if (expr.operator === '*') { return expr.left.value * expr.right.value } }
undefined
> eval(ast.body[0].expression)
42

# Interpreter

Proceed by rewriting AST to another AST - presumably simpler! FIXME this is what we mean by reductions; small step semantics clarify what we get; big step semantics are reasonable here too

# Operational semantics

* Describes the execution of a program
* Evaluation - successively reduce a program AND its input into a result, plus possible side effects
* Side effects - probably what most of you care about!

# Interpretation vs compilation

* Interpreters directly work with source ASTs

* Specifically transformation of an AST into another AST - we call that interpreting

# Equivalent idea

Unit testing!

Just a fancy way of stating: we care about the execution of a program (vs thinking about 

We are going to choose big-step for simplicity, but small-step allows
us to describe precisely each execution step as a reduction:

* Big step semantics
* Small step semantics

# Command line interpreter

Desired goal: be able to run

`$ jsonjs foo.js`

# Modular too

* Can require jsonjs, try it out
* With AST

# Judgment form

# Equivalent test

# Testing frameworks in JavaScript

* choice of assertions
* test discovery

# Possibilities

https://facebook.github.io/jest/


# Assertion test framework

Maybe just use https://nodejs.org/api/assert.html ? FIXME especially matchers like `assert.deepStrictEqual`

Let's use http://chaijs.com/api/assert/ - more assertions!

# Test discovery

Mocha; see http://mochajs.org/#installation etc


# FIXME specific tool to be used in JS

# Test-driven development

* Start with our tests first
* Build corresponding functionality
* Repeat until done

# Test-driven development

=> Requirements driven, but concrete - based on actual needs

# Syntax testing?

Not today - we already have a parser, let's move on

# Semantics tests

* What is our core functionality?

Name bindings, expression evaluation

Can simplify further these ideas... But this is not a theory course condensed into one hour...

# When writing unit tests

Write the simplest ones possible
Covering especially edge cases (maybe not so simple after all)

# Bindings

Test binding `x`

throw `ReferenceError: x is not defined`




# GitHub and tracking commits

FIXME do this? or just demo away?
