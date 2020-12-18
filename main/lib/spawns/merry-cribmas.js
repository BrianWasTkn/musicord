const random = arr => arr[Math.floor(Math.random() * arr.length)];
const randNum = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

exports.config = {
	emoji: '<:memerGold:753138901169995797>',
	type: 'SPECIAL EVENT',
	event: 'It\'s Christmas',
	description: 'Take this special gift just for you!',
	color: random(['#8bc34a', '#ef5350']),
	coins: { min: 1000, max: 10000 },
	string: random([
		'merry christmas', 'happy holidays',
		'50m heist', 'giveaway when', 'ima win dis heist'
	])
};

exports.run = async (ctx, msg) => {
	const { channel, guild } = msg;
	let strings = [
		'merry christmas', 'happy holidays',
		'50m heist', 'giveaway when', 'ima win dis heist'
	];

	let string = random(strings);
	const message = await channel.send([
		'**<:memerGold:753138901169995797> `SPECIAL EVENT ENCOUNTERED`**',
		'**It\'s Christmas**',
		'Take this special gift just for you!',
	].join('\n'));
	await channel.send(`Type \`${string}\``);

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
		if (!col.first()) {
			await message.edit([
				message.content,
				`\n<:memerRed:729863510716317776> \`Nobody joined the event.\``
			]);
			return;
		}

		const m = col.first();
		await m.channel.send({ embed: {
			author: { name: 'Results for \'Merry Cribmas\' event' },
			color: random(['#8bc34a', '#ef5350']),
			description: `\`${m.author.username}\` grabbed **${coins}** coins`
		}});
	});
}