import Command from '../classes/Command.js'
import { Collection } from 'discord.js'
import { log } from '../utils/logger.js'

export default class VoteSkip extends Command {
	constructor(client) {
		super(client, {
			name: 'voteskip',
			aliases: ['vs'],
			description: 'Musicord will start awaiting for messages in this channel when this command is called.',
			usage: 'command',
			cooldown: 5000
		});

		/**
		 * Command Category 
		 * @type {String}
		 */
		this.category = 'Music';

		/**
		 * Custom Checking
		 * * `dj` - dj role
		 * * `queue` - the server queue
		 * * `paused` - if player paused
		 * * `stopped` - if player stopped
		 * @type {String[]}
		 */
		this.checks = ['queue'];
	}

	async execute({ Bot, msg, args }) {
		/** Voice Channel */
		const channel = msg.member.voice.channel;
		/** Member Count in channel is <= 3 */
		if (channel.members.size <= 3) {
			try {
				await Bot.player.skip(msg);
			} catch(error) {
				super.log('voteskip@skip' , error);
			}
		}

		/** Start Collecting */
		try {
			const voters = new Collection();
			const filter = m => m.content === '!voteskip' || m.content === '!revoke';
			const collector = await msg.channel.createMessageCollector(filter, {
				time: 30000,
				errors: ['time']
			});

			/** Add the author to the collection */
			try {
				voters.set(msg.author.id);
			} catch(error) {
				super.log('voteskip@set_vote', error)
			}

			/** Collector Events */
			collector
				.on('collect', async m => {
					try {
						// Already voted
						if (voters.has(m.author.id)) {
							await msg.reply('You already voted to skip!')
						} else {
							// Add to Collection
							voters.set(m.author.id, 'voted');
							// Then send message
							try {
								await msg.channel.send(super.createEmbed({
									title: 'Vote',
									color: 'GREEN',
									text: `**${m.author.tag}** voted to skip.`,
									footer: {
										text: `Thanks for using ${this.client.user.username}!`,
										icon: this.client.user.avatarURL()
									}
								}));
							} catch(error) {
								super.log('voteskip@collector.onCollect', error);
							}
						}
					} catch(error) {
						super.log('voteskip@collector.onCollect', error);
					}
				})
				.on('end', async c => {
					try {
						// Msg of results
						if (c.size >= Math.floor(channel.members.size / 2)) {
							await msg.channel.send(super.createEmbed({
								title: 'Results',
								color: 'GREEN',
								text: `Skipping the track as **more than** half voted to skip.`,
								fields: {
									'Votes': { content: `${c.size}/${channel.members.size}` }
								}
							}));
							try {
								await Bot.player.skip(msg);
							} catch(error) {
								super.log('voteskip@collector.onCollect', error);
							}
						} else {
							await msg.channel.send(super.createEmbed({
								title: 'Results',
								color: 'RED',
								text: `Voteskipping ended, not skipping as **less than** half voted to skip.`,
								fields: {
									'Votes': { content: `${c.size}/${channel.members.size}` }
								}
							}));
						}
					} catch(error) {
						super.log('voteskip@collector.onCollect', error);
					}
				})
		} catch(error) {
			super.log('voteskip@collector', error);
		}
	}
}