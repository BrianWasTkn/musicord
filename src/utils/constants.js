/** 
 * BrianWasTkn 2020
 * 
 * Some strings and functions we can return so we
 * wouldn't dig down to every class/command/listeners.
*/

import { red, blue, green } from './colors.js'

import discord from 'discord.js';

/**
 * Missing Permission Embed
 * @returns {discord.Message}
*/
export const embedMissingPermissions = ({ message, content, p }) => {
	return message.channel.send({
		embed: {
			title: 'Missing Permissions',
			color: red,
			description: msg,
			fields: [
				{ name: `${p.length} missing permission${p.length > 1 ? 's' : ''}`, value: `\`${p.join('`, `')}\`` }
			]
		}
	})
}

/**
 * Permission Strings
 * @returns {String}
*/
export const Permissions = {
	// Voice
	_voice: `${this.CONNECT} and ${this.SPEAK}`,
	CONNECT: 'connect to the voice channel',
	SPEAK: 'speak in the voice channel',
	MOVE_MEMBERS: 'move members in and out of the voice channel',
	PRIORITY_SPEAKER: 'priority to speak',

	// Text
	_embed: `${this.EMBED_LINKS}, ${this.READ_MESSAGES} and ${this.SEND_MESSAGES}`,
	EMBED_LINKS: 'embed links',
	READ_MESSAGES: 'read messages',
	SEND_MESSAGES: 'send messages'
}

/**
 * Requirement Strings
 * @returns {String}
*/
export const Require = {
	joinVoice: 'Please join a voice channel first!',
	djRole: 'You need to have the {dj} role!',
	missingPerms: 'Make sure you have permissions to {perm} and try again.'
	somethingToPlay: 'Please enter a valid music source link, a search query or a direct stream URL.',
	numberPlease: 'Unable to parse {num} as a valid number.',
}

/**
 * Player Limits
*/
export const Limits = {
	search: { min: 1, max: 10},
	volume: { min: 0, max: 100 }

}