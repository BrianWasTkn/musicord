import Command from '../../lib/structures/Command'

/**
 * Represents a BassBoost filter command
 * @class @extends Command
 */
export default class BassBoost extends Command {
	/**
	 * The base constructor for this command
	 * @param {import'../../classes/Musicord'} client A Musicord client
	 */
	constructor(client) {
		super(client, {
			name: 'bassboost',
			aliases: ['toggle-bassboost'],
			description: 'Enables the bassboost effect for your server player.',
			usage: '<on|off>',
			cooldown: 10000
		}, {
			category: 'Filter',
			user_permissions: [],
			client_permissions: ['EMBED_LINKS'],
			music_checks: ['voice', 'queue'],
			args_required: true
		});
	}

	/**
	 * Execute Command
	 * @param {Object} Options command parameters to use
	 * @param {import'../../classes/Musicord'} Options.Bot the main client
	 * @param {import'discord.js'.Message} Options.msg discord message
	 */
	async execute({ Bot, msg, args }) {
		try {
			// TODO: repair this
			/** Set */
			let filter = Bot.distube.setFilter(msg, apply);
			filter = filter.split('@');
			try {
				return await msg.channel.send(super.createEmbed({
					title: 'Bassboost',
					color: 'GREEN',
					text: `The **${filter[0]}** filter with a level of **${filter[1]}** has been applied.`
				}));
			} catch(error) {
				super.log('bassboost@msg', error);
			}
		} catch(error) {
			super.log('bassboost', error);
		}
	}
}