import { Collection } from 'discord.js'

const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

export default {
	/* Main Guild */
	memer_lock: Bot => ({
		/* {Guild} The main guild */
		guild: Bot.guilds.cache.get('691416705917779999')
	}),
	/* Lottery */
	lottery: Bot => ({
		/** {Boolean} Lotto State */
		active: false,
		/** {Collection} Lotto Winners */
		winners: new Collection(),
		/** {number} Number in hours */
		interval: 12,
		/** {Date} The last rolled timestamp */
		lastRoll: null,
		/** {Number} Prize multi: (won / 1000) * (1-10) */
		multiplier: random(1, 5),
		/** {Object} Prize Caps */
		prize: {
			/* Minimum */
			min: 200,
			/* Maximum */
			max: 500,
			/* Limit */
			limit: 1000
		},
		/* The main guild */
		host: {
			/* {Guild} Main Guild */
			guild: Bot.guilds.cache.get('691416705917779999'),
			/* {GuildChannel} Lotto Channel */
			channel: this.default.lottery(Bot).host.guild.channels.cache.get('717351680676462712'),
			/* {Role} Required Role */
			role: this.default.lottery(Bot).host.guild.roles.cache.get('692517500814098462')
		}
	})
}