const log = (_) => console.log(_);
const { EventEmitter } = require('events');

class Lame extends EventEmitter {
	constructor(s) {
		super();
		this.s = s;
		this.addListener('eventHere', n => console.log(n))
	}

	nani(idk) {
		this.emit('eventHere', idk);
	}
}

const test = new Lame();
(async () => {
	test.nani('idk lol');
	test.on('eventHere', string => {
		console.log(Lame);
	});
})();

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