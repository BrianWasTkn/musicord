import type { ClientOptions, WebSocketOptions } from 'discord.js';
import { Intents } from 'discord.js';

export const discordOptions: ClientOptions = {
	intents: Intents.ALL,
	presence: {
		status: 'dnd',
		activities: [{
			name: 'Myself To Connect...',
			type: 'WATCHING'
		}]
	},
	allowedMentions: {
		parse: ['users', 'roles'],
		repliedUser: true,
	},
};
