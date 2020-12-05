export default {
	/* Token */
	token: 'Njg2OTY5MDIwMzg1MzI5MTgy.Xme7wQ.8NNvk2zlQ6I08eQcqDNRD7OxlZs',
	/* Client Options */
	clientOptions: Bot => ({
		/* {String} Calculated Shards */
		shards: 'auto',
		/* {Number} Default Shard Count */
		shardCount: 10,
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
				name: `${Bot.prefix}help`,
				/* {String} */
				type: 'LISTENING'
			}
		}
	})
}