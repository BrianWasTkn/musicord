import Lava from 'discord-akairo'
import {
	Message, MessageEmbed
} from 'discord.js'

export default class Spawn extends Lava.Command {
	public client: Lava.Client;
	public constructor() {
		super('paid', {
			aliases: ['paid'],
			userPermissions: ['MANAGE_MESSAGES'],
			args: [{
				id: 'amount', type: 'number', unordered: true
			}, {
				id: 'user', type: 'member', unordered: true,
				default: (message: Message) => message.member
			}]
		});
	}

	public async exec(_: Message, args: any): Promise<Message> {
		const { amount, user } = args;
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

		// Update
		const data = await this.client.db.spawns.removeUnpaid(user.user.id, amount);
		// Message
		const embed = new MessageEmbed({
			author: {
				name: `Updated — ${user.user.tag}`,
				iconURL: user.user.avatarURL({ dynamic: true })
			},
			color: 'ORANGE',
			fields: [{ 
				name: 'Total Unpaid Left', 
				value: data.unpaid.toLocaleString() 
			}],
			timestamp: Date.now(),
			footer: {
				text: this.client.user.username,
				iconURL: this.client.user.avatarURL()
			}
		});

		return _.channel.send(embed);
	}
}