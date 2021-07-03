import { Command, Context, Item } from 'lava/index';

export default class extends Command {
	constructor() {
		super('upgrade', {
			aliases: ['upgrade', 'upg'],
			clientPermissions: ['EMBED_LINKS'],
			cooldown: 1000 * 60 * 1,
			description: 'Upgrade an item!',
			name: 'Upgrade',
			args: [
				{
					id: 'item',
					type: 'item',
				}
			]
		});
	}

	async exec(ctx: Context, { item }: { item: Item }) {
		const entry = await ctx.currency.fetch(ctx.author.id);
		const isMax = item.upgrades.length - 1 === inv.level;
		const inv = entry.items.get(item.id);

		if (inv.upgrade.upgrade > (item.premium ? entry.props.prem : entry.props.pocket)) {
			const { upgrade, icon, premium } = inv.upgrade;
			const e = premium ? 'keys' : 'coins';
			return ctx.reply(`You need **${upgrade.toLocaleString()} ${icon} ${e}** to upgrade this item!`).then(() => false);
		}
		if (isMax) {
			return ctx.reply(`Your **${inv.upgrade.emoji} ${inv.upgrade.name}** is already at max level!`).then(() => false);
		}

		await ctx.channel.send({ embed: { description: `Are you sure you wanna upgrade your **${item.emoji} ${item.name}** to **Level ${inv.level + 1}** for **${inv.upgrade.upgrade}** ${inv.upgrade.premium ? 'keys' : 'coins'}?` }});
		const choice = await ctx.awaitMessage();
		if (!choice || !choice.content) {
			return ctx.reply({ embed: { description: 'Imagine not answering to me lmfaooo' }}).then(() => false);
		}
		if (choice.content.toLowerCase().slice(0, 1) === 'n') {
			return ctx.reply({ embed: { description: 'ok then.' }}).then(() => false);
		}

		const newInv = await entry.upgradeItem(item.id).save().then(e => e.items.get(item.id));
		return ctx.reply({ embed: {
			color: 'BLUE', author: { 
				name: `${inv.upgrade.name} reached ${
					isMax ? 'max level' : `level ${newInv.level}`
				}!`,
				iconURL: ctx.author.avatarURL({ 
					dynamic: true 
				})
			},
		}}).then(() => true);
	}
}