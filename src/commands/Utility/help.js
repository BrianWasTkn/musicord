import { Command } from '../../lib/Command/Command.js'

export default new Command({
	name: 'help',
	aliases: ['cmds'],
	cooldown: 3000
}, async (msg) => {
	const { client } = msg;
	const
});