import { Util } from '../lib/structure/Util'

export default async function(
	msg, delay, lockChannel = true, { number, range, min, max }
) {
	const { author, guild } = msg;
	const util = new Util(msg.client);

	msg.channel.send(util.dynamicEmbed({
		title: 'Guess the Number',
		color: 'BLUE',
		text: [
			'**Welcome!** This event\'s objective is to guess the right number',
			'between a **mininum** and a **maximum** number. This channel will be',
			'locked automatically once the number has been guesed.\n\n',
			`For this event, the lowest possible number is **${min}** while`,
			`**${max}** is the highest possible one.\n\n`,
			'Do you have the highest IQ to guess the right number? Let\'s',
			`find out! This channel will be unlocked in **${delay}** seconds.\n\n`,
			'Goodluck!'
		].join(' '),
		footer: {
			text: `Hosted by — ${author.tag} (${author.id})`,
			icon: author.avatarURL()
		}
	})).then(message => {
		await util.sleep(delay * 1000);
		await message.channel.updateOverwrites(guild.id, {
			SEND_MESSAGES: true
		}, `GuessNumber by ${author.tag} (${author.id})`);
	}).catch(error => {
		return error.message;
	});

	let filter = m => Boolean(Number(m.content));
	const collector = await msg.channel.createMessageCollector(filter, {
		max: Infinity,
		time: 60000
	});

	collector.on('collect', async m => {
		if (m.content < min && m.content > max) {
			collector.dispose(m);
			await m.reply([
				'**Out of range**',
				`The number should be in the range of **${min}** and **${max}** only.`
			].join('\n'));
		} else if (m.content > max) {
			collector.dispose(m);
			await m.reply([
				'**Too High**',
				`The number should be **lower or equal** to **${max}** only.`
			].join('\n'));
		} else if (m.content < min) {
			collector.dispose(m);
			await m.reply([
				'**Too Low**',
				`The number should be **higher or equal** to **${min}** only.`
			].join('\n'));
		} else if (m.content === number) {
			collector.end('Number Guessed');
		}
	}).on('end', async collected => {
		const m = collected.first();
		m.channel.send(util.dynamicEmbed({
			title: 'Event Winner',
			color: 'GOLD',
			text: `**${m.author.mention}** got the correct number which is **${number}**! GGs!`,
			footer: {
				text: `Thanks for participating this event!`,
				icon: guild.iconURL()
			}
		})).then(async message => {
			let { channel } = message;
			await channel.updateOverwrites(guild.id, {
				SEND_MESSAGES: false
			}, `GuessNumber by ${author.tag} (${author.id})`);
		}).catch(error => {
			return util.log('Command', 'error', 'guess-number@msg', error);
		});
	});
}