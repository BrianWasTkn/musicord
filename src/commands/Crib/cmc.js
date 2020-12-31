const { Command } = require('discord-akairo');

const allowed = [
	// Other
	{ userID: '671195847823851540', role: '728742113478705213' },
	{ userID: '654050620205957152', role: '735831064198774825' },
	// Staff
	{ userID: '605419747361947649', role: '694527702656614533' },
	{ userID: '601429964050530305', role: '766286790856146996' },
	{ userID: '450199947577393162', role: '747520033554694154' },
	{ userID: '562367252406468646', role: '727216443300642856' },
	{ userID: '409838637811892226', role: '705783211489230869' },
	{ userID: '450282847391973376', role: '724692343458103426' },
	{ userID: '673516525683998756', role: '738041469390291032' },
	{ userID: '495733792250789891', role: '787358392443863100' },
	// Boosters
	{ userID: '509207806742626314', role: '786873354308681739' },
	{ userID: '316407287545856000', role: '744648152656904383' },
	{ userID: '497601345566801921', role: '739093126622347295' },
	{ userID: '463731733695561749', role: '735831002924187739' },
	{ userID: '255260328659648512', role: '746180440007901254' },
	{ userID: '701864536004624385', role: '738041469390291032' },
	{ userID: '340954339051044885', role: '723075257962987572' },
	{ userID: '601429964050530305', role: '766286790856146996' },
	{ userID: '181264821713371136', role: '723073481633300521' },
	{ userID: '590610033235066904', role: '793841053982785556' }
]

module.exports = class Crib extends Command {
	constructor() {
		super('cmc', {
			aliases: ['cmc'],
			category: 'Crib',
			channel: 'guild',
			cooldown: 5000,
			rateLimit: 2
		});
	}

	toHex(decimal) {
		return decimal.toString(16).padStart(decimal.toString().length, 0);
	}

	bgColor(hex) {
		return `https://dummyimage.com/512x512/${hex}/010101&text=+`
	}

	async changeColor(role, message) {
		const color = Math.random() * 0xFFFFFF;
		role = await role.edit({ color });
		return role;
	}

	async exec(message) {
		const { guild, member, channel } = message;
		const required = ['693324853440282654', '692941106475958363'].map(r => {
			return guild.roles.cache.get(r);
		});

		if (!required.some(r => member.roles.cache.has(r.id))) {
			return channel.send({ embed: {
				title: 'Command Error',
				color: 'RED',
				description: [
					`You need to have the **${required.join('** or the **')}** role first!`,
					'Consider **boosting this server** to use this command :>'
				].join('\n'),
				timestamp: Date.now(),
				footer: {
					text: this.client.user.username,
					iconURL: this.client.user.avatarURL()
				}
			}});
		}

		const profile = allowed.find(i => i.userID === member.user.id);
		if (!profile) {
			return message.reply([
				'Seems like you don\'t have a profile for this command yet.',
				'Ask our Moderators to make one for you within 24 hours.'
			].join('\n')); 
		}

		const r = guild.roles.cache.get(profile.role);
		if (!r) return message.reply('It feels like your custom role got removed...');
		const role = await this.changeColor(r, message);
		return channel.send({ embed: {
			title: `Change My Color`,
			thumbnail: { url: this.bgColor(this.toHex(role.color)) },
			description: [
				`Your **${role.name}** custom role has it's color changed.`,
				`It's new hex color is now **#${this.toHex(role.color)}**!`
			].join('\n'),
			color: role.color,
			footer: {
				text: `Thanks for supporting us!`,
				iconURL: member.user.avatarURL()
			}
		}});
	}
}