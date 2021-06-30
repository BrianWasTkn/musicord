import { Inhibitor, Context, Command } from 'lava/index';

export default class extends Inhibitor {
	constructor() {
		super('staffOnly', {
			name: 'Staff Only',
			priority: 2,
			reason: 'staff',
			type: 'pre',
		});
	}

	exec(ctx: Context, cmd: Command): boolean {
		console.log(cmd.id);
		return !ctx.member.roles.cache.has('692941106475958363') && cmd.staffOnly;
	}
}