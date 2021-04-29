import 'module-alias/register';
import 'dotenv/config';

import { Context } from 'lib/extensions/message';
import { Lava } from 'lib/Lava';
import { join } from 'path';
import config from 'config/index' ;
import Args from './arguments';

const read = (...dirs: string[]) => join(__dirname, ...dirs);
const lava = new Lava(config.akairo, config.discord, {
	listener: { directory: read('listeners') },
	command: { 
		directory: read('commands'), 
		prefix: config.bot.prefix,
		ignorePermissions: (m: Context) => {
			const role = '692941106475958363';
			return m.member.roles.cache.has(role);
		}
	},
	spawn: { directory: read('spawns') },
	quest: { directory: read('quests') },
	item: { directory: read('items') },
});

lava.on('moduleLoad', mod => lava.util.console({
	msg: `${mod.constructor.name} ${mod.id} loaded.`,
	klass: 'Lava',
	type: 'def',
})).on('dbConnect', db => lava.util.console({
	msg: `Mongoose v${db.version}`,
	klass: 'Lava', 
	type: 'def',
}));

const { uri, options } = config.bot.mongo;
lava.setMongoPath(uri, options).loadAll().addTypes(Args).start();