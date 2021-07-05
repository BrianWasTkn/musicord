import { LavaClient } from 'lava/index';
import { Intents } from 'discord.js';

export default new LavaClient({ 
	ownerID: ['627321330655821834'],
	intents: Intents.ALL,
	shards: 'auto',
	messageCacheLifetime: 20,
	messageCacheMaxSize: 100,
	messageSweepInterval: 30,
	allowedMentions: {
		repliedUser: true,
	},
	presence: {
		status: 'idle',
		activities: [{ 
			type: 'WATCHING', 
			name: 'LOL Bot' 
		}]
	} 
});