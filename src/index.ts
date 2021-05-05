import 'module-alias/register';
import 'dotenv/config';

import { ModulePlus } from 'lib/objects';
import { Context } from 'lib/extensions';
import { Message } from 'discord.js';
import { Lava } from 'lib/Lava';
import { join } from 'path';
import Mongoose from 'mongoose';
import config from 'config/index';
import Args from './arguments';

const read = (...dirs: string[]) => join(__dirname, ...dirs);
const lava = new Lava(config.akairo, config.discord, {
	inhibitor: {
		directory: read('inhibitors'),
		automateCategories: true
	},
	listener: { 
		directory: read('listeners'),
		automateCategories: true, 
	},
	command: { 
		directory: read('commands'), 
		prefix: config.bot.prefix,
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
		directory: read('spawns'),
		automateCategories: true, 
	},
	quest: { 
		directory: read('quests'),
		automateCategories: true,
	},
	item: { 
		directory: read('items'),
		automateCategories: true,
	},
});

const { uri, options } = config.bot.mongo;
const onModLoad = (mod: ModulePlus) => {
	lava.util.console.log(
		mod.handler.constructor.name,
		`Module "${process.env.DEV ? mod.id : mod.name}" loaded.`
	);
};
const onDbConnect = (db: typeof Mongoose) => {
	lava.util.console.log(
		'Mongoose', `v${db.version} — Connected!`
	);
};

lava.on('moduleLoad', onModLoad)
	.on('dbConnect', onDbConnect)
	.setMongoPath(uri, options)
	.loadAll().addTypes(Args)
	.start();