import { Command } from './Command'

export class ModCMD extends Command {
	constructor(fn, help, config) {
		super(fn, help, config);
	}

	async execute({ ctx, msg, args }) {
		const { guild, member, channel } = msg;
		const { help: { userPerms, botPerms } } = this;

		/* Filter needed perms for the member */
		if (!member.permissions.has(userPerms)) {
			let needed = userPerms.some(perm => !member.permissions.has(perm));
			const { PermissionStrings } = require('../lib/constants');
			return channel.send([
				'**Missing Permissions**',
				'You don\'t have enough permissions to run this command!',
				`Please ensure you can **${needed.map(n => PermissionStrings[n]).join('**, **')}** and try again.`
			].join('\n'));
		}

		/* And for the context */
		if (!guild.me.permissions.has(botPerms)) {
			let 
		}
	}
}