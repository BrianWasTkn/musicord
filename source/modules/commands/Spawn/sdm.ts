import { MessageOptions } from 'discord.js';
import { Context } from 'lib/extensions';
import { Command } from 'lib/objects';

export default class Spawn extends Command {
	constructor() {
		super('sdm', {
			name: 'SDM Notifications',
			aliases: ['sdm', 'sdms'],
			channel: 'guild',
			description: 'Toggle DM notifications whenever you finish a spawn event.',
			category: 'Spawn',
			cooldown: 5e3,
		});
	}

	async exec(ctx: Context): Promise<MessageOptions> {
		const emojify = (bool: boolean) => `:small_${bool ? 'blue' : 'orange'}_diamond:`
		const status = (bool: boolean) => (bool ? 'ON' : 'OFF');
		const { fetch } = this.client.db.spawns;
		const data = await fetch(ctx.author.id);
		data.allowDM = !data.allowDM;
		const { allowDM } = await data.save();

		return {
			content: `**${emojify(allowDM)} Spawn notifications are now \`${status(allowDM)}\`**`,
			reply: { messageReference: ctx.id, failIfNotExists: false },
		};
	}
}
