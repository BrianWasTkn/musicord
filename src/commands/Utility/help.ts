import { Message, MessageEmbed } from 'discord.js'
import Lava from 'discord-akairo'


export default class Utility extends Lava.Command {
	public client: Lava.Client;
	public constructor() {
		super('help', {
			aliases: ['help', 'h'],
			channel: 'guild',
			description: 'Lists all or a specific command you wish.',
			category; 'Utility',
			args: [{
				id: 'query', type: 'command',
				default: null
			}]
		});
	}

	public async exec(_: Message, args: any): Promise<Message> {
		if (args.query) {
			const command: Lava.Command = args.query;
			return _.channel.send({ embed: {
				color: 'ORANGE',
				title: args.query.aliases[0],
				fields: [{
					name: 'Description',
					value: command.description || 'No description provided.'
				}, {
					name: 'Triggers',
					value: command.aliases.join(', ')
				}, {
					name: 'Cooldown',
					value: command.cooldown / 1000
				}, {
					name: 'Category',
					value: command.categoryID
				}]
			}})
		}
	}
}