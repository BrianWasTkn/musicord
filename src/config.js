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
		leaveOnFinish: true,
		customFilters: {
			bassboost: "bass=g=20,dynaudnorm=f=200",
			nightcore: "aresample=48000,asetrate=48000*1.25",
			treble: "treble=g=5",
			karaoke: "stereotools=mlev=0.03",
			"8D": "apulsator=hz=0.08",
			clear: "dynaudnorm=f=200",
			flanger: "flanger",
			surround: "surround",
			normalizer: "dynaudnorm=f=200",
			vaporwave: "aresample=48000,asetrate=48000*0.8",
			phaser: "aphaser=in_gain=0.4",
			subboost: "asubboost",
			reverse: "areverse",
			mcompand: "mcompand",
			tremolo: "tremolo",
			vibrato: "vibrato=f=6.5",
			pulsator: "apulsator=hz=1",
			gate: "agate",
			haas: "haas"
		}
	},

	/** Cooldown Bypass */
	cooldownExclusions: {
		guilds: [],
		users: []
	}
}