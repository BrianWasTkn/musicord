/**
class Something {
	constructor(obj) {
		this.f = Math.random();
		(this.run.bind(Object.assign(this, obj)))();
	}

	run() {
		return console.log(this.toString());
	}

	toString() {
		return `[${typeof this}]`
	}
}

const e = new Something({ e: Math.E });
*/

/**
const promise = () => {
	return new Promise((res, rej) => {
		let r = Math.random();
		if (r > Math.random()) {
			res(r);
		} else {
			rej(r);
		}
	});
}

(async () => {
	try {
		const r = promise();
		console.log(r);
	} catch(error) {
		console.error('ERROR', error)
	}
})();
*/


/**
const { Collection } = require('discord.js');

const e = new Collection();
e.set('124354164144313454013', {
	user: 'another someone who blah blah#0045',
	time: new Date(Date.now()),
	won: Math.floor(Math.random() * 500) * 1000
});
e.set('444646113', {
	user: 'maybe someone idk lol#5421',
	time: new Date(Date.now()),
	won: Math.floor(Math.random() * 600) * 1000
});
const obj = {};
e.keyArray().forEach(w => {
	obj[w] = e.get(w)
});

const l = () => {
	console.log(Date.now());
	console.clear();
	return l();
}
console.log(l());
*/