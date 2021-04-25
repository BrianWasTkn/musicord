/**
 * An async queue that preserves the stack and prevents lock-ups.
 * @private
 */
class AsyncQueue {
  constructor() {
    /**
     * The promises array.
     * @type {Array<{promise: Promise<void>, resolve: Function}>}
     * @private
     */
    this.promises = [];
  }

  /**
   * The remaining amount of queued promises
   * @type {number}
   */
  get remaining() {
    return this.promises.length;
  }

  /**
   * Waits for last promise and queues a new one.
   * @returns {Promise<void>}
   * @example
   * const queue = new AsyncQueue();
   * async function request(url, options) {
   *     await queue.wait();
   *     try {
   *         const result = await fetch(url, options);
   *         // Do some operations with 'result'
   *     } finally {
   *         // Remove first entry from the queue and resolve for the next entry
   *         queue.shift();
   *     }
   * }
   *
   * request(someUrl1, someOptions1); // Will call fetch() immediately
   * request(someUrl2, someOptions2); // Will call fetch() after the first finished
   * request(someUrl3, someOptions3); // Will call fetch() after the second finished
   */
  wait() {
    const next = this.promises.length ? this.promises[this.promises.length - 1].promise : Promise.resolve();
    let resolve;
    const promise = new Promise(res => {
      resolve = res;
    });

    this.promises.push({
      resolve,
      promise,
    });

    return next;
  }

  /**
   * Frees the queue's lock for the next item to process.
   */
  shift() {
    const deferred = this.promises.shift();
    if (typeof deferred !== 'undefined') deferred.resolve();
  }
}

/**
 * @typedef {object} QueueData
 * @property {Function} resolve
 * @property {object} promise
 * @property {Context} promise.ctx
 * @property {Command} promise.cmd
 * @property {Promise} promise.promise
*/

class CommandQueue {
	constructor() {
		/** @type {QueueData[]} */
		this.queues = [];
	}

	/**
	 * @param {{ ctx: Context, cmd: Command }} args
	*/
	wait(args) {
		const next = this.queues.length ? this.queues[this.queues.length - 1].promise : Promise.resolve();
		let resolve; const promise = new Promise(res => { resolve = res });
		this.queues.push({ promise: { ...args, promise }, resolve });
		return next;
	}

	next() {
		const next = this.queues.shift();
		if (typeof next !== 'undefined') {
			next.resolve();
		}
	}
}

class Context {
	constructor(oop) {
		this.author = { id: 'h2621646211060nd50' };
		this.content = oop || 'nice';
	}
}

class Command {
	/** @param {Context} ctx */
	exec(ctx) {
		return ctx.content;
	}
}

const queue = new CommandQueue();
/** @param {string|number} args */
async function nice(args, time = 5e3) {
	await queue.wait(args);
	// console.log(m);
	try {
		const nice = await new Promise(res => setTimeout(res, time));
		console.log(queue.queues.map(q => q.promise));
	} finally {
		queue.next();
	}
}

// function tryit(num = 100) {
// 	try {
// 		if (num > 50) {
// 			console.log('what')
// 			return num;
// 		}
// 		console.log('below 50')
// 	} finally {
// 		return 'finally';
// 	}
// }

// console.log(tryit(15))

const instan = (m) => new Context(m);

(async () => {
	await nice({ ctx: instan('3s'), cmd: new Command() }, 3e3);
	await nice({ ctx: instan('5s'), cmd: new Command() }, 5e3);
	await nice({ ctx: instan('10s'), cmd: new Command() }, 10e3);
})();

// nice({ ctx: new Context('after 3 seconds'), cmd: new Command() }, 3e3)
// .then(() => nice({ ctx: new Context('after 5s'), cmd: new Command() }, 5e3))
// .then(() => nice({ ctx: new Context('after 10s'), cmd: new Command() }, 10e3));
// console.log(queue)











// const regex = /k/g;
// console.log(['56k', '2.56e-3k']
//   .map(k => k.replace(regex, ''))
//   .map(k => k * 1e3)
// );

/*****************************/
// function Time(num) {
//   this.num = num;
// }

// /**
//  * @param {number} time time in seconds
//  */
// Time.prototype.parseTime = function parseTime(time) {
//   const methods = [
//     { name: 'year', count: 31104000 },
//     { name: 'month', count: 2592000 },
//     { name: 'day', count: 86400 },
//     { name: 'hour', count: 3600 },
//     { name: 'minute', count: 60 },
//     { name: 'second', count: 1 },
//   ];

//   /**
//    * @param {string} string
//    * @param {number} num
//    */
//   function pluralize(string, num) {
//     return num > 1 ? `${string}s` : string;
//   }

//   const raw = Math.floor(time / methods[0].count);
//   const timeStr = [raw.toString() + ' ' + pluralize(methods[0].name, raw)];
//   for (let i = 0; i < methods.length - 1; i++) {
//     const raw = (time % methods[i].count) / methods[i + 1].count;
//     const calced = Math.floor(raw);
//     timeStr.push(
//       calced.toString() + ' ' + pluralize(methods[i + 1].name, calced)
//     );
//   }

//   return timeStr.filter((g) => !g.startsWith('0'));
// };

// /** @param {Array<*>} arr */
// Time.prototype.join = function join(arr) {
//   const secondToLast = arr[arr.length - 2];
//   const last = arr.pop();
//   return [...arr.slice(0, arr.length - 1), [secondToLast, last].join(' and ')];
// };

// /** @param {Time} this */
// Time.prototype.see = function see() {
//   return this.num;
// };

// const time = new Time(5);
// // console.log(time.see());
// // global.console.log(~~0);

// /** @type {number} */
// const and = time.parseTime(
//   60 * 60 * 24 * 30 * 12 * 5 +
//     60 * 60 * 24 * 30 * 3 +
//     60 * 60 * 24 * 15 +
//     60 * 60 * 15 +
//     60 * 15 +
//     15
// );

// console.log(
//   and.length === 2
//     ? and.join(' and ')
//     : time.join(and).length >= 3
//     ? join(and).join(', ')
//     : parseTime(and).join(', ')
// );
