import { ShardingManager } from 'discord.js';
import config from 'config/index' ;
import { join } from 'path';

const sharder = new ShardingManager('./index', {
	token: config.bot.token,
	totalShards: 'auto',
	mode: 'process',
	respawn: true,
});

sharder.on('shardCreate', shard => {
	console.log(`[SHARDER] Shard ${shard.id} created.`);
});