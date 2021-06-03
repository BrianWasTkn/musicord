import 'module-alias/register';
import 'dotenv/config';

import { LavaClient, CommandHandler, ListenerHandler, ItemHandler, Command, Listener, Item } from './library';
import { ClientOptions, Intents } from 'discord.js';
import { join } from 'path';

const bot = new LavaClient({ 
	ownerID: ['605419747361947649'],
	intents: Intents.ALL,
	messageCacheLifetime: 20,
	messageCacheMaxSize: 100,
	messageSweepInterval: 30,
	presence: {
		status: 'dnd',
		activities: [
			{ type: 'WATCHING', name: 'things load...' },
			{ type: 'WATCHING', name: 'volcanos erupt...' }
		]
	} 
});

bot.once('ready', () => {	
	for (const message of messages) bot.console.log('Client', message);
});

bot.plugins.loadAll();
bot.connect();