/** 
 * BrianWasTkn 2020
 * 
 * Some strings and functions we can return so we
 * wouldn't dig down to every class/command/listeners.
*/

import { 
	red, 
	orange,
	yellow,
	green,
	blue,
	indigo,
	purple,
	blurple,
	greyple,
	pink,
	gold,
	aqua
} from './colors.js'

/** Permission Strings */
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

/** Requirement Strings */
export const Require = {
	JOIN_VOICE: 'Please join a voice channel first!',
	ROLE_DJ: 'You need to have the {dj} role!',
	PERMISSIONS: 'Make sure you have permissions to {perm} and try again.',
	PLAY_SOMETHING: 'Please enter a valid music source link, a search query or a direct stream URL.',
	NUMBER_ONLY: 'Unable to parse {num} as a valid number.'
}

/** Colors */
export const Colors = {
	red, 
	orange,
	yellow,
	green,
	blue,
	indigo,
	purple,
	blurple,
	greyple,
	pink,
	gold,
	aqua
}