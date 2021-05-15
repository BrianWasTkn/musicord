import { CommandHandler, Command, Listener } from 'lib/objects';
import { TextChannel } from 'discord.js';
import { Context } from 'lib/extensions';
import { Embed } from 'lib/utility';

export default class CommandListener extends Listener<CommandHandler<Command>> {
	constructor() {
		super('cmdError', {
			emitter: 'command',
			event: 'commandError',
			name: 'Command Error',
		});
	}

	async exec(ctx: Context, cmd: Command, args: any[], error: Error) {
		const channel = (
			await this.client.channels.fetch('789692296094285825')
		) as TextChannel;
		const embed = this.client.util.embed()
			.setDescription(`Command \`${cmd.aliases[0]}\` failed to run. The error has been reported to the bot owner and is pending for a fix. If you encounter any bugs or issues with the bot, please ping or DM the owner about it. Thank you.`)
			.setTitle('Command Error', ctx.url).setColor('BLUE').setFooter(true, ctx.client.user.username, ctx.client.user.avatarURL())
			.addField('Error Message', '```js\n' + error.message + '\n```', false);

		await ctx.send({ embed, replyTo: ctx.id });
		embed.setColor('BLUE').setDescription(null)
		.addField('Message Author', `${ctx.author.tag} (${ctx.author.id})`)
		.addField('Invoking Guild', `${ctx.guild.name} (${ctx.guild.id})`);
		await channel.send({ embed });
	}
}
