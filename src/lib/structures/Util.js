import chalk from 'chalk'
import moment from 'moment'
import Discord from 'discord.js'
import { Colors } from './Constants'

/**
 * A class representing Musicord utilities.
 * @class
 */
export default class Util {
	constructor(client) {
		/**
		 * A discord client
		 * @type {Discord.Client}
		 */
		this.client = client;
	}

	sleep(ms = 1000) {
		return Discord.Util.delayFor(ms);
	}

	/**
	 * Logger
	 * @param {Object} Class the class logged
	 * @param {String} type the type of log
	 * * `error` - an error
	 * * `process` - the node process
	 * * `main` - a general log
	 * @param {String} msg the message
	 * @param {Boolean|String|Object} error the error, if any
	 * @returns {void}
	*/
	log(Class, type, msg, info = false) {
		/* The base function */
		const log = (Class, msg, info = false) => {
			return console.log(
				chalk.whiteBright(`[${moment().format('HH:mm:ss')}]`),
				Class, chalk.whiteBright('=>'), msg, info || ''
			); // [00:00:00] Class => Some Message
		}

		/* The types of logging */
		switch(type) {
			// Red(Class) => Yellow(msg)
			case 'error':
			return log(chalk.redBright(Class), chalk.yellowBright(msg), info);
			break;

			// Blue(Class) => Cyan(msg)
			case 'process':
			return log(chalk.blueBright(Class), chalk.cyanBright(msg), info);
			break;

			// Hex(Class) => Green(msg)
			case 'main':
			return log(chalk.hex('#57d6ff')(Class), chalk.greenBright(msg));
			break;
		}
	}

	/**
	 * Creates an "alt-embed"
	 * @returns {MessageEmbed} the native embed obj
	 */
	dynamicEmbed({
		author = {}, fields = {}, footer = {},
		title = null, icon = null, text = null,
		color = 'RANDOM',
	} = {}) {
		/* Assign default values */
		const embed = {
			author: { name: null, iconURL: null }, fields: [], 
			thumbnail: null, title: null, description: null, color: 'BLUE', 
			footer: { 
				text: `Thanks for using ${this.client.user.username}!`,
				iconURL: this.client.user.avatarURL()
			}
		};

		/* Return */
		return Object.assign(embed, {
			author: { name: author.text, iconURL: author.icon },
			footer: { text: footer.text, iconURL: footer.icon },
			title, description: text, thumbnail: icon, color: Colors[color],
			fields: Object.entries(fields).map(f => ({
				name: f[0], value: f[1].content, inline: f[1].inline || false
			}))
		});
	}

	/**
	 * Duration Formatter
	 * @param {number} ms the ms to format
	 * @returns {String} in 'hh:mm:ss' format
	 */
	formatDuration(ms) {
		/* Invalid or Empty */
		if (!ms || !parseInt(ms)) {
			return '00:00';
		}
		/* A func to convert "0:1" to "0:01" */
		const format = int => {
			if (int < 10) {
				return `0${int}`;
			} else {
				return int;
			}
		}
		/* Pre-vars */
		const hours = moment.duration(ms).hours();
		const minut = moment.duration(ms).minutes();
		const secon = moment.duration(ms).seconds();
		/* Check */
		if (hours > 0) {
			return [hours, minut, secon].map(i => format(i)).join(':');
		} else if (minut > 0) {
			return [minut, secon].map(i => format(i)).join(':');
		} else if (secon > 0) {
			return ['00', secon].map(i => format(i)).join(':');
		} else {
			return '00:00';
		}
	}

	/**
	 * Duration Formatter
	 * @param {String} stamp in 'hh:mm:ss' format
	 * @returns {number} in (ms / 1000)
	 */
	formatToSecond(stamp) {
		/* Check */
		if (!stamp) return;
		/* Pre-vars */
		let h = 0, m = 0, s = 0;
		if (stamp.match(':')) {
			let times = stamp.split(':');
			/* Minutes */
			if (times.length === 2) {
				m = parseInt(times[0], 10);
				s = parseInt(times[1], 10);
			}
			/* Hours */
			if (times.length === 3) {
				h = parseInt(times[0], 10);
				m = parseInt(times[1], 10);
				s = parseInt(times[2], 10);
			}
		} else {
			/* Seconds */
			s = parseInt(stamp, 10);
		}
		/* Return parsed seconds */
		return h * 60 * 60 + m * 60 + s;
	}

	/**
	 * Cooldown Formatter
	 * @param {number} s the amount of time in seconds
	 * @returns {String} parsed cooldown string
	 */
	formatCooldown(s) {
		/* String and Time amount to use */
		const times = [
			{ name: 'day', value: 60 * 60 * 24 },
			{ name: 'hour', value: 60 * 60 },
			{ name: 'minute', value: 60 },
			{ name: 'second', value: 1 }
		]

		/* Maths */
		const calc = (s, index, modulus = true) => {
			return modulus 
			? Math.floor(s % times[index].value) 
				: Math.floor(s / times[index].value);
		}

		/* Formatting Time */
		const results = [ `${calc(s, 0, false).toString()} ${times[0].name}` ];
		for (let i = 0 ; i < 3 ; i++) {
			const formula = Math.floor(s % times[i].value / times[i + 1].value);
			const label = formula > 1 ? `${times[i + 1].name}s` : times[i + 1].name;
			results.push(`${formula.toString()} ${label}`)
		}

		/* Return */
		return results.filter(r => !r.startsWith('0')).join(', ');
	}

	/**
	 * Player Controls
	 * @param {Song} song a distube song
	 * @param {Discord.MessageEmbed} embed a discord embed
	 * @param {Discord.Message} msg a discord message
	 * @returns {Promise<any>}
	 */
	async handleControls({ song, embed, msg }) {
		/* Emojis */
		try {
			// Order: [skip, pause, mute, volDown, volUp, loop, stop]
			const emojis = ['⏭', '⏯', '🔇', '🔉', '🔊', '🔁', '⏹'];
			for await (const emoji of emojis) {
				setTimeout(() => {
					msg.react(emoji);
				}, 1000); // a second timeout to avoid rateLimits.
			}
		} catch(error) {
			super.log('play@handleControls_reactions', error);
		}

		/* Prepare Collector */
		try {
			const filter = m => m.author.id === msg.author.id && this.client.user.id !== msg.author.id;
			const collector = await embed.createReactionCollector(filter, {
				time: song.duration > 0 ? song.duration * 1000 : 600000,
				errors: ['time']
			});

			collector
				.on('collect', async (reaction, user) => {
					/* Reactions */
					switch(reaction.emoji.name) {
						/* Skip */
						case emojis[0]:
						await this.client.distube.skip(msg);
						break;

						/* Pause */
						case emojis[1]:
						await this.client.distube.pause(msg);
						await msg.channel.send(this.createEmbed({
							title: 'Player Paused',
							color: 'GREEN',
							text: `${user.tag} has paused the queue.`,
						}));
						break;

						/* Mute */
						case emojis[2]:
						let queue = this.client.distube.getQueue(msg);
						if (queue.volume <= 0) {
							queue = await this.client.distube.setVolume(msg, 100);
							await msg.channel.send(this.createEmbed({
								title: 'Player Unmuted',
								color: 'GREEN',
								text: `${user.tag} unmuted the player.\nThe volume is now **${queue.volume}%**`
							}));
						} else {
							queue = await this.client.distube.setVolume(msg, 0);
							await msg.channel.send(this.createEmbed({
								title: 'Player Muted',
								color: 'GREEN',
								text: `The player has been muted by ${user.tag}.`
							}));
						}
						break;

						/* Volume down */
						case emojis[3]:
						if (queue.volume - 10 <= 0) {
							queue = await this.client.distube.setVolume(msg, 0);
							await msg.channel.send(this.createEmbed({
								title: 'Volume Changed',
								color: 'GREEN',
								text: `${user.tag} changed the volume to **${queue.volume}%**.`
							}));
						} else {
							queue = await this.client.distube.setVolume(msg, queue.volume - 10);
							await msg.channel.send(this.createEmbed({
								title: 'Volume Changed',
								color: 'GREEN',
								text: `${user.tag} decreased the volume by **10%**.`
							}));
						}
						break;

						/* Volume up */
						case emojis[4]:
						if (queue.volume + 10 >= 100) {
							queue = await this.client.distube.setVolume(msg, 100);
							await msg.channel.send(this.createEmbed({
								title: 'Volume Changed',
								color: 'GREEN',
								text: `${user.tag} changed the volume to default (${queue.volume}%).`
							}));
						} else {
							queue = await this.client.distube.setVolume(msg, queue.volume + 10);
							await msg.channel.send(this.createEmbed({
								title: 'Volume Changed',
								color: 'GREEN',
								text: `${user.tag} increased the volume by **10%**.`
							}));
						}
						break;

						/* Loop */
						case emojis[5]:
						let mode = queue.setRepeatMode ? queue.setRepeatMode === 2 ? 0 : 2 : 1;
						queue = await this.client.distube.setRepeatMode(msg, mode);
						await msg.channel.send(this.createEmbed({
							title: 'Loop Mode',
							color: 'GREEN',
							text: `${this.client.user.username} will now loop \`${queue.repeatMode ? queue.repeatMode === 2 ? 'the queue' : 'the current track' : 'none'}\``
						}));
						break;
						
						/* Stop */
						case emojis[6]:
						await this.client.distube.stop(msg);
						await msg.channel.send(this.createEmbed({
							title: 'Player Stopped',
							color: 'RED',
							text: `The player has been stopped by ${user.tag}.`
						}));
						break;
					}
				})
				.on('end', async () => {
					/* Remove Reactions */
					await embed.reactions.removeAll();
				});
		} catch(error) {
			super.log('play@collector', error);
		}
	}

	/**
	 * Repeat Mode
	 * @param {Queue} queue a distube queue
	 * @param {String} q something to return if mode is queue
	 * @param {String} t something to return if mode is track
	 * @param {String} o something to return if mode is off
	 * @returns {String} the mode
	 */
	repeatMode(queue, q = 'Queue', t = 'Track', o = 'Off') {
		return queue.repeatMode
		? queue.repeatMode === 2
			? q
			: t
		: o;
	}

	/**
	 * Delays the code for whatever time in ms
	 * @param {number} ms time in milliseconds
	 * @returns {Promise<void>}
	 */
	sleep(ms) {
		return Discord.Util.delayFor(ms);
	}

}