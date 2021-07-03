import { Command, Context } from 'lava/index';

export default class extends Command {
	constructor() {
		super('rcr', {
			aliases: ['rcr'],
			clientPermissions: ['MANAGE_ROLES'],
			cooldown: 1000 * 60,
			description: 'Change the daily random color role to a random color.',
			userPermissions: ['MANAGE_ROLES'],
		});
	}

	async exec(ctx: Context) {
		const rcr = ctx.guild.roles.cache.get('716344676634066964');
		let fColor = ctx.client.util.randomColor();

		const prompt = async (color: number): Promise<boolean | Function> => {
			await ctx.reply({ embed: { color, description: 'Do you like this color? Type `(y / n)` only.' }});
			const choice = await ctx.awaitMessage();
			switch(choice.content.toLowerCase().slice(0, 1)) {
				case 'n':
					const newColor = ctx.client.util.randomColor();
					return prompt(fColor = newColor);
				case 'y':
				default:
					return true;
			}
		};

		await prompt(fColor);
		await role.edit({ color: fColor });
		return ctx.reply({ embed: {
			description: `Ok, color changed. Enjoy!`,
			color: fColor,
		}}).then(() => true);
	}
}