export default {
	/* Bot Prefix */
	prefix: 'm!',
	/* Developer Mode */
	dev: false,
	/* {Array<User>} Array of Bot devs */
	developers: Bot => ([
		Bot.users.cache.get('605419747361947649')
	]),
	/* {Object} */
	support: Bot => ({
		/* {Guild} The server */
		guild: Bot.guilds.cache.get('691416705917779999'),
		/* {GuildChannel} The error channel */
		errorChannel: Bot.channels.cache.get(),
		/* {GuildChannel} The voters channel */
		votersChannel: Bot.channels.cache.get(),
		/* {GuildChannel} The feature-requests channel */
		requestChannel: Bot.channels.cache.get()
	})

}