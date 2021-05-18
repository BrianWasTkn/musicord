import { ListenerHandler, CommandHandler, Command, Listener } from 'lib/objects';
import { Constants } from 'discord-akairo';
import { Context } from 'lib/extensions';
const { BuiltInReasons } = Constants;

export default class CommandListener extends Listener<CommandHandler<Command>> {
	constructor() {
		super('cmdBlocked', {
			emitter: 'command',
			event: 'commandBlocked',
			name: 'Command Blocked',
		});
	}

	public getReason(reason: string): string {
		switch (reason.toLowerCase()) {
			case BuiltInReasons.OWNER:
				return "You're not my bot owner :P";
			case BuiltInReasons.DM:
				return 'Not usable in guilds sorry';
			case BuiltInReasons.GUILD:
				return 'Not usable in DMs sorry';
			case 'blacklisted': 
				return "You're blacklisted from the bot idiot";
			default:
				return "You can't use this command for no reason wtf";
		}
	}

	exec(ctx: Context, cmd: Command, reason: string) {
		return ctx.send({ content: this.getReason(reason) });
	}
}
