function Time(num) {
	this.num = num;
}

/** 
 * @param {number} time time in seconds
 */
Time.prototype.parseTime = function parseTime(time) {
	const methods = [
		{ name: 'year', count: 31104000 },
    { name: 'month', count: 2592000 },
	  { name: 'day', count: 86400 },
	  { name: 'hour', count: 3600 },
	  { name: 'minute', count: 60 },
	  { name: 'second', count: 1 },
	];

	/**
	 * @param {string} string
	 * @param {number} num
	*/
	function pluralize(string, num) {
		return num > 1 ? `${string}s` : string;
	}

	const raw = Math.floor(time / methods[0].count);
	const timeStr = [raw.toString() + ' ' + pluralize(methods[0].name, raw)];
	for (let i = 0; i < (methods.length - 1); i++) {
		const raw = (time % methods[i].count) / methods[i + 1].count;
	  const calced = Math.floor(raw);
	  timeStr.push(calced.toString() + ' ' + pluralize(methods[i + 1].name, calced));
	}

	return timeStr.filter((g) => !g.startsWith('0'));
}

/** @param {Array<*>} arr */
Time.prototype.join = function join(arr) {
	const secondToLast = arr[arr.length - 2];
	const last = arr.pop();
	return [...arr.slice(0, arr.length - 1), [secondToLast, last].join(' and ')];
}

/** @param {Time} this */
Time.prototype.see = function see() {
	return this.num;
}

const runner = require('discord-akairo/src/commands/arguments/ArgumentRunner');
console.log(runner);

const time = new Time(5);
// console.log(time.see());
// global.console.log(~~0);

/** @type {number} */
const and = time.parseTime((60 * 60 * 24 * 30 * 12 * 5) 
	+ (60 * 60 * 24 * 30 * 3)
	+ (60 * 60 * 24 * 15)
	+ (60 * 60 * 15)
	+ (60 * 15)
	+ (15));

// console.log(and.length === 2 
// 	? and.join(' and ') 
// 	: and.length >= 3 
// 		? join(and).join(', ')
// 		: parseTime(and)
// );
