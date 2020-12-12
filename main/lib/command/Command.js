const { Collection } = require('discord.js');

module.exports = class Command {
	constructor(callback, props) {
		this.fn = callback;
		this.props = Object.assign({
			cooldown: 3000,
			userPerms: ['SEND_MESSAGES'].concat(props.userPerms || []),
			botPerms: ['SEND_MESSAGES'].concat(props.botPerms || [])
		}, props);
	}

	async execute({ ctx, msg, args }) { 
		return await this.fn({ ctx, msg, args });
	}
}