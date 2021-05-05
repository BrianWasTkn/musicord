import type { ClientOptions, WebSocketOptions } from 'discord.js';
import { Intents } from 'discord.js';

export const discordOptions: ClientOptions = {
	intents: Intents.ALL,
	allowedMentions: {
		parse: ['users', 'roles'],
		repliedUser: true,
	},
};
