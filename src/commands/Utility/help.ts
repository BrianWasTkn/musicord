import { Message, MessageEmbed } from 'discord.js'
import Lava from 'discord-akairo'


export default class Utility extends Lava.Command {
	public client: Lava.Client;
	public constructor() {
		super('help', {
			aliases: ['help', 'h'],
			channel: 'guild',
			args: [{
				id: 'query', type: 'command',
				default: null
			}]
		});
	}

	public async exec(_: Message, args: any): Promise<Message> {
		if (args.query) {
			return _.channel.send({ embed: {
				color: 'ORANGE',
				title: args.query.aliases[0],
				fields: [{
					name: 'Triggers',
					value: args.query.aliases.join(', ')
				}]
			}})
		}
	}
}