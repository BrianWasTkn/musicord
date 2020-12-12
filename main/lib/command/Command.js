const { Collection } = require('discord.js');

module.exports = class Command {
	constructor(callback, props) {
		this.fn = callback;
		this.examples = [];
		this.props = Object.assign({
			cooldown: 3000,
			rateLimit: 1,
			category: 'Utility',
			description: 'Nothing provided.'
		}, props, {
			aliases: [props.name].concat(props.aliases || []),
			userPerms: ['SEND_MESSAGES'].concat(props.userPerms || []),
			botPerms: ['SEND_MESSAGES'].concat(props.botPerms || [])
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