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
	listener: { directory: read('listeners') },
	command: { 
		directory: read('commands'), 
		prefix: config.bot.prefix,
		ignorePermissions: (m: Message) => {
			const role = '692941106475958363';
			return m.member.roles.cache.has(role);
		}
	},
	spawn: { directory: read('spawns') },
	quest: { directory: read('quests') },
	item: { directory: read('items') },
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