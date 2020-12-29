const { Command } = require('discord-akairo');

const roles = guild => ([
	guild.id, 
	'692517500814098462', '692517507734700062', // ['5', '10']
	'704052909943423086', '692517526311141416' // ['15', '20']
]);

module.exports = class Crib extends Command {
	constructor() {
		super('heist-lock', {
			aliases: ['hlock', 'hl'],
			category: 'Crib',
			channel: 'guild',
			cooldown: 3000,
			rateLimit: 1,
			userPermissions: ['MANAGE_MESSAGES'],
			args: [	
				{ id: 'id', type: 'number' }
			]
		});
	}

	async exec(message, args) {
		const { channel, guild } = message;
		let { id } = args;

		// Check Args
		if (!id) {
			return channel.send([
				'**bruh**',
				'you need a level number:',
				`\`${['0', '5', '10', '15', '20'].join('`, `')}\``
			].join('\n')).then(async m => {
				await m.delete({ timeout: 3e3 });
			});
		}

		// Check role
		let role;
		if (id === 0) role = roles(guild)[0];
		else if (id === 5) role = roles(guild)[1];
		else if (id === 10) role = roles(guild)[2];
		else if (id === 15) role = roles(guild)[3];
		else if (id === 20) role = roles(guild)[4];
		else return message.reply('invalid level number');

		// Check overwrites
		role = guild.roles.cache.get(role);
		const c = await channel.updateOverwrite(role.id, { SEND_MESSAGES: null });
		await channel.send(`Locked **#${c.name}**`);
	}
}