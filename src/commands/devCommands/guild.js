import Command from '../../classes/Command.js'

/**
 * Represents a LeaveGuild developer command
 * @class @extends Command
 */
export default class LeaveGuild extends Command {
	/**
	 * The main constructor for this command
	 * @param {import'../../classes/Musicord'} client A Musicord client
	 */
	constructor(client) {
		super(client, {
			name: 'guild',
			aliases: ['lg'],
			description: 'Display some info about a guild, or do something about them.',
			usage: '[id] <info|ping|leave>',
			cooldown: 0
		}, {
			category: 'Developer',
			user_permissions: [],
			client_permissions: ['EMBED_LINKS'],
			music_checks: [],
			args_required: false
		});
	}

	/**
	 * Executes this command
	 * @param {Object} Options an object of parameters to use within this command
	 * @param {import'../../classes/Musicord'} Options.Bot A Musicord client
	 * @param {import'discord.js'.Message} Options.msg A Discord.Message class
	 * @param {String[]} Options.args An array of strings from this command
	 */
	async execute({ Bot, msg, args }) {
		/* Args */
		let [id, action] = args;
		id = msg.channel.type !== 'dm' ? (msg.guild.id || id) : null;

		if (!id) {
			try {
				return msg.channel.send(super.createEmbed({
					title: 'Missing Args',
					color: 'RED',
					text: 'You need a guild ID.'
				}));
			} catch(error) {
				super.log('leaveguild@msg', error);
			}
		}

		/* Fetch */
		let guild = Bot.guilds.cache.get(id);
		if (!guild) {
			try {
				return msg.channel.send(super.createEmbed({
					title: 'Invalid Guild',
					color: 'RED',
					text: 'You need a valid guild bro.'
				}));
			} catch(error) {
				super.log('guild@msg', error);
			}
		}

		/* Leave */
		if (action === 'leave') {
			try {
				let ms = Date.now();
				guild = await guild.leave();
				ms = Date.now() - ms;
				try {
					await msg.channel.send(super.createEmbed({
						title: 'Guild Left',
						color: 'GREEN',
						text: `Successfully left **${guild.name}** in \`${ms}ms\``
					}));
				} catch(error) {
					super.log('guild@msg', error);
				}
			} catch(error) {
				super.log('guild', error);
			}
		}
		/* Ping */
		else if (action === 'ping') {
			try {
				let shard = guild.shard;
				await msg.channel.send(super.createEmbed({
					title: guild.name,
					color: 'YELLOW',
					fields: {
						'Shard ID': { content: shard.id },
						'Latency': { content: `\`${shard.ping}ms\`` }
					}
				}));
			} catch(error) {
				super.log('ping@msg', error);
			}
		}
		/* Info */
		else if (action === 'info') {

		}

	}
}