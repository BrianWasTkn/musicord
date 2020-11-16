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

	/** Parse Time */
	parseTime(time) {
    const methods = [
      { name: 'day', count: 86400 },
      { name: 'hour', count: 3600 },
      { name: 'minute', count: 60 },
      { name: 'second', count: 1 }
    ];

    const parsed = [ 
    	`${Math.floor(time / methods[0].count).toString()} ${methods[0].name}` 
    ];
    for (let i = 0; i < 3; i++) {
      parsed.push(`${Math.floor(time % methods[i].count / methods[i + 1].count).toString()} ${Math.floor(time % methods[i].count / methods[i + 1].count) > 1 ? `${methods[i + 1].name}s` : methods[i + 1].name}`);
    }

    return parsed.filter(g => !g.startsWith('0')).join(', ');
  }
}