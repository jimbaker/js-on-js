% JavaScript on JavaScript
% Jim Baker
% jim.baker@{python.org, rackspace.com}

# Overview

* Basics of syntax, semantics and applying to JavaScript
* Exploration in JS console, using Node 5 - mostly syntax and how to parse
* Unit tests for the (TDD) win!
* Corresponding interpreter implementing JS semantics
* Implement numeric ops, conditionals, assignment, function definition, and recursive call support in 135 LOC

# About me

* Architect at Rackspace, focused on overall platform
* Lecturer in CS, CU Boulder teaching CSCI 3155
* Languages I often use: Python, Java, Scala, JavaScript, ...
* But really just a languages geek!
* Core developer of Jython
* Co-author of *Definitive Guide to Jython* from Apress
* Previous jobs include Canonical (worked on Juju), Sauce Labs

# JavaScript on JavaScript

* How to parse JavaScript into...
* ... JSON (but of course!)
* then interpret using a simple evaluation model (big step operational semantics)
* Use Esprima for parsing, Chai for assertions, Mocha for test discovery & running

# Or just use `eval`

Built into JavaScript, since the very beginning (at least 1996):

```javascript
eval('6 * 7')
```

# Or just use `eval`

Does show what we could support:

```javascript
eval('(function (x) { return x + 1 })(8)')
```

# Or just use `eval`

* Great way to introduce cross site scripting (XSS) attacks on your site, if you use `eval` with untrusted text!
* But JSON was successful in part because `eval(someJSON)` worked - and worked very efficiently
* Key observation by Douglas Crockford (the "good parts")

# Related projects

* Sandboxing with [JS in JS](https://sns.cs.princeton.edu/2012/04/javascript-in-javascript-js-js-sandboxing-third-party-scripts/)
* PyPy - Python on Python - used to be 1000x slower, now it can be 20x faster
* Self-hosting compilers - GNU C, javac (but Hotspot JVM uses C++ at its core), ...

# Credits

* Some aspects based on Principles of Programming Languages (CSCI 3155) at CU Boulder
* JavaScript interpreter, written for labs developed by Evan Chang at Univ of Colorado, Boulder
  - Judgment forms to define big step AND small step operational semantics
  - explore dynamic and lexical scoping
  - adding static typing similar to MS TypeScript
  - Expressed on Scala
* Modified for this talk to be in terms of unit tests and written in JavaScript itself

# ECMAScript 6

Will show ECMAScript 6 (aka ECMAScript 2015, JavaScript 6, ...)

* [(Mostly) supported](https://kangax.github.io/compat-table/es6/) by Chrome 46, Firefox 44, MS Edge, Node 5
* Get to use `let`, `const`, along with other great functionality
* Today's example code may require transpilation, polyfill, or manual changes to use with your needs 

# What is a programming language?

* PLs are systems in which we can write programs/code/...
* Well-defined (more or less!) what we will get
* And we can collaborate on - we can read code together, make changes, "fork me on GitHub"

# Key aspects

* Syntax
* Semantics

# Syntax

* **Shape of the code**
* Higher order aspects, such as scoping of names
* e.g. being able to block scope variable assignment (new with `let`, `const`)
* Dealing with ambiguity - think PEDMAS precedence in middle school arithmetic
* JavaScript is often called a Lisp with C syntax...
* and Lisp itself doesn't really have a syntax

# Semantics

* Functional, imperative, declarative, logical, ...
* Concurrency, mutation, software transactional memory, ... pick your favorite
* As constrained (or not) by typing (static, dynamic, gradual)

# Node console

Install standard parser package

```bash
$ npm install esprima
```

# Abstract Syntax Trees (ASTs)

FIXME - something simple like math

FIXME ASTs look like the document object model (DOM), but for the program/script itself

# ASTs are just plain old objects

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

```javascript
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

# Recommedation

Go simple:



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
