import support from './support'
const { prefix } = support;

export default {
	/* Token */
	token: 'Njg2OTY5MDIwMzg1MzI5MTgy.Xme7wQ.8NNvk2zlQ6I08eQcqDNRD7OxlZs',
	/* Activities */
	activities: Bot => ([
		`${Bot.users.cache.size} users`,
		`${Bot.prefix}help`
	]),
	custom_options: {
		/* {Boolean} To reply if command not found */
		unknownCommandMessage: false,
	},
	/* Client Options */
	client_options: {
		/* {String} Calculated Shards */
		shards: 'auto',
		/* {String} Disabled Mentions */
		disableMentions: 'everyone',
		/* {Object} Allowed Mentions */
		allowedMentions: { 
			/* {String} Parse */
			parse: 'users' 
		},
		/* {Object} Login with this presence */
		presence: {
			/* {String} The status */
			status: 'online',
			/* {Object} Activity */
			activity: {
				/* {String} */
				name: `${prefix}help`,
				/* {String} */
				type: 'LISTENING'
			}
		}
	}
}