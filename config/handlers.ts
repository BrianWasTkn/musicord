import { lavaConfig as config } from './lava';
import { HandlerConstructor } from 'lib/Lava';
import { Context } from 'lib/extensions';
import { Message } from 'discord.js';
import { join } from 'path';

function read(...path: Parameters<typeof join>) {
	return join(__dirname, ...path);
}

export const handlerConfig: HandlerConstructor = {
	inhibitor: {
		directory: read('..', 'inhibitors'),
		automateCategories: true
	},
	listener: { 
		directory: read('..', 'listeners'),
		automateCategories: true, 
	},
	command: { 
		directory: read('..', 'commands'), 
		prefix: config.prefix,
		automateCategories: true,
		ignoreCooldown: ((m: Context) => {
			return m.client.isOwner(m.author.id);
		}) as ((m: Message) => boolean),
		ignorePermissions: ((m: Context) => {
			const role = '692941106475958363';
			return m.member.roles.cache.has(role);
		}) as ((m: Message) => boolean),
	},
	spawn: { 
		directory: read('..', 'spawns'),
		automateCategories: true, 
	},
	quest: { 
		directory: read('..', 'quests'),
		automateCategories: true,
	},
	item: { 
		directory: read('..', 'items'),
		automateCategories: true,
	},
}