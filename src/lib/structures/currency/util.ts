import { Message, GuildChannel } from 'discord.js'

export const utils: Lava.CurrencyUtil = {
	/**
	 * calc the multi of user
	 * @param Lava an extended instance of akairo client
	 * @param msg a discord msg obj
	 * @returns {Promise<number>}
	 */
	calcMulti: async (Lava: Akairo.Client, msg: Message): Promise<number> => {
		const channel = (msg.channel as GuildChannel);
		const db = await Lava.db.currency.fetch(msg.member.user.id);
		let total = 0; total += db.multi;
		if (msg.guild.id === '691416705917779999') {
			total += 10;
		}
		if (msg.member.nickname.toLowerCase().includes('taken')) {
			total += 5;
		}
		if (channel.name.includes('lava')) {
			total += 2.5;
		}
		if (msg.guild.emojis.cache.size >= 250) {
			total += 2.5;
			if (msg.guild.emojis.cache.size >= 100) {
				total += 1;
			}
		}
		return total;
	},

	/**
	 * returns an array of multi strings
	 * @param Lava client
	 * @param msg discord msg
	 */
	showMulti: async (Lava: Akairo.Client, msg: Message): Promise<string[]> => {
		const channel = (msg.channel as GuildChannel);
		let unlocked = [];
		if (msg.guild.id === '691416705917779999') {
			const crib = await Lava.guilds.fetch('691416705917779999');
			unlocked.push(`${crib.name} - \`10%\``);
		}
		if (msg.member.nickname.toLowerCase().includes('taken')) {
			unlocked.push(`Taken Cult - \`5%\``);
		}
		if (channel.name.includes('lava')) {
			unlocked.push(`#lava - \`2.5%\``);
		}
		if (msg.guild.emojis.cache.size >= 250) {
			unlocked.push(`250 Emojis - \`2.5%\``);
			if (msg.guild.emojis.cache.size >= 100) {
				unlocked.push(`100 Emojis - \`1%\``);
			}
		}

		return unlocked;
	}
}