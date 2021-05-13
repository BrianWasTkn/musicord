const TagError = require('./TagError');
const Token = require('./Token');
const Tag = require('./Tag');

function getMissingDeps(ctx) {
	const missing = [];
	// if (!ctx) { return ['msg']; }

	// if (!ctx.guild) missing.push('guild');
	// if (!ctx.channel) missing.push('channel');
	// if (!ctx.author) missing.push('author');
	return missing;
}

/**
 * @param {Token[]} tokens
 * @param {any} ctx
 * @param {Map<string, Tag>} tags
*/
async function interpret(tokens = [], ctx, tags) {
	const output = [];
	const errors = [];

	// Parse multiple args.
	/**
	 * @param {Token[]} tkns
	*/
	async function parseArgs(tkns) {
		const out = [];

		if (!tkns || !tkns.length) return [];
		for (const tkn of tkns) {
			const returned = await interpret(tkn, ctx, tags);
			errors.push(...returned.errors);
			out.push(returned.output);
		}

		return out;
	}

	// Parse only one argument.
	/**
	 * @param {string} arg
	*/
	async function parseArg(arg) {
		if (!arg) return;
		const [ret] = await parseArgs([arg], ctx);
		return ret;
	}

	// The main thing
	for (const token of tokens) {
		if (!token) continue;

		if (token.type === 'BRACKETGROUP') {
			const thisToken = token.value.shift();
			// console.log({ thisToken })
			const tag = tags.get(thisToken.value.toLowerCase());
			// console.log({ tag })

			let args = token.value;
			if (tag && !tag.config.dontParse) {
				args = await parseArgs(token.value);
				// console.log('not parsing')
			}
			if (tag) {
				// console.log('breh')
				const missing = getMissingDeps(ctx);
				if (missing.length >= 1) {
					output.push(missing);
					continue;
				}

				try {
					let textArgs = [];
					if (tag.config.dontParse) {
						textArgs = args.map(a => {
							let val = '';
							for (const x of a) {
								val += Array.isArray(x.value)
									? x.value[0].value
									: x.value;
							}

							return val;
						});
					}

					// console.log({ textArgs })

					const out = await tag.fn({ 
						ctx, parseArgs, parseArg, textArgs 
					}, args, { 
						output, errors 
					});

					output.push(out);
				} catch(e) {
					if (e instanceof TagError) {
						errors.push(e);
					} else {
						if (e instanceof Error) throw e;
						throw new Error(e);
					}

					output.push(`{${thisToken.value}-ERROR${errors.length}-${e.message.split(' ').join('-').toLowerCase().replace(/[^A-z-]/g, '')}}`);
				}

				continue;
			}

			output.push(`{${thisToken.value}}`);
			continue;
		}

		output.push(token.value);
	}

	return { errors, output: output.join(' ').trim() };
}

module.exports = interpret;