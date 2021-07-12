function parse(time, short = false, returnArray = false) {
	const methods = [
			{ name: ['mo', 'month'], count: 2592000 },
			{ name: ['d', 'day'], count: 86400 },
			{ name: ['h', 'hour'], count: 3600 },
			{ name: ['m', 'minute'], count: 60 },
			{ name: ['s', 'second'], count: 1 },
		];

		/**
		 * Pluralize time method names.
		*/
		const pluralize = (str, num) => {
			if (short || num <= 1) return str;
			return `${str}s`;
		};

		/**
		 * Joins "and" onto our second to the last and last index of array.
		*/
		const and = arr => {
			const secondToLast = arr[arr.length - 2];
			const last = arr.pop();
			return [...arr.slice(0, arr.length - 1), [secondToLast, last].join(' and ')];
		}

		const fCount = Math.floor(time / methods[0].count);
		const timeStr = [`${fCount.toString()}${short ? '' : ' '}${pluralize(methods[0].name[short ? 0 : 1], fCount)}`];
		for (let i = 0; i < methods.length - 1; i++) {
			const mathed = Math.floor((time % methods[i].count) / methods[i + 1].count);
			timeStr.push(`${mathed.toString()}${short ? '' : ' '}${pluralize(methods[i + 1].name[short ? 0 : 1], mathed)}`);
		}

		const filtered = timeStr.filter(ts => !ts.startsWith('0'));
		if (returnArray) return filtered;
		return filtered.length > 1 ? and(filtered).join(', ') : filtered[0];
}

console.log(parse(1.5));



// const progressBar = (percent = 1, filledChar = '■', emptyChar = '□') => {
// 	return `${filledChar.repeat(percent)}${emptyChar.repeat(10 - percent)}`;
// };

// const xp = 500000;
// const cost = 100;
// const maxLevel = 5001;

// class Experience {
// 	constructor(obj) {
// 		Object.assign(this, obj);
// 	}
// }

// class Level {
// 	constructor(obj) {
// 		Object.assign(this, obj);
// 	}
// }

// const exp = () => {
// 	const nextXP = Math.min((Math.trunc(xp / cost) + 1) * cost, maxLevel * cost);
// 	const barable = Math.round((cost - (nextXP - xp)) / (cost / 10));
// 	console.log(new Experience({ cost, xp, nextXP, barable, bar: progressBar(barable) }));
// };

// const level = () => {
// 	const level = Math.trunc(xp / cost);
// 	const nextLevel = Math.min(level + 1, maxLevel);
// 	const barable = Math.round((cost - ((nextLevel * cost) - xp)) / (cost / 10));
// 	console.log(new Level({ cost, xp, level, nextLevel, barable, bar: progressBar(barable) }));
// };

// exp();
// level();




// const random = (a, b) => Math.floor(Math.random() * (b - a + 1) + a);
// console.log(
// 	Array(1e5).fill(null)
// 	.map(() => {
// 		return random(1000, 20000)
// 	})
// 	.reduce((p, c) => {
// 		return p + c;
// 	}, 0)
// 	.toLocaleString()
// );


// const e = [
// 	{ n: 'card', },
// 	{ n: 'cheese', },
// 	{ n: 'taco', },
// 	{ n: 'bacon', },
// ];

// console.log(e.map(f => f.n).sort().map((h, i) => e.find(f => f.n === h)));


// const url = new URLSearchParams();
// url.set('avatar1', 'some/avatar.png');
// console.log(url.toString());


// const { AkairoHandler } = require('discord-akairo');
// const dir = require('path').join(__dirname, 'src', 'typings');
// const d = AkairoHandler.readdirRecursive(dir);
// console.log(d);


// const rand = array => array[Math.floor(Math.random() * array.length)];
// const filt = (a, b) => a.filter(s => !b.some(f => f === s));
// const r = (array, amount = 1) => {
// 	const randoms = [];
		
// 	array.forEach((_, i, a) => {
// 		const random = rand(filt(a, randoms));
// 		return randoms.push(random);
// 	});

// 	return randoms.slice(0, amount);
// };

// for (let i = 0; i < 10; i++) {
// 	console.log(r([1, 2, 3], 2));
// }


// class Test {
// 	constructor() {
// 		return 'lol'
// 	}
// }

// const a = new Test();
// const b = new Test();
// console.log({
// 	instance: Test.instance,
// 	shit: { a, b },
// });


// require('module-alias/register');
// require('dotenv').config();

// const { CurrencyModel } = require('lava/index');
// const db = require('mongoose');
// console.log('oop')
// const ok = async () => {
// 	const con = await db.connect(process.env.MONGO_URI, {
// 		useUnifiedTopology: true,
// 		useNewUrlParser: true
// 	});

// 	const lb = await CurrencyModel.find({}).sort({ 'props.pocket': 'desc' }).exec();
// 	return lb.map(e => {
// 		e.props.pocket = 0; 
// 		return e.save();
// 	});
// };

// ok().then(sh => Promise.all(sh)).then(e => e.map(f => f.props.pocket)).then(console.log);



// let b = 5e5;
// let e = (b + (b * 3));
// e = e + (e * (100 / 1000));

// console.log(Math.round(e).toLocaleString());



// require('module-alias/register');
// const lava = require('lava');

// console.log(lava);

// import 'dotenv/config';
// import { Client, Intents, MessageAttachment } from 'discord.js';
// import fetch from 'node-fetch';

// const bot = new Client({ intents: Intents.ALL });

// class Imgen {
// 	/** @param {string} apiURL */
// 	constructor(apiURL) {
// 		/** @type {string} */
// 		this.apiURL = apiURL;
// 	}

// 	get token() {
// 		return process.env.MEME_TOKEN;
// 	}

// 	/**
// 	 * Generate an image from a certain endpoint.
// 	 */
// 	generate(endpoint, body) {
// 		return fetch(`${this.apiURL}/${endpoint}`, {
// 			body: JSON.stringify(body),
// 			method: 'POST',
// 			headers: {
// 				Authorization: this.token,
// 			},
// 		})
// 		.then(e => e.buffer());
// 	}
// }

// const imgen = new Imgen('https://dankmemer.services');

// bot.on('ready', () => console.log('uwu'));
// bot.on('message', async m => {
// 	if (m.content === 'plx meme') {
// 		const nice = await imgen.generate('changemymind', { text: m.content });
// 		console.log(nice);
// 		return await m.channel.send({ files: [new MessageAttachment(nice, 'cmm')] });
// 	}
// });

// await bot.login(process.env.DISCORD_TOKEN);