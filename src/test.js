
let items = [
	{ v: 12 },
	{ v: 15 },
	{ v: 5 }
]

items = items.sort((p, c) => p.v - c.v);

console.log(items)

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