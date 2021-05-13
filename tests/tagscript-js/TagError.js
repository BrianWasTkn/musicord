module.exports = class TagError extends Error {
	/**
	 * @param {string} raw
	 * @param {object} [args]
	 * @param {string} [args.ref]
	*/
	constructor(raw, { ref } = {}) {
		super(raw);
		this.ref = ref;
	}
}