import { Context, ContextDatabase, UserPlus } from 'lib/extensions';
import { MessageOptions } from 'discord.js';
import { Command } from 'lib/objects';
import Mongo from 'mongoose';

export default class Currency extends Command {
	constructor() {
		super('rich', {
			name: 'Rich',
			aliases: ['rich', 'lb'],
			channel: 'guild',
			description: 'View top users locally or globally.',
			category: 'Currency',
			cooldown: 1e4,
			args: [
				{
					id: 'isGlobal',
					type: 'boolean',
					flag: ['--global', '-g'],
					default: false,
				},
			],
		});
	}

	async exec(
		ctx: Context<{
			type: keyof CurrencyProfile;
			isGlobal: boolean;
		}>
	): Promise<MessageOptions> {
		const { randomInArray } = ctx.client.util;
		const { isGlobal: glob } = ctx.args;
		
		const emojis = ['first_place', 'second_place', 'third_place'];
		const mjs = ['eggplant', 'skull', 'clown', 'kiss', 'alien'];
		await ctx.send({ reply: { messageReference: ctx.id, failIfNotExists: false }, content: 'Fetching...' });
		const docs = (await Mongo.models['currency'].find({})) as CurrencyProfile[];
		
		if (glob) {
			const lava = docs
				.filter((n) => n.pocket > 0)
				.sort((a, b) => b.pocket - a.pocket)
				.slice(0, 10);
			const nice = lava.map(({ userID, pocket }, i) => {
				const u = ctx.client.users.cache.get(userID);
				return ({ u: u as UserPlus, pocket });
			});
			const rich = nice
				.filter((n) => !n.u.bot)
				.map((n, i) =>
					`:${
						emojis[i] || randomInArray(mjs)
					}: **${
						n.pocket.toLocaleString()
					}** — ${n.u.tag}`
				);

			return { reply: { messageReference: ctx.id, failIfNotExists: false }, embed: {
					author: { name: 'richest discord players' },
					description: rich.join('\n'),
					color: 'ORANGE',
					footer: {
						iconURL: ctx.client.user.avatarURL(),
						text: ctx.client.user.username + ' — Showing Pockets',
					},
				},
			};
		}

		const idiots = [...ctx.guild.members.cache.values()].filter(({ user }) => !user.bot);
		const mebDocs = idiots.map(({ user }) => docs.find((doc) => doc.userID === user.id));
		const abcde = mebDocs
			.filter(Boolean)
			.filter((m) => m.pocket > 0)
			.sort((a, b) => b.pocket - a.pocket)
			.slice(0, 10);
		const filt = abcde.map(d => ({
			member: idiots.find(i => i.user.id === d.userID),
			pocket: d.pocket,
		}));

		return {
			reply: { messageReference: ctx.id, failIfNotExists: false }, embed: {
				author: { name: 'richest players in this server' },
				description: filt
					.map(
						(n, i) =>
							`:${emojis[i] || randomInArray(mjs)
							}: **${n.pocket.toLocaleString()}** — ${n.member.user.tag || '**LOL WHO DIS**'
							}`
					)
					.join('\n'),
				color: ctx.member.displayHexColor,
				footer: {
					iconURL: ctx.guild.iconURL({ dynamic: true }),
					text: ctx.guild.name + ' — Showing Pockets',
				},
			},
		};
	}
}
