import Command from '../../classes/Command/Utility.js'
import { log } from '../../utils/logger.js'
import { simpleEmbed, dynamicEmbed } from '../../utils/embed.js'

export default new Command({
	name: 'repl',
	description: 'Start a REPL environment.',
	usage: 'command'
}, async (bot, command, args) => {
	// TODO: smh
})