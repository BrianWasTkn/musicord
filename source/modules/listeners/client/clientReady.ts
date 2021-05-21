import { ActivitiesOptions, TextChannel } from 'discord.js';
import { Listener } from 'lib/objects';
import { Lava } from 'lib/Lava';

export default class ClientListener extends Listener<Lava> {
	constructor() {
		super('ready', {
			emitter: 'client',
			event: 'ready',
			name: 'Client Ready',
		});
	}

	async exec(): Promise<void> {
		const { channels, util, user: bot } = this.client;
		const activities: ActivitiesOptions[] = [
			{ name: 'Memers Crib', type: 'COMPETING' },
		];

		const channel = (await channels.fetch('789692296094285825')) as TextChannel;
		const extra = (await channels.fetch('821719437316718624')) as TextChannel;
		const embed = util.embed({
			color: 'ORANGE',
			title: 'Logged in',
			description: `**${bot.tag}** logged in.`,
			timestamp: Date.now(),
			footer: {
				text: bot.tag,
				icon_url: bot.avatarURL(),
			},
		});

		await bot.setPresence({ status: 'online', activities });
		await channel.send({ embed, content: '<@605419747361947649>' });
		await extra.send({ embed });

		const msg = `${bot.tag} has flown within Discord.`;
		return util.console.log('Lava', msg);
	}
}
