/**
 * string to codeBlock string
 * @param {String} string the content to be codeBlocked
 * @param {String} syntax the language for syntax highlighting
 */
export const codeBlock = (string, syntax = null) => {
	return `\`\`\`${syntax}\n${string}\n\`\`\``;
}

/**
 * escape all special, common chars
 * @param {String} string the text to be sanitized
 */
export const sanitize = (string) => {
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

export const fancyText = (emoji, title, message) => {
	return `**__${emoji} | ${title}__**\n${message}`
}