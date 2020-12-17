const { Collection } = require('discord.js');

module.exports = class Command {
	constructor(props, callback) {
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

		if (!member.permissions.has(this.props.userPerms)) {
			return msg.reply('You don\'t have enough perms to run this command.');
		}

		if (!guild.me.permissions.has(this.props.botPerms)) {
			return msg.reply('Looks like i dont have perms to run this cmd.');
		}

		return await this.fn({ ctx, msg, args });
	}
}