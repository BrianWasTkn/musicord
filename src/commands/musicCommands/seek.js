import Command from '../../lib/structures/Command'

export default class Seek extends Command {
	constructor(client) {
		super(client, {
			name: 'seek',
			aliases: ['seek'],
			description: 'Jump to your specified timestamp of the track to play that part.',
			usage: '<hh:mm:ss | s>',
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

		/* Args */
		let stamp = args.join(' ');
		/* Check */
		if (stamp.match(/:/g)) {
			stamp = Bot.utils.formatToSecond(stamp);
		} else {
			stamp = Bot.utils.formatDuration(stamp);
		}

		/* Checks again */
		const queue = Bot.distube.getQueue(msg);
		if ((formatToSecond(stamp) * 1000) > queue.songs[0].duration) {
			try {
				/* Message */
				const embed = await msg.channel.send(super.createEmbed({
					title: 'Skip or Stay?',
					color: 'RED',
					text: 'The specified duration is higher than the length of the current song in the queue.',
					fields: {
						'Prompt': { content: 'Type `skip` or `cancel` to continue.', inline: true },
						'Time': {	content: 'You have 30 seconds to respond or bad DJ.', inline: true }
					}
				}));

				try {
					/* Collector */
					const filter = user => user.id !== Bot.user.id && user.id === msg.author.id,
						collected = await msg.channel.awaitMessages(filter, {
							max: 1,
							time: 30000,
							errors: ['time']
						});

					/* Collector Check */
					if (!collected.first()) {
						try {
							return msg.channel.send(super.createEmbed({
								title: 'Seek Cancelled',
								color: 'RED',
								text: `User ${msg.author.tag} was timed-out.`
							}));
						} catch(error) {
							super.log('seek@msg', error);
						}
					} else {
						const m = collected.first();
						/* Skip */
						if (m.content === 'skip') {
							try { 
								await Bot.commands.get('skip').execute({ Bot, msg, args }); 
							} catch(error) { 
								super.log('seek@exec_skip', error); 
							}
						}
						/* Stay */
						else if (m.content === 'cancel') {
							try {
								await msg.channel.send(super.createEmbed({
									title: 'Cancelled',
									color: 'GREEN',
									text: 'Seek cancelled, Now what?'
								}));
							} catch(error) {
								super.log('seek@msg', error);
							}
						}
						/* None of skip or stay */
						else {
							try {
								await msg.channel.send(super.createEmbed({
									title: 'Invalid',
									color: 'GREEN',
									text: `Invalid option.`
								}));
							} catch(error) {
								super.log('seek@msg', error);
							}
						}
					}
				} catch(error) {
					super.log('seek@collector', error);
				}
			} catch(error) {
				super.log('seek@msg', error);
			}
		}

	}
}