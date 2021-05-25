// const param = new URLSearchParams();
// param.append('text', 'lol imagine');
// console.log(JSON.stringify({
// 	text: 'owo'
// }).text)

// await import('dotenv').then(env => env.config());
// import { MessageAttachment } from 'discord.js';
// import fetch from 'node-fetch';

// const base = 'https://dankmemer.services/api';
// const params = new URLSearchParams();
// params.set('text', 'dank memer is the best owo');

// const gen = await fetch(`${base}/changemymind`, {
// 	method: "POST",
// 	body: JSON.stringify({
// 		text: 'owo'
// 	}),
// 	headers: {
// 		Authorization: process.env.MEME_TOKEN,
// 		'Content-Type': 'application/json'
// 	}
// }).then(async r => new MessageAttachment(await r.text(), 'hey girl welcome to me crib'));

// console.log(gen)

// console.log(JSON.stringify({ 'bruh': 5 }));

// const body = {
// 	text: 'dank memer is the best'
// }
// 
// const changeMyMind = await fetch(`${base}`, { 
// 	method: 'POST',
// 	body: JSON.stringify(body),
// 	headers: {
// 		"Authorization": process.env.MEME_TOKEN,
// 		"Content-Type": 'application/json'
// 	}
// }).then(async r => new MessageAttachment(await r.text()));
//
// console.log(changeMyMind);

// console.time('e');
// await new Promise(res => setTimeout(res, 5e3));
// console.timeEnd('e');

// import { Client, Intents } from 'discord.js';
// const bot = new Client({ intents: Intents.ALL });

// bot
// 	.on('ready', () => console.log(bot.user))
// 	.on('message', m => console.log(`${m.author.tag}: ${m.content}`))

// const token = await bot.login('some token');
// console.log(token);


// -------------------- node v13 ------------------------

// async function owa (o) {
// 	const owo = {
// 		cat: new Promise(res => setTimeout(() => res(o), o * 1e3)),
// 		dog: new Promise(res => setTimeout(() => res(o * 5), o * 1e3)),
// 	}

// 	return console.log(await owo.cat);
// }

// owa(5)

// console.log('breh');
// setTimeout(() => console.log('owa owa'), 5e3);

// const a = {
// 	owo: 'uwu',
// 	// owa: 'owa'
// };

// console.log(Object.assign({ 'owo': 'default owo', 'owa': 'def owa' }, a))


// class Token {
// 	constructor(type, value) {
// 		return { type, value };
// 	}
// }


// const volatile = new Map();
// const fns = {
// 	math: (m) => eval(m),
// 	set: (k, v) => volatile.set(k, v), 
// 	get: (v) => volatile.get(v), 
// };

// class Lexer {
// 	/**
// 	 * @param {string} script the script
// 	*/
// 	static lex(script) {
// 		const tokens = [];
// 		let content = script.split(/(\{|\}|;)/);
// 		content = content.map((c, i) => {
// 			return (c == '' && 
// 				(content[i + 1] === '{' || 
// 				content[i - 1] === '}')
// 			) ? undefined : c;
// 		}).filter((c) => c !== undefined);

// 		for (const token of content) {
// 			switch(token) {
// 				case '{':
// 					tokens.push(new Token('LBRACKET', token));
// 					break;
// 				case '}':
// 					tokens.push(new Token('RBRACKET', token));
// 					break;
// 				case ';':
// 					tokens.push(new Token('SEMI', token));
// 					break;
// 				default:
// 					tokens.push(new Token('WORD', token));
// 					break;
// 			}
// 		}

// 		tokens.push(new Token('EOF', ''));
// 		return tokens;
// 	}
// }

// const s = '{channel.send}';

// /**
//  * @param {Token[]} tokens
//  * @param {...string} args
// */
// function run(tokens, ...args) {
// 	/** @type {string} */
// 	let word = tokens.map(t => t.value).filter(v => v.split('.')[0] !== undefined);
// 	if (word.length >= 1) word = word[0];
// 	return fns[word](...args);
// }

// const lexed = Lexer.lex(s);
// console.log(run(lexed, ));







// // const args = process.argv.filter(arg => arg.startsWith('--'));
// // console.log(args.includes('--epic') ? 'Very Epic' : 'Not Epic');

// // class Nick {}
// // console.log(Nick()); // ok nvm

// // /** @param {number} sched */
// // function get(sched) {
// //   const total = Date.parse(new Date(sched)) - Date.parse(new Date());
// //   const floor = n => Math.floor(n);

// //   let seconds = floor((total / 1e3) % 60);
// //   let minutes = floor((total / 1e3 / 60) % 60);
// //   let hours = floor((total / (1e3 * 60 * 60)) % 24);
// //   let days = floor(total / (1e3 * 60 * 60 * 24));

// //   return { total, seconds, minutes, hours, days };
// // }

// // function init(sched) {
// //   function update() {
// //     const t = get(sched);
// //     console.log(t);
// //     if (t.total <= 0) {
// //       clearInterval(interval);
// //     }
// //   }

// //   update();
// //   const interval = setInterval(update, 1e3);
// // }

// // const sched = Date.now() + 10 * 1e3;
// // init(sched);

// /**
//  * An async queue that preserves the stack and prevents lock-ups.
//  * @private
//  */
// // class AsyncQueue {
// //   constructor() {
// //     /**
// //      * The promises array.
// //      * @type {Array<{promise: Promise<void>, resolve: Function}>}
// //      * @private
// //      */
// //     this.promises = [];
// //   }

// //   /**
// //    * The remaining amount of queued promises
// //    * @type {number}
// //    */
// //   get remaining() {
// //     return this.promises.length;
// //   }

// //   *
// //    * Waits for last promise and queues a new one.
// //    * @returns {Promise<void>}
// //    * @example
// //    * const queue = new AsyncQueue();
// //    * async function request(url, options) {
// //    *     await queue.wait();
// //    *     try {
// //    *         const result = await fetch(url, options);
// //    *         // Do some operations with 'result'
// //    *     } finally {
// //    *         // Remove first entry from the queue and resolve for the next entry
// //    *         queue.shift();
// //    *     }
// //    * }
// //    *
// //    * request(someUrl1, someOptions1); // Will call fetch() immediately
// //    * request(someUrl2, someOptions2); // Will call fetch() after the first finished
// //    * request(someUrl3, someOptions3); // Will call fetch() after the second finished
   
// //   wait() {
// //     const next = this.promises.length ? this.promises[this.promises.length - 1].promise : Promise.resolve();
// //     let resolve;
// //     const promise = new Promise(res => {
// //       resolve = res;
// //     });

// //     this.promises.push({
// //       resolve,
// //       promise,
// //     });

// //     return next;
// //   }

// //   /**
// //    * Frees the queue's lock for the next item to process.
// //    */
// //   shift() {
// //     const deferred = this.promises.shift();
// //     if (typeof deferred !== 'undefined') deferred.resolve();
// //   }
// // }

// *
//  * @typedef {object} QueueData
//  * @property {Function} resolve
//  * @property {object} promise
//  * @property {Context} promise.ctx
//  * @property {Command} promise.cmd
//  * @property {Promise} promise.promise


// // class CommandQueue {
// // 	constructor() {
// // 		/** @type {QueueData[]} */
// // 		this.queues = [];
// // 	}

// // 	/**
// // 	 * @param {{ ctx: Context, cmd: Command }} args
// // 	*/
// // 	wait(args) {
// // 		const next = this.queues.length ? this.queues[this.queues.length - 1].promise : Promise.resolve();
// // 		let resolve; const promise = new Promise(res => { resolve = res });
// // 		this.queues.push({ promise: { ...args, promise }, resolve });
// // 		return next;
// // 	}

// // 	next() {
// // 		const next = this.queues.shift();
// // 		if (typeof next !== 'undefined') {
// // 			next.resolve();
// // 		}
// // 	}
// // }

// // class Context {
// // 	constructor(oop) {
// // 		this.author = { id: 'h2621646211060nd50' };
// // 		this.content = oop || 'nice';
// // 	}
// // }

// // class Command {
// // 	/** @param {Context} ctx */
// // 	exec(ctx) {
// // 		return ctx.content;
// // 	}
// // }

// // const queue = new CommandQueue();
// // /** @param {string|number} args */
// // async function nice(args, time = 5e3) {
// // 	await queue.wait(args);
// // 	// console.log(m);
// // 	try {
// // 		const nice = await new Promise(res => setTimeout(res, time));
// // 		console.log(queue.queues.map(q => q.promise));
// // 	} finally {
// // 		queue.next();
// // 	}
// // }

// // function tryit(num = 100) {
// // 	try {
// // 		if (num > 50) {
// // 			console.log('what')
// // 			return num;
// // 		}
// // 		console.log('below 50')
// // 	} finally {
// // 		return 'finally';
// // 	}
// // }

// // const calc = (w, l) => w / (w + l);
// // console.log(calc(100, 100).toFixed(2) * 100)
// // console.log(process.argv)

// // console.log(tryit(15))

// // const instan = (m) => new Context(m);

// // (async () => {
// // 	await nice({ ctx: instan('3s'), cmd: new Command() }, 3e3);
// // 	await nice({ ctx: instan('5s'), cmd: new Command() }, 5e3);
// // 	await nice({ ctx: instan('10s'), cmd: new Command() }, 10e3);
// // })();

// // nice({ ctx: new Context('after 3 seconds'), cmd: new Command() }, 3e3)
// // .then(() => nice({ ctx: new Context('after 5s'), cmd: new Command() }, 5e3))
// // .then(() => nice({ ctx: new Context('after 10s'), cmd: new Command() }, 10e3));
// // console.log(queue)











// // const regex = /k/g;
// // console.log(['56k', '2.56e-3k']
// //   .map(k => k.replace(regex, ''))
// //   .map(k => k * 1e3)
// // );

// /*****************************/
// // function Time(num) {
// //   this.num = num;
// // }

// // /**
// //  * @param {number} time time in seconds
// //  */
// // Time.prototype.parseTime = function parseTime(time) {
// //   const methods = [
// //     { name: 'year', count: 31104000 },
// //     { name: 'month', count: 2592000 },
// //     { name: 'day', count: 86400 },
// //     { name: 'hour', count: 3600 },
// //     { name: 'minute', count: 60 },
// //     { name: 'second', count: 1 },
// //   ];

// //   /**
// //    * @param {string} string
// //    * @param {number} num
// //    */
// //   function pluralize(string, num) {
// //     return num > 1 ? `${string}s` : string;
// //   }

// //   const raw = Math.floor(time / methods[0].count);
// //   const timeStr = [raw.toString() + ' ' + pluralize(methods[0].name, raw)];
// //   for (let i = 0; i < methods.length - 1; i++) {
// //     const raw = (time % methods[i].count) / methods[i + 1].count;
// //     const calced = Math.floor(raw);
// //     timeStr.push(
// //       calced.toString() + ' ' + pluralize(methods[i + 1].name, calced)
// //     );
// //   }

// //   return timeStr.filter((g) => !g.startsWith('0'));
// // };

// // /** @param {Array<*>} arr */
// // Time.prototype.join = function join(arr) {
// //   const secondToLast = arr[arr.length - 2];
// //   const last = arr.pop();
// //   return [...arr.slice(0, arr.length - 1), [secondToLast, last].join(' and ')];
// // };

// // /** @param {Time} this */
// // Time.prototype.see = function see() {
// //   return this.num;
// // };

// // const time = new Time(5);
// // // console.log(time.see());
// // // global.console.log(~~0);

// // /** @type {number} */
// // const and = time.parseTime(
// //   60 * 60 * 24 * 30 * 12 * 5 +
// //     60 * 60 * 24 * 30 * 3 +
// //     60 * 60 * 24 * 15 +
// //     60 * 60 * 15 +
// //     60 * 15 +
// //     15
// // );

// // console.log(
// //   and.length === 2
// //     ? and.join(' and ')
// //     : time.join(and).length >= 3
// //     ? join(and).join(', ')
// //     : parseTime(and).join(', ')
// // );
