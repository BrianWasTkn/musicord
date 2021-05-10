import { ShardingManager } from 'discord.js';
import { join } from 'path';
import config from 'config/index';

const sharder = new ShardingManager(join(__dirname, 'index'), {
	token: config.bot.token,
	totalShards: 'auto',
	mode: 'process',
	respawn: true,
});

sharder.on('shardCreate', shard => {
	console.log(`[SHARDER] Shard ${shard.id} created.`);
});

sharder.spawn()
.then(shards => console.log(`[SHARDER] ${shards.size} shards connected.`))
.catch(console.error).finally(() => console.log(`[SHARDER] Spawned.`));