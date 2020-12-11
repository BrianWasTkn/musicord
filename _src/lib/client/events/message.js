export async function run(message) {
	const { author, guild, channel, content, member } = message;
	if (author.bot || !content.startsWith(this.prefix)) return;
	if (this.blacklists.includes(author.id)) return;

	const args = content.slice(this.prefix.length).trim().split(/\s+/g),
	cmd = args.shift().toLowerCase(),
	command = this.commands.get(cmd) || this.commands.get(this.aliases.get(cmd));
	if (!command) {
		if (!this.customOptions.unknownCommandMessage) return;
		else return channel.send('Unknown Command.');
	}

	message.args = args; message.command = command;
	if (this.config.devMode) return runDev.call(this, message);

	const { checks, permissions } = command;
	if (!member.permissions.has(permissions)) {
		// let needed = permissions.some(perm => !member.permissions.has(perm));
		return channel.send({ embed: {
			title: 'MISSING PERMISSIONS',
			color: 'RED',
			description: [
			 '**You don\'t have enough permissions to run this command!**',
			 `Make sure you have the \`${permissions.join('`, `')}\` permission${permissions.length > 1 ? 's' : ''} and try again.`
			].join('\n')
		}});
	}


	// let channelPerms = channel.permissionsFor(author.id);
	// if (permissions.some(perm => !needed.has(perm))) {
	// 	needed = permissions.filter(perm => !member.permissions.has(perm));
	// 	checkPermissions.call(this, msg, command);
	// }
	// if (!member.has(permissions)) {
	// 	let needed = permissions.filter(perm => !member.has(perm));
	// 	checkPermissions.call(this, msg, command, permissions);
	// }


}

async function runDev(message) {
	const { config } = this;
	if (!message.content.startsWith(client.prefix)) return;
}