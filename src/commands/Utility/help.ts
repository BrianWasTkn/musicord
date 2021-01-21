import { Message, MessageEmbed, EmbedField } from 'discord.js'
import Lava from 'discord-akairo'


export default class Utility extends Lava.Command {
	public client: Lava.Client;
	public constructor() {
		super('help', {
			aliases: ['help', 'h'],
			channel: 'guild',
			description: 'Lists all or a specific command you wish.',
			category: 'Utility',
			args: [{
				id: 'query', type: 'command',
				default: null
			}]
		});
	}

	private mapCommands(): EmbedField[] {
		const commands = this.handler.modules.array();
		const categories = [ ...new Set(commands.map(c => c.categoryID))];
		return categories.map((c: string) => ({
			name: c, inline: false,
			value: `\`${commands.filter(c => c.categoryID).map(c => c.aliases[0]).join('`, `')}\``
		}));
	}

	public async exec(_: Message, args: any): Promise<Message> {
		const command = args.query;
		if (!command) {
			const fields: EmbedField[] = this.mapCommands();
			return _.channel.send({ embed: {
				title: 'Lava Commands',
				color: 'RANDOM',
				fields, footer: {
					text: `${this.handler.modules.size} commands`,
					iconURL: this.client.user.avatarURL()
				}
			}});
		}

		if (args.query) {
			const command: Lava.Command = args.query;
			return _.channel.send({ embed: {
				color: 'ORANGE',
				title: command.aliases[0],
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