import Command from '../../lib/structures/Command'
import moment from 'moment'

export default class About extends Command {
	constructor(client) {
		super(client, {
			name: 'about',
			aliases: ['botinfo'],
			description: 'Display some info about this bot.',
			usage: 'command',
			cooldown: 3000
		}, {
			category: 'Utility',
			user_permissions: [],
			client_permissions: ['EMBED_LINKS'],
			args_required: false
		});
	}
	
	/**
	 * Executes this command
	 * @param {Object} Options An object of parameters to use within this command
	 * @param {import'discord.js'.Client} Options.Bot a discord client
	 * @param {import'discor.djs'.Message} Optons.msg a discord message
	 * @returns {Promise<import'discord.js'.Message>} A Message
	 */
	async execute({ Bot, msg }) {
		try {
			/* Application */
			const app = await Bot.fetchApplication();

			/* Invite */
			let invite;
			try {
				invite = await Bot.generateInvite({
					permissions: [
						'SEND_MESSAGES', 'READ_MESSAGES', 
						'READ_MESSAGE_HISTORY', 'EMBED_LINKS',
						'CONNECT', 'SPEAK', 'MOVE_MEMBERS'
					]
				});
			} catch(error) {
				super.log('about@generateInvite', error);
			}

			/* Vars */
			const uptime = () => {
				return moment(Bot.uptime).format('DD[d], HH[h], mm[m] and ss[s]');
			};
			const version = () => ({
				musicord: Bot.package.version,
				discord: require('discord.js').version,
				distube: require('../../../node_modules/distube/package.json').version,
			});
			const channels = {
				text: Bot.channels.cache.filter(c => c.type === 'text'),
				voice: Bot.channels.cache.filter(c => c.type === 'voice'),
				all: Bot.channels.cache
			};
			const users = {
				bot: Bot.users.cache.filter(u => u.bot),
				humans: Bot.users.cache.filter(u => !u.bot),
				all: Bot.users.cache
			};

			/* Message */
			try {
				await msg.channel.send(super.createEmbed({
					title: Bot.user.username,
					color: 'BLUE',
					text: Bot.package.description,
					fields: {
						'Guilds': { 
							content: `
**${Bot.guilds.cache.size}** servers
**${channels.text.size}** text
**${channels.voice.size}** voice
**${channels.all}** total
							`, 
							inline: true 
						},
						'Users': {
							content: `
**${users.bot.size}** bots
**${users.humans.size}** humans
**${users.all}** total
							`,
							inline: true
						},
						'Bot': {
							content: `
**${Bot.voice.connections.size}** voice connections
**${Bot.commands.size}** commands
**${app.botPublic ? `[public](${invite})` : '`private`'}** bot
**${uptime}** uptime
							`,
							inline: true
						},
						'Dependencies': {
							content: `
**${version().musicord}** — [${Bot.user.username}](${Bot.package.homepage} 'View source')
**${version().discord}** — [Discord.JS](https://discord.js.org 'View documentation')
**${version().distube}** — [DisTube](https://distube.js.org 'View documentation')
**${process.version}** — [Node.JS](https://nodejs.org 'Download Node')
							`,
							inline: true
						}
					},
					footer: {
						text: `Thanks for using ${Bot.user.username}!`,
						icon: Bot.user.avatarURL()
					}
				}));
			} catch(error) {
				super.log('about@msg', error);
			}
		} catch(error) {
			super.log('about@fetch', error);
		}
	}
}