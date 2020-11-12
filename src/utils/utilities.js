
export default {
	codeBlock: (string, syntax = null) => {
		return `\`\`\`${syntax}\n${string}\n\`\`\``;
	},

	sanitize: (string) => {
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
	},

	fancyText: (emoji, title, message) => {
		return `**__${emoji} | ${title}__**\n${message}`
	}
}