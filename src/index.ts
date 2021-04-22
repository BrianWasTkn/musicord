import 'module-alias/register';
import 'dotenv/config';

import config from 'config/index' ;
import { Lava } from 'lib/Lava';
import { join } from 'path';
import Args from './arguments';

const read = (...dirs: string[]) => join(__dirname, ...dirs);
const lava = new Lava(config.akairo, config.discord, {
	listener: { directory: read('listeners') },
	command: { directory: read('commands') },
	spawn: { directory: read('spawners') },
	quest: { directory: read('quests') },
	item: { directory: read('items') },
});

lava.on('handlerLoad', handler => {
	const { constructor: ctor, modules } = handler;
	lava.util.console({
		msg: `${modules.size} ${ctor.name} loaded.`,
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
lava.setMongoPath(uri, options).addTypes(Args).start();