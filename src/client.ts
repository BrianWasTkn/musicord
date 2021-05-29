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

bot.listenerHandler = new ListenerHandler(bot, {
	directory: join(__dirname, 'modules', 'listeners'),
	automateCategories: true,
	classToHandle: Listener,
}).loadAll();

bot.commandHandler = new CommandHandler(bot, { 
	directory: join(__dirname, 'modules', 'commands'),
	automateCategories: true,
	classToHandle: Command,
	handleEdits: true,
	useNames: true,
	prefix: ['lava'],
}).loadAll().useListenerHandler(bot.listenerHandler);

bot.itemHandler = new ItemHandler(bot, {
	directory: join(__dirname, 'modules', 'items'),
	automateCategories: true,
	classToHandle: Item,
}).loadAll();

bot.once('ready', () => {
	const messages = [
		`${bot.listenerHandler.modules.size} Listeners Loaded`,
		`${bot.commandHandler.modules.size} Commands Loaded`,
		`${bot.itemHandler.modules.size} Items Loaded`,
	];
	
	for (const message of messages) bot.console.log('Client', message);
});

bot.connect();