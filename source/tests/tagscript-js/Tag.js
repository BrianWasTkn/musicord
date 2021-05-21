
/**
 * @typedef {Function} TagFunction
 * @type {(this: Tag, ctx: any, args?: string) => any}
*/


module.exports = class Tag {
	/**
	 * @param {TagFunction} fn
	 * @param {TagConfig} cfg
	*/
	constructor(fn, cfg) {
		this.config = cfg;
		this.fn = fn.bind(this);
	}
}