import { Command } from './Command.js'

export class Music extends Command {
	constructor(props, fn) {
		super(props, fn);
		this.run = fn;
		this.props = Object.assign(props, {
			cooldown: 5000,
			permissions: ['CONNECT'],
			category: 'Music',
			checks: []
		});
	}

	process(msg) {
		const { checks } = this.props;
		const embed = {};
		if (checks.includes('voice')) {
			embed.title = 'Voice Channel';
			embed.color = 'RED';
			embed.description = 'You need to join a voice channel first.';
			embed.footer = {}; embed.footer.text = msg.client.user.username;
			embed.footer.iconURL = msg.client.user.avatarURL();
			return embed;
		} else if (checks.includes('queue')) {
			embed.title = 'Queue Empty';
			embed.color = 'RED';
			embed.description = 'Lava is not currently playing anything';
			embed.footer = {}; embed.footer.text = msg.client.user.username;
			embed.footer.iconURL = msg.client.user.avatarURL();
			return embed;
		} else if (checks.inludes('dj')) {
			return 'You need to be a DJ to have access for this command.'
		}
	}

	async execute(msg) {
		const checks = this.process(msg);
		checks.forEach(async c => await msg.reply({ embed: c }));


		if (this.props.checks.includes('voice')) {
			if (!voiceChannel) {
				return msg.channel.send({ embed: {
					title: 'Voice Channel',
					color: 'RED',
					description: 'You need to join a voice channel first!',
					footer: {
						text: msg.client.user.username,
						iconURL: msg.client.user.avatarURL()
					}
				}})
			}
		}

		if (this.props.includes('queue')) {
			const queue = msg.client.distube.getQueue(msg);
			if (!queue) {
				return msg.embed({
					title: ''
				})
			}
		}
	}
}