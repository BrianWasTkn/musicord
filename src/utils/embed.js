/**
 * BrianWasTkn 2020
 * An embed generator for Musicord
*/

import { blue, red } from './colors.js'
import { Colors } from './constants.js'
import config from '../config.js'

/** Simple Embed */
export const simpleEmbed = (message, content) => {
	return {
		color: blue,
		author: {
			name: slice(content, 256),
			iconURL: message.client.user.avatarURL()
		}
	}
}

/** Dynamic Embed */
export const dynamicEmbed = ({ 
	author = {}, 
	title = null,
	icon = null,
	color = 'RANDOM', 
	info = null, 
	fields = [], 
	footer = {}
} = {}) => {
	return {
		embed: {
			author: {
				name: slice(author.text, 256),
				iconURL: author.icon
			},
			title: slice(title, 256),
			thumbnail: icon,
			color: Colors[color.toLowerCase()],
			description: slice(info, 2000),
			fields: Object.entries(fields).map(f => ({
				name: slice(f[0], 256),
				value: slice(f[1].content, 1000),
				inline: f[1].inline || false
			})),
			footer: {
				text: slice(footer.text, 256),
				iconURL: footer.icon
			}
		}
	}
}

/** Error Embed */
export const errorEmbed = (message, error) => {
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