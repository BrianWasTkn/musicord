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

	_random(arr) {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	async exec(message, args) {
		const { channel } = message;
		console.log(args);
		
		// if (!args.query) {
		// 	return message.reply(`Command`)
		// }

		// if (query) {
		// 	if (handler.has(query.toLowerCase())) {
		// 		const command = handler.get(query.toLowerCase());
		// 		return await channel.send({ embed: {
		// 			title: [this._random(handler.prefix), command.id].join(' '),
		// 			color: 'ORANGE',
		// 			fields: [
		// 				{ name: 'Category', value: command.category.id },
		// 				{ name: 'Cooldown', value: `\`${command.cooldown / 1e3}s\`` },
		// 				{ name: 'Rate Limit', value: `\`${command.ratelimit}\` uses per \`${command.cooldown / 1e3}s\`` }
		// 			]
		// 		}});
		// 	}
		// }
	}
}
