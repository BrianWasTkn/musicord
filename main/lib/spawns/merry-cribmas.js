const random = arr => arr[Math.round(Math.random() * arr.length)];
const randNum = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

exports.run = async (ctx, msg) => {
	const { channel, guild } = msg;
	let strings = [
		'merry christmas', 'happy holidays',
		'50m heist', 'giveaway when', 'ima win dis heist'
	];


	const message = await channel.send([
		'**:snowman: `SPECIAL EVENT ENCOUNTERED`**',
		'**It\'s Christmas**',
		'Take this special gift just for you!'
	].join('\n'));

	let string = random(strings);
	let coins = Math.floor(randNum(1000, 20000));
	const filter = m => m.content.toLowerCase() === string;
	const collector = await channel.createMessageCollector(filter, {
		time: 15000,
		max: 1
	});

	collector.on('collect', async m => {
		await m.channel.send(`\`${m.author.username}\` answered first!`);
		await require('discord.js').Util.delayFor(Math.floor(Math.random() * 3));
	}).on('end', async col => {
		col = col.first();
		return {
			author: { name: 'Results for \'Merry Cribmas\' event' },
			color: random(['#8bc34a', '#ef5350']),
			description: `\`${col.user.username}\` grabbed **${coins}** coins`
		};
	})
}