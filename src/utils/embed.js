/**
 * BrianWasTkn 2020
 * An embed generator for Musicord
*/

import { blue, red } from './colors.js'
import { Colors } from './constants.js'
import { codeBlock } from './text.js'
import config from '../config.js'

/** Simple Embed */
export const simpleEmbed = ({ 
	title = null,
	color = 'RANDOM',
	info = null,
	footer = {}
} = {}) => {
	return dynamicEmbed({
		title: title,
		color: color,
		text: info,
		footer: {
			text: footer.text,
			icon: footer.icon
		}
	});
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
export const errorEmbed = ({ 
	title = null,
	error = null,
	footer = {}
} = {}) => {
	return dynamicEmbed({
		title: title,
		color: color,
		text: codeBlock(slice(error.stack, 2000), 'js'),
		fields: {
			'Error Message': { 	content: error.message },
			'Support': {		content: 'Join our [discord server](https://discord.gg/memer) for support', inline: true }
		},
		footer: {
			text: footer.text,
			icon: footer.icon
		}
	});
}

const slice = (string, length) => {
	return string.length > length 
	? `${string.substr(0, length - 3)}...` 
	: string;
}