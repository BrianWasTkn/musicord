
let items = [
	{ v: 12 },
	{ v: 15 },
	{ v: 5 }
]

console.log(items.sort((p, c) => c.v - p.v))

/**
const obj = { e: Math.E },
another = { pi: Math.PI }

function log() {
	let { e } = this.obj, { pi } = this.another;
	return console.log({ e, pi });
}

const func = log.bind({ obj, another });
func();
*/

/**
const { Collection } = require('discord.js');

const winners = new Collection();
winners.set('691416705917779999', [{
	coins: 5e3,
	timestamp: new Date().getHours()
}]);

if (winners.has('691416705917779999')) {
	winners.get('691416705917779999').push({
		coins: 1e4,
		timestamp: Date.now()
	});
}

console.log(winners);
*/

/**
const random = (min, max) => {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

const roll = () => {
	let { thres, limit, multi } = {
		thres: 1e5, limit: 6e5, multi: Math.floor(Math.random() * 100)
	}

	let inc = thres + Math.floor(thres * (multi / 100));
	thres /= 1e3;
	let coins = random(thres, inc / 1e3);
	coins = Math.floor(coins + (coins * (multi / 100)));
	console.log({
		coins: (coins * 1e3).toLocaleString(),
		thres: thres * 1e3, multi
	})
}

const rolrl = () => {
	let { min, max, limit, multi, odds } = { 
		min: 1e5, max: 5e5, limit: 6e5, multi: randomNum(20, 100),
		odds: Math.random()
	};

	min = Math.floor(min + (min * (multi / 100)));

	let coins = random(min / 1e3, max / 1e3);
	coins = Math.floor(coins + (coins * odds)) / 1e3 * 1e3;
	if (coins > limit) coins = limit;
	console.log({
		coins: (coins * 1e3).toLocaleString(),
		min, odds: Math.floor(odds * 100), max
	})
}

const int = () => {
	roll();
	const timeout = () => {
		setTimeout(() => {
			roll();
			timeout();
		}, 1000);
	}
	timeout();
}

int();
*/

/**
const e = (time) => {
	setTimeout(() => {
		console.log(Date.now());
		e(Math.random() * 3)
	}, Math.floor(time) * 1e3);
}

e(1);
*/

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