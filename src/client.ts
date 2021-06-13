import { LavaClient } from 'lava/index';
import { Intents } from 'discord.js';

export default new LavaClient({ 
	ownerID: ['605419747361947649'],
	intents: Intents.ALL,
	shards: 'auto',
	messageCacheLifetime: 20,
	messageCacheMaxSize: 100,
	messageSweepInterval: 30,
	allowedMentions: {
		repliedUser: true
	},
	presence: {
		status: 'idle',
		activities: [{ 
			type: 'WATCHING', 
			name: 'things load...' 
		}]
	} 
});