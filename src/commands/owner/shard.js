import Command from '../../classes/Command/Owner.js'
import { log } from '../../utils/logger.js'
import { 
	simpleEmbed, 
	errorEmbed 
} from '../../utils/embed.js'

export default new Command({
	name: 'shard',
	aliases: ['0'],
	description: 'View, disconnect or connect shard id you specify.',
	usage: '{<Shard>.id} {disconnect | connect | ping}'
}, async (bot, [id, method]) => {

	/** Check */
	if (!id) {
		return simpleEmbed({
			title: 'Missing Args',
			color: 'RED',
			text: 'You need a shard id.'
		});
	}

	/** Check Again */
	const shard = bot.shards.get(id);
	if (!shard) {
		return simpleEmbed({
			title: 'Invalid Shard',
			color: 'RED',
			text: 'You need a valid shard id for this command to work.'
		});
	}

	/** The Thing */
	if (method === 'ping') {
		/** Ping */
		return simpleEmbed({
			title: `Shard ${shard.id}'s ping`,
			color: 'BLUE',
			text: `My latency on that shard is \`${shard.ping}ms\`.`
		});
	} else if (method === 'connect') {
		/** Connect */
		try {
			await shard.connect();
			return simpleEmbed({
				title: 'Connected',
				color: 'GREEN',
				text: `Shard **${shard.id}** connected.`
			});
		} catch(error) {
			log('commandError', 'shard@connect', error);
			return errorEmbed({ title: 'shard@connect', error: error });
		}
	} else if (method === 'disconnect') {
		/** Disconnect */
		try {
			await shard.disconnect();
			return simpleEmbed({
				title: 'Disconnected',
				color: 'ORANGE',
				text: `Shard **${shard.id}** disconnected.`
			});
		} catch(error) {
			log('commandError', 'shard@disconnect', error);
			return errorEmbed({ title: 'shard@disconnect', error: error });
		}
	} else {
		return simpleEmbed({
			title: 'Unknown Method',
			color: 'RED',
			text: 'Unknown method, your options are `ping`, `disconnect`, or `connect` only.'
		})
	}

})