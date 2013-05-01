## Getting started with Cat.js

Cat.js is a small library to build modular reactive applications in Javascript.

The main idea comes from this paper: 

Retracing some paths in Process Algebra (1996) by Samson Abramsky

However, it is not necesssary to understand how it works.


Code is organized in modules. A module is just a piece of code.

A module interacts with its environment through asynchronous events.

Modules can be composed. We have the following composition operator:

1. Sequential composition (SEQ).
2. Parallel composition (PAR).
3. Trace or feedback (TRACE).
4. Int-construction (INTC).

Int-contruction can be derived from the others, but we prefer to deal with it as a primitive operator.