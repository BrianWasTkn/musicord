import { 
	Command, Argument,
	LavaClient, LavaCommand
} from 'discord-akairo'
import {
	Message, MessageEmbed
} from 'discord.js'

export default class Spawn extends Command implements LavaCommand {
	public client: LavaClient;
	public constructor() {
		super('paid', {
			aliases: ['paid'],
			userPermissions: ['MANAGE_MESSAGES'],
			args: [{
				id: 'amount', type: 'number',
			}, {
				id: 'user', type: 'member'
			}]
		});
	}

	public async exec(_: Message, args: Argument | any): Promise<Message> {
		const { amount, user } = args;
		const { channel } = _;

		// Args
		if (!amount) {
			return _.reply('You need an amount.').then((m: Message) => {
				return m.delete({ timeout: 3000 });
			});
		} else if (!user) {
			return _.reply('You need a user').then((m: Message) => {
				return m.delete({ timeout: 3000 });
			});
		}

		// Fetch
		let data = await this.client.db.spawns.fetch({ userID: user.user.id });
		data = await this.client.db.spawns.add({ userID: user.user.id, amount, type: 'paid' });
		data = await this.client.db.spawns.remove({ userID: user.user.id, amount, type: 'unpaid' });
		data = await this.client.db.spawns.fetch({ userID: user.user.id });

		// Message
		const embed = new MessageEmbed({
			title: 'Updated',
			color: 'ORANGE',
			description: `Paid and unpaid coins for **${user.user.tag}** has been updated.`,
			fields: [
				{ inline: true, name: 'Total Paid', value: data.paid.toLocaleString() },
				{ inline: true, name: 'Total Unpaid', value: data.unpaid.toLocaleString() }
			],
			footer: {
				text: this.client.user.username,
				iconURL: this.client.user.avatarURL()
			}
		});

		return channel.send(embed);
	}
}