import { Context, UserPlus } from 'lib/extensions';
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
	): Promise<void> {
		const { randomInArray } = this.client.util;
		const { isGlobal: glob } = ctx.args;
		await (await ctx.db.fetch()).save(true);
		const emojis = ['first_place', 'second_place', 'third_place'];
		const mjs = ['eggplant', 'skull', 'clown', 'kiss', 'alien'];
		const m: Context = (await ctx.send({ 
			replyTo: ctx.id, content: 'Fetching...' 
		})) as Context;

		if (glob) {
			const docs = (await Mongo.models['currency'].find({})) as CurrencyProfile[];
			const lava = docs
				.filter((n) => n.pocket > 0)
				.sort((a, b) => b.pocket - a.pocket)
				.slice(0, 10);
			const nice = await Promise.all(
				lava.map((l, i) =>
					ctx.client.users
						.fetch(l.userID, false, true)
						.then((o) => ({ o: o as UserPlus, pocket: l.pocket }))
				)
			);
			const rich = nice
				.filter((n) => !n.o.bot)
				.map(
					(n, i) =>
						`:${emojis[i] || randomInArray(mjs)
						}: **${n.pocket.toLocaleString()}** — ${n.o.tag}`
				);

			await m.edit({
				embed: {
					author: { name: 'richest discord players' },
					description: rich.join('\n'),
					color: 'ORANGE',
					footer: {
						iconURL: ctx.client.user.avatarURL(),
						text: ctx.client.user.username + ' — Showing Pockets',
					},
				},
			});

			return;
		}

		const documents = (await Mongo.models['currency'].find({})) as CurrencyProfile[];
		const idiots = await ctx.guild.members.fetch({ force: true });
		const mebDocs = [...idiots.values()].map(({ user }) => documents.find((doc) => doc.userID === user.id));
		const abcde = mebDocs
			.filter(Boolean)
			.filter((m) => m.pocket > 0)
			.sort((a, b) => b.pocket - a.pocket)
			.slice(0, 10);
		const filt = (
			abcde.map(d => ({
				member: idiots.find(i => i.user.id === d.userID),
				pocket: d.pocket,
			}))
		).filter((m) => !m.member.user.bot);

		await m.edit({
			embed: {
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
		});
	}
}
