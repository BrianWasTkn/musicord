import { Client, Collection } from 'discord.js'
import { readdirSync } from 'fs'
import { join } from 'path'

const bot = new Client();
bot.commands = new Collection(); 
bot.aliases = new Collection(); 
bot.cooldowns = new Collection(); 
bot.managers = new Collection();
bot.config = require('./config/');
bot.utils = new (require('./include/util'))(bot);

const login = async () => {
	const { token } = bot.config;
	if (token) {
		try {
			bot.utils.log('Crib', 'main', 'Logging in...');
			await bot.login(token);
		} catch(error) {
			bot.utils.log('Crib', 'error', error);
		} 
	}
}

const commands = readdirSync(join(__dirname, 'commands'));
commands.forEach(dir => {
	const subdir = readdirSync(join(__dirname, 'commands', dir));
	subdir.forEach(cmd => {
		const command = require(`./commands/${dir}/${cmd}`);
		bot.commands.set(command.name, command);
		command.aliases.forEach(alias => bot.aliases.set(alias, command.name));
	});
});

const listeners = readdirSync(join(__dirname, 'handlers'));
listeners.forEach(l => {
	const listener = require(`./handlers/${l}`);
	bot.on(l.split('.')[0], listener.run.bind(bot));
});

login();