import { ListenerHandler, CommandHandler, Command, Listener } from 'lib/objects';
import { Context } from 'lib/extensions';

export default class CommandListener extends Listener<CommandHandler<Command>> {
	constructor() {
		super('cmdBlocked', {
			emitter: 'command',
			event: 'commandBlocked',
			name: 'Command Blocked',
		});
	}

	exec(ctx: Context, cmd: Command, reason: string) {
		function getReason(reason: string) {
			switch (reason.toLowerCase()) {
				case 'owner':
					return "You're not my bot owner :P";
				case 'blacklisted': 
					return "You're blacklisted from the bot idiot";
				case 'dm':
					return 'Not usable in guilds sorry';
				case 'guild':
					return 'Not usable in DMs sorry';
				default:
					return "You can't use this command for no reason wtf";
			}
		}

		return ctx.send({ content: getReason(reason) });
	}
}
