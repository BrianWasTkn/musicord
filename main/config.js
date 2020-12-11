const { Collection } = require('discord.js');

const main = {
	/* {Boolean} devMode - developer mode */
	devMode: false,
	/* {String[]|RegEx[]} prefix - bot prefix */
	prefix: ['//', 'crib'],
	/* {String} token - discord token to login */
	token: 'Njg2OTY5MDIwMzg1MzI5MTgy.Xme7wQ.8NNvk2zlQ6I08eQcqDNRD7OxlZs',
	/* {String[]} activities - an array of bot activities */
	activities: Ctx => ([
		{ type: 'LISTENING', name: `${Ctx.prefix}help` },
		{ type: 'WATCHING', name: `${Ctx.users.cache.size} users` }
	]),
	/* {Number} presence_interval - the interval of activities */
	presence_interval: 5
}

const clientOptions = {
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
			name: `${main.prefix[0]}help`,
			/* {String} type - wether: 'STREAMING', 'PLAYING', 'LISTENING', or 'WATCHING' */
			type: 'LISTENING'
			/* {String} url - (only in STREAMING) the url of this presence */
		}
	}
}

const customOptions = {
	/* {Boolean} unknownCommandMessage - wether to display a message if cmd is unknown */
	unknownCommandMessage: false,
	/* {Boolean} deleteCommandInvocation - wether to delete commands when executed */
	deleteCommandInvocation: true,
	/* {Boolean} pruning - wether to delete previous bot messages */
	pruning: false
}

const cribConfig = {
	/* {Object} lottery - the lotto system for memers crib */
	lottery: ctx => ({
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
			guild: ctx.guilds.cache.get('691416705917779999'),
			/* {Role} role - the required role for this guild */
			role: this.lottery(ctx).host.guild.roles.cache.get('692517500814098462'),
			/* {GuildChannel} channel - the main channel for this guild */
			// channel: this.lottery(Bot).host.guild.channels.cache.get('717351680676462712')
			channel: this.lottery(ctx).host.guild.channels.cache.get('745155004041789523')
		}
	})
}

const playerConfig = {
	searchSongs: true
}

module.exports = {
	main, clientOptions, playerConfig
	cribConfig, customOptions
}