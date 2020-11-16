export default class Utilities {
	constructor() {}

	/** Text Sanitizer */
	sanitize(string) {
		if (string instanceof String) {
			return string
				.replace(/\*/g, "*" + String.fromCharCode(8203))
				.replace(/_/g, "_" + String.fromCharCode(8203))
				.replace(/>/g, ">" + String.fromCharCode(8203))
				.replace(/`/g, "`" + String.fromCharCode(8203))
				.replace(/\|/g, "|" + String.fromCharCode(8203))
				.replace(/@/g, "@" + String.fromCharCode(8203));
		} else {
			return string;
		}
	}

	/** Codeblock Text */
	codeBlock(string, syntax = null) {
		return `\`\`\`${syntax}\n${string}\n\`\`\``;
	}

	/** Embedify */
	embedify({ author, title, color, description, fields, footer } = {}) {
		return {
			author,
			title,
			color,
			description,
			fields,
			footer
		}
	}

	/** TODO: Unembedify */
	unembedify(embed) {
		if(!embed instanceof Object) {
			return new Error('NoEmbed')
		}
	}
}