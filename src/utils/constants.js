/** 
 * BrianWasTkn 2020
 * 
 * Some strings and functions we can return so we
 * wouldn't dig down to every class/command/listeners.
*/

import { red, blue, green } from './colors.js'

import discord from 'discord.js'

/**
 * Permission Strings
 * @returns {String|Array<String>}
*/
export const Permissions = {
	_text: [this.EMBED_LINKS, this.READ_MESSAGES, this.SEND_MESSAGES],
	_voice: [this.CONNECT, this.SPEAK],
	CONNECT: 'connect',
	SPEAK: 'speak',
	MOVE_MEMBERS: 'move members',
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
	missingPerms: 'Make sure you have permissions to {perm} and try again.',
	somethingToPlay: 'Please enter a valid music source link, a search query or a direct stream URL.',
	numberPlease: 'Unable to parse {num} as a valid number.'
}

/**
 * Player Limits
*/
export const Limits = {
	search: { min: 1, max: 10},
	volume: { min: 0, max: 100 }
}