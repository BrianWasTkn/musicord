import Command from '../../classes/Command.js'

export default class BassBoost extends Command {
	constructor(client) {
		super(client, {
			name: 'bassboost',
			aliases: ['toggle-bassboost'],
			description: 'Enabled the bassboost effect for your server player.',
			usage: '<1-100 | on | off>',
			cooldown: 10000
		}, {
			category: 'Effects'
		});
	}

	async execute({ Bot, msg, args }) {
		// TODO: add this 
	}
}