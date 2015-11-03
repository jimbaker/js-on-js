% JavaScript on JavaScript
% Jim Baker
% jim.baker@{python.org, rackspace.com}

# Overview

# Related projects

* Sandboxing with [JS in JS](https://sns.cs.princeton.edu/2012/04/javascript-in-javascript-js-js-sandboxing-third-party-scripts/)
* PyPy - Python on Python - used to be 1000x slower, now it can be 20x faster (FIXME check stats)
* Self-hosting compilers - GNU C, javac (but Hotspot JVM uses C++ at its core), ...
* FIXME other similar projects; Ouroboros FIXME maybe a picture element here; maybe this could be good for 

# Syntax

# Semantics

# Abstract Syntax Trees (ASTs)

FIXME - something simple like math

# ASTs in JavaScript

* How to produce
* What do they mean?

# AST of an expression

# AST of an anonymous function being defined

# Why anonymous functions in JS?

FIXME describe how they rock

# AST combined

function (x) { ... } (6 * 7)


# Operational semantics

We are going to choose big-step for simplicity, but small-step allows us to describe precisely each execution step as a reduction:

* Big step semantics
* Small step semantics


# Judgment form

# Equivalent test

# Testing frameworks in JavaScript

* choice of assertions
* test discovery

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

# GitHub and tracking commits
