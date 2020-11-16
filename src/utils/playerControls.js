import { logError } from './logger.js'

export const react = (msg, emojis) => {
	try {
		for (const emoji of emojis) {
			setTimeout(async () => {
				msg.react(emoji)
			}, 1000);
		}
	} catch (error) {
		logError('Utilities', 'Unable to run playerControls', error)
	}
}