import { Inhibitor, Context, Command } from 'lava/index';

export default class extends Inhibitor {
	constructor() {
		super('staffOnly', {
			name: 'Staff Only',
			priority: 2,
			reason: 'staff',
			type: 'post',
		});
	}

	exec(ctx: Context, cmd: Command): boolean {
		if (ctx.channel.type !== 'dm') {
			return !ctx.member.roles.cache.has('692941106475958363') && cmd.staffOnly;
		}

		return false;
	}
}