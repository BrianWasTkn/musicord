const { Command } = require('discord-akairo')

module.exports = class UtilHelp extends Command {
	constructor() {
		super('help', {
			aliases: ['help', 'commands'],
			channel: 'guild',
			typing: true,
			cooldown: 3000,
			args: [
				{ id: 'query', type: 'command' }
			]
		});
	}

	async exec(message, args) {
		const handler = this.client.commandHandler;
		return message.channel.send(handler.modules.randomKey());
		// TODO: find the command
	}
}
