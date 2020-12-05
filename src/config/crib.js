import { Collection } from 'discord.js'

export default {
	/* Lottery */
	lottery: Bot => ({
		/** {Boolean} Lotto State */
		active: false,
		/** {Collection} Lotto Winners */
		winners: new Collection(),
		/** {number} Number */
		interval: 1000 * 60 * 60 * 12,
		/** {Object} Prize Caps */
		prize: {
			/* Minimum */
			min: 200,
			/* Maximum */
			max: 500
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