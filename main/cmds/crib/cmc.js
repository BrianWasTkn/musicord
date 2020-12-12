const Command = require('../../lib/command/Command.js');

let staff = [
	{ userID: '605419747361947649', role: '694527702656614533' },
	{ userID: '601429964050530305', role: '766286790856146996' },
	{ userID: '450199947577393162', role: '747520033554694154' }
]

const array = [
	{ userID: '509207806742626314', role: '786873354308681739' },
	{ userID: '316407287545856000', role: '744648152656904383' },
	{ userID: '497601345566801921', role: '739093126622347295' },
	{ userID: '463731733695561749', role: '735831002924187739' },
	{ userID: '255260328659648512', role: '746180440007901254' },
	{ userID: '701864536004624385', role: '738041469390291032' },
	{ userID: '340954339051044885', role: '723075257962987572' },
	{ userID: '601429964050530305', role: '766286790856146996' },
	{ userID: '181264821713371136', role: '723073481633300521' },
	...staff
]

module.exports = new Command(
	async ({ msg }) => {
		const { member, channel, guild } = msg;
		let roles = ['693324853440282654', '692941106475958363'].map(r => guild.roles.cache.get(r));

		let missing;
		for (const role of roles) {
			if (!member._roles.includes(role.id)) missing = role;
		}

		if (missing) {
			return channel.send(`You need to be a **${missing.name}** first before using this command.`);
		}

		const profile = array.find(i => i.userID === member.user.id);
		if (!profile) {
			return await channel.send(`You don\'t have a custom role yet.\nRun \`${ctx.prefix[0]}`)
		}

		let random = Math.random() * 0xffffff;
		let roleToBeChanged = guild.roles.cache.get(profile.role);
		let role = await roleToBeChanged.edit({ color: random });
		await channel.send({ embed: {
			title: 'Color Changed',
			color: role.color,
			thumbnail: `https://dummyimage.com/1920x1280/${role.color.toString(16)}/010101&text=+`,
			description: `
Here you go, **${member.user.tag}**. Such fancy color we got there for your **${roleToBeChanged.mention}** role! The hex is \`#${role.color.toString(16)}\` by the way.`,
			author: {
				name: guild.name,
				iconURL: guild.iconURL()
			}
		}})

	}, {
		name: 'cmc',
		aliases: ['changemycolor']
	}
)