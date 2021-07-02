import { Command, Context } from 'lava/index';
import { Snowflake } from 'discord.js';

export default class extends Command {
	constructor() {
		super('about', {
			aliases: ['about'],
			description: 'About me obviously who else?',
			name: 'About',
		});
	}

	exec(ctx: Context) {
		const idiot = ctx.client.users.cache.get((ctx.client.ownerID as Snowflake[])[0]);
		await ctx.reply(`Hi my name is ${ctx.client.user.username} and my owner is ${idiot.tag} and you're cute <3`);
		return false;
	}
} 