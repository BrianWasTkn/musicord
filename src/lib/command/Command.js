import { Collection } from 'discord.js'

export class Command {
	constructor(fn, help, config) {
		this.run = fn;
		this.props = { help, config };
		this.rateLimited = new Collection();
	}

	async execute({ ctx, msg, args, addCD }) {
		const { guild, channel, author, member } = msg;

		/* Arguments */
		if (this.config.reqArgs) {
			let usage = this.help.usage.replace('{command}', ctx.prefix + this.help.name);
			return channel.send([
				'**Missing Args**',
				'You\'re missing some command arguments.\n',
				`**Proper Usage:** ${ctx.prefix}${this.help.name} ${usage}`
			].join('\n'));
		}

		/* Channel */
		if (true) {}
	}

	get help () {
		return Object.assign({
			triggers: [this.cmd.help.name].concat(this.cmd.help.aliases || []),
			usage: '{command}'
		}, this.cmd.help, {
			userPerms: ['SEND_MESSAGES'].concat(this.cmd.help.userPerms || []),
			botPerms: ['SEND_MESSAGES'].concat(this.cmd.help.botPerms || [])
		});
	}

	get config () {
		return Object.assign({
			cooldown: 1000,
			rateLimit: 1,
			enabled: true,
			permLevel: 0,
			devOnly: false,
			nsfw: false
		}, this.cmd.config, {
			reqArgs: false,
			args: '{command}'
		});
	}

}