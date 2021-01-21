import { Message, GuildChannel, GuildMember } from 'discord.js'
import Lava from 'discord-akairo'

export default {
	calcMulti: async (Lava: Lava.Client, msg: Message): Promise<number> => {
		const { channel }: { channel: any } = msg;
		const db = await Lava.db.currency.fetch(msg.member.user.id);
		let total = 0;
		total += db.multi;
		if (msg.member.nickname.includes('e')) {
			total += 2;
		}
		if (channel.name.includes('dank')) {
			total += 5;
		}
		if (msg.guild.id === '691416705917779999') {
			total += 10;
		}
		if (db.pocket >= 10000000) {
			total += 2;
		}
		return total;
	}
}