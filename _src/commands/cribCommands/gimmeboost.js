import Command from '../../lib/structures/Command'

export default class GimmeBoost extends Command {
	constructor(client) {
		super(client, {
			name: 'gimmeboost',
			aliases: ['gb', 'claimperks'],
			description: 'Claim your booster perks for this server.',
			usage: 'command',
			cooldown: 5000
		}, {
			category: 'Crib',
			user_permissions: [],
			client_permissions: [],
			music_checks: [],
			args_required: false,
			exclusive: ['691416705917779999']
		});
	}

	async ask(msg, question) {
		/* Message */
		const embed = await msg.channel.send(msg).catch(error => super.log('phone@msg', error));
		/* Collector */
		const collector = await msg.channel.awaitMessages(m => m.author.id == msg.author.id, {
			max: 1,
			time: 30000,
			errors: ['time']
		}).catch(error => super.log('phone@collector'));
		/* Return */
		return { embed, collector };
	}

	async execute({ Bot, msg }) {
		// TODO: the thing
	}
}