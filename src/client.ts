import 'module-alias/register';
import 'dotenv/config';

import { ClientOptions, Intents } from 'discord.js';
import { LavaClient } from 'lava/index';
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

bot.on('ready', () => {	
	bot.console.log('Client', `${bot.user.tag} has logged in.`);
});
bot.on('debug', m => bot.console.log('Client', m));

bot.plugins.loadAll();
bot.connect();