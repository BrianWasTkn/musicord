/**
 * BrianWasTkn 2020
 * An embed generator for Musicord
*/

import { blue, red } from './colors.js'
import config from '../config.js'

/** Simple Embed */
export const simpleEmbed = (message, content) => {
	return {
		color: blue,
		author: {
			name: slice(content, 200),
			iconURL: message.client.user.avatarURL()
		}
	}
}

/** Player Embed */
export const generatePlayerEmbed = ({ 
	author = {}, 
	title = null, 
	color = 'RANDOM', 
	info = null, 
	fields = [], 
	footer = {}
} = {}) => {
	return {
		embed: {
			author: {
				name: author.text,
				iconURL: author.icon
			},
			title: title,
			color: color,
			description: info,
			fields: Object.entries(fields).map(f => ({
				name: f[0],
				value: f[1].content,
				inline: f[1].inline || false
			})),
			footer: {
				text: footer.text,
				iconURL: footer.icon
			}
		}
	}
}

/** Simple but, Error embed */
export const generateErrorEmbed = (message, error) => {
	return {
		color: red,
		author: {
			name: slice(error.message, 200),
			iconURL: message.client.user.avatarURL()
		},
		fields: [
			{ name: 'Error', value: message.client.utils.codeBlock(slice(error.stack.toString(), 1000), 'js') },
			{ name: 'Support', value: `If this error still occurs multiple times, please join our [discord server](https://discord.gg/memer) for help and support.` }
		]
	}
}

const slice = (string, length) => {
	return string.length > length 
	? `${string.substr(0, length - 3)}...` 
	: string;
}