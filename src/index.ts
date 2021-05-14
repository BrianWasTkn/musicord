import 'module-alias/register';
import 'dotenv/config';
import Instance from './instance';
import config from 'config/index';

const { akairo, discord, handlers, bot: { mongo: { uri, options } } } = config;
const lava = Instance(akairo, discord, handlers);

lava.on('moduleLoad', (mod: import('lib/objects').ModulePlus) => {
	lava.util.console.log(
		mod.handler.constructor.name,
		`Module "${process.env.DEV ? mod.id : mod.name}" loaded.`
	);
});

lava.on('dbConnect', (db: typeof import('mongoose')) => {
	lava.util.console.log(
		'Mongoose', `v${db.version} — Connected!`
	);
});

lava.setMongoPath(uri, options)
	.loadAll()
	.addTypes()
	.start();