---
title: Debugging 'this' in JavaScript
description: Learn to debug JavaScript errors when changing contexts.
author: pat_wentz
date: 2020-11-16 17:09 UTC
category: JavaScript
tags: javascript
published: true
---

You've seen it, but maybe you don't fully understand it. Perhaps you know how to work around it, but not sure why it's a problem in the first place. That's right, I'm talking about `this`. There's a lot of controversy surrounding `this` because, aside from the ambiguous naming, it can be confusing if you don't know what to look for. I get a lot of questions about `this` in JavaScript so I'm going to try and introduce the most common problems you will run into with regards to `this` in a short blog post.

Although it is out of the scope of this post, these examples assume that strict-mode is being used. For more information on strict-mode, check out the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode).

END_SUMMARY

## Object Methods

Object methods. Some people call these prototype functions. Whatever you call them, referencing functions living on an object (via dot-notation) is the crux of the majority of `this` problems that developers will run into. Take this sample class:

```js
class Dog {
  constructor(sound) {
    this.sound = sound;
  }

  bark() {
    console.log(this.sound.toUpperCase());
  }
}
```

And if I were to call the `bark` method on a dog instance:

```js
const dog = new Dog("arf");
dog.bark();
// ARF
```
And it _just works_ because ___for object methods, `this` will always be set to the object it is invoked on___.

What does that mean? It means that when we call `dog.bark()`, our `this` inside the `bark` method will be implicitly set to the `dog` instance. The nice thing about this rule is that it's very cut and dry. A method will always take the context of the object it's invoked on. The key work here is "invoked". Let's see what happens if we invoke the object method _without_ the object.

```js
const dog = new Dog("arf");
const doglessBark = dog.bark;
doglessBark();
// Uncaught TypeError: Cannot read property 'sound' of undefined
```
This is probably the most common issue that you will run into with `this`, especially when using libraries like React that require lots of method passing. The common fix for this particular issue is to use the `bind` method, which takes an argument and sets the `this` context to the given argument:

```js
const dog = new Dog("arf");
const doglessBark = dog.bark;
const boundBark = doglessBark.bind(dog);
boundBark();
// ARF
```
The nice thing about `bind` is that it returns an uninvoked function, so you can bind the method to its original object before passing it around. Another common solution would be to set the `bark` property to a bound `bark` method in the constructor:

```js
constructor(sound) {
  this.sound = sound;
  this.bark = this.bark.bind(this);
}
```
This ensures that regardless of whether I invoke the `bark` method on a dog instance or not, the `this` context will always be set to the instance it belongs to.

## ES5 Functions
The second issue you're going to run into with `this` is when you're working with the `function` keyword.  Let's say we have a new `Dog` class:

```js
class Dog {
  bark(sound) {
    console.log(sound);
  }

  barks(barkSounds) {
    barkSounds.forEach(function(barkSound) {
      this.bark(barkSound);
    });
  }
}
```
Take a look at the anonymous `function` we're passing to `forEach` in the `barks` method. Now let's try to invoke our new `barks` method:

```js
const dog = new Dog();
dog.barks(["woof", "arf"]);
// Uncaught TypeError: Cannot read property 'bark' of undefined
```
So if we called the `barks` method on the Dog object, then why is our `this` coming through `undefined`? This is because ___`function` keywords will always have `this` implicitly set by default___. If you're **not** using strict-mode, then `this` will be set to the global object instead of `undefined`. Either way, the context is not a dog and we need to change that. Similar to the last example, you can override this behavior by using `bind` to set `this` explicitly. Another common trick that you might find while reading JavaScript code is setting `this` to a separate variable outside the function body:

```js
  barks(barkSounds) {
    var that = this;
    barkSounds.forEach(function(barkSound) {
      that.bark(barkSound);
    });
  }
```
We won't get into why functions behave like this by default in ES5, but if you're using Babel or you're in an environment where you can write ES6 then usually the best solution to this particular inconvenience is to use ES6 arrow functions:

```js
  barks(barkSounds) {
    barkSounds.forEach((barkSound) => {
      this.bark(barkSound);
    });
  }
```
ES6 arrow functions are convenient because they assume the context of whatever  surrounding context they are declared in. For this purpose, arrow functions are helpful when you need to pass an anonymous function while maintaining your `this` context. The term often thrown around is "lexical scope", which is a fancy way of referring to the surrounding scope in which the function is declared. So in short, arrow functions will maintain the "lexical scope" while function declarations do not.

## Recap
  * object methods lose their `this` context when not invoked on an object
    * use `bind` in your class constructor or pass an anonymous arrow function that wraps your method
  * ES5 functions implicitly declare their own `this` context
    * use arrow functions when writing anonymous functions or save `this` context to variable outside the function body if you don't have access to babel

If you have any questions about `this` or this post in general then let us know in the comments below! [We're also hiring!](https://www.taxjar.com/jobs/)
