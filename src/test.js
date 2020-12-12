function randomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

const roll = () => {
	let min = 100, max = 500, limit = 750;
	let odds = Math.random();

	// multi = randomNumber(
	// 	0 + Math.floor((1 - (1 - (Math.floor(odds * 100) / 100))) * 100),
	// 	100 - Math.floor((1 - (Math.floor(odds * 100) / 100)) * 100)
	// )

	
	if (odds > 0.9) {
		multi = randomNumber(90, 100);
	} else if (odds > 0.7) {
		multi = randomNumber(70, 90);
	} else if (odds > 0.5) {
		multi = randomNumber(50, 70);
	} else if (odds > 0.3) {
		multi = randomNumber(30, 50);
	} else if (odds > 0.1) {
		multi = randomNumber(10, 30);
	} else {
		multi = randomNumber(1, 10);
	}
	
	let won = randomNumber(min, max);
	let raw = won;
	won += Math.floor(won * (multi / 100));
	if (won > limit) won = (limit * 1000 + 1) / 1000;
	won *= 1000; raw *= 1000;
	console.log({ 
		min, max, multi, limit, won, raw
	});
}

const timeout = () => {
	setTimeout(() => {
		roll();
		timeout();
	}, 1000);
}

roll();
timeout();

/**
let items = [
	{ v: 12 },
	{ v: 15 },
	{ v: 5 }
]

items = items.sort((p, c) => p.v - c.v);

console.log(items)
*/

/**
import { Discord } from './another'

export function run() { new Discord('e'); }
*/

/**
const { Collection } = require('discord.js');

const perms = new Collection([
	['MESSAGE', 'yes'],
	['READ', 'yes'],
	['CONNECT', 'yes'],
	['SPEAK', 'yes'],
	['WRITE', false]
])

const req = ['MESSAGE', 'READ', 'CONNECT', 'SPEAK', 'WRITE', 'BAN'];

if (!req.some(perm => !perms.has(perm))) {
	let needed = req.filter(perm => !perms.get(perm) || !perms.includes(perm));
	console.log(needed);
}
*/