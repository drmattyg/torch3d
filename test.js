"use strict";

class Foobar {

	constructor(x) {
		this.x = x;
	}
	foo() { 
		return this.x*2;
	}

	bar() { 
		console.log(this.foo(this.x));
	}
}

var f = new Foobar(3);
f.bar();