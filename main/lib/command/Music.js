const Command = require('./Command');

module.exports = class MusicCommand extends Command {
	constructor(callback, props) {
		super(callback, fn);
		this.fn = callback;
		this.examples = [];
		this.props = Object.assign({
			userPerms: ['CONNECT'].concat(props.userPerms || []),
			botPerms: ['CONNECT', 'SPEAK'].concat(props.botPerms || [])
		}, props, {
			cooldown: 5000
		});
	}

	async execute({ ctx, msg, args }) {
		const { member, channel, guild } = msg;

		if (!member.permissions.has(this.userPerms)) {
			return await channel.send('Not enough permissions.');
		}

		if (!guild.me.permissions.has(this.botPerms)) {
			return await channel.send('Looks like i dont have perms to run this cmd.');
		}

		return await this.fn({ ctx, msg, args });
	}
}