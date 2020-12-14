const Command = require('../../lib/command/Command.js');
const { Collection } = require('discord.js');

module.exports = new Command({
	name: 'fakeheist',
	aliases: ['fh']
}, async ({ ctx, msg, args }) => {
	let [specAmount] = args;
	const { channel, guild, author } = msg;
	if (!ctx.fakeHeist.has(guild.id)) {
		ctx.fakeHeist.set(guild.id, channel.id);
	} else {
		let chan = guild.channels.cache.get(ctx.fakeHeist.get(guild.id));
		return msg.reply(`There's a current event happening on <#${chan.id}>`);
	}

	if (!specAmount) {
		return msg.reply('You need an amount.');
	} else if (!specAmount) {
		return msg.reply('You need an amount, e.g: "1e6", "100000"');
	}

	specAmount = specAmount.toLowerCase();
	if (specAmount.endsWith('k')) {
		specAmount = Number(specAmount.replace('k', '000'));
	} else if (specAmount.endsWith('m')) {
		specAmount = Number(specAmount.replace('m', '000000'));		
	} else if (Number(specAmount)) {
		specAmount = Number(specAmount) || parseInt(specAmount);
	} else {
		return msg.reply('Number invalid, lol try again you idiot.');
	}

	await msg.delete();
	channel.send(`Type \`JOIN EVENT\` in order to have a chance of splitting up \`${specAmount.toLocaleString()}\` coins!`);
	const entries = new Collection();
	let filter = m => (m.content.toLowerCase() === 'join event') && !entries.has(m.author.id);
	const collector = await channel.createMessageCollector(filter, {
		max: Infinity,
		time: 60000,
		errors: ['time']
	});

	collector.on('collect', async m => {
		entries.set(m.author.id, m.id);
		await m.react('✅');
	}).on('end', async col => {
		// const random = arr => arr[Math.floor(Math.random() * arr.length)];
		if (col.size === 1) {
			return col.first().reply(`Looks like you're alone.`);
		} else if (col.size === 0) {
			return channel.send('I guess nobody\'s joining this event, sadness.')
		}

		await channel.send(`**${col.size}** ${col.size > 1 ? 'people are' : 'person is'} teaming up to win the grand prize.`);
		await require('discord.js').Util.delayFor(Math.round(Math.random() * Math.floor(col.size / 2)) * 1000);

		let authors = col.map(m => m.author);
		let success = [], fail = [], empty = [];
		authors.forEach(a => {
			let odds = Math.random();
			if (odds > 0.5) {
				success.push(`+ ${a.username} grabbed {coins} coins!`);
			} else {
				fail.push(`- ${a.username} died wtf?`);
			}
		});

		let coins = Math.floor(specAmount / success.length);
		success = success.map(s => s.replace('{coins}', coins.toLocaleString()));
		let order = [
			success.join('\n'), fail.join('\n'), empty.join('\n')
		].sort(() => Math.random() - 0.5).join('\n');
		await channel.send(order, { code: 'diff' });
		ctx.fakeHeist.delete(guild.id);
	});
})

// let winners = col.random(Math.round(Math.random() * col.size)).map(w => w.author.id);
// let losers = col.map(l => l.author.id).filter(l => !winners.includes(l));
// let coins = Math.floor(10e6 / winners.length);


// // if (winners) {}
// winners = winners.length > 0 ? winners.map(w => {
// 	return `+ ${w.username} grabbed ${coins.toLocaleString()} coins.`;
// }) : [];
// losers = losers.length > 0 ? losers.map(l => {
// 	return `- ${l.username} died LOL`;
// }) : [];

// if ([...winners, ...losers].length <= 0) {
// 	return await channel.send(`\`${col.map(u => u.author.username).join('`, `')}\` failed the event.`);
// } else {
// 	await channel.send(`${winners.join('\n')}\n${losers.join('\n')}`, {
// 		code: 'diff'
// 	});
// }

// let wString = winners.length > 1 ? (winners.map(w => `+ ${w.author.username} grabbed ${coins.toLocaleString()} coins!`).join('\n')) : [];
// let lString = losers.length > 1 ? (losers.map(l => `- ${l.author.username} died LOL`).join('\n')) : [];
// await channel.send([wString, lString].join('\n'), { code: 'diff' });
// await channel.send(winners.length > 1 ? winners.map(w => `+ ${w.author.username} grabbed ${coins.toLocaleString()} coins`).join('\n') : '# none', {
// 	code: 'diff'
// });
// await channel.send(losers.length > 1 ? losers.map(l => `- ${l.author.username} died LOL`).join('\n') : '# none', {
// 	code: 'diff'
// });