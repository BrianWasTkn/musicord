export default {
	/** Discord Token */
	token: 'Njg2OTY5MDIwMzg1MzI5MTgy.Xme7wQ.8NNvk2zlQ6I08eQcqDNRD7OxlZs', // Ensures the login of our bot
	
	/** Bot Prefixes */
	prefix: ['crib ', 'musicord '],
	
	/** Discord.Client options */
	clientOpts: {
	},

	/** DisTube#options */
	playerOpts: {
		searchSongs: true,
		leaveOnFinish: true
	},

	/** Bypass */
	bypass: {

		/** Cooldowns */
		cooldowns: {
			guilds: [],
			users: []
		},

		/** Premium/Voters */
		premium: []
	}
}