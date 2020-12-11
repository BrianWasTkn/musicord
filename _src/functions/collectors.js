import { MessageCollector } from 'discord.js'

export async function awaitMessages(msg, messages, timeout = 30000) {
	if (!Array.isArray(questions)) return new Error('The "messages" parameter should be an array.');
	const { author, channel } = msg;

	let incrementer = 0;
	let filter = m => m.author.id === author.id;
	const collector = new MessageCollector(channel, filter, {
		max: messages.length,
		time: timeout
	});

	await channel.send(messages[incrementer++]);
	collector.on('collect', async m => {
		await channel.send(messages[incrementer++]);
	}).on('end', collected => {
		return collected;
	});
}

export async function awaitReactions(msg, message, reactions, timeout = 30000) {
	if (!Array.isArray(reactions)) {
		return new Error('The "reactions" parameter should be an array of unicode (or custom emojis)'); 
	}
}