import { ShardingManager } from 'discord.js';
import { join } from 'path';
import config from 'config/index';

export default new ShardingManager(join(__dirname, 'index'), {
	token: config.bot.token,
	totalShards: 'auto',
	mode: 'process',
	respawn: true,
}).on('shardCreate', shard => {
	console.log(`[SHARDER] Shard ${shard.id} created.`);
}).spawn()
.then(shards => {
	return console.log(`[SHARDER] ${shards.size} shards connected.`)
})
.catch(err => {
	if (err instanceof Error) {
		return console.error(err.message, err.stack);
	}
	return console.error(err);
})
.finally(() => {
	return console.log(`[SHARDER] Spawned.`);
});