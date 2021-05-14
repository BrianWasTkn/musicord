import { CommandHandler, Command, Listener } from 'lib/objects';
import { Context } from 'lib/extensions';

export default class CommandListener extends Listener<CommandHandler<Command>> {
	constructor() {
		super('cooldown', {
			emitter: 'command',
			event: 'cooldown',
			name: 'Command Cooldown',
		});
	}

	async exec(ctx: Context, { cooldown, id }: Command, remaining: number) {
		const { parseTime } = ctx.client.util;
		const time =
			remaining <= 60e3
				? `${(remaining / 1e3).toFixed(1)} seconds`
				: parseTime(remaining / 1e3);
		const defCd =
			cooldown <= 60e3
				? `${cooldown / 1e3} seconds`
				: parseTime(cooldown / 1e3, false);

		return ctx.send({
			embed: {
				description: `You're currently on cooldown for the \`${id}\` command.\nYou can use this command in **${time}**\nYou only need to wait **${defCd}** by default!`,
				title: 'Hold up nelly', color: 'INDIGO', footer: {
					text: this.client.user.username,
					icon_url: this.client.user.avatarURL(),
				},
			}
		});
	}
}
