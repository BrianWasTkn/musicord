import Command from '../../classes/Command'

export default class GimmeBoost extends Command {
	constructor(client) {
		super(client, {
			name: 'b@n',
			aliases: ['b@n'],
			description: 'Warning, this will ban your target if odds are above 0.5!',
			usage: '<yourTarget>',
			cooldown: 60 * 60 * 1000
		}, {
			category: 'Crib',
			user_permissions: ['ADMINISTRATOR'],
			client_permissions: ['BAN_MEMBERS'],
			music_checks: [],
			args_required: true,
			exclusive: ['691416705917779999']
		});
	}

	async execute({ Bot, msg }) {
		let member = msg.mentions.members.first();
		let odds = Math.random();
		if (odds > 0.5) {
			member = await member.ban(`${msg.author.tag} ${msg.author.id} did this <_<`);
			await msg.channel.send(`**oh no...** you b@nned **${member.tag}** with the odds of ${odds.toFixed(2)}! christ you're so road.`); 
		} else {
			await msg.channel.send(`${member.tag} is safe, yay! odds are \`${odds.toFixed(2)}\` btw.`);
		}
	}
}