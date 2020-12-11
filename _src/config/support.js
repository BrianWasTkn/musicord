export default {
	/* Bot Prefix */
	prefix: 'm!',
	/* Developer Mode */
	devMode: true,
	/* Blacklists */
	blacklists: Bot => ([
		Bot.users.cache.get()
	]),
	/* {Array<User>} Array of Bot devs */
	developers: Bot => ([
		Bot.users.cache.get('605419747361947649')
	]),
	/* {Object} */
	support: Bot => ({
		/* {Guild} The server */
		guild: Bot.guilds.cache.get('691416705917779999'),
		/* {Invite} The permanent invite link */
		invite: reason => this.default.support(Bot).guild.channels.first().createInvite({
			reason, maxAge: 0, maxUses: 1,
		}),
		/* {GuildChannel} The error channel */
		errorChannel: Bot.channels.cache.get(),
		/* {GuildChannel} The feature-requests channel */
		requestChannel: Bot.channels.cache.get()
	}),
}