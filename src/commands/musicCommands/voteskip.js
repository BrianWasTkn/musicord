import Command from '../../classes/Command'

export default class VoteSkip extends Command {
	constructor(client) {
		super(client, {
			name: 'voteskip',
			aliases: ['vote-skip'],
			description: 'Musicord will start awaiting for messages in this channel when this command is called.',
			usage: 'command',
			cooldown: 5000
		}, {
			category: 'Music',
			user_permissions: [],
			client_permissions: ['EMBED_LINKS'],
			music_checks: ['voice', 'queue'],
			args_required: false
		});
	}

	async execute({ Bot, msg, args }) {
		/** Voice Channel */
		const channel = msg.member.voice.channel;
		/** Filter Bots */
		const members = channel.members.filter(m => !m.bot);
		/** Member Count in channel is <= 3 */
		if (channel.members.size <= 3) {
			try {
				await Bot.distube.skip(msg);
			} catch(error) {
				super.log('voteskip@skip', error);
			}
		}

		/** Start Collecting */
		try {
			const { Collection } = require('discord.js'),
				voters = new Collection(),
				filter = m => m.content === '!voteskip' || m.content === '!revoke',
				collector = await msg.channel.createMessageCollector(filter, {
				time: 30000,
				errors: ['time']
			});

			/** Add the author to the collection */
			try {
				voters.set(msg.author.id, 'voted');
			} catch(error) {
				super.log('voteskip@set_vote', error);
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
									fields: {
										'Remaining': { content: `${channel.members.size - voters.size} users`, inline: true },
										'Members in VC': { content: channel.members.size, inline: true }
									},
									footer: {
										text: `Thanks for using ${Bot.user.username}!`,
										icon: Bot.user.avatarURL()
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
								await Bot.distube.skip(msg);
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
			super.log('voteskip', error);
		}
	}
}