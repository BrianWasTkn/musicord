const log = (_) => console.log(_);
const { EventEmitter } = require('events');

/**
class Lame extends EventEmitter {
	constructor(s) {
		super();
		this.addListener('eventHere', f => this.constructor.nani(f));
	}

	nani(f) {
		return console.log(f);
	}
}

const test = new Lame('e');
(async () => {
	test.on('eventHere', f => {
		return f;
	});
})();
*/

/**
const fields = {
	'Duration': { value: 555, inline: true },
	'Name': { value: 'London Bridge', inline: true }
}

const field = Object.entries(fields);
const e = field.map((f, i) => ({
	name: f[0],
	value: f[1].value,
	inline: f[1].inline
}))
console.log(e);

console.log(lol(5));
function lol({ number, squared = number }) {
	return squared;
}
*/