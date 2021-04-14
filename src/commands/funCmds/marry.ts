import { MessageOptions } from 'discord.js';
import { MessagePlus } from '@lib/extensions/message';
import { UserPlus } from '@lib/extensions/user';
import { Command } from '@lib/handlers/command';

export default class Fun extends Command {
	constructor() {
		super('marry', {
			aliases: ['marry'],
			channel: 'guild',
			description: 'Marry someone!',
			category: 'Fun',
			args: [
				{
					id: 'someone',
					type: 'user',
					default: null
				}
			]
		})
	}

	async exec(msg: MessagePlus, args: {
		someone: UserPlus
	}): Promise<MessageOptions> {
		const Ring = this.client.handlers.item.modules.get('donut');
		const { someone } = args;
		const me = await msg.author.fetchDB();

		if (!someone) {
			if (!me.marriage.id) {
				return { replyTo: msg.id, content: 'You\'re not married to anyone right now.' };
			}

			const some1 = await this.client.users.fetch(me.marriage.id, true, true);
			const since = new Date(me.marriage.since);

			return { embed: {
				author: {
					name: `${msg.author.username}'s marriage`,
					icon_url: msg.author.avatarURL({ dynamic: true })
				},
				color: 'PINK',
				description: `**Married to:** ${some1.toString()}\n**Since:** ${since.toDateString()}\n**Ring:** ${Ring.emoji} ${Ring.name}`,
				thumbnail: {
					url: some1.avatarURL({ dynamic: true })
				}
			}};
		}

		const s = await someone.fetchDB();
		const inv = me.items.find(i => i.id === Ring.id);
		const inv2 = s.items.find(i => i.id === Ring.id);

		if (inv.amount < 1 || inv2.amount < 1) {
			return { replyTo: msg.id, content: `Both of you must have at least **1 ${Ring.emoji} ${Ring.name}** in your inventories!` };
		}
		if (s.marriage.id) {
			const marriedTo = (await this.client.users.fetch(s.marriage.id)) as UserPlus;
			return { replyTo: msg.id, content: `Sad to say but they're already married to **${marriedTo.tag}** bro :(`};
		}
		if (someone.bot) {
			return { replyTo: msg.id, content: 'Imagine marrying a bot' };
		}
		if (msg.author.id === someone.id) {
			return { replyTo: msg.id, content: 'Lol imagine marrying yourself, couldn\'t be me honestly.' };
		}

		await msg.channel.send(`${someone.toString()} do you accept this marriage? Type \`y\` or \`n\` in 30 seconds.`);
		const ido = (await msg.channel
			.awaitMessages(m => m.author.id === someone.id, {
				max: 1, time: 3e4
			})
		).first();

		if (!ido || !['yes', 'y'].includes(ido.content.toLowerCase())) {
			return { content: 'I guess not then.' };
		}

		inv.amount--;
		me.marriage.id = someone.id;
		me.marriage.since = Date.now();
		await me.save();

		inv2.amount--;
		s.marriage.id = msg.author.id;
		s.marriage.since = Date.now();
		await s.save();

		return { replyTo: msg.id, content: `You're now married to ${someone.toString()} GGs! Type \`lava ${this.aliases[0]}\` to see your marriage profile!` };
	}
}