
/**
 * @typedef {string} TokenType
 * * `BRACKETGROUP`
 * * `RBRACKET`
 * * `LBRACKET`
 * * `SEMI`
 * * `EOF`
 * * `NONE`
*/

/**
 * @typedef {object} Token
 * @property {TokenType} type
 * @property {string|string[]|string[][]} value
*/

/**
 * @type {Token}
*/
module.exports = class Token {
	/**
	 * @param {TokenType} type
	 * @param {string|string[]|string[][]} value
	*/
	constructor(type, value) {
		return { type, value };
	}
}