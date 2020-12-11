import { Collection } from 'discord.js'

const bot = {
	/* {Boolean} devMode - developer mode */
	devMode: false,
	/* {String[]|RegEx[]} prefix - bot prefix */
	prefix: ['//', 'crib'],
	/* {String} token - discord token to login */
	token: 'Njg2OTY5MDIwMzg1MzI5MTgy.Xme7wQ.8NNvk2zlQ6I08eQcqDNRD7OxlZs',
	/* {String[]} activities - an array of bot activities */
	activities: Bot => ([
		`${Bot.users.cache.size} users`,
		`${Bot.prefix}help`
	])
}

const client_options = {
	/* {String} shards - wether to calculate shards 'auto'matically or manually */
	shards: 'auto',
	/* {String} disableMentions - automatically filter @everyone/here mentions */
	disableMentions: 'everyone',
	/* {Object} allowedMentions - idk lol */
	allowedMentions: { 
		/* {String} parse - idk lol */
		parse: 'users' 
	},
	/* {Object} presence - the first presence to use within login */
	presence: {
		/* {String} status - either: 'dnd', 'idle', 'online', or 'invisible' */
		status: 'online',
		/* {Object} activity - the activity */
		activity: {
			/* {String} name - the thing to display in member sidebar */
			name: `${prefix}help`,
			/* {String} type - wether: 'STREAMING', 'PLAYING', 'LISTENING', or 'WATCHING' */
			type: 'LISTENING'
			/* {String} url - (only in STREAMING) the url of this presence */
		}
	}
}

const custom_options = {
	/* {Boolean} unknownCommandMessage - wether to display a message if cmd is unknown */
	unknownCommandMessage: false,
	/* {Boolean} deleteCommandInvocation - wether to delete commands when executed */
	deleteCommandInvocation: true,
	/* {Boolean} pruning - wether to delete previous bot messages */
	pruning: false
}

const crib_config = {
	/* {Object} lottery - the lotto system for memers crib */
	lottery: Bot => ({
		/* {Boolean} active - wether to start it as active */
		active: false,
		/* {Collection} winners - a collection of winners (TODO: add mongodb or redis for this) */
		winners: new Collection(),
		/* {Number} interval - interval in hours */
		interval: 12,
		/* {Date} lastRoll- the date of last timestamp */
		lastRoll: Date.now(),
		/* {Number} multi - the random multiplier to increase winnings */
		multi: randomNumber(1, 100),
		/* {Object} prize */
		prize: {
			/* {Number} min - minimum prize in hundreds */
			min: 100,
			/* {Number} max - maximum prize in hundreds */
			max: 500,
			/* {Number} limit - the limit in hundreds */
			limit: 600
		},
		/* {Object} host */
		host: {
			/* {Guild} guild - the memers crib discord server */
			guild: Bot.guilds.cache.get('691416705917779999'),
			/* {Role} role - the required role for this guild */
			role: this.lottery(Bot).host.guild.roles.cache.get('692517500814098462'),
			/* {GuildChannel} channel - the main channel for this guild */
			channel: this.lottery(Bot).host.guild.channels.cache.get('717351680676462712')
		}
	})
}


export default {
	main: {
		...bot
	},
	clientOptions: {
		...client_options,
		custom_options
	},
	playerOptions: {
		...player_options
	},
	crib: {
		...crib_config
	}
}