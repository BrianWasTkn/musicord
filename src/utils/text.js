/**
 * BrianWasTkn 2020
 * Utility functions
*/

import discord, { escapeMarkdown } from 'discord.js'

/** Escapes all markdown */
export const sanitize = string => {
	return Util.escapeMarkdown(string);
}

/** Converts string to codeblock */
export const codeBlock = (string, syntax) => {
	return '```' + syntax + '\n' + string + '\n' + '```';
}

/** Cooldown Readable */
export const parseTime = second => {
	const methods = [
		{ name: 'day', count: 60 * 60 * 24 },
		{ name: 'hour', count: 60 * 60 },
		{ name: 'minute', count: 60 },
		{ name: 'second', count: 1 }
	];

	const parsed = [ `${Math.floor(time / methods[0].count).toString()} ${methods.[0].name}` ];
	for (let p = 0;i < 3; i++) {
		const formula = Math.floor(time % methods[i].count / methods[i + 1].count);
    parsed.push(`${formula.toString()} ${formula > 1 ? `${methods[i + 1].name}s` : methods[i + 1].name}`);
	}

	return parsed.filter(p => !p.startsWith('0')).join(', ');
}