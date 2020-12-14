const Command = require('../../lib/command/Command.js');

const allowed = [
	// Other
	{ userID: '671195847823851540', role: '728742113478705213' },
	{ userID: '654050620205957152', role: '735831064198774825' },

	// Staff
	{ userID: '605419747361947649', role: '694527702656614533' },
	{ userID: '601429964050530305', role: '766286790856146996' },
	{ userID: '450199947577393162', role: '747520033554694154' },
	{ userID: '562367252406468646', role: '727216443300642856' },

	// Boosters
	{ userID: '509207806742626314', role: '786873354308681739' },
	{ userID: '316407287545856000', role: '744648152656904383' },
	{ userID: '497601345566801921', role: '739093126622347295' },
	{ userID: '463731733695561749', role: '735831002924187739' },
	{ userID: '255260328659648512', role: '746180440007901254' },
	{ userID: '701864536004624385', role: '738041469390291032' },
	{ userID: '340954339051044885', role: '723075257962987572' },
	{ userID: '601429964050530305', role: '766286790856146996' },
	{ userID: '181264821713371136', role: '723073481633300521' }
]

module.exports = new Command({
	name: 'cmc',
	aliases: ['changemycolor']
}, async ({ msg }) => {
	const { member, channel, guild } = msg;
	let roles = ['693324853440282654', '692941106475958363'].map(r => guild.roles.cache.get(r));

	if (
		!member._roles.includes('693324853440282654')
		|| !member._roles.includes('692941106475958363') 
	) {
		return msg.reply(`You need to be one of the ff: **${roles.map(r => r.name).join('`, `')}** to use this cmd.`);
	}

	const profile = allowed.find(i => i.userID === member.user.id);
	if (!profile) {
		return await channel.send(`You don\'t have a custom role yet.\nRun \`${ctx.prefix[0]} request\` to request this.`)
	}

	let random = Math.random() * 0xffffff;
	let roleToBeChanged = guild.roles.cache.get(profile.role);
	let role = await roleToBeChanged.edit({ color: random });
	await channel.send({ embed: {
		title: 'Color Changed',
		color: role.color,
		thumbnail: {
			url: `https://dummyimage.com/512x512/${role.color.toString(16)}/010101&text=+`
		},
		description: `
Here you go, **${member.user.tag}**. Such fancy color we got there for your **${roleToBeChanged.name}** role! The hex is \`#${role.color.toString(16)}\` btw, thank you for supporting **${guild.name}**!`,
		author: {
			name: guild.name,
			iconURL: guild.iconURL()
		}
	}});
});