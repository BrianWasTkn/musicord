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
		await this.client.db.spawns.removeUnpaid(user.user.id, amount);
		const data = await this.client.spawns.db.fetch(user.user.id);
		// Message
		const embed = new MessageEmbed({
			title: 'Updated',
			color: 'ORANGE',
			description: `Paid status for **${user.user.tag}** has been updated.`,
			fields: [{ 
				name: 'Total Unpaid Left', 
				value: data.unpaid.toLocaleString() 
			}],
			footer: {
				text: this.client.user.username,
				iconURL: this.client.user.avatarURL()
			}
		});

		return channel.send(embed);
	}
}