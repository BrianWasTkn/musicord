const Command = require('./Command');

module.exports = class MusicCommand extends Command {
	constructor(callback, props) {
		super(callback, fn);
		this.fn = callback;
		this.examples = [];
		this.props = Object.assign({
			userPerms: ['SEND_MESSAGES', 'CONNECT'].concat(props.userPerms || []),
			botPerms: ['SEND_MESSAGES', 'CONNECT', 'SPEAK'].concat(props.botPerms || [])
		}, props, {
			cooldown: 5000,
			deps: []
		});
	}

	async execute({ ctx, msg, args }) {
		const { member, channel, guild } = msg;

		if (!member.permissions.has(this.userPerms)) {
			return channel.send('You don\'t have enough perms, bro.');
		}

		if (!guild.me.permissions.has(this.botPerms)) {
			return channel.send('Looks like I dont have perms to run this cmd.');
		}

		const { channel } = member.voice;
		const queue = ctx.distube.getQueue(msg);
		if (this.deps.includes('voice') && !channel) {
			return channel.send('You need to join a voice channel first.');
		}

		if (this.deps.includes('queue') && !queue) {
			return channel.send('There\'s nothing playing in the queue rn.');
		}

		return await this.fn({ ctx, msg, args });
	}
}