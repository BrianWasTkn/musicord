import Command from '../../classes/Command/Owner.js'
import { log } from '../../utils/logger.js'

export default new Command({
	name: 'shard',
	aliases: ['0'],
	description: 'View, disconnect or connect shard id you specify.',
	usage: '{<Shard>.id} {disconnect | connect | ping}'
}, async (bot, [id, method]) => {

	if (!id) return 'You need a sgard id';
	const shard = bot.shards.get(id);
	if (!shard) return 'Invalid shard id';
	if (method === 'ping') {
		return `shard **${shard.id}**'s ping is: \`${shard.ping}ms\``;
	} else if (['disconnect', 'ds'].includes(method)) {
		try { await shard.disconnect() } catch(e) { return e };
		return `shard **${shard.id}** disconnected`;
	} else if (['connect', 'c'].includes(method)) {
		try { await shard.connect() } catch(e) { return e };
		return `shard **${shard.id}** connected`;
	} else {
		return `bro, only: \`${['ping', 'disconnect', 'connect'].join('`, `')}\``
	}

})