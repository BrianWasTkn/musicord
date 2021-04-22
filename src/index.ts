import 'module-alias/register';
import 'dotenv/config';

import config from 'config/index' ;
import { Lava } from 'lib/Lava';
import { join } from 'path';
import Args from './arguments';

const read = (...dirs: string[]) => join(__dirname, ...dirs);
const lava = new Lava(config.akairo, config.discord, {
	command: { directory: read('commands'), prefix: config.bot.prefix },
	listener: { directory: read('listeners') },
	spawn: { directory: read('spawns') },
	quest: { directory: read('quests') },
	item: { directory: read('items') },
});

lava.on('moduleLoad', module => {
	const { constructor: ctor } = module;
	lava.util.console({
		msg: `${ctor.name} ${module.id} loaded.`,
		klass: 'Lava',
		type: 'def',
	});
}).on('dbConnect', db => {
	lava.util.console({ 
		klass: 'Lava', 
		type: 'def',
		msg: `Mongoose v${db.version}`
	});
})

const { uri, options } = config.bot.mongo;
lava.setMongoPath(uri, options).loadModules().addTypes(Args).start();