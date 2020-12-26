const { Collection } = require('discord.js');
const chalk = require('chalk');

module.exports = class LavaManager {
	constructor(client) {
		this.client = client;

		this.listenerHandler = client.listenerHandler;
		this.commandHandler = client.commandHandler;
		this.spawnQueues = new Collection();

  	client.listenerHandler.on('load', this.constructor.logListeners);
		client.commandHandler.on('load', this.constructor.logCommands);
		client.commandHandler.on('cooldown', this.constructor.displayCooldown);
	}

	static logCommands(command, isReload) {
		this.client.util.log(
			'Command', 'main',
			`Command ${chalk.cyanBright(command.id)} loaded.`
		);
	}

	static logListeners(listener, isReload) {
		this.client.util.log(
			'Emitter', 'main',
			`Emitter ${chalk.cyanBright(listener.id)} loaded.`
		);
	}

	static async displayCooldown(message, command, remaining) {
		const { channel } = message;
		await channel.send({ embed: {
			title: 'On Cooldown',
			color: 'ORANGE',
			description: [
				`You're currently in cooldown for the \`${command.id}\` command.`,
				`Please wait **${(remaining / 1000).toFixed(1)} seconds** and try again.`
			].join('\n'),
			footer: {
				text: this.client.user.username,
				iconURL: this.client.user.avatarURL()
			}
		}});
	}
}