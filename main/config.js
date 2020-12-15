const { Collection } = require('discord.js');

function randomNumber(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

const main = {
	/* {Boolean} devMode - developer mode */
	devMode: false,
	/* {String[]|RegEx[]} prefix - bot prefix */
	prefix: ['crib ', 'memer', ','],
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
	memer_lock: ctx => ({
		category: ctx.channels.cache.get('691416705917779999')
	}),
	/* {Object} lottery - the lotto system for memers crib */
	lottery: ctx => ({
		/* {Boolean} active - wether to start it as active */
		active: true,
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
			// role: ctx.guilds.cache.get('691416705917779999').roles.cache.get('692517500814098462'),
			role: ctx.guilds.cache.get('691416705917779999').roles.cache.get('692941106475958363'),
			/* {GuildChannel} channel - the main channel for this guild */
			// channel: this.lottery(Bot).host.guild.channels.cache.get('717351680676462712')
			channel: ctx.guilds.cache.get('691416705917779999').channels.cache.get('695614620781641778')
		}
	})
}

const playerConfig = {
	searchSongs: true
}

module.exports = {
	main, clientOptions, playerConfig,
	cribConfig, customOptions
}