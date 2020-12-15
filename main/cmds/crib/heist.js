const Command = require('../../lib/command/Command.js');
const { Collection } = require('discord.js');

module.exports = new Command({
	name: 'fakeheist',
	aliases: ['fh'],
	description: 'Immediately starts a fake heist event.'
}, async ({ ctx, msg, args }) => {
	let [specAmount, lockChannel] = args;
	const { channel, guild, author } = msg;
	if (!ctx.fakeHeists.has(guild.id)) {
		ctx.fakeHeists.set(guild.id, channel.id);
	} else {
		let chan = guild.channels.cache.get(ctx.fakeHeists.get(guild.id));
		return msg.reply(`There's a current event happening on <#${chan.id}>`);
	}


	if (!specAmount) {
		return msg.reply('You need an amount.');
	} else if (!specAmount) {
		return msg.reply('You need an amount, e.g: "1e6", "100000"');
	}

	if (lockChannel === 'true') lockChannel = Boolean(lockChannel);
	else lockChannel = false;

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
	if (lockChannel) {
		await channel.updateOverwrite(guild.id, { 
			SEND_MESSAGES: true 
		}, `FakeHeist by ${author.tag}`);
		await channel.send(`Channel auto unlocked.`);
	}
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


		let authors = col.map(m => m.author);
		let success = [], fail = [], empty = [];
		authors.forEach(a => {
			let odds = Math.random();
			if (odds > 0.7) {
				success.push(`+ ${a.username} grabbed {coins} coins!`);
			} else {
				fail.push(`- ${a.username} died wtf?`);
			}
		});

		let coins = Math.floor(specAmount / success.length);
		await channel.send(`**${col.size}** ${col.size > 1 ? 'people are' : 'person is'} teaming up to split \`${specAmount.toLocaleString()}\` coins.`);
		await require('discord.js').Util.delayFor(Math.round(Math.random() * Math.floor(col.size / 2)) * 1000);
		
		success = success.map(s => s.replace('{coins}', coins.toLocaleString()));
		let order = [
			success.join('\n'), fail.join('\n'), empty.join('\n')
		].sort(() => Math.random() - 0.5).join('\n');
		await channel.send(order, { code: 'diff' });
		ctx.fakeHeists.delete(guild.id);
		if (lockChannel) {
			await channel.updateOverwrite(guild.id, { 
				SEND_MESSAGES: false 
			}, `FakeHeist by ${author.tag}`);
			await channel.send(`Channel auto locked.`);
		}
	});
})