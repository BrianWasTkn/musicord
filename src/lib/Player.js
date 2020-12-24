const DisTube = require('distube');

module.exports = class Player extends DisTube {
	constructor(client, options) {
		super(client, options);
	}

	async search(message) {
		const queue = super.getQueue(message);
		if (!queue) return Error('NoQueue');
		const { channel } = message;
		const reply = await channel.awaitMessages(
			m => m.author.id === message.author.id
			&& !isNaN(Number(m.content)), {
			max: 1, time: 30000
		});
		if (!reply.size) return Error('NoReply');
		const msg = reply.first();
		if (isNaN(Number(msg.content))) {
			return; 
		}
	}
}